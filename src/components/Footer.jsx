import { profile } from '../assets/data/content'

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 py-8 dark:border-mist/10">
      <div className="container-content flex flex-col items-center justify-between gap-3
                       font-mono text-xs text-ink-soft dark:text-mist-soft md:flex-row">
        <p>© {new Date().getFullYear()} {profile.name}. Built with React &amp; a lot of coffee.</p>
        <a href="#top" className="hover:text-pink dark:hover:text-pink-bright">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}