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
 * Wordmark left; from `lg` up the links run inline with a filled "Start a
 * project" button at the end. Below `lg` the same links live in a sheet under
 * the bar, and the button stays visible beside the menu toggle so the primary
 * action is one tap away at every width.
 *
 * Client, for two reasons only: the active-route comparison needs
 * `usePathname`, and the sheet needs open state. Nav items arrive as plain
 * `{label, href}` objects from the server layout.
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

  const ctaClasses =
    'items-center whitespace-nowrap rounded-full bg-accent px-3.5 py-2 text-[0.875rem] font-medium text-white shadow-xs sm:px-4 sm:text-[0.9375rem] transition-[transform,box-shadow] duration-[--duration-sm] can-hover:hover:-translate-y-px can-hover:hover:shadow-sm'

  return (
    <header className="surface-glass sticky top-0 z-50">
      <div className="px-gutter">
        <div className="mx-auto flex w-full max-w-content items-center gap-4 py-4 lg:gap-8 lg:py-5">
          <Wordmark value={wordmark} />

          {/* Inline links, `lg` and up. */}
          <nav aria-label="Primary" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-7">
              {items.map((item) => (
                <li key={item._key ?? item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`inline-block py-2 text-[0.9375rem] font-medium transition-colors duration-[--duration-sm] ${
                      isActive(item.href)
                        ? 'text-accent underline decoration-pop decoration-[3px] underline-offset-[6px]'
                        : 'text-ink can-hover:hover:text-accent'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Hidden below 360px (iPhone SE is 320): the wordmark, the pill and
              the menu button do not fit on one row there, and the sheet carries
              the same link. */}
          {cta && (
            <Link href={cta.href} className={`${ctaClasses} ml-auto hidden min-[360px]:inline-flex lg:ml-0`}>
              {cta.label}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={sheetId}
            className="ml-auto flex size-11 shrink-0 items-center justify-center text-ink transition-transform duration-[--duration-sm] can-hover:hover:scale-[1.03] min-[360px]:ml-0 lg:hidden"
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
          className="border-t border-rule-soft bg-[rgb(250_247_242/0.96)] px-gutter pb-6 pt-2 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto w-full max-w-content">
            <ul className="w-full">
              {[...items, ...(cta ? [cta] : [])].map((item) => (
                <li key={item._key ?? item.href} className="border-b border-rule-soft">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`block py-[18px] font-display text-[1.875rem] leading-tight transition-[color,transform] duration-[--duration-sm] ${
                      isActive(item.href)
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
