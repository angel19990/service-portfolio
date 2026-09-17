import { Heading, RichText, Eyebrow, Button } from '@/components/primitives'
import { Reveal } from '@/components/interactive'
import { sanityFetch } from '@/sanity/lib/live'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import type { RichHeading, PortableTextBlock, CtaLink } from '@/sanity/types'

interface ContactLinks {
  email?: string
  scheduleLink?: CtaLink
}

export interface SectionCtaData {
  id?: string
  _key?: string
  eyebrow?: string
  heading?: RichHeading
  body?: PortableTextBlock[]
  ctas?: CtaLink[]
  tone?: 'paper' | 'ink'
  showEmail?: boolean
}

/**
 * The closing invitation. `ink` is the dark band that ends the home page;
 * `paper` is a tinted card for the middle of a page. `showEmail` adds the site
 * email and the schedule-a-call link, so nobody has to fill in a form to say hello.
 */
export async function SectionCta({ data, index = 0 }: { data: SectionCtaData; index?: number }) {
  const links = data.showEmail ? await sanityFetch<ContactLinks | null>(siteSettingsQuery) : null
  const email = links?.email
  const schedule = links?.scheduleLink?.href ? links.scheduleLink : undefined
  const ink = data.tone === 'ink'
  const linkClass = `text-body underline decoration-[2px] underline-offset-4 transition-colors ${
    ink ? 'text-bg decoration-pop can-hover:hover:text-pop' : 'text-ink decoration-pop can-hover:hover:text-accent'
  }`

  return (
    <section id={data.id} className="px-gutter pb-section">
      <Reveal index={index} variant="up" className="mx-auto w-full max-w-content">
        <div className={`${ink ? 'band-ink' : 'surface-tint'} flex flex-col items-start gap-stack p-8 md:p-12 lg:p-16`}>
          {data.eyebrow && <Eyebrow tone={ink ? 'accent' : 'muted'}>{data.eyebrow}</Eyebrow>}
          {data.heading && <Heading value={data.heading} tier="title" className="max-w-[18ch]" />}
          {data.body && <RichText value={data.body} className={ink ? 'text-bg/85' : ''} />}
          {(data.ctas?.length || email || schedule) && (
            <div className="mt-2 flex flex-wrap items-center gap-4">
              {data.ctas?.map((cta) => (
                <Button
                  key={cta._key ?? cta.href}
                  cta={cta}
                  className={ink && cta.tone !== 'filled' ? 'border-bg/40 text-bg can-hover:hover:border-pop can-hover:hover:bg-pop can-hover:hover:text-ink' : ''}
                />
              ))}
              {email && (
                <a href={`mailto:${email}`} className={linkClass}>
                  or email {email}
                </a>
              )}
              {schedule && (
                <a href={schedule.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {schedule.label}
                  <span aria-hidden> ↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
