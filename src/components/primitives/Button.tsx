import Link from 'next/link'
import type { CtaLink } from '@/sanity/types'

/**
 * Source `.rec-btn` / `.dcl-figma-cta` — a pill with a 1.5px accent border that
 * fills accent on hover and focus.
 *
 * External links get the ↗ glyph the deck used, marked aria-hidden: "opens in a
 * new tab" belongs in the accessible name, not in a decorative arrow.
 */
export function Button({
  cta,
  className = '',
}: {
  cta?: CtaLink
  className?: string
}) {
  if (!cta?.label) return null

  /*
   * Ink on the accent fill, not white. White on `#ff7112` is 2.75:1 — the accent
   * is light enough that it needs *dark* text, not light. `#141312` on the same
   * orange is 6.74:1 and passes AA, and it does it without moving the accent
   * token, so nothing else in the system shifts.
   */
  const filled = cta.tone === 'filled'
  const classes = [
    'group inline-flex items-center gap-1.5 rounded-full border border-accent/55',
    'px-4 py-2.5 text-body transition-[background-color,border-color,color,box-shadow,transform] duration-[--duration-sm]',
    filled
      ? 'bg-[linear-gradient(180deg,rgb(240_107_37/0.95),rgb(227_97_30/0.95))] text-ink shadow-sm'
      : 'bg-white/60 text-ink shadow-xs backdrop-blur-sm',
    'can-hover:hover:-translate-y-px can-hover:hover:border-accent can-hover:hover:bg-accent can-hover:hover:text-ink can-hover:hover:shadow-md',
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

  return cta.external ? (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={classes}>
      {label}
    </a>
  ) : (
    <Link href={cta.href} className={classes}>
      {label}
    </Link>
  )
}
