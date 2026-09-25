import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

// Sends the welcome email to the signed-in user only. Recipient and name come
// from the verified account, never from the request body.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const url = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '').trim()
  if (!token) return json({ error: 'Authentication required' }, 401)

  const supabase = createClient(url, serviceKey)
  const { data: { user }, error: userErr } = await supabase.auth.getUser(token)
  if (userErr || !user?.email) return json({ error: 'Authenticated user required' }, 401)

  const createdAt = user.created_at ? new Date(user.created_at).getTime() : 0
  if (!createdAt || Date.now() - createdAt > 1000 * 60 * 60 * 24) {
    return json({ success: true, skipped: 'not_new' })
  }

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>
  const rawName = (meta.first_name || meta.given_name || meta.name || meta.full_name) as string | undefined
  const firstName = rawName ? String(rawName).trim().split(/\s+/)[0] : undefined

  const logRow = async (status: string, error_message?: string) => {
    const { error } = await supabase.from('email_send_log').insert({
      message_id: null,
      template_name: 'welcome',
      recipient_email: user.email,
      status,
      ...(error_message ? { error_message } : {}),
    })
    if (error) console.error('email_send_log write failed', { code: error.code, message: error.message })
  }

  try {
    const result = await sendTemplateEmail('welcome', user.email, {
      templateData: firstName ? { firstName } : {},
      idempotencyKey: `welcome-${user.id}`,
    })
    await logRow(result.sent ? 'sent' : 'suppressed')
    return json({ success: true, sent: result.sent })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Welcome email failed', msg)
    await logRow('failed', msg)
    return json({ error: 'Failed to send email' }, 502)
  }
})
