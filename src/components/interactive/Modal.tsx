'use client'

import * as Dialog from '@radix-ui/react-dialog'
import type { CSSProperties, ReactNode } from 'react'
import { useState } from 'react'

/**
 * Radix, not the deck's hand-rolled dialog.
 *
 * The source modal was `role="dialog" aria-modal` with **no focus trap**, and its
 * Escape listener was registered in the capture phase specifically to beat
 * `deck-stage`'s global keydown handler. Radix supplies a real trap, correct
 * return focus and an inert background; the capture-phase hack disappears along
 * with `deck-stage`.
 *
 * `Dialog.Trigger` renders its own button rather than taking `asChild`. Every
 * trigger here is composed in a Server Component and passed across the boundary,
 * and Radix's Slot calls `Children.only` on that — which throws once the child
 * arrives as a serialized node rather than a plain element. Rendering the button
 * natively removes the Slot, and the trigger was always going to be a button.
 *
 * Below 768 the card becomes a bottom sheet — a centred 82vh card on a phone
 * wastes the edges and puts the close control at the top of a long scroll.
 */
export function Modal({
  children,
  title,
  eyebrow,
  triggerLabel,
  triggerClassName = '',
  triggerStyle,
  trigger,
  size = 'default',
}: {
  children: ReactNode
  title: string
  eyebrow?: string
  /** Accessible name, when the visible trigger content is imagery. */
  triggerLabel?: string
  triggerClassName?: string
  triggerStyle?: CSSProperties
  trigger: ReactNode
  /**
   * `default` is 1240px, which media needs. `narrow` is a reading width — a
   * paragraph set across 1240px is roughly 150 characters a line, about twice
   * what anyone tracks.
   */
  size?: 'default' | 'narrow'
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={triggerClassName} style={triggerStyle} aria-label={triggerLabel}>
        {trigger}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-scrim/95 backdrop-blur-[14px]" />
        <Dialog.Content
          aria-describedby={undefined}
          className={[
            'surface-card-strong fixed z-50 flex flex-col border border-white/60',
            // mobile: bottom sheet
            'inset-x-0 bottom-0 top-[8vh] rounded-t-2xl px-5 pb-6 pt-6',
            // ≥768: centred card
            'md:inset-auto md:left-1/2 md:top-1/2 md:h-auto md:max-h-[82vh] md:w-[92vw]',
            'md:max-h-[88vh] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:py-10',
            size === 'narrow' ? 'md:max-w-[46rem] md:px-10' : 'md:max-w-[1240px] md:px-11',
            'focus:outline-none',
          ].join(' ')}
          // On a sheet the close button is the wrong first stop — send focus to
          // the content instead.
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            ;(e.currentTarget as HTMLElement).focus()
          }}
        >
          <div className="flex flex-col gap-2 pr-12">
            {eyebrow && <p className="text-label uppercase text-muted">{eyebrow}</p>}
            <Dialog.Title className="font-display text-title-dense text-ink">{title}</Dialog.Title>
          </div>

          <Dialog.Close
            aria-label="Close"
            className={[
              'absolute right-5 top-5 grid size-11 place-items-center rounded-full',
              'border border-white/60 bg-white/72 text-ink shadow-xs transition-colors duration-[--duration-sm]',
              'can-hover:hover:border-accent/35 can-hover:hover:bg-accent can-hover:hover:text-ink',
              'md:right-6 md:top-6 md:size-10',
            ].join(' ')}
          >
            <span aria-hidden>✕</span>
          </Dialog.Close>

          {/* Only the body scrolls, so the title and close stay reachable. */}
          <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1 md:pr-0">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
