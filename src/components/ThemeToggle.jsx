import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className="relative flex h-9 w-9 items-center justify-center rounded-full
                 border border-ink/15 text-ink transition-colors
                 hover:border-pink hover:text-pink
                 dark:border-mist/20 dark:text-mist dark:hover:border-pink-bright
                 dark:hover:text-pink-bright"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.i
          key={isDark ? 'moon' : 'sun'}
          className={isDark ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill'}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{ fontSize: '1rem' }}
        />
      </AnimatePresence>
    </button>
  )
}
