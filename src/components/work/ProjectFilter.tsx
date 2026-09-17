'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'ux', label: 'UX & Products' },
  { value: 'video', label: 'Creative Videos' },
  { value: 'experiment', label: 'Experiments' },
] as const

type Filter = (typeof FILTERS)[number]['value']
const isFilter = (v: string | null): v is Filter => FILTERS.some((f) => f.value === v)

/**
 * The /work filter rail. The grid arrives fully server-rendered as `children`;
 * this shell only reads `?filter=` and writes it onto the grid as
 * `data-filter`, and the CSS in `globals.css` does the hiding. The page stays
 * static, deep links work, and with JavaScript off every card simply shows.
 *
 * Links rather than buttons so each filter has a URL to share and the browser's
 * back button walks through them. The pills are the site's outline button.
 */
export function ProjectFilter({ children }: { children: ReactNode }) {
  const params = useSearchParams()
  const raw = params.get('filter')
  const active: Filter = isFilter(raw) ? raw : 'all'
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current?.querySelector<HTMLElement>('.project-grid')
    if (!grid) return
    if (active === 'all') grid.removeAttribute('data-filter')
    else grid.setAttribute('data-filter', active)
  }, [active])

  return (
    <div ref={gridRef} className="flex flex-col gap-band">
      <nav aria-label="Filter projects">
        <ul className="rail-x -mx-gutter gap-2 px-gutter md:mx-0 md:flex-wrap md:px-0">
          {FILTERS.map((f) => {
            const on = f.value === active
            return (
              <li key={f.value}>
                <Link
                  href={f.value === 'all' ? '/work' : `/work?filter=${f.value}`}
                  scroll={false}
                  aria-current={on ? 'true' : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full border px-4 text-[0.9375rem] transition-colors duration-[--duration-sm] ${
                    on
                      ? 'border-accent bg-accent text-ink'
                      : 'border-accent/55 bg-white/60 text-ink can-hover:hover:border-accent can-hover:hover:bg-accent'
                  }`}
                >
                  {f.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      {children}
    </div>
  )
}
