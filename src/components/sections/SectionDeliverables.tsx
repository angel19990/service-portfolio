import { RichText } from '@/components/primitives'
import { SectionShell } from './SectionShell'
import type { RichHeading, PortableTextBlock } from '@/sanity/types'

export interface SectionDeliverablesData {
  id?: string
  _key?: string
  eyebrow?: string
  heading?: RichHeading
  intro?: PortableTextBlock[]
  includedLabel?: string
  included?: string[]
  separateLabel?: string
  separate?: string[]
  note?: PortableTextBlock[]
}

/** Two lists: what an engagement includes, and what is scoped separately. */
export function SectionDeliverables({ data, index = 0 }: { data: SectionDeliverablesData; index?: number }) {
  const columns = [
    { label: data.includedLabel || 'Typically included', items: data.included ?? [], mark: 'before:bg-accent' },
    { label: data.separateLabel || 'Scoped separately', items: data.separate ?? [], mark: 'before:bg-rule' },
  ].filter((c) => c.items.length)
  if (!columns.length) return null

  return (
    <SectionShell id={data.id} eyebrow={data.eyebrow} heading={data.heading} index={index}>
      {data.intro && <RichText value={data.intro} />}
      <div className="grid gap-6 md:grid-cols-2">
        {columns.map((col) => (
          <div key={col.label} className="surface-card flex flex-col gap-4 rounded-[1.25rem] border border-white/65 p-6 md:p-8">
            <h3 className="text-label uppercase text-muted">{col.label}</h3>
            <ul className="flex flex-col gap-2.5 text-text">
              {col.items.map((item) => (
                <li
                  key={item}
                  className={`relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 ${col.mark}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {data.note && <RichText value={data.note} className="text-[0.9375rem]" />}
    </SectionShell>
  )
}
