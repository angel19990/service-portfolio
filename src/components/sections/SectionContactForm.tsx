import { Heading, RichText, Eyebrow } from '@/components/primitives'
import { Reveal } from '@/components/interactive'
import { ContactForm } from '@/components/contact/ContactForm'
import type { RichHeading, PortableTextBlock } from '@/sanity/types'

export interface SectionContactFormData {
  id?: string
  _key?: string
  eyebrow?: string
  heading?: RichHeading
  intro?: PortableTextBlock[]
  nextSteps?: PortableTextBlock[]
  timingOptions?: string[]
  budgetOptions?: string[]
  successHeading?: string
  successBody?: PortableTextBlock[]
  errorBody?: PortableTextBlock[]
  emailNote?: PortableTextBlock[]
}

/**
 * Server shell for the contact form: renders every piece of copy to ReactNodes
 * and hands them to the client form.
 */
export function SectionContactForm({ data, index = 0 }: { data: SectionContactFormData; index?: number }) {
  const form = (
    <ContactForm
      timingOptions={data.timingOptions}
      budgetOptions={data.budgetOptions}
      successHeading={data.successHeading || 'Thanks, I have it.'}
      success={<RichText value={data.successBody} />}
      errorFallback={<RichText value={data.errorBody} />}
      emailNote={<RichText value={data.emailNote} className="gap-1" />}
    />
  )

  return (
    <section id={data.id} className="px-gutter pb-section">
      <Reveal index={index} variant="up" className="mx-auto w-full max-w-content">
        <div className="grid gap-band lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="flex flex-col gap-stack lg:sticky lg:top-28 lg:self-start">
            {data.eyebrow && <Eyebrow>{data.eyebrow}</Eyebrow>}
            {data.heading && <Heading value={data.heading} tier="title" />}
            {data.intro && <RichText value={data.intro} />}
            {data.nextSteps && (
              <div className="surface-tint p-6">
                <RichText value={data.nextSteps} className="text-[0.9375rem]" />
              </div>
            )}
          </div>
          {form}
        </div>
      </Reveal>
    </section>
  )
}
