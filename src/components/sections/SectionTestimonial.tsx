import { Eyebrow, Button } from '@/components/primitives'
import { Reveal } from '@/components/interactive'
import { SanityImage } from '@/components/media/SanityImage'
import type { ImageMedia, CtaLink } from '@/sanity/types'

export interface SectionTestimonialData {
  id?: string
  _key?: string
  eyebrow?: string
  quote?: string
  name?: string
  role?: string
  portrait?: ImageMedia
  link?: CtaLink
}

/** One genuine quote. The section is simply absent when there is none. */
export function SectionTestimonial({ data, index = 0 }: { data: SectionTestimonialData; index?: number }) {
  if (!data.quote || !data.name) return null
  return (
    <section id={data.id} className="px-gutter pb-section">
      <Reveal index={index} variant="up" className="mx-auto w-full max-w-content">
        <figure className="surface-card flex flex-col gap-6 rounded-[1.25rem] border border-white/65 p-8 md:p-12">
          {data.eyebrow && <Eyebrow>{data.eyebrow}</Eyebrow>}
          <blockquote className="font-display text-title-dense text-ink">
            <span aria-hidden className="text-accent">&ldquo;</span>
            {data.quote}
            <span aria-hidden className="text-accent">&rdquo;</span>
          </blockquote>
          <figcaption className="flex items-center gap-4">
            {data.portrait?.asset && (
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                <SanityImage value={data.portrait} sizes="48px" className="object-cover" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-ink">{data.name}</span>
              {data.role && <span className="text-[0.9375rem] text-muted">{data.role}</span>}
            </div>
            {data.link && <Button cta={data.link} className="ml-auto" />}
          </figcaption>
        </figure>
      </Reveal>
    </section>
  )
}
