# Pragati Tiwari — Portfolio

A React portfolio built with Vite, Tailwind CSS v4, Framer Motion, and GSAP.

## Run locally

```bash
npm install
npm run dev
```

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
