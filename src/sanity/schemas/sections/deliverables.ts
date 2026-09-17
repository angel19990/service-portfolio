import { defineType, defineField, defineArrayMember } from 'sanity'
import { baseFields, sectionPreview } from './_base'

/** Two lists: what a typical engagement includes, and what is scoped separately. */
export const sectionDeliverables = defineType({
  name: 'sectionDeliverables',
  title: 'Deliverables',
  type: 'object',
  fields: [
    ...baseFields,
    defineField({ name: 'intro', type: 'richText' }),
    defineField({ name: 'includedLabel', type: 'string', initialValue: 'Typically included' }),
    defineField({
      name: 'included',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (R) => R.min(1),
    }),
    defineField({ name: 'separateLabel', type: 'string', initialValue: 'Scoped separately' }),
    defineField({
      name: 'separate',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'note', type: 'richText', description: 'Optional closing note, e.g. how quotes work.' }),
  ],
  preview: sectionPreview('Deliverables'),
})
