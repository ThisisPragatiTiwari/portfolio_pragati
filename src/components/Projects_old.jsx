import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from './ProjectCard'
import { projects } from '../assets/data/content'

const FILTERS = ['All', 'React', 'Other']

export default function Projects() {
  const [filter, setFilter] = useState('All')

  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  )

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="font-mono text-sm text-pink dark:text-pink-bright">Work</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink dark:text-mist">
          Projects
        </h2>
        <p className="mt-3 max-w-lg text-ink-soft dark:text-mist-soft">
          A React build leading the way, alongside sites I've designed and shipped end to end.
        </p>
      </motion.div>

      {/* Filter tabs */}
      <div className="mt-8 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 font-mono text-sm transition-colors ${
              filter === f
                ? 'bg-pink text-paper dark:bg-pink-bright dark:text-night'
                : 'border border-ink/10 text-ink-soft hover:border-pink hover:text-pink dark:border-mist/15 dark:text-mist-soft dark:hover:border-pink-bright dark:hover:text-pink-bright'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-8 grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
