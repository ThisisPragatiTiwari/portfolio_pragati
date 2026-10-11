import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Soft, blurred shapes that drift slowly and continuously in the background.
// Fixed positioning + a very low opacity keeps them as ambience rather than
// distraction — this is the site's "always something moving" layer.
export default function FloatingBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const blobs = containerRef.current?.querySelectorAll('.floating-blob')
    if (!blobs || blobs.length === 0) return

    const ctx = gsap.context(() => {
      blobs.forEach((blob, i) => {
        gsap.to(blob, {
          x: `random(-60, 60)`,
          y: `random(-50, 50)`,
          duration: 10 + i * 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.6,
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="floating-blob absolute -left-24 top-10 h-72 w-72 rounded-full bg-pink/20 blur-3xl dark:bg-pink-bright/10" />
      <div className="floating-blob absolute right-0 top-1/3 h-80 w-80 rounded-full bg-violet/20 blur-3xl dark:bg-violet-bright/10" />
      <div className="floating-blob absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-pink/15 blur-3xl dark:bg-pink-bright/10" />
    </div>
  )
}
