import { defineType, defineField, defineArrayMember } from 'sanity'
import { baseFields, sectionPreview } from './_base'
import { mediaSlot } from '../objects/media'

/**
 * The home opener: headline, one paragraph, two buttons, and one example of
 * each offer side by side so both are apparent before anyone scrolls.
 */
export const sectionHero = defineType({
  name: 'sectionHero',
  title: 'Hero',
  type: 'object',
  fields: [
    ...baseFields,
    defineField({ name: 'body', type: 'richText' }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'ctaLink' })],
      validation: (R) => R.max(2),
    }),
    mediaSlot('mediaA', 'First example', 'A UX visual.'),
    defineField({ name: 'mediaALabel', title: 'First example label', type: 'string', validation: (R) => R.max(40) }),
    mediaSlot('mediaB', 'Second example', 'A creative-video example.'),
    defineField({ name: 'mediaBLabel', title: 'Second example label', type: 'string', validation: (R) => R.max(40) }),
  ],
  preview: sectionPreview('Hero'),
})
