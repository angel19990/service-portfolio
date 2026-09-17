import { RichText, Button } from '@/components/primitives'
import { SectionShell } from './SectionShell'
import type { RichHeading, PortableTextBlock, CtaLink, Step } from '@/sanity/types'

export interface SectionStepsData {
  id?: string
  _key?: string
  eyebrow?: string
  heading?: RichHeading
  intro?: PortableTextBlock[]
  steps?: Step[]
  cta?: CtaLink
}

/** How a project works: numbered stages, each with what the client brings. */
export function SectionSteps({ data, index = 0 }: { data: SectionStepsData; index?: number }) {
  const steps = data.steps ?? []
  if (!steps.length) return null

  return (
    <SectionShell id={data.id} eyebrow={data.eyebrow} heading={data.heading} index={index}>
      {data.intro && <RichText value={data.intro} />}
      <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step._key ?? i} className="surface-tint flex flex-col gap-3 p-6">
            <span className="font-display text-title-dense text-accent" aria-hidden>
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display text-h2 text-ink">
              <span className="sr-only">Step {i + 1}: </span>
              {step.title}
            </h3>
            {step.body && <RichText value={step.body} className="text-[0.9375rem]" />}
            {step.clientInput && (
              <p className="mt-auto border-t border-rule pt-3 text-[0.875rem] text-muted">
                <span className="text-label uppercase">You bring: </span>
                {step.clientInput}
              </p>
            )}
          </li>
        ))}
      </ol>
      {data.cta && (
        <div>
          <Button cta={data.cta} />
        </div>
      )}
    </SectionShell>
  )
}
