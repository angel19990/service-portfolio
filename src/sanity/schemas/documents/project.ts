import { defineType, defineField, defineArrayMember } from 'sanity'
import { mediaSlot, mediaList } from '../objects/media'

/** The /work filters. `label` is what the filter rail and the card eyebrow show. */
export const PROJECT_CATEGORIES = [
  { title: 'UX & Products', value: 'ux' },
  { title: 'Creative Videos', value: 'video' },
  { title: 'Experiments', value: 'experiment' },
] as const

/** The project-type label, kept distinct from the category filter on purpose. */
export const PROJECT_TYPES = [
  { title: 'Client work', value: 'client' },
  { title: 'Personal project', value: 'personal' },
  { title: 'Independent concept', value: 'concept' },
] as const

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'card', title: 'Card', default: true },
    { name: 'story', title: 'Story' },
    { name: 'credits', title: 'Credits' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'card', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'card',
      options: { source: 'title', maxLength: 60 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      group: 'card',
      options: { list: [...PROJECT_CATEGORIES], layout: 'radio' },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'projectType',
      title: 'Project type',
      type: 'string',
      group: 'card',
      options: { list: [...PROJECT_TYPES], layout: 'radio' },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on the home page',
      type: 'boolean',
      group: 'card',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      type: 'number',
      group: 'card',
      description: 'Lower numbers come first.',
      validation: (R) => R.required().integer(),
    }),
    defineField({
      name: 'summary',
      title: 'The challenge, in a sentence',
      type: 'text',
      rows: 3,
      group: 'card',
      description: 'Shown on the card and as the page description.',
      validation: (R) => R.required().max(180),
    }),
    mediaSlot('cover', 'Cover', 'The finished result. Shown first on the card and the story.'),

    defineField({
      name: 'contextNote',
      title: 'Status / context note',
      type: 'text',
      rows: 2,
      group: 'story',
      description:
        'Shown beside the title wherever the project appears. Use it for status and provenance, e.g. a self-initiated concept that is not affiliated with the brand it depicts.',
    }),
    defineField({ name: 'brief', title: 'The brief or problem', type: 'richText', group: 'story' }),
    defineField({
      name: 'decisions',
      title: 'Decisions worth explaining',
      type: 'array',
      group: 'story',
      of: [defineArrayMember({ type: 'decision' })],
      validation: (R) => R.max(5),
    }),
    defineField({
      name: 'outcomes',
      title: 'Deliverables and outcomes',
      type: 'array',
      group: 'story',
      of: [defineArrayMember({ type: 'string' })],
      description: 'What was delivered, or the current status of a concept.',
    }),
    mediaList('gallery', 'Gallery'),
    defineField({
      name: 'externalLink',
      title: 'Deeper reading',
      type: 'ctaLink',
      group: 'story',
      description: 'Optional link to the full case study on angelikaux.com.',
    }),

    defineField({ name: 'client', title: 'Client / for', type: 'string', group: 'credits' }),
    defineField({ name: 'year', type: 'string', group: 'credits' }),
    defineField({ name: 'role', title: 'My role', type: 'string', group: 'credits' }),
    defineField({ name: 'collaborators', type: 'string', group: 'credits' }),

    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
    {
      title: 'Category',
      name: 'category',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'title', category: 'category', projectType: 'projectType', featured: 'featured', media: 'cover.0' },
    prepare: ({ title, category, projectType, featured, media }) => {
      const cat = PROJECT_CATEGORIES.find((c) => c.value === category)?.title
      const type = PROJECT_TYPES.find((t) => t.value === projectType)?.title
      return {
        title,
        subtitle: [featured ? '★' : null, cat, type].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
