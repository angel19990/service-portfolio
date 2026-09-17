import Link from 'next/link'
import { Wordmark } from './Wordmark'
import type { NavItem } from './SiteHeader'
import type { CtaLink } from '@/sanity/types'

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href)

/**
 * Three rows: the wordmark with the email beside it, the site and social
 * links, and the one line for recruiters that sends them to the career
 * portfolio on its own domain.
 */
export function SiteFooter({
  items,
  social = [],
  wordmark,
  email,
  location,
  careerPortfolio,
}: {
  items: NavItem[]
  social?: CtaLink[]
  wordmark?: string
  email?: string
  location?: string
  careerPortfolio?: CtaLink
}) {
  /* `-my-1.5 py-1.5` is a hit area: the label tier renders a 13px line box and
     these are a column of tap targets on a phone, where WCAG 2.2's 24px target
     minimum bites. The equal negative margin hands the height back. */
  const link =
    'inline-block -my-1.5 py-1.5 whitespace-nowrap transition-[color,transform] duration-[--duration-sm] can-hover:hover:-translate-y-px can-hover:hover:text-accent'

  const renderLink = (label: string, href: string) =>
    isExternal(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={link}>
        {label}
      </a>
    ) : (
      <Link href={href} className={link}>
        {label}
      </Link>
    )

  return (
    <footer className="mt-auto border-t border-rule-soft bg-tint">
      <div className="px-gutter">
        <div className="mx-auto flex w-full max-w-content flex-col gap-8 py-10 lg:py-12">
          <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:gap-8">
            <Wordmark value={wordmark} className="shrink-0" />
            {email && (
              <a
                href={`mailto:${email}`}
                className="font-display text-h2 text-ink underline decoration-pop decoration-[3px] underline-offset-[6px] transition-colors can-hover:hover:text-accent"
              >
                {email}
              </a>
            )}
            {location && <p className="text-label uppercase text-muted lg:ml-auto">{location}</p>}
          </div>

          <ul className="flex flex-col items-start gap-y-2.5 text-label uppercase text-muted lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-7 lg:gap-y-1.5">
            {items.map((item) => (
              <li key={item._key ?? item.href}>{renderLink(item.label, item.href)}</li>
            ))}
            {social.map((item) => (
              <li key={item._key ?? item.href}>{renderLink(item.label, item.href)}</li>
            ))}
          </ul>

          {careerPortfolio && (
            <p className="border-t border-rule-soft pt-6 text-[0.9375rem] text-muted">
              <a
                href={careerPortfolio.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline decoration-rule underline-offset-4 transition-colors can-hover:hover:text-accent can-hover:hover:decoration-accent"
              >
                {careerPortfolio.label}
                <span aria-hidden> ↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
