import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="border-t border-ink/10 py-20 dark:border-mist/10">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <p className="font-mono text-sm text-pink dark:text-pink-bright">About</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink dark:text-mist">
            A little about <span className="text-pink dark:text-pink-bright">how I work</span> 
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft dark:text-mist-soft">
            I'm a frontend developer who enjoys the space where design decisions
            turn into working code. I started with HTML, CSS, and JavaScript,
            and I'm now building most of my new projects in React — focusing
            on components that are easy to reuse, animation that supports the
            content instead of distracting from it, and layouts that hold up
            on any screen.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft dark:text-mist-soft">
            I like taking a project from a rough idea to a shipped site: planning
            the structure, building it with clean and maintainable code, and
            polishing the details that make an interface feel considered.
          </p>

          <h2 className="mt-6 font-display text-3xl font-bold text-ink dark:text-mist">
            A little about <span className="text-pink dark:text-pink-bright">me</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft dark:text-mist-soft">
            I'm a lifelong learner who loves to explore new ideas and technologies. When I'm not coding, you can find me reading, gardening, listening to music, or experimenting with new recipes in the kitchen. I believe that creativity and curiosity are key to both personal and professional growth, and I strive to bring that mindset into every project I work on.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
