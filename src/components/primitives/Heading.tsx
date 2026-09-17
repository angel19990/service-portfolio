import { PortableText } from '@portabletext/react'
import { headingComponents } from './portable-text'
import type { RichHeading } from '@/sanity/types'

const TIER = {
  display: 'text-display',
  title: 'text-title',
  'title-dense': 'text-title-dense',
  h2: 'text-h2',
} as const

export type HeadingTier = keyof typeof TIER

export function Heading({
  value,
  tier = 'title',
  className = '',
  as,
}: {
  value?: RichHeading
  tier?: HeadingTier
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
}) {
  const lines = value?.lines ?? []
  if (!lines.length) return null

  const Tag = as ?? value?.level ?? 'h2'
  /**
   * Each Portable Text block is one visual line, since Portable Text has no
   * hard-break primitive. `collapseOnMobile` rejoins them below 768 so a
   * two-line desktop lockup does not shatter into five ragged lines at 375.
   */
  const lineClass = value?.collapseOnMobile === false ? 'block' : 'inline md:block'

  return (
    <Tag className={`font-display text-ink text-balance ${TIER[tier]} ${className}`}>
      {lines.map((line, i) => (
        <span key={line._key ?? i} className={lineClass}>
          <PortableText value={line} components={headingComponents} />
          {/* Separator only matters while the lines are inline. */}
          {i < lines.length - 1 && <span className="md:hidden"> </span>}
        </span>
      ))}
    </Tag>
  )
}
