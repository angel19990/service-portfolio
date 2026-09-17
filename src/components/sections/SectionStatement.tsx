import { Heading, RichText, Eyebrow, Button, type HeadingTier } from '@/components/primitives'
import { Reveal } from '@/components/interactive'
import { Media } from '@/components/media/Media'
import type { RichHeading, PortableTextBlock, MediaSlot, CtaLink } from '@/sanity/types'

export interface SectionStatementData {
  id?: string
  _key?: string
  eyebrow?: string
  heading?: RichHeading
  headingTier?: HeadingTier
  body?: PortableTextBlock[]
  meta?: string[]
  media?: MediaSlot
  layout?: 'split' | 'stacked' | 'centred'
  ctas?: CtaLink[]
}

/**
 * A heading plus supporting copy: page intros, the about preview, closing
 * notes. `layout` drives the arrangement: split puts media beside the copy,
 * stacked runs full width, centred is the display-type treatment.
 */
export function SectionStatement({ data, index = 0 }: { data: SectionStatementData; index?: number }) {
  const tier = data.headingTier ?? (data.layout === 'centred' ? 'display' : 'title')
  const centred = data.layout === 'centred'

  const copy = (
    <div className={`flex flex-col gap-stack ${centred ? 'items-center text-center' : ''}`}>
      {data.eyebrow && <Eyebrow>{data.eyebrow}</Eyebrow>}
      {data.heading && <Heading value={data.heading} tier={tier} />}
      {data.body && <RichText value={data.body} className={centred ? 'items-center text-center' : ''} />}

      {data.meta && data.meta.length > 0 && (
        <ul className={`flex flex-wrap items-center gap-2 ${centred ? 'justify-center' : ''}`}>
          {data.meta.map((m) => (
            <li key={m} className="rounded-full border border-rule-soft bg-surface/70 px-3.5 py-1.5 text-label uppercase text-muted">
              {m}
            </li>
          ))}
        </ul>
      )}

      {data.ctas && data.ctas.length > 0 && (
        <div className={`mt-2 flex flex-wrap gap-3 ${centred ? 'justify-center' : ''}`}>
          {data.ctas.map((cta) => (
            <Button key={cta._key ?? cta.href} cta={cta} />
          ))}
        </div>
      )}
    </div>
  )

  const media = data.media?.length ? (
    <Media value={data.media} sizes="(max-width: 768px) 100vw, 40vw" priority={index === 0} />
  ) : null

  return (
    <section id={data.id} className="px-gutter pb-section">
      <Reveal index={index} variant="up" className="mx-auto w-full max-w-content">
        {data.layout === 'split' && media ? (
          <div className="grid items-center gap-band lg:grid-cols-[1.15fr_1fr]">
            {copy}
            {media}
          </div>
        ) : media ? (
          <div className="flex flex-col gap-band">
            {copy}
            {media}
          </div>
        ) : (
          copy
        )}
      </Reveal>
    </section>
  )
}
