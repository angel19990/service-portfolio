import { defineType, defineField, defineArrayMember } from 'sanity'
import { baseFields, sectionPreview } from './_base'

export const sectionFaq = defineType({
  name: 'sectionFaq',
  title: 'FAQ',
  type: 'object',
  fields: [
    ...baseFields,
    defineField({
      name: 'items',
      type: 'array',
      of: [defineArrayMember({ type: 'faqItem' })],
      validation: (R) => R.required().min(1).max(10),
    }),
    defineField({ name: 'firstOpen', title: 'Open the first question', type: 'boolean', initialValue: false }),
  ],
  preview: sectionPreview('FAQ'),
})
