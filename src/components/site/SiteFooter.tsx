import Link from 'next/link'
import { Wordmark } from './Wordmark'
import type { NavItem } from './SiteHeader'
import type { CtaLink } from '@/sanity/types'

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href)

/**
 * The same footer as angelikaux.com: wordmark left, a row of uppercase labels
 * right, stacked below `lg`. The labels are the footer nav, email, the
 * scheduling link, the social links and the location. The one line for
 * recruiters sits underneath and sends them to the career portfolio.
 */
export function SiteFooter({
  items,
  social = [],
  wordmark,
  email,
  location,
  scheduleLink,
  careerPortfolio,
}: {
  items: NavItem[]
  social?: CtaLink[]
  wordmark?: string
  email?: string
  location?: string
  scheduleLink?: CtaLink
  careerPortfolio?: CtaLink
}) {
  /*
   * `-my-1.5 py-1.5` is a hit area, not spacing: the label tier renders a 13px
   * line box, and these are a column of tap targets on a phone, where WCAG
   * 2.2's 24px target minimum bites. The equal negative margin hands the
   * height back to the flex column.
   */
  const link =
    'inline-block -my-1.5 py-1.5 whitespace-nowrap transition-[color,transform] duration-[--duration-sm] can-hover:hover:-translate-y-px can-hover:hover:text-ink'

  const entries: { key: string; label: string; href: string; external?: boolean }[] = [
    ...items.map((i) => ({ key: i._key ?? i.href, label: i.label, href: i.href })),
    ...(email ? [{ key: 'email', label: 'Email', href: `mailto:${email}` }] : []),
    ...(scheduleLink?.href ? [{ key: 'schedule', label: scheduleLink.label, href: scheduleLink.href, external: true }] : []),
    ...social.map((s) => ({ key: s._key ?? s.href, label: s.label, href: s.href, external: true })),
  ]

  return (
    <footer className="mt-auto border-t border-white/65 bg-[rgb(246_248_250/0.82)] backdrop-blur-sm">
      <div className="px-gutter">
        <div className="mx-auto flex w-full max-w-content flex-col items-start gap-5 py-6 lg:flex-row lg:items-center lg:gap-8 lg:py-8">
          <Wordmark value={wordmark} className="shrink-0" />

          <ul className="flex flex-col items-start gap-y-2.5 text-label uppercase text-muted lg:ml-auto lg:flex-1 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end lg:gap-x-7 lg:gap-y-1.5">
            {entries.map((e) => (
              <li key={e.key}>
                {isExternal(e.href) ? (
                  <a
                    href={e.href}
                    target={e.external ? '_blank' : undefined}
                    rel={e.external ? 'noopener noreferrer' : undefined}
                    className={link}
                  >
                    {e.label}
                    {e.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                ) : (
                  <Link href={e.href} className={link}>
                    {e.label}
                  </Link>
                )}
              </li>
            ))}
            {location && <li className="hidden lg:block">{location}</li>}
          </ul>
        </div>

        {careerPortfolio?.href && (
          <div className="mx-auto w-full max-w-content border-t border-rule-soft py-4">
            <p className="text-[0.9375rem] text-muted">
              <a
                href={careerPortfolio.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors can-hover:hover:text-accent"
              >
                {careerPortfolio.label}
                <span aria-hidden> ↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
        )}
      </div>
    </footer>
  )
}
