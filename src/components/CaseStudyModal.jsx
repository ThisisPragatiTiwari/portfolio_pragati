import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  { key: 'challenge', label: 'Challenge' },
  { key: 'approach', label: 'Approach' },
  { key: 'result', label: 'Result' },
]

export default function CaseStudyModal({ project, onClose }) {
  const isOpen = Boolean(project)

  // Close on Escape, and lock page scroll while the modal is open.
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm dark:bg-black/60"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-ink/10
                       bg-paper p-6 shadow-xl dark:border-mist/10 dark:bg-night-raised md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-pink dark:text-pink-bright">Case study</p>
                <h3
                  id="case-study-title"
                  className="mt-1 font-display text-2xl font-bold text-ink dark:text-mist"
                >
                  {project?.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-ink/15
                           text-ink transition-colors hover:border-pink hover:text-pink
                           dark:border-mist/20 dark:text-mist dark:hover:border-pink-bright dark:hover:text-pink-bright"
              >
                <i className="bi bi-x-lg" style={{ fontSize: '0.9rem' }} />
              </button>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {project?.stack.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-ink/[0.05] px-3 py-1 font-mono text-xs text-ink-soft
                             dark:bg-mist/10 dark:text-mist-soft"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-6">
              {SECTIONS.map(({ key, label }) => (
                <div key={key}>
                  <p className="font-mono text-xs uppercase tracking-wide text-pink dark:text-pink-bright">
                    {label}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft dark:text-mist-soft">
                    {project?.caseStudy?.[key]}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
