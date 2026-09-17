import { defineType, defineField, defineArrayMember } from 'sanity'
import { mediaSlot } from '../objects/media'

/**
 * The two offers, as documents rather than section fields, so the card copy
 * exists once and appears identically on the home page and /services.
 * Pinned to fixed ids (`service-ux`, `service-video`) in the Studio desk.
 */
export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'key',
      title: 'Inquiry key',
      type: 'string',
      description: 'Matches the `service` option on the contact form.',
      options: {
        list: [
          { title: 'UX & Product Design', value: 'ux' },
          { title: 'Creative Video', value: 'video' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'href',
      title: 'Detail page',
      type: 'string',
      description: 'Route of the service detail page, e.g. /services/ux-design.',
      validation: (R) => R.required(),
    }),
    defineField({ name: 'order', type: 'number', validation: (R) => R.integer() }),
    mediaSlot('media', 'Example', 'One image or short clip that shows the kind of work.'),
    defineField({
      name: 'situation',
      title: 'Who this is for',
      type: 'richInline',
      description: 'The buyer situation, one sentence.',
    }),
    defineField({
      name: 'promise',
      title: 'What you get',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'scope',
      title: 'Sample scope',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'deliverables',
      title: 'Possible deliverables',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'proof',
      title: 'Proof',
      type: 'richInline',
      description: 'One line on what backs this up. Link to work with the link tool.',
    }),
    defineField({
      name: 'note',
      title: 'Fine print',
      type: 'richInline',
      description: 'Optional clarification, e.g. what is scoped separately.',
    }),
    defineField({ name: 'cta', title: 'Inquiry button', type: 'ctaLink' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'href', media: 'media.0' },
  },
})
