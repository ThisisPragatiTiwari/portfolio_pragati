import { motion } from 'framer-motion'

// Alternates the thumbnail gradient direction so the grid doesn't feel
// mechanically repeated across cards.
const GRADIENTS = [
  'from-pink to-violet',
  'from-violet to-pink',
]

export default function ProjectCard({ project, index }) {
  const { title, description, stack, href, code, featured, category } = project

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className={`group flex flex-col overflow-hidden rounded-2xl border transition-colors ${
        featured
          ? 'border-pink/40 dark:border-pink-bright/30'
          : 'border-ink/10 dark:border-mist/10'
      }`}
    >
      {/* Thumbnail — gradient placeholder with the project's initial, since
          these are private/client projects without public screenshots */}
      <div
        className={`relative flex h-32 items-center justify-between bg-gradient-to-br px-6
                     ${GRADIENTS[index % GRADIENTS.length]}`}
      >
        <span className="font-display text-4xl font-extrabold text-white/90">
          {title.charAt(0)}
        </span>
        <span className="font-mono text-xs text-white/70">
          {String(index + 1).padStart(2, '0')}
        </span>
        {featured && (
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 font-mono text-xs text-ink">
            Featured · React
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-ink dark:text-mist">
            {title}
          </h3>
          <span className="flex-none rounded-full bg-ink/[0.05] px-2.5 py-1 font-mono text-[11px]
                            text-ink-soft dark:bg-mist/10 dark:text-mist-soft">
            {category}
          </span>
        </div>

        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft dark:text-mist-soft">
          {description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {stack.map((item) => (
            <li
              key={item}
              className="rounded-full bg-ink/[0.05] px-3 py-1 font-mono text-xs text-ink-soft
                         dark:bg-mist/10 dark:text-mist-soft"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex gap-4">
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-sm text-pink
                         transition-transform hover:translate-x-0.5 hover:underline
                         dark:text-pink-bright"
            >
              Live site <i className="bi bi-arrow-up-right" />
            </a>
          )}
          {code && (
            <a
              href={code}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-sm text-ink-soft
                         hover:underline dark:text-mist-soft"
            >
              <i className="bi bi-github" /> Code
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
