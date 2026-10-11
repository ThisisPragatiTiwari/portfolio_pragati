// Vercel serverless function — lives at /api/contact, so the deployed URL
// is https://yoursite.vercel.app/api/contact. Vercel builds this
// automatically alongside the Vite frontend; nothing extra to configure.
//
// Required environment variables (set these in Vercel's dashboard under
// Project → Settings → Environment Variables, and in a local .env file
// for `vercel dev` — see .env.example):
//
//   RESEND_API_KEY        Your Resend API key (resend.com → API Keys)
//   TO_EMAIL               The inbox that should receive contact form messages
//   FROM_EMAIL              The "from" address Resend sends as. Until you
//                            verify your own domain on Resend, use their
//                            shared testing address:
//                            "Portfolio <onboarding@resend.dev>"
//   TURNSTILE_SECRET_KEY   Server-side Cloudflare Turnstile secret (paired
//                            with VITE_TURNSTILE_SITE_KEY on the frontend).
//                            If unset, Turnstile verification is skipped —
//                            useful for local dev, but set it in production.

import { Resend } from 'resend'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_LENGTH = { name: 100, email: 200, message: 2000 }

// Very small in-memory rate limiter: max 5 submissions per IP per hour.
// Resets whenever the serverless function cold-starts, so it's a light
// deterrent rather than a strict guarantee — fine for a portfolio site.
const submissions = new Map()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000

function isRateLimited(ip) {
  const now = Date.now()
  const entry = submissions.get(ip)
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    submissions.set(ip, { start: now, count: 1 })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT
}

function validate(body) {
  const errors = {}
  const { name, email, message } = body || {}

  if (!name || !name.trim()) errors.name = 'Name is required.'
  else if (name.length > MAX_LENGTH.name) errors.name = 'Name is too long.'

  if (!email || !email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Email looks invalid.'
  else if (email.length > MAX_LENGTH.email) errors.email = 'Email is too long.'

  if (!message || !message.trim()) errors.message = 'Message is required.'
  else if (message.length > MAX_LENGTH.message) errors.message = 'Message is too long.'

  return errors
}

// Escapes basic HTML so form input can't inject markup into the notification email.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Verifies the Turnstile token with Cloudflare's siteverify endpoint.
// Returns true if verification passes OR if Turnstile isn't configured
// (so local dev without a secret key still works).
async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // not configured — skip (see header comment)
  if (!token) return false

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    })
    const data = await res.json()
    return data.success === true
  } catch (err) {
    console.error('Turnstile verification request failed:', err)
    return false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many submissions. Please try again later.' })
  }

  // Honeypot check — "website" is a hidden field real users never fill.
  // A bot that auto-fills every input on the page will populate it. We
  // respond exactly as if the message sent successfully, so the bot has
  // no signal that it was caught (and won't learn to avoid this trap) —
  // we just silently skip sending the actual email.
  if (req.body?.website) {
    return res.status(200).json({ ok: true })
  }

  const turnstileOk = await verifyTurnstile(req.body?.turnstileToken, ip)
  if (!turnstileOk) {
    return res.status(400).json({ error: 'Bot verification failed. Please try again.' })
  }

  const errors = validate(req.body)
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed', fields: errors })
  }

  const { name, email, message } = req.body

  if (!process.env.RESEND_API_KEY || !process.env.TO_EMAIL || !process.env.FROM_EMAIL) {
    console.error('Missing RESEND_API_KEY, TO_EMAIL, or FROM_EMAIL environment variable')
    return res.status(500).json({ error: 'Server is not configured to send email yet.' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      replyTo: email,
      subject: `Portfolio contact form: ${name}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(502).json({ error: 'Email service failed to send.' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Unexpected error sending email:', err)
    return res.status(500).json({ error: 'Something went wrong sending your message.' })
  }
}
