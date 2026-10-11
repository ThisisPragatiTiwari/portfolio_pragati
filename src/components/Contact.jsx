import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../assets/data/content'

const EMPTY_FORM = { name: '', email: '', message: '' }

// Basic client-side email pattern check — not exhaustive, just catches
// obviously malformed input before it would reach a backend.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  // Honeypot field — real visitors never see or fill this (see the hidden
  // input below). If it arrives non-empty, the backend treats it as spam.
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState({})
  // status: 'idle' | 'sending' | 'success' | 'error'
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const turnstileRef = useRef(null)
  const widgetId = useRef(null)
  const [turnstileToken, setTurnstileToken] = useState('')

  // Render the Cloudflare Turnstile widget once the script (loaded in
  // index.html) has attached `window.turnstile`. Polls briefly since the
  // script loads async and may not be ready the instant this mounts.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return

    let cancelled = false

    const tryRender = () => {
      if (cancelled) return
      if (window.turnstile) {
        widgetId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(''),
          'error-callback': () => setTurnstileToken(''),
        })
      } else {
        setTimeout(tryRender, 200)
      }
    }

    tryRender()
    return () => {
      cancelled = true
      if (window.turnstile && widgetId.current !== null) {
        window.turnstile.remove(widgetId.current)
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!form.email.trim()) next.email = 'Please enter your email.'
    else if (!EMAIL_PATTERN.test(form.email)) next.email = 'That email doesn\u2019t look right.'
    if (!form.message.trim()) next.message = 'Please add a short message.'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('sending')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          // Honeypot value — named to look like an ordinary field to a bot,
          // not to a human (it's hidden, so a human never fills it anyway).
          website: honeypot,
          turnstileToken,
        }),
      })

      if (!res.ok) {
        // The API returns { error, fields? } — surface its message (rate
        // limit, bot check, validation) instead of a generic failure.
        const data = await res.json().catch(() => ({}))
        if (data.fields) setErrors(data.fields)
        setErrorMessage(
          res.status === 429
            ? 'Too many messages from this connection — please try again later.'
            : data.error || 'Something went wrong — please try again.'
        )
        throw new Error('Request failed')
      }

      setErrorMessage('')
      setStatus('success')
      setForm(EMPTY_FORM)
      setHoneypot('')
      setTurnstileToken('')
      if (window.turnstile && widgetId.current !== null) {
        window.turnstile.reset(widgetId.current)
      }
    } catch {
      // Network failure (no response at all) never set a message above.
      setErrorMessage((m) => m || 'Couldn’t reach the server — check your connection and try again.')
      setStatus('error')
      if (window.turnstile && widgetId.current !== null) {
        window.turnstile.reset(widgetId.current)
      }
    }
  }

  return (
    <section id="contact" className="container-content py-24">
      {/* One rounded card, split left / right. The left half is the solid
          theme-pink "info" panel; the right half holds the form. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="grid overflow-hidden rounded-3xl border border-ink/10 shadow-xl
                   dark:border-mist/10 md:grid-cols-5"
      >
        {/* ---- Left: pink info panel ---- */}
        <div
          className="relative flex flex-col justify-between gap-10 overflow-hidden bg-pink p-8
                     text-paper dark:bg-pink-bright dark:text-night md:col-span-2 md:p-10"
        >
          {/* Decorative rings — purely visual */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full
                       border-[28px] border-paper/15 dark:border-night/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full
                       bg-paper/10 dark:bg-night/10"
          />

          <div className="relative">
            <p className="font-mono text-sm opacity-90">Contact</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Let's build something together
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed">
              I'm open to frontend and full-stack opportunities. Send a message
              and I'll get back to you directly.
            </p>
          </div>

          <ul className="relative space-y-4 text-sm">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-3 hover:underline"
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-paper text-pink dark:bg-night dark:text-pink-bright">
                  <i className="bi bi-envelope-fill" />
                </span>
                {profile.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-paper text-pink dark:bg-night dark:text-pink-bright">
                <i className="bi bi-geo-alt-fill" />
              </span>
              {profile.location}
            </li>
          </ul>

          <div className="relative flex gap-3">
            {profile.socials
              .filter((s) => s.label !== 'Email')
              .map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/50
                             transition-colors hover:bg-paper hover:text-pink
                             dark:border-night/40 dark:hover:bg-night dark:hover:text-pink-bright"
                >
                  <i className={`bi ${social.icon}`} style={{ fontSize: '1rem' }} />
                </a>
              ))}
          </div>
        </div>

        {/* ---- Right: form ---- */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 bg-paper p-6 dark:bg-night-raised md:col-span-3 md:p-10"
      >
        {/* Honeypot field — visually hidden, skipped by screen readers and
            keyboard tabbing, but visible to bots that auto-fill every
            input on a page. A human should never be able to reach this. */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', top: 0, width: 1, height: 1, overflow: 'hidden' }}
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="name" className="font-mono text-xs text-ink-soft dark:text-mist-soft">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-paper px-4 py-2.5
                       text-ink outline-none transition-colors focus:border-pink
                       dark:border-mist/15 dark:bg-night dark:text-mist dark:focus:border-pink-bright"
            placeholder="Your name"
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="font-mono text-xs text-ink-soft dark:text-mist-soft">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-paper px-4 py-2.5
                       text-ink outline-none transition-colors focus:border-pink
                       dark:border-mist/15 dark:bg-night dark:text-mist dark:focus:border-pink-bright"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="font-mono text-xs text-ink-soft dark:text-mist-soft">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className="mt-1.5 w-full resize-none rounded-lg border border-ink/15 bg-paper px-4 py-2.5
                       text-ink outline-none transition-colors focus:border-pink
                       dark:border-mist/15 dark:bg-night dark:text-mist dark:focus:border-pink-bright"
            placeholder="Tell me a bit about the role or project..."
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-xs text-red-500">
              {errors.message}
            </p>
          )}
        </div>

        {/* Cloudflare Turnstile — usually renders invisibly; only shows a
            checkbox to visitors that look suspicious. Skipped entirely in
            local dev if VITE_TURNSTILE_SITE_KEY isn't set. */}
        {TURNSTILE_SITE_KEY && <div ref={turnstileRef} />}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-full bg-pink px-6 py-3 font-mono text-sm text-paper
                     transition-transform hover:-translate-y-0.5 disabled:opacity-60
                     disabled:hover:translate-y-0 dark:bg-pink-bright dark:text-night"
        >
          {status === 'sending' ? 'Sending...' : 'Send message'}
        </button>

        {/* aria-live so screen readers announce the result */}
        <div aria-live="polite">
          {status === 'success' && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-pink dark:text-pink-bright"
            >
              Thanks for reaching out — your message has been sent. I'll get back to you soon.
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-red-500"
            >
              {errorMessage || 'Something went wrong — please try again.'}
            </motion.p>
          )}
        </div>
      </form>
      </motion.div>
    </section>
  )
}