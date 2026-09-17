import { NextResponse, type NextRequest } from 'next/server'
import { Resend } from 'resend'
import { validate, formatInquiry, SERVICES } from '@/lib/contact'
import { CONTACT_EMAIL } from '@/lib/site'

/**
 * The contact form's target. Validates, drops obvious bots, and forwards the
 * inquiry by email through Resend with the sender as reply-to.
 *
 * Two bot traps, both silent: a hidden `website` field that humans never see,
 * and a `startedAt` timestamp that rejects anything submitted within three
 * seconds of the form mounting. Both return a plain 200 so a bot learns
 * nothing from the response.
 *
 * The rate limit is a best-effort, per-instance memory map; on a serverless
 * host it resets whenever the instance does. It is a speed bump, not a wall.
 */
const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 5
const hits = new Map<string, number[]>()

function limited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > LIMIT
}

export async function POST(req: NextRequest) {
  const dryRun = process.env.CONTACT_DRY_RUN === '1'
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  // The test suite submits from one address many times in a row.
  if (!dryRun && limited(ip)) {
    return NextResponse.json({ ok: false, message: 'Too many messages in a row. Please try again in a few minutes.' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, message: 'Bad request.' }, { status: 400 })
  }

  // Honeypot and time trap.
  const startedAt = Number(body.startedAt)
  if ((typeof body.website === 'string' && body.website.trim()) || (Number.isFinite(startedAt) && Date.now() - startedAt < 3000)) {
    return NextResponse.json({ ok: true })
  }

  const result = validate(body)
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 })
  }

  const label = SERVICES.find((s) => s.value === result.data.service)?.label ?? result.data.service
  const subject = `New ${label.toLowerCase()} inquiry from ${result.data.name}`
  const text = formatInquiry(result.data)

  if (dryRun) {
    console.log(`[contact] dry run\n${subject}\n${text}`)
    return NextResponse.json({ ok: true })
  }

  // `||`, not `??`: these keys exist in `.env.local` as empty placeholders.
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set')
    return NextResponse.json({ ok: false, message: 'The form is not configured yet.' }, { status: 500 })
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM || `Angelika Cheng <${CONTACT_EMAIL}>`,
    to: process.env.CONTACT_TO || CONTACT_EMAIL,
    replyTo: result.data.email,
    subject,
    text,
  })

  if (error) {
    // Never echo the provider's error to the client; it can name internal config.
    console.error('[contact] send failed', error)
    return NextResponse.json({ ok: false, message: 'The message could not be sent.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
