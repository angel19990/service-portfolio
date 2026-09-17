import type { ReactNode } from 'react'
import { Reveal } from '@/components/interactive'
import { Heading, Eyebrow } from '@/components/primitives'
import type { RichHeading } from '@/sanity/types'

/**
 * Every section's outer band: the gutter, the vertical rhythm, the eyebrow and
 * heading, and the scroll-triggered reveal. The reveal index is the section's
 * position in the page array, so the stagger falls out of document order.
 *
 * Padding is bottom-only: bands are spaced by a single `section` gap, and the
 * page's leading gap comes from `pt-page-top` on the first section, applied by
 * the route layout.
 */
export function SectionShell({
  id,
  eyebrow,
  heading,
  headingTier = 'title',
  index = 0,
  children,
  className = '',
  contentClassName = 'gap-band',
}: {
  id?: string
  eyebrow?: string
  heading?: RichHeading
  headingTier?: 'display' | 'title-cover' | 'title' | 'title-dense' | 'h2'
  index?: number
  children?: ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <section id={id} className={`px-gutter pb-section ${className}`}>
      <Reveal
        index={index}
        variant="up"
        className={`mx-auto flex w-full max-w-content flex-col ${contentClassName}`}
      >
        {(eyebrow || heading) && (
          <div className="flex flex-col gap-stack">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {heading && <Heading value={heading} tier={headingTier} />}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}
