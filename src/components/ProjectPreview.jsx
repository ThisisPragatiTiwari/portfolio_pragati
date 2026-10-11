import { useEffect, useRef, useState } from 'react'

// Renders a project's thumbnail in one of three modes, set per project in
// content.js via `preview`:
//   'iframe'   — a live, scaled-down embed of the real site (see the scaling note below). Reserved for DevFest Noida — it's
//                this site's own build, so it's reliable and has no scroll-triggered content to worry about.
//   'image'    — a static screenshot (project.image). Used for sites that can't be reliably embedded live (corporate sites often
//                block framing outright; some pages lazy-load content on  scroll, which a frozen iframe can never trigger since it's
//                cross-origin and can't be scrolled programmatically). 'gradient' — a gradient block with the project's initial. Automatic
//                fallback when 'image'/'iframe' is set but the asset/href isn't ready yet.
//
// Why the iframe needs a scaling trick: embedded at its natural size, a cropped sliver of a page looks broken. Instead it renders at a fixed
// "page" size (1280×800) inside a wrapper that's scaled and centered to COVER the container — like CSS `object-fit: cover` — so it always fills the box edge to edge, whatever height the container ends up with. A ResizeObserver keeps that scale correct as the container's size changes.
const IFRAME_WIDTH = 1280
const IFRAME_HEIGHT = 800

export default function ProjectPreview({ project, index, gradients, height = '' }) {
  const { title, href, image, preview } = project
  const containerRef = useRef(null)
  const [scale, setScale] = useState(0.3)

  useEffect(() => {
    const el = containerRef.current
    if (!el || preview !== 'iframe') return

    const updateScale = () => {
      const scaleX = el.clientWidth / IFRAME_WIDTH
      const scaleY = el.clientHeight / IFRAME_HEIGHT
      setScale(Math.max(scaleX, scaleY)) // "cover" — never leaves a gap
    }
    updateScale()

    const observer = new ResizeObserver(updateScale)
    observer.observe(el)
    return () => observer.disconnect()
  }, [preview])

  if (preview === 'iframe' && href) {
    return (
      <div
        ref={containerRef}
        className={`relative ${height} overflow-hidden bg-paper-dim dark:bg-night-raised`}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{
            width: IFRAME_WIDTH,
            height: IFRAME_HEIGHT,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <iframe
            src={href}
            title={`Live preview of ${title}`}
            loading="lazy"
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
            style={{ width: IFRAME_WIDTH, height: IFRAME_HEIGHT, border: 0 }}
          />
        </div>
        {/* Transparent, click-absorbing layer — keeps the thumbnail a
            preview, not an interactive embed of someone else's site */}
        <div className="absolute inset-0" />
        <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[10px] text-paper backdrop-blur-sm">
          Live preview
        </span>
      </div>
    )
  }

  if (preview === 'image' && image) {
    return (
      <div className={`relative ${height} overflow-hidden bg-paper-dim dark:bg-night-raised`}>
        <img
          src={image}
          alt={`Screenshot of ${title}`}
          loading="lazy"
          className=" w-full object-cover object-top"
        />
      </div>
    )
  }

  // Gradient fallback — used for case-study entries, or any project whose
  // 'image'/'iframe' asset isn't ready yet
  return (
    <div
      className={`relative flex ${height} items-center justify-between bg-gradient-to-br px-6
                   ${gradients[index % gradients.length]}`}
    >
      <span className="font-display text-4xl font-extrabold text-white/90">
        {title.charAt(0)}
      </span>
      <span className="font-mono text-xs text-white/70">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  )
}
