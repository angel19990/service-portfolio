import { Heading, RichText, Eyebrow } from '@/components/primitives'
import { Reveal } from '@/components/interactive'
import { ContactForm } from '@/components/contact/ContactForm'
import { sanityFetch } from '@/sanity/lib/live'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import { CONTACT_EMAIL } from '@/lib/site'
import type { RichHeading, PortableTextBlock, CtaLink } from '@/sanity/types'

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
  emailNote?: PortableTextBlock[]
}

/**
 * Server shell for the contact form: reads the email and the scheduling link
 * from site settings, renders every piece of copy to ReactNodes and hands the
 * lot to the client form.
 */
export async function SectionContactForm({ data, index = 0 }: { data: SectionContactFormData; index?: number }) {
  const settings = await sanityFetch<{ email?: string; scheduleLink?: CtaLink } | null>(siteSettingsQuery)
  const email = settings?.email || CONTACT_EMAIL
  const schedule = settings?.scheduleLink?.href
    ? { label: settings.scheduleLink.label, href: settings.scheduleLink.href }
    : undefined

  return (
    <section id={data.id} className="px-gutter pb-section">
      <Reveal index={index} variant="up" className="mx-auto w-full max-w-content">
        <div className="grid gap-band lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="flex flex-col gap-stack lg:sticky lg:top-28 lg:self-start">
            {data.eyebrow && <Eyebrow>{data.eyebrow}</Eyebrow>}
            {data.heading && <Heading value={data.heading} tier="title" />}
            {data.intro && <RichText value={data.intro} />}
            {data.nextSteps && (
              <div className="surface-card rounded-[1.25rem] border border-white/65 p-6">
                <RichText value={data.nextSteps} className="text-[0.9375rem]" />
              </div>
            )}
          </div>
          <ContactForm
            email={email}
            schedule={schedule}
            timingOptions={data.timingOptions}
            budgetOptions={data.budgetOptions}
            successHeading={data.successHeading || 'Your email is ready.'}
            success={<RichText value={data.successBody} />}
            emailNote={<RichText value={data.emailNote} className="gap-1" />}
          />
        </div>
      </Reveal>
    </section>
  )
}
