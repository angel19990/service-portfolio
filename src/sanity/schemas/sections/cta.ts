import { defineType, defineField, defineArrayMember } from 'sanity'
import { baseFields, sectionPreview } from './_base'

/** The closing invitation: a heading, a line, one or two buttons. */
export const sectionCta = defineType({
  name: 'sectionCta',
  title: 'Call to action',
  type: 'object',
  fields: [
    ...baseFields,
    defineField({ name: 'body', type: 'richText' }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'ctaLink' })],
      validation: (R) => R.min(1).max(2),
    }),
    defineField({
      name: 'tone',
      type: 'string',
      initialValue: 'paper',
      options: {
        list: [
          { title: 'Paper', value: 'paper' },
          { title: 'Ink (dark band)', value: 'ink' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'showEmail',
      title: 'Show the email address',
      type: 'boolean',
      initialValue: false,
      description: 'Adds the site email beneath the buttons as the no-form alternative.',
    }),
  ],
  preview: sectionPreview('Call to action'),
})
