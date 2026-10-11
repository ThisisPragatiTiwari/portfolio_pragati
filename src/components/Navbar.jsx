import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import { nav, profile } from '../assets/data/content'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeNav, setActiveNav] = useState('null')

  // The header stays plain and full-width while the hero is in view, then
  // condenses into a floating pill matched to the content width once the
  // hero has scrolled out — not on a fixed pixel offset, but tied to the
  // hero section's actual height so it works at any viewport size.
  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return

    const handleScroll = () => {
      const heroBottom = hero.offsetTop + hero.offsetHeight
      setScrolled(window.scrollY > heroBottom - 80)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed left-1/2 z-50 -translate-x-1/2 rounded-xl md:rounded-full transition-all duration-400 ease-out ${
        scrolled
          ? 'top-3 w-[calc(100%-2rem)] max-w-[1200px] border border-ink/10 bg-paper/75 shadow-lg backdrop-blur-md dark:border-mist/10 dark:bg-night/75'
          : 'top-0 w-full max-w-none border-transparent bg-transparent shadow-none backdrop-blur-0'
      }`}
    >
      <div
        className={`flex items-center justify-between transition-all duration-400 ease-out ${
          scrolled ? 'px-5 py-2.5' : 'px-6 py-4 md:px-10'
        }`}
      >
        <a
          href="#top"
          className="font-logo text-xl italic tracking-tight text-ink dark:text-mist"
        >
          Pragati<span className="text-pink dark:text-pink-bright">.</span>
        </a>

        {/* Desktop nav — body font, as requested, not the mono label style */}
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => {
                console.log('clicked', item.href);
                setActiveNav(item.href)}}
              className={`text-sm transition-colors hover:text-pink
                         dark:text-mist-soft dark:hover:text-pink-bright ${
                           activeNav === item.href
                             ? 'text-pink dark:text-pink-bright'
                             : ''
                         }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-pink px-4 py-1.5 text-sm text-pink
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

      {/* Mobile menu — inherits the header's current width automatically
          since it's a block-level child of the header, not the viewport */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-ink/10 md:hidden dark:border-mist/10"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm text-ink-soft dark:text-mist-soft"
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