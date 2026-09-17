import { Heading, RichText, Eyebrow, Button } from '@/components/primitives'
import { Reveal } from '@/components/interactive'
import { Media } from '@/components/media/Media'
import type { RichHeading, PortableTextBlock, MediaSlot, CtaLink } from '@/sanity/types'

export interface SectionHeroData {
  id?: string
  _key?: string
  eyebrow?: string
  heading?: RichHeading
  body?: PortableTextBlock[]
  ctas?: CtaLink[]
  mediaA?: MediaSlot
  mediaALabel?: string
  mediaB?: MediaSlot
  mediaBLabel?: string
}

/**
 * The home opener. Copy on the left; on the right, one example of each offer
 * side by side so both are apparent without reading a word past the headline.
 * The video example gets a coral tag and the UX one a marigold tag, which is
 * the only place the two offers take different colours.
 */
export function SectionHero({ data, index = 0 }: { data: SectionHeroData; index?: number }) {
  const examples = [
    { key: 'a', media: data.mediaA, label: data.mediaALabel, tag: 'bg-pop text-ink' },
    { key: 'b', media: data.mediaB, label: data.mediaBLabel, tag: 'bg-coral text-ink' },
  ]
  const hasExamples = examples.some((e) => e.media?.length || e.label)

  return (
    <section id={data.id} className="px-gutter pb-section">
      <Reveal index={index} variant="up" className="mx-auto w-full max-w-content">
        <div className={`grid items-center gap-band ${hasExamples ? 'lg:grid-cols-[1.1fr_1fr]' : ''}`}>
          <div className="flex flex-col gap-stack">
            {data.eyebrow && <Eyebrow>{data.eyebrow}</Eyebrow>}
            {data.heading && <Heading value={data.heading} tier="display" />}
            {data.body && <RichText value={data.body} className="text-[1.125rem] md:text-[1.25rem]" />}
            {data.ctas && data.ctas.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-3">
                {data.ctas.map((cta) => (
                  <Button key={cta._key ?? cta.href} cta={cta} />
                ))}
              </div>
            )}
          </div>

          {hasExamples && (
            <ul className="grid grid-cols-2 gap-4 md:gap-5">
              {examples.map((ex, i) => (
                <li key={ex.key} className={`flex flex-col gap-3 ${i === 1 ? 'md:translate-y-8' : ''}`}>
                  {ex.media?.length ? (
                    <Media
                      value={ex.media}
                      sizes="(max-width: 1024px) 50vw, 22vw"
                      priority={i === 0}
                      passive
                      fit="cover"
                      className="media-fit aspect-[4/5] [&_img]:h-full [&_img]:object-cover [&_video]:h-full"
                    />
                  ) : (
                    <div className="media-empty aspect-[4/5]" aria-hidden />
                  )}
                  {ex.label && (
                    <span className={`self-start rounded-full px-3 py-1 text-label uppercase ${ex.tag}`}>
                      {ex.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>
    </section>
  )
}
