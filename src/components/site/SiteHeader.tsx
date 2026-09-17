'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { Wordmark } from './Wordmark'

export interface NavItem {
  _key?: string
  label: string
  href: string
}

/**
 * The same bar as angelikaux.com: wordmark left, menu button right, links in a
 * sheet under the bar, at every width. One bar that behaves identically
 * everywhere beats two that diverge, and it keeps the wordmark and the accent
 * as the only things competing for the eye up there.
 *
 * Client, for two reasons only: the active-route comparison needs
 * `usePathname`, and the sheet needs open state. Nav items arrive as plain
 * `{label, href}` objects from the server layout. The header button ("Start a
 * project") is the sheet's last item, set in the accent so it reads as the
 * action rather than another destination.
 */
export function SiteHeader({
  items,
  cta,
  wordmark,
}: {
  items: NavItem[]
  cta?: NavItem
  wordmark?: string
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)
  const sheetId = useId()

  // The header survives navigation, so the sheet has to be closed by hand.
  // Reset during render rather than in an effect: an effect would paint the
  // new route once with the old menu still open.
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    // Scrolling the page behind an open sheet reads as a broken overlay.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  /* `/work` stays lit on `/work/some-project`; `/` would otherwise match everything. */
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  const links: (NavItem & { cta?: boolean })[] = [...items, ...(cta ? [{ ...cta, cta: true }] : [])]

  return (
    <header className="surface-glass sticky top-0 z-50 border-b border-white/65">
      <div className="px-gutter">
        <div className="mx-auto flex w-full max-w-content items-center gap-6 py-4 lg:gap-8 lg:py-5">
          <Wordmark value={wordmark} />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={sheetId}
            className="ml-auto flex size-11 items-center justify-center text-ink transition-transform duration-[--duration-sm] can-hover:hover:scale-[1.03]"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span aria-hidden className="relative block h-4 w-6">
              <span
                className={`absolute left-0 top-1/2 h-0.5 w-full origin-center bg-current transition-transform duration-[420ms] ease-[--ease-out-expo] ${
                  open ? 'translate-y-0 rotate-45' : '-translate-y-[5px]'
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-0.5 w-full origin-center bg-current transition-transform duration-[420ms] ease-[--ease-out-expo] ${
                  open ? 'translate-y-0 -rotate-45' : 'translate-y-[5px]'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id={sheetId}
          aria-label="Primary"
          className="border-t border-white/65 bg-[rgb(246_248_250/0.94)] px-gutter pb-6 pt-2 backdrop-blur-xl"
        >
          {/* Same capped content column as every section, so the sheet aligns
              with the page body rather than landing inside a narrower bar. */}
          <div className="mx-auto w-full max-w-content">
            <ul className="w-full">
              {links.map((item) => (
                <li key={item._key ?? item.href} className="border-b border-rule-soft/80">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`block py-[18px] font-display text-[1.875rem] leading-tight transition-[color,transform] duration-[--duration-sm] ${
                      isActive(item.href) || item.cta
                        ? 'translate-x-1 text-accent'
                        : 'text-ink can-hover:hover:translate-x-1 can-hover:hover:text-accent'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </header>
  )
}
