# Pragati Tiwari — Portfolio

A React portfolio built with Vite, Tailwind CSS v4, Framer Motion, and GSAP.

## Run locally

```bash
npm install
npm run dev
```

## Contact form (Vercel serverless function)

The form posts to `api/contact.js`, a Node.js serverless function that
validates input, checks a honeypot + Cloudflare Turnstile, rate-limits per
IP, and emails you via [Resend](https://resend.com).

**Setup**

1. Create a Resend account → API Keys. Copy `.env.example` to `.env` and fill
   in `RESEND_API_KEY`, `TO_EMAIL` and `FROM_EMAIL`. Until you verify a
   domain on Resend, use `Portfolio <onboarding@resend.dev>` as the sender
   and your Resend signup email as `TO_EMAIL`.
2. (Recommended) Create a free Turnstile widget at dash.cloudflare.com →
   Turnstile. Put the secret in `TURNSTILE_SECRET_KEY` and the site key in
   `VITE_TURNSTILE_SITE_KEY`. Leave both empty to skip the check locally.

**Run locally with the API** — plain `npm run dev` does *not* serve `/api`:

```bash
npm i -g vercel
vercel dev
```

**Deploy** — import the repo in Vercel, add the same variables under
Project → Settings → Environment Variables, then redeploy (env changes
only apply to new deployments; `VITE_*` values are baked in at build time).

**Tests** — `npm test` runs the API handler tests (validation, honeypot,
rate limit, Turnstile, Resend failure) with email sending stubbed out.

## Build for production

```bash
npm run build
```

The output goes to `dist/` — deploy that folder to Netlify, Vercel, or GitHub Pages.

## Editing content

Almost all text (name, tagline, skills, projects, social links) lives in
one file: `src/assets/data/content.js`. Edit that file to update the site
without touching any component code.

## Structure

```
src/
  components/     Navbar, Hero, Skills, Projects, ProjectCard, About, Contact, Footer, ThemeToggle
  context/        ThemeContext.jsx — light/dark theme state (light by default)
  assets/data/    content.js — all site copy and project data
  index.css       Design tokens (colors, fonts) + Tailwind import
```

## Design tokens

Defined in `src/index.css` under `@theme`:
- Colors: `paper`, `ink`, `emerald`, `emerald-bright`, `coral`, `night`, `mist`
- Fonts: Space Grotesk (headings), Newsreader (body), JetBrains Mono (labels/code)

## Notes

- Theme toggle defaults to light and persists your choice in `localStorage`.
- The hero's animated code snippet and the skills marquee use GSAP; page-load
  and scroll-reveal transitions use Framer Motion.
- Icons are from Bootstrap Icons (`bootstrap-icons` npm package).