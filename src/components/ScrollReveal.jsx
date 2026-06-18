import { useEffect, useRef } from 'react'

export default function ScrollReveal({ children, className = "" }) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element crosses into the screen...
        if (entry.isIntersecting) {
          // Add the visible class to trigger the CSS transition
          entry.target.classList.add('is-visible')
          // Stop observing so it stays visible even if they scroll back up
          observer.unobserve(entry.target) 
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the element is visible
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div ref={ref} className={`reveal-on-scroll ${className}`}>
      {children}
    </div>
  )
}
