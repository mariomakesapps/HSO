import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'
import { formNotificationRecipient } from '../_shared/form-notification-routing.ts'

// In-memory rate limit: max 5 requests / 10 minutes per IP per function instance.
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const ipHits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const arr = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (arr.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, arr)
    return true
  }
  arr.push(now)
  ipHits.set(ip, arr)
  return false
}

// Resumes live in a private bucket; the path is a random folder plus a cleaned
// file name (see src/lib/internshipApplication.ts, which builds it).
const RESUME_BUCKET = 'internship-resumes'
const RESUME_PATH_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[\w.-]{1,90}\.(pdf|docx?)$/
// HR's download link lasts 60 days; after that the file is still in Cloud storage.
const RESUME_LINK_SECONDS = 60 * 24 * 60 * 60

const baseFields = {
  // Honeypot — bots tend to fill every field. Real users leave it blank.
  website: z.string().max(0).optional().or(z.literal('')),
}

const ContactSchema = z.object({
  type: z.literal('contact'),
  ...baseFields,
  reason: z.enum(['Outdated deadline', 'Missing opportunity', 'Broken link', 'General contact']),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(2000),
  related_url: z.string().trim().url().max(500).optional().or(z.literal('')),
})

const OpportunitySchema = z.object({
  type: z.literal('opportunity'),
  ...baseFields,
  title: z.string().trim().min(2).max(160),
  org: z.string().trim().min(2).max(160),
  category: z.enum(['Research', 'Internship', 'Competition', 'Summer Program', 'Scholarship', 'Volunteer', 'Fellowship']),
  url: z.string().trim().url().max(500),
  deadline: z.string().max(40).optional().or(z.literal('')),
  cost: z.enum(['Free', 'Paid', 'Stipend']),
  format: z.enum(['In-person', 'Online', 'Hybrid']),
  grades: z.array(z.number()).default([]),
  description: z.string().trim().min(20).max(2000),
  submitter_email: z.string().trim().email().max(255),
})

// Students applying to help run HSO — not the "Volunteer" opportunity
// category, which is third-party volunteering listed in the catalog.
const VolunteerSchema = z.object({
  type: z.literal('volunteer'),
  ...baseFields,
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  grade: z.number().int().min(9).max(12),
  school: z.string().trim().max(160).optional().or(z.literal('')),
  interests: z.array(z.string().max(80)).min(1).max(20),
  hours_per_week: z.enum(['1-2 hours', '3-5 hours', '5+ hours']),
  portfolio_url: z.string().trim().url().max(500).optional().or(z.literal('')),
  motivation: z.string().trim().min(20).max(2000),
  // Added Nov 2026. Optional here so an older page still in someone's browser
  // keeps working; the page itself requires the resume, location and questions.
  age: z.number().int().min(10).max(25).optional(),
  city: z.string().trim().max(120).optional().or(z.literal('')),
  country: z.string().trim().max(120).optional().or(z.literal('')),
  time_zone: z.string().trim().max(80).optional().or(z.literal('')),
  contribution: z.string().trim().max(2000).optional().or(z.literal('')),
  about: z.string().trim().max(2000).optional().or(z.literal('')),
  experience: z.string().trim().max(2000).optional().or(z.literal('')),
  referral_source: z.string().trim().max(200).optional().or(z.literal('')),
  resume_path: z.string().regex(RESUME_PATH_PATTERN).optional().or(z.literal('')),
  resume_name: z.string().trim().max(200).optional().or(z.literal('')),
})

const Schema = z.discriminatedUnion('type', [ContactSchema, OpportunitySchema, VolunteerSchema])

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing SUPABASE env')
    return json({ error: 'Server configuration error' }, 500)
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  if (rateLimited(ip)) {
    return json({ error: 'Too many submissions. Please try again later.' }, 429)
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return json({ error: 'Invalid submission', details: parsed.error.flatten() }, 400)
  }

  const data = parsed.data

  // Honeypot tripped — return success without sending. Don't tip off bots.
  if (data.website && data.website.length > 0) {
    console.warn('Honeypot tripped', { ip })
    return json({ success: true })
  }

  const submittedAt = new Date().toISOString()

  let templateName: string
  let templateData: Record<string, unknown>

  if (data.type === 'contact') {
    templateName = 'contact-notification'
    templateData = {
      reason: data.reason,
      email: data.email,
      message: data.message,
      relatedUrl: data.related_url || undefined,
      submittedAt,
    }
  } else if (data.type === 'volunteer') {
    templateName = 'volunteer-signup-notification'
    let resumeUrl: string | undefined
    let resumeNote: string | undefined
    if (data.resume_path) {
      const admin = createClient(supabaseUrl, serviceKey)
      const { data: signed, error } = await admin.storage
        .from(RESUME_BUCKET)
        .createSignedUrl(data.resume_path, RESUME_LINK_SECONDS)
      if (error || !signed?.signedUrl) {
        console.error('Resume link failed', { message: error?.message })
        resumeNote = `Uploaded as ${data.resume_path}, but a download link could not be made. Find it in Cloud storage (bucket ${RESUME_BUCKET}).`
      } else {
        resumeUrl = signed.signedUrl
      }
    } else {
      resumeNote = 'No resume was uploaded. The applicant was asked to email it to HR.'
    }
    templateData = {
      fullName: data.full_name,
      email: data.email,
      grade: String(data.grade),
      school: data.school || undefined,
      interests: data.interests.join(', '),
      hoursPerWeek: data.hours_per_week,
      portfolioUrl: data.portfolio_url || undefined,
      motivation: data.motivation,
      age: data.age ? String(data.age) : undefined,
      city: data.city || undefined,
      country: data.country || undefined,
      timeZone: data.time_zone || undefined,
      contribution: data.contribution || undefined,
      about: data.about || undefined,
      experience: data.experience || undefined,
      referralSource: data.referral_source || undefined,
      resumeName: data.resume_name || undefined,
      resumeUrl,
      resumeNote,
      submittedAt,
    }
  } else {
    templateName = 'opportunity-submission-notification'
    templateData = {
      title: data.title,
      org: data.org,
      category: data.category,
      url: data.url,
      deadline: data.deadline || undefined,
      cost: data.cost,
      format: data.format,
      grades: data.grades?.length ? data.grades.join(', ') : undefined,
      description: data.description,
      submitterEmail: data.submitter_email,
      submittedAt,
    }
  }

  const supabase = createClient(supabaseUrl, serviceKey)
  const recipient = formNotificationRecipient(data.type)
  const logRow = (status: string, error_message?: string) =>
    supabase.from('email_send_log').insert({
      message_id: null,
      template_name: templateName,
      recipient_email: recipient,
      status,
      ...(error_message ? { error_message } : {}),
    }).then(({ error }) => {
      if (error) console.error('email_send_log write failed', { code: error.code, message: error.message })
    })

  try {
    const result = await sendTemplateEmail(templateName, recipient, {
      templateData,
      idempotencyKey: `${templateName}-${crypto.randomUUID()}`,
    })
    await logRow(result.sent ? 'sent' : 'suppressed')
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Failed to send form notification', msg)
    await logRow('failed', msg)
    return json({ error: 'Failed to send email' }, 502)
  }

  return json({ success: true })
})

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}