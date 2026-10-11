import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { profile } from '../assets/data/content'

// The lines rendered inside the mock editor. Each `parts` entry is typed in
// sequence with its own color, so the animation reads like real syntax
// highlighting appearing keystroke by keystroke.
const CODE_LINES = [
  [{ t: 'const ', c: 'kw' }, { t: 'developer', c: 'var' }, { t: ' = {', c: 'punct' }],
  [{ t: '  name: ', c: 'prop' }, { t: '"Pragati Tiwari"', c: 'str' }, { t: ',', c: 'punct' }],
  [{ t: '  role: ', c: 'prop' }, { t: '"Frontend Developer"', c: 'str' }, { t: ',', c: 'punct' }],
  [{ t: '  stack: ', c: 'prop' }, { t: '["React", "JS", "Tailwind"]', c: 'str' }, { t: ',', c: 'punct' }],
  [{ t: '  loves: ', c: 'prop' }, { t: '"clean, animated UI"', c: 'str' }],
  [{ t: '};', c: 'punct' }],
]

const COLOR_MAP = {
  kw: 'text-violet',
  var: 'text-pink dark:text-pink-bright',
  punct: 'text-ink-soft dark:text-mist-soft',
  prop: 'text-ink dark:text-mist',
  str: 'text-pink dark:text-pink-bright',
}

export default function Hero() {
  const lineRefs = useRef([])
  const caretRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = lineRefs.current.filter(Boolean)
      // Start every line invisible / clipped, then reveal them one at a time
      // to fake a typing effect without re-rendering text node by node.
      gsap.set(lines, { clipPath: 'inset(0 100% 0 0)', opacity: 1 })

      const tl = gsap.timeline({ delay: 0.3 })
      lines.forEach((line, i) => {
        tl.to(line, { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'steps(20)' }, i * 0.35)
      })
      tl.to(caretRef.current, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.5,
        ease: 'power1.inOut',
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="top"
      className="container-content grid gap-12 pb-20 pt-28 md:grid-cols-[1.1fr_1fr] md:items-center md:pb-28 md:pt-36"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="font-mono text-sm text-pink dark:text-pink-bright">
          Hi, I&apos;m {profile.name.split(' ')[0]}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1] text-ink dark:text-mist md:text-5xl">
          {profile.role} crafting interfaces people enjoy using.
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft dark:text-mist-soft">
          {profile.intro}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="rounded-full bg-pink px-6 py-2.5 font-mono text-sm text-paper
                       transition-transform hover:-translate-y-0.5
                       dark:bg-pink-bright dark:text-night"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="font-mono text-sm text-ink underline decoration-ink/30 underline-offset-4
                       transition-colors hover:text-pink hover:decoration-pink
                       dark:text-mist dark:decoration-mist/30 dark:hover:text-pink-bright"
          >
            Get in touch
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
        className="relative rounded-xl border border-ink/10 bg-white/60 p-5 font-mono text-sm shadow-sm
                   dark:border-mist/10 dark:bg-night-raised/80"
      >
        {/* Small floating accents — part of the site's continuous, gentle motion */}
        <motion.span
          aria-hidden="true"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-4 -top-4 flex h-9 w-9 items-center justify-center rounded-full
                     bg-pink text-paper shadow-md dark:bg-pink-bright dark:text-night"
        >
          <i className="bi bi-braces" style={{ fontSize: '0.9rem' }} />
        </motion.span>
        <motion.span
          aria-hidden="true"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -bottom-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full
                     bg-violet text-paper shadow-md dark:bg-violet-bright dark:text-night"
        >
          <i className="bi bi-stars" style={{ fontSize: '0.8rem' }} />
        </motion.span>

        <div className="mb-4 flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-violet/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-pink/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/20 dark:bg-mist/20" />
        </div>
        <pre className="whitespace-pre-wrap leading-7">
          {CODE_LINES.map((line, i) => (
            <div
              key={i}
              ref={(el) => (lineRefs.current[i] = el)}
              style={{ opacity: 0 }}
            >
              {line.map((part, j) => (
                <span key={j} className={COLOR_MAP[part.c]}>
                  {part.t}
                </span>
              ))}
              {i === CODE_LINES.length - 1 && (
                <span ref={caretRef} className="ml-0.5 text-pink dark:text-pink-bright">
                  ▍
                </span>
              )}
            </div>
          ))}
        </pre>
      </motion.div>
    </section>
  )
}