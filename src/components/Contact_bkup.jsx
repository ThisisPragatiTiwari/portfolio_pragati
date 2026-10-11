import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../assets/data/content'

const EMPTY_FORM = { name: '', email: '', message: '' }

// Basic client-side email pattern check — not exhaustive, just catches
// obviously malformed input before it would reach a backend.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  // status: 'idle' | 'sending' | 'success' | 'error'
  const [status, setStatus] = useState('idle')

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

    // ---------------------------------------------------------------
    // TODO (backend integration, later chat): replace this simulated
    // delay with a real request, e.g.
    //
    //   const res = await fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(form),
    //   })
    //   if (!res.ok) throw new Error('Request failed')
    //
    // That endpoint is what should trigger the email notification to
    // Pragati. Everything else in this form (validation, states, UI)
    // is already wired to work with it — only this block changes.
    // ---------------------------------------------------------------
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      setStatus('success')
      setForm(EMPTY_FORM)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-2xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center"
      >
        <p className="font-mono text-sm text-pink dark:text-pink-bright">Contact</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink dark:text-mist md:text-4xl">
          Let's build something together
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink-soft dark:text-mist-soft">
          I'm open to frontend and full-stack opportunities. Send a message
          and I'll get back to you directly.
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        noValidate
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="mt-10 space-y-5 rounded-2xl border border-ink/10 bg-white/50 p-6
                   dark:border-mist/10 dark:bg-night-raised/60 md:p-8"
      >
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

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-full bg-pink px-6 py-3 font-mono text-sm text-paper
                     transition-transform hover:-translate-y-0.5 disabled:opacity-60
                     disabled:hover:translate-y-0 dark:bg-pink-bright dark:text-night"
        >
          {status === 'sending' ? 'Sending...' : 'Send message'}
        </button>

        {status === 'success' && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-pink dark:text-pink-bright"
          >
            Thanks — your message is ready to send. (Backend wiring coming next.)
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-red-500"
          >
            Something went wrong — please try again.
          </motion.p>
        )}
      </motion.form>

      <div className="mt-8 flex justify-center gap-5">
        {profile.socials
          .filter((s) => s.label !== 'Email')
          .map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15
                         text-ink transition-colors hover:border-pink hover:text-pink
                         dark:border-mist/20 dark:text-mist dark:hover:border-pink-bright
                         dark:hover:text-pink-bright"
            >
              <i className={`bi ${social.icon}`} style={{ fontSize: '1rem' }} />
            </a>
          ))}
      </div>
    </section>
  )
}
