import { RichText } from '@/components/primitives'
import { sanityFetch } from '@/sanity/lib/live'
import { servicesQuery } from '@/sanity/lib/queries'
import { SectionShell } from './SectionShell'
import { ServiceCard } from '@/components/services/ServiceCard'
import type { RichHeading, PortableTextBlock, ServiceCardData } from '@/sanity/types'

export interface SectionServiceCardsData {
  id?: string
  _key?: string
  eyebrow?: string
  heading?: RichHeading
  intro?: PortableTextBlock[]
  services?: { _ref: string }[]
  footnote?: PortableTextBlock[]
}

/** The two offers side by side, from the `service` documents. */
export async function SectionServiceCards({ data, index = 0 }: { data: SectionServiceCardsData; index?: number }) {
  const ids = (data.services ?? []).map((s) => s._ref)
  const services = await sanityFetch<ServiceCardData[]>(servicesQuery, { ids })
  if (!services.length) return null

  return (
    <SectionShell id={data.id} eyebrow={data.eyebrow} heading={data.heading} index={index}>
      {data.intro && <RichText value={data.intro} />}
      <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {services.map((s, i) => (
          <ServiceCard key={s._id} service={s} index={i} />
        ))}
      </ul>
      {data.footnote && (
        <div className="text-[1.0625rem] text-text">
          <RichText value={data.footnote} />
        </div>
      )}
    </SectionShell>
  )
}
