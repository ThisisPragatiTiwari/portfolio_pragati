import { useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import { nav, profile } from '../assets/data/content'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 8)
  })

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-paper/80 backdrop-blur transition-shadow
                  dark:bg-night/80 ${
                    scrolled
                      ? 'border-ink/10 shadow-sm dark:border-mist/10'
                      : 'border-transparent'
                  }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="font-display text-lg font-semibold tracking-tight text-ink dark:text-mist"
        >
          Pragati<span className="text-pink dark:text-pink-bright">.</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-sm text-ink-soft transition-colors hover:text-pink
                         dark:text-mist-soft dark:hover:text-pink-bright"
            >
              {item.label}
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-pink px-4 py-1.5 font-mono text-sm text-pink
                       transition-colors hover:bg-pink hover:text-paper
                       dark:border-pink-bright dark:text-pink-bright
                       dark:hover:bg-pink-bright dark:hover:text-night"
          >
            Say hello
          </a>
          <ThemeToggle />
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15
                       text-ink dark:border-mist/20 dark:text-mist"
          >
            <i className={open ? 'bi bi-x-lg' : 'bi bi-list'} style={{ fontSize: '1.1rem' }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-b border-ink/10 bg-paper md:hidden
                       dark:border-mist/10 dark:bg-night"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-2 font-mono text-sm text-ink-soft dark:text-mist-soft"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
