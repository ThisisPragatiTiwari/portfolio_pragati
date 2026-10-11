import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from './ProjectCard'
import CaseStudyModal from './CaseStudyModal'
import { projects } from '../assets/data/content'

const FILTERS = ['All', 'React', 'Web Development', 'Design']

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [activeCaseStudy, setActiveCaseStudy] = useState(null)

  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  )

  const featured = visible.filter((p) => p.tier === 'featured')
  const rest = visible.filter((p) => p.tier !== 'featured')

  return (
    <section id="projects" className="container-content py-20">
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
          A React build leading the way, alongside sites and products I've designed and shipped end to end.
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

      {/* Featured projects — full-width rows, top of the section */}
      {featured.length > 0 && (
        <motion.div layout className="mt-8 flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {featured.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Everything else — standard previews and case studies, side by side */}
      {rest.length > 0 && (
        <>
          <p className="mt-12 font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-mist-soft">
            More work
          </p>
          <motion.div layout className="mt-4 grid gap-6 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {rest.map((project, i) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={i}
                  onOpenCaseStudy={setActiveCaseStudy}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      <CaseStudyModal project={activeCaseStudy} onClose={() => setActiveCaseStudy(null)} />
    </section>
  )
}