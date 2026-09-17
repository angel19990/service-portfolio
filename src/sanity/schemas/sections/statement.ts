import { defineType, defineField, defineArrayMember } from 'sanity'
import { baseFields, sectionPreview } from './_base'
import { mediaSlot } from '../objects/media'

/** Heading plus supporting copy: page intros, the about preview, closing notes. */
export const sectionStatement = defineType({
  name: 'sectionStatement',
  title: 'Statement',
  type: 'object',
  fields: [
    ...baseFields,
    defineField({
      name: 'headingTier',
      title: 'Heading size',
      type: 'string',
      description: 'Leave empty to derive from the layout.',
      options: {
        list: [
          { title: 'Display', value: 'display' },
          { title: 'Title', value: 'title' },
          { title: 'Title, dense', value: 'title-dense' },
          { title: 'H2', value: 'h2' },
        ],
      },
    }),
    defineField({ name: 'body', type: 'richText' }),
    defineField({
      name: 'meta',
      title: 'Facts',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Short facts rendered as pills.',
      options: { layout: 'tags' },
    }),
    mediaSlot('media', 'Media'),
    defineField({
      name: 'layout',
      type: 'string',
      initialValue: 'stacked',
      options: {
        list: [
          { title: 'Split: copy beside media', value: 'split' },
          { title: 'Stacked', value: 'stacked' },
          { title: 'Centred', value: 'centred' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'ctaLink' })],
      validation: (R) => R.max(3),
    }),
  ],
  preview: sectionPreview('Statement'),
})
