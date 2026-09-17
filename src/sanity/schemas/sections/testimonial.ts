import { defineType, defineField } from 'sanity'

/** One genuine quote. Leave the section out entirely rather than inventing one. */
export const sectionTestimonial = defineType({
  name: 'sectionTestimonial',
  title: 'Testimonial',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string', validation: (R) => R.max(40) }),
    defineField({ name: 'quote', type: 'text', rows: 4, validation: (R) => R.required().max(400) }),
    defineField({ name: 'name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'role', type: 'string', description: 'Title and company.' }),
    defineField({ name: 'portrait', type: 'imageMedia' }),
    defineField({ name: 'link', type: 'ctaLink', description: 'Optional link to the related project.' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'quote', media: 'portrait' },
    prepare: ({ title, subtitle, media }) => ({ title: `Testimonial · ${title}`, subtitle, media }),
  },
})
