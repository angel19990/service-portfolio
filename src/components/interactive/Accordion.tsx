'use client'

import { useId, useState, type ReactNode } from 'react'

export interface AccordionEntry {
  id: string
  title: string
  body: ReactNode
}

/**
 * Serves both the home FAQ and the About "things that bring me joy" gallery —
 * one disclosure pattern, one component, because they differ only in what the
 * panel holds.
 *
 * Open/close animates `grid-template-rows: 0fr → 1fr`, which is the only way to
 * transition to intrinsic height. Safari below 17 cannot animate that, so the
 * fallback is simply an instant open — the content is never inaccessible, it just
 * lacks the transition.
 *
 * Exactly one panel is open at a time. Opening a second used to leave both
 * expanded, which on the FAQ pushed the question you were reading off-screen as
 * the one above it grew, and in the About gallery put two four-image grids on the
 * page at once. `aria-expanded` on every header still reports the true state, so
 * the pattern stays legible to assistive tech.
 */
export function Accordion({
  items,
  firstOpen = false,
  ariaLabel,
}: {
  items: AccordionEntry[]
  firstOpen?: boolean
  ariaLabel?: string
}) {
  const [open, setOpen] = useState<number | null>(firstOpen ? 0 : null)
  const uid = useId()

  const toggle = (i: number) => setOpen((prev) => (prev === i ? null : i))

  return (
    <div className="flex flex-col" aria-label={ariaLabel}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={item.id}
            /* No fill on the open row. It used to take `bg-white/28`, which is
               the one place on the site where a white plate sat directly on the
               warm ground with no border to explain it — it read as the page
               changing colour behind the FAQ. The accent title, the − glyph and
               the expanded panel already carry the state. */
            className="border-t border-rule last:border-b"
          >
            <h3>
              <button
                type="button"
                id={`${uid}-h-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-p-${i}`}
                onClick={() => toggle(i)}
                className={[
                  'group flex w-full items-start justify-between gap-6 py-6 text-left',
                  'min-h-11 transition-colors duration-[--duration-sm]',
                  isOpen ? 'text-accent' : 'text-ink can-hover:hover:text-accent',
                ].join(' ')}
              >
                <span className="font-display text-h2">{item.title}</span>
                {/* Aligned to the first line's cap height, not the block centre —
                    at 375 these titles wrap to two lines. */}
                <span
                  aria-hidden
                  className="relative mt-[0.35em] block size-8 shrink-0 rounded-full border border-rule-soft bg-bg shadow-xs"
                >
                  <span
                    className={`absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 transition-colors ${
                      isOpen ? 'bg-accent' : 'bg-ink/55 group-hover:bg-accent'
                    }`}
                  />
                  <span
                    className={[
                      'absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2',
                      'transition-transform duration-[--duration-md] ease-[--ease-out-expo]',
                      isOpen ? 'scale-y-0 bg-accent' : 'bg-ink/55 group-hover:bg-accent',
                    ].join(' ')}
                  />
                </span>
              </button>
            </h3>

            <div
              id={`${uid}-p-${i}`}
              role="region"
              aria-labelledby={`${uid}-h-${i}`}
              // grid-template-rows 0fr→1fr is the only transition to auto height.
              className="grid transition-[grid-template-rows] duration-[--duration-md] ease-[--ease-out-expo]"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="pb-8" hidden={!isOpen}>
                  {item.body}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
