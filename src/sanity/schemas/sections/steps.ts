import { defineType, defineField, defineArrayMember } from 'sanity'
import { baseFields, sectionPreview } from './_base'

/** How a project works: a numbered list of stages. */
export const sectionSteps = defineType({
  name: 'sectionSteps',
  title: 'Steps',
  type: 'object',
  fields: [
    ...baseFields,
    defineField({ name: 'intro', type: 'richText' }),
    defineField({
      name: 'steps',
      type: 'array',
      of: [defineArrayMember({ type: 'step' })],
      validation: (R) => R.required().min(2).max(6),
    }),
    defineField({ name: 'cta', title: 'Button', type: 'ctaLink' }),
  ],
  preview: sectionPreview('Steps'),
})
