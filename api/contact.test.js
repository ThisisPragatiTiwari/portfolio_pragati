// Run with: npm test   (uses Node's built-in test runner — no extra deps).
//
// The Resend SDK talks to its API via global fetch, so stubbing fetch lets
// us exercise the real handler end to end without sending any email.

import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import handler from './contact.js'

const realFetch = globalThis.fetch
let fetchCalls

function fakeRes() {
  return {
    statusCode: 200,
    body: undefined,
    headers: {},
    setHeader(k, v) { this.headers[k] = v },
    status(code) { this.statusCode = code; return this },
    json(payload) { this.body = payload; return this },
  }
}

let ipCounter = 0
// Fresh IP per request so the in-memory rate limiter doesn't bleed between tests.
const req = (body, { method = 'POST', ip } = {}) => ({
  method,
  body,
  headers: { 'x-forwarded-for': ip ?? `10.0.0.${++ipCounter}` },
})

const valid = { name: 'Ada', email: 'ada@example.com', message: 'Hello there' }

beforeEach(() => {
  fetchCalls = []
  process.env.RESEND_API_KEY = 're_test'
  process.env.TO_EMAIL = 'me@example.com'
  process.env.FROM_EMAIL = 'Portfolio <onboarding@resend.dev>'
  delete process.env.TURNSTILE_SECRET_KEY
  // Default: every outbound call succeeds (Resend and Turnstile alike).
  globalThis.fetch = async (url, init) => {
    fetchCalls.push({ url: String(url), init })
    return new Response(JSON.stringify({ id: 'email_1', success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

afterEach(() => {
  globalThis.fetch = realFetch
})

test('rejects non-POST methods', async () => {
  const res = fakeRes()
  await handler(req(undefined, { method: 'GET' }), res)
  assert.equal(res.statusCode, 405)
  assert.equal(res.headers.Allow, 'POST')
})

test('sends an email on a valid submission', async () => {
  const res = fakeRes()
  await handler(req(valid), res)
  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body, { ok: true })
  const sent = fetchCalls.find((c) => c.url.includes('resend'))
  assert.ok(sent, 'expected a call to the Resend API')
  const payload = JSON.parse(sent.init.body)
  assert.deepEqual([].concat(payload.to), ['me@example.com'])
  assert.match(payload.subject, /Ada/)
})

test('rejects missing fields with per-field errors', async () => {
  const res = fakeRes()
  await handler(req({ name: '', email: '', message: '' }), res)
  assert.equal(res.statusCode, 400)
  assert.ok(res.body.fields.name && res.body.fields.email && res.body.fields.message)
  assert.equal(fetchCalls.length, 0)
})

test('rejects a malformed email', async () => {
  const res = fakeRes()
  await handler(req({ ...valid, email: 'not-an-email' }), res)
  assert.equal(res.statusCode, 400)
  assert.ok(res.body.fields.email)
})

test('rejects an over-long message', async () => {
  const res = fakeRes()
  await handler(req({ ...valid, message: 'x'.repeat(2001) }), res)
  assert.equal(res.statusCode, 400)
  assert.ok(res.body.fields.message)
})

test('honeypot: pretends success but sends nothing', async () => {
  const res = fakeRes()
  await handler(req({ ...valid, website: 'http://spam.example' }), res)
  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body, { ok: true })
  assert.equal(fetchCalls.length, 0)
})

test('rate limits the 6th submission from one IP', async () => {
  const ip = '203.0.113.7'
  let last
  for (let i = 0; i < 6; i++) {
    last = fakeRes()
    await handler(req(valid, { ip }), last)
  }
  assert.equal(last.statusCode, 429)
})

test('returns 500 when email env vars are missing', async () => {
  delete process.env.RESEND_API_KEY
  const res = fakeRes()
  await handler(req(valid), res)
  assert.equal(res.statusCode, 500)
})

test('Turnstile: blocks when token is missing', async () => {
  process.env.TURNSTILE_SECRET_KEY = 'secret'
  const res = fakeRes()
  await handler(req(valid), res)
  assert.equal(res.statusCode, 400)
  assert.match(res.body.error, /verification/i)
})

test('Turnstile: blocks when Cloudflare says the token is invalid', async () => {
  process.env.TURNSTILE_SECRET_KEY = 'secret'
  globalThis.fetch = async (url) => {
    fetchCalls.push({ url: String(url) })
    return new Response(JSON.stringify({ success: false }), { status: 200 })
  }
  const res = fakeRes()
  await handler(req({ ...valid, turnstileToken: 'bad' }), res)
  assert.equal(res.statusCode, 400)
  assert.ok(!fetchCalls.some((c) => c.url.includes('resend')))
})

test('returns 502 when Resend rejects the send', async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ name: 'validation_error', message: 'nope', statusCode: 422 }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    })
  const res = fakeRes()
  await handler(req(valid), res)
  assert.equal(res.statusCode, 502)
})

test('HTML in the message is escaped in the email body', async () => {
  const res = fakeRes()
  await handler(req({ ...valid, message: '<script>alert(1)</script>' }), res)
  const sent = fetchCalls.find((c) => c.url.includes('resend'))
  const { html } = JSON.parse(sent.init.body)
  assert.ok(!html.includes('<script>'))
  assert.ok(html.includes('&lt;script&gt;'))
})