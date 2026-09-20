import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import opportunities from './opportunities.json' with { type: 'json' }

// Monthly "deadlines closing soon" digest.
//
// Triggered by a pg_cron job on the 1st of each month, and callable manually
// for testing. Auth: the caller must present DIGEST_CRON_SECRET (header
// `x-digest-secret`) or the service-role key as a bearer token — this function
// runs with verify_jwt = false so cron can reach it.

interface Row {
  id: string
  title: string
  org: string
  category: string
  cost: string
  format: string
  grades: number[]
  deadline: string
  url: string
  summary: string
}

const rows = opportunities as Row[]
const MAX_ITEMS = 5
const WINDOW_DAYS = 45

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function gradesLabel(grades: number[]): string | undefined {
  if (!grades?.length) return undefined
  const sorted = [...grades].sort((a, b) => a - b)
  const contiguous = sorted.every((g, i) => i === 0 || g === sorted[i - 1] + 1)
  return contiguous && sorted.length > 1
    ? `${sorted[0]}-${sorted[sorted.length - 1]}`
    : sorted.join(', ')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const cronSecret = Deno.env.get('DIGEST_CRON_SECRET')
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing SUPABASE env')
    return json({ error: 'Server configuration error' }, 500)
  }

  const authHeader = req.headers.get('Authorization') ?? ''
  const bearer = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : ''
  const presented = req.headers.get('x-digest-secret') ?? ''
  const authorized =
    bearer === serviceKey || (!!cronSecret && presented === cronSecret)
  if (!authorized) {
    return json({ error: 'Unauthorized' }, 401)
  }

  let body: { recipientEmail?: string; dryRun?: boolean } = {}
  try {
    body = (await req.json()) ?? {}
  } catch {
    body = {}
  }

  const recipientEmail =
    typeof body.recipientEmail === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.recipientEmail)
      ? body.recipientEmail
      : 'highschoolopportunity@gmail.com'

  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const dayMs = 24 * 60 * 60 * 1000

  const upcoming = rows
    .map((r) => {
      const due = new Date(`${r.deadline}T00:00:00Z`)
      const daysLeft = Math.round((due.getTime() - today.getTime()) / dayMs)
      return { r, daysLeft }
    })
    .filter(({ daysLeft }) => daysLeft >= 0 && daysLeft <= WINDOW_DAYS)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, MAX_ITEMS)

  if (upcoming.length === 0) {
    console.log('No upcoming deadlines in window — skipping digest')
    return json({ success: true, skipped: 'no upcoming deadlines' })
  }

  const items = upcoming.map(({ r, daysLeft }) => ({
    title: r.title,
    org: r.org,
    summary: r.summary,
    category: r.category,
    deadlineLabel: new Date(`${r.deadline}T00:00:00Z`).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }),
    daysLeft,
    cost: r.cost,
    format: r.format,
    gradesLabel: gradesLabel(r.grades),
    url: r.url,
  }))

  const monthLabel = today.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  if (body.dryRun) {
    return json({ success: true, dryRun: true, monthLabel, items })
  }

  const sendRes = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({
      templateName: 'deadline-digest',
      recipientEmail,
      // One digest per recipient per calendar month.
      idempotencyKey: `deadline-digest-${today.toISOString().slice(0, 7)}-${recipientEmail}`,
      templateData: { monthLabel, items },
    }),
  })

  const sendBody = await sendRes.text()
  if (!sendRes.ok) {
    console.error('send-transactional-email failed', { status: sendRes.status, body: sendBody })
    return json({ error: 'Failed to send digest', status: sendRes.status, details: sendBody }, 502)
  }

  return json({ success: true, recipientEmail, count: items.length, monthLabel })
})
