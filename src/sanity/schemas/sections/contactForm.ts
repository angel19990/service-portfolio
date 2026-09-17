import { defineType, defineField, defineArrayMember } from 'sanity'
import { baseFields, sectionPreview } from './_base'

/** The inquiry form. Field labels are fixed in code; the surrounding copy is not. */
export const sectionContactForm = defineType({
  name: 'sectionContactForm',
  title: 'Contact form',
  type: 'object',
  fields: [
    ...baseFields,
    defineField({ name: 'intro', type: 'richText' }),
    defineField({
      name: 'nextSteps',
      title: 'What happens next',
      type: 'richText',
      description: 'Shown beside the form. Include a response time you can keep.',
    }),
    defineField({
      name: 'timingOptions',
      title: 'Timing choices',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Leave empty for a free-text field.',
    }),
    defineField({
      name: 'budgetOptions',
      title: 'Budget range choices',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Leave empty to hide the budget field entirely.',
    }),
    defineField({ name: 'successHeading', type: 'string', initialValue: 'Thanks, I have it.' }),
    defineField({ name: 'successBody', type: 'richText' }),
    defineField({ name: 'errorBody', type: 'richText', description: 'Shown if sending fails. Offer the email address.' }),
    defineField({
      name: 'emailNote',
      type: 'richText',
      description: 'The alternative to the form, e.g. "Prefer email? Write to ..."',
    }),
  ],
  preview: sectionPreview('Contact form'),
})
