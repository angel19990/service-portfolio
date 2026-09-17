import { defineField } from 'sanity'
import { headingText } from '../objects/richHeading'

/** Every section opens with an optional eyebrow and a heading. */
export const baseFields = [
  defineField({ name: 'eyebrow', type: 'string', validation: (R) => R.max(40) }),
  defineField({ name: 'heading', type: 'richHeading' }),
]

/** Shared preview: eyebrow as the subtitle, heading text as the title. */
export function sectionPreview(label: string) {
  return {
    select: { heading: 'heading', eyebrow: 'eyebrow' },
    prepare: ({ heading, eyebrow }: { heading?: { lines?: never[] }; eyebrow?: string }) => ({
      title: headingText(heading) || label,
      subtitle: [label, eyebrow].filter(Boolean).join(' · '),
    }),
  }
}
