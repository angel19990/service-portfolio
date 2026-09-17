import { defineType, defineField, defineArrayMember } from 'sanity'
import { baseFields, sectionPreview } from './_base'

/** The two offers side by side, reading from the `service` documents. */
export const sectionServiceCards = defineType({
  name: 'sectionServiceCards',
  title: 'Service cards',
  type: 'object',
  fields: [
    ...baseFields,
    defineField({ name: 'intro', type: 'richText' }),
    defineField({
      name: 'services',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
      description: 'Leave empty to show every service in order.',
      validation: (R) => R.max(2),
    }),
    defineField({
      name: 'footnote',
      type: 'richText',
      description: 'The line below the cards, e.g. the invitation for combined projects.',
    }),
  ],
  preview: sectionPreview('Service cards'),
})
