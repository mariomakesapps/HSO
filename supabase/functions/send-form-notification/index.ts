import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'

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
    templateData = {
      fullName: data.full_name,
      email: data.email,
      grade: String(data.grade),
      school: data.school || undefined,
      interests: data.interests.join(', '),
      hoursPerWeek: data.hours_per_week,
      portfolioUrl: data.portfolio_url || undefined,
      motivation: data.motivation,
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

  // Call send-transactional-email with service-role auth so it can run
  // the queue pipeline (suppression check, render, enqueue).
  const sendUrl = `${supabaseUrl}/functions/v1/send-transactional-email`
  let sendRes: Response
  try {
    sendRes = await fetch(sendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        templateName,
        // `to` is fixed in the template, but the function requires a recipient
        // string when no template.to is set — pass admin address as a fallback.
        recipientEmail: 'highschoolopportunity@gmail.com',
        idempotencyKey: `${templateName}-${crypto.randomUUID()}`,
        templateData,
      }),
    })
  } catch (err) {
    console.error('Failed to call send-transactional-email', err)
    return json({ error: 'Email service unavailable' }, 502)
  }

  const sendBody = await sendRes.text()
  if (!sendRes.ok) {
    console.error('send-transactional-email failed', { status: sendRes.status, body: sendBody })
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