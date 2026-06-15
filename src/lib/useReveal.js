import { useEffect, useRef } from 'react'

/**
 * Returns a ref to attach to an element. When the element scrolls into
 * view, adds the `is-visible` class which triggers the `.reveal` CSS
 * transition defined in index.css.
 */
export function useReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15, ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return ref
}
