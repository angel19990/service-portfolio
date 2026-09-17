import { SectionHero } from './SectionHero'
import { SectionStatement } from './SectionStatement'
import { SectionProjectGrid } from './SectionProjectGrid'
import { SectionServiceCards } from './SectionServiceCards'
import { SectionSteps } from './SectionSteps'
import { SectionDeliverables } from './SectionDeliverables'
import { SectionTestimonial } from './SectionTestimonial'
import { SectionFaq } from './SectionFaq'
import { SectionCta } from './SectionCta'
import { SectionContactForm } from './SectionContactForm'

/* eslint-disable @typescript-eslint/no-explicit-any */
const REGISTRY: Record<string, (props: { data: any; index?: number }) => any> = {
  sectionHero: SectionHero,
  sectionStatement: SectionStatement,
  sectionProjectGrid: SectionProjectGrid,
  sectionServiceCards: SectionServiceCards,
  sectionSteps: SectionSteps,
  sectionDeliverables: SectionDeliverables,
  sectionTestimonial: SectionTestimonial,
  sectionFaq: SectionFaq,
  sectionCta: SectionCta,
  sectionContactForm: SectionContactForm,
}

function headingText(heading?: { lines?: { children?: { text?: string }[] }[] }) {
  return (heading?.lines ?? [])
    .map((block) => (block.children ?? []).map((child) => child.text ?? '').join(''))
    .join(' ')
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Renders a document's `sections[]`.
 *
 * The array index becomes each section's reveal index, so the entrance stagger
 * falls out of document order. Each section gets an `id` from its eyebrow or
 * heading so it can be deep-linked. An unknown `_type` renders nothing in
 * production but shouts in development.
 */
export function SectionRenderer({ sections }: { sections?: { _type: string; _key?: string }[] }) {
  if (!sections?.length) return null

  const seen = new Set<string>()
  const withIds = sections.map((section) => {
    const label =
      (section as { eyebrow?: string }).eyebrow ||
      headingText((section as { heading?: { lines?: { children?: { text?: string }[] }[] } }).heading)
    if (!label) return { ...section }
    let id = slugify(label)
    // Two sections with the same eyebrow ("Deliverables" twice) must not share an id.
    if (seen.has(id)) id = `${id}-${section._key ?? seen.size}`
    seen.add(id)
    return { ...section, id }
  })

  return (
    <>
      {withIds.map((section, i) => {
        const Component = REGISTRY[section._type]
        if (!Component) {
          if (process.env.NODE_ENV !== 'production') {
            return (
              <div key={section._key ?? i} className="mx-gutter my-6 rounded-md border border-accent bg-accent/8 p-5">
                <p className="text-label uppercase text-accent">Unrendered section</p>
                <p className="font-display text-h2 text-ink">{section._type}</p>
              </div>
            )
          }
          return null
        }
        return <Component key={section._key ?? i} data={section} index={i} />
      })}
    </>
  )
}

export { REGISTRY as SECTION_REGISTRY }
