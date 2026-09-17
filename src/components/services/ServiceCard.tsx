import Link from 'next/link'
import { InlineText, Button } from '@/components/primitives'
import { Reveal } from '@/components/interactive'
import { Media } from '@/components/media/Media'
import type { ServiceCardData } from '@/sanity/types'

/**
 * One offer, complete: who it is for, what they get, a sample scope, the
 * deliverables, the proof and the inquiry button with the service preselected.
 * Both cards render identically so neither offer reads as the lesser one.
 */
export function ServiceCard({ service, index = 0 }: { service: ServiceCardData; index?: number }) {
  const list = (label: string, items?: string[]) =>
    items && items.length > 0 ? (
      <div className="flex flex-col gap-2">
        <p className="text-label uppercase text-muted">{label}</p>
        <ul className="flex flex-col gap-1.5 text-text">
          {items.map((item) => (
            <li
              key={item}
              className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-accent"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    ) : null

  return (
    <Reveal as="li" index={index} variant="up" className="flex">
      <article className="surface-card flex w-full flex-col overflow-hidden rounded-[1.25rem] border border-white/65">
        {service.media?.length ? (
          <Media
            value={service.media}
            sizes="(max-width: 768px) 100vw, 45vw"
            passive
            fit="cover"
            className="aspect-[16/10] w-full overflow-hidden [&_img]:h-full [&_img]:object-cover [&_video]:h-full"
          />
        ) : (
          <div className="aspect-[16/10] w-full bg-ink/[0.03]" aria-hidden />
        )}

        <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-h2 text-ink">
              <Link href={service.href} className="transition-colors can-hover:hover:text-accent">
                {service.title}
              </Link>
            </h3>
            {service.situation && (
              <p className="text-[0.9375rem] text-muted">
                <InlineText value={service.situation} />
              </p>
            )}
            {service.promise && <p className="text-text">{service.promise}</p>}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {list('Sample scope', service.scope)}
            {list('Possible deliverables', service.deliverables)}
          </div>

          {service.proof && (
            <p className="text-[0.9375rem] text-text">
              <InlineText value={service.proof} />
            </p>
          )}
          {service.note && (
            <p className="text-[0.875rem] text-muted">
              <InlineText value={service.note} />
            </p>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
            <Button cta={service.cta} />
            <Link
              href={service.href}
              className="text-[0.9375rem] text-ink underline decoration-rule underline-offset-4 transition-colors can-hover:hover:text-accent can-hover:hover:decoration-accent"
            >
              How it works
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  )
}
