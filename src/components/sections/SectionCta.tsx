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
 * The closing invitation, in the angelikaux.com "learn more" shape: eyebrow,
 * heading, a line of copy and the pills. `tone: 'ink'` puts it on a white card
 * for the end of a page; `paper` sits directly on the ground. `showEmail` adds
 * the site email and the schedule-a-call link, so nobody has to fill in a form
 * to say hello.
 */
export async function SectionCta({ data, index = 0 }: { data: SectionCtaData; index?: number }) {
  const links = data.showEmail ? await sanityFetch<ContactLinks | null>(siteSettingsQuery) : null
  const email = links?.email
  const schedule = links?.scheduleLink?.href ? links.scheduleLink : undefined
  const card = data.tone === 'ink'
  const linkClass =
    'text-body text-ink underline decoration-rule underline-offset-4 transition-colors can-hover:hover:text-accent can-hover:hover:decoration-accent'

  return (
    <section id={data.id} className="px-gutter pb-section">
      <Reveal index={index} variant="up" className="mx-auto w-full max-w-content">
        <div
          className={`flex flex-col items-start gap-stack ${
            card ? 'surface-card rounded-[1.25rem] border border-white/65 p-8 md:p-12 lg:p-16' : ''
          }`}
        >
          {data.eyebrow && <Eyebrow>{data.eyebrow}</Eyebrow>}
          {data.heading && <Heading value={data.heading} tier="title" className="max-w-[20ch]" />}
          {data.body && <RichText value={data.body} />}
          {(data.ctas?.length || email || schedule) && (
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex flex-wrap gap-3">
                {data.ctas?.map((cta) => (
                  <Button key={cta._key ?? cta.href} cta={cta} />
                ))}
              </div>
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
