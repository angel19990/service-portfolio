import Link from 'next/link'
import type { CtaLink } from '@/sanity/types'

/**
 * A pill. `filled` is terracotta with white text (5.98:1); `outline` is a
 * hairline that fills on hover.
 *
 * External links get the ↗ glyph, marked aria-hidden: "opens in a new tab"
 * belongs in the accessible name, not in a decorative arrow.
 */
export function Button({
  cta,
  className = '',
}: {
  cta?: CtaLink
  className?: string
}) {
  if (!cta?.label) return null

  const filled = cta.tone === 'filled'
  const classes = [
    'group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-body font-medium',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-[--duration-sm]',
    filled
      ? 'border border-accent bg-accent text-white shadow-sm can-hover:hover:bg-ink can-hover:hover:border-ink'
      : 'border border-ink/25 bg-transparent text-ink can-hover:hover:border-accent can-hover:hover:bg-accent can-hover:hover:text-white',
    'can-hover:hover:-translate-y-px',
    className,
  ].join(' ')

  const label = (
    <>
      {cta.label}
      {cta.external && (
        <span aria-hidden className="translate-y-[-1px]">
          ↗
        </span>
      )}
      {cta.external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  )

  const external = cta.external || /^(https?:|mailto:|tel:)/.test(cta.href)
  return external ? (
    <a
      href={cta.href}
      target={cta.external ? '_blank' : undefined}
      rel={cta.external ? 'noopener noreferrer' : undefined}
      className={classes}
    >
      {label}
    </a>
  ) : (
    <Link href={cta.href} className={classes}>
      {label}
    </Link>
  )
}
