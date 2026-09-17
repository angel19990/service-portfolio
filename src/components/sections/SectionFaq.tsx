import { RichText } from '@/components/primitives'
import { Accordion } from '@/components/interactive'
import { SectionShell } from './SectionShell'
import type { RichHeading, FaqItem } from '@/sanity/types'

export interface SectionFaqData {
  id?: string
  _key?: string
  eyebrow?: string
  heading?: RichHeading
  items?: FaqItem[]
  firstOpen?: boolean
}

/**
 * Questions and answers. The answers are rendered here (server) and handed to
 * the client `Accordion` as ReactNodes, so no Portable Text crosses the boundary.
 */
export function SectionFaq({ data, index = 0 }: { data: SectionFaqData; index?: number }) {
  const items = data.items ?? []
  if (!items.length) return null

  return (
    <SectionShell id={data.id} eyebrow={data.eyebrow} heading={data.heading} index={index} contentClassName="gap-band lg:grid lg:grid-cols-[1fr_1.6fr] lg:items-start">
      <Accordion
        ariaLabel="Questions"
        firstOpen={data.firstOpen}
        items={items.map((item, i) => ({
          id: item._key ?? String(i),
          title: item.question,
          body: <RichText value={item.answer} />,
        }))}
      />
    </SectionShell>
  )
}
