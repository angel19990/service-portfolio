'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * One shared IntersectionObserver for the whole document. In JSX the tree
 * order is the order, so the parent simply passes its map index as the stagger.
 *
 * Two-way, not one-shot: an element that leaves the viewport drops back to its
 * hidden state, so scrolling back up plays the entrance again.
 *
 * The two thresholds are hysteresis, not decoration. Revealing at 15% and hiding
 * only at 0 leaves a dead band in between, so an element parked on the viewport
 * edge cannot flicker between the two states.
 *
 * Not Framer Motion: ~40kb to do this, and it would push the entire section tree
 * across the client boundary. Not `animation-timeline: view()`: that scrubs with
 * the scrollbar, which is a different effect — this is an entrance that plays at
 * its own speed once triggered.
 */
let observer: IntersectionObserver | null = null

function shared(): IntersectionObserver {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // A section taller than the viewport can never reach 15% coverage, so
        // ratio alone would leave the longest bands permanently hidden.
        const tall =
          !!entry.rootBounds && entry.boundingClientRect.height > entry.rootBounds.height * 0.6
        if (entry.isIntersecting && (entry.intersectionRatio >= 0.15 || tall)) {
          entry.target.setAttribute('data-revealed', '')
        } else if (!entry.isIntersecting) {
          entry.target.removeAttribute('data-revealed')
        }
      }
    },
    { threshold: [0, 0.15], rootMargin: '0px 0px -8% 0px' },
  )
  return observer
}

export function Reveal({
  children,
  index = 0,
  variant = 'up',
  as: Tag = 'div',
  className = '',
  ...rest
}: {
  children: ReactNode
  index?: number
  variant?: 'fade' | 'left' | 'right' | 'up'
  as?: 'div' | 'section' | 'li' | 'article'
  className?: string
  /** Data attributes to forward, e.g. the category a filter reads. */
  [key: `data-${string}`]: string | undefined
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Reveal immediately rather than never — an unreached observer would leave
    // the content at opacity 0 forever.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.setAttribute('data-revealed', '')
      return
    }
    const io = shared()
    io.observe(el)
    return () => io.unobserve(el)
  }, [])

  return (
    <Tag
      ref={ref as never}
      {...rest}
      data-reveal={variant}
      style={{ '--reveal-i': index } as CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  )
}
