import { motion } from 'framer-motion'
import ProjectPreview from './ProjectPreview'

// Alternates the gradient fallback's direction so the grid doesn't feel
// mechanically repeated across cards.
const GRADIENTS = ['from-pink to-violet', 'from-violet to-pink']

export default function ProjectCard({ project, index, onOpenCaseStudy }) {
  const { title, description, stack, href, code, category, tier } = project

  if (tier === 'featured') {
    return <FeaturedCard project={project} index={index} />
  }

  // 'standard' and 'case-study' share the same compact card shape; only the
  // thumbnail and the bottom action differ.
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 transition-colors dark:border-mist/10"
    >
      {tier !== 'case-study' && (
        <ProjectPreview project={project} index={index} gradients={GRADIENTS} />
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-ink dark:text-mist">{title}</h3>
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
          {tier === 'case-study' ? (
            <button
              type="button"
              onClick={() => onOpenCaseStudy(project)}
              className="inline-flex items-center gap-1.5 font-mono text-sm text-pink
                         transition-transform hover:translate-x-0.5 hover:underline
                         dark:text-pink-bright"
            >
              Read case study <i className="bi bi-arrow-right" />
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </motion.article>
  )
}

// Large, full-width row for the top 1–2 projects — alternates image/content
// sides by index so a stack of featured cards doesn't feel mechanical.
function FeaturedCard({ project, index }) {
  const { title, description, stack, href, category } = project
  const imageOnRight = index % 2 === 0

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="grid overflow-hidden rounded-2xl border border-pink/40 dark:border-pink-bright/30 md:grid-cols-2"
    >
      {/* Both columns get the SAME explicit height on desktop (md:min-h-[26rem]),
          instead of one column sizing itself and the other stretching to
          match — that mismatch is what left empty space under the image
          whenever the text column was taller. ProjectPreview fills that
          fixed box with h-full + object-cover, so it's always edge-to-edge
          with no gap, whatever the image's own aspect ratio is. */}
      <div className={imageOnRight ? 'order-1 md:order-2 md:min-h-[26rem]' : 'order-1 md:min-h-[26rem]'}>
        <ProjectPreview
          project={project}
          index={index}
          gradients={GRADIENTS}
          height="h-64 md:h-full"
        />
      </div>

      <div
        className={`flex flex-col overflow-y-auto p-6 md:p-8 md:min-h-[26rem] ${imageOnRight ? 'order-2 md:order-1' : 'order-2'}`}
      >
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-pink px-3 py-1 font-mono text-xs text-paper
                          dark:bg-pink-bright dark:text-night">
          Featured · {category}
        </span>
        <h3 className="mt-4 font-display text-2xl font-bold text-ink dark:text-mist">{title}</h3>
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

        {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-sm text-pink
                       transition-transform hover:translate-x-0.5 hover:underline
                       dark:text-pink-bright"
          >
            Live site <i className="bi bi-arrow-up-right" />
          </a>
        )}
      </div>
    </motion.article>
  )
}