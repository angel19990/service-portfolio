import Link from 'next/link'

/**
 * The name in the chrome, with a marigold dot after it: the one place `pop`
 * appears in the header, and the only ornament there.
 *
 * `py-3 -my-3` is a hit area, not spacing: the line box is under WCAG 2.2's
 * 24px minimum target, and this is the home link on every page.
 */
export function Wordmark({ value = '', className = '' }: { value?: string; className?: string }) {
  return (
    <Link
      href="/"
      className={`-my-3 inline-flex items-baseline gap-1 whitespace-nowrap py-3 font-display text-body leading-[1.35] text-ink ${className}`}
      aria-label={`${value}, home`}
    >
      {value}
      <span aria-hidden className="inline-block size-[0.4em] translate-y-[-0.05em] rounded-full bg-pop" />
    </Link>
  )
}
