import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'
import { skills } from '../assets/data/content'

export default function Skills() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // The track is rendered twice back to back (see JSX) so this tween can
    // loop seamlessly: once it scrolls exactly one copy's width, snap back.
    const ctx = gsap.context(() => {
      const distance = track.scrollWidth / 2
      const tween = gsap.to(track, {
        x: -distance,
        duration: 28,
        ease: 'none',
        repeat: -1,
      })

      const pause = () => tween.pause()
      const resume = () => tween.resume()
      track.addEventListener('mouseenter', pause)
      track.addEventListener('mouseleave', resume)

      return () => {
        track.removeEventListener('mouseenter', pause)
        track.removeEventListener('mouseleave', resume)
      }
    })

    return () => ctx.revert()
  }, [])

  const doubled = [...skills, ...skills]

  return (
    <section id="skills" className="border-y border-ink/10 py-14 dark:border-mist/10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="container-content"
      >
        <p className="font-mono text-sm text-pink dark:text-pink-bright">Skills</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink dark:text-mist">
          What I build with
        </h2>
      </motion.div>

      <div className="mt-8 overflow-hidden">
        <div ref={trackRef} className="flex w-max gap-3 px-6">
          {doubled.map((skill, i) => (
            <span
              key={`${skill}-${i}`}
              className="flex-none rounded-full border border-ink/10 px-5 py-2 font-mono text-sm
                         text-ink-soft dark:border-mist/15 dark:text-mist-soft"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}