import { defineType, defineField, defineArrayMember } from 'sanity'
import { baseFields, sectionPreview } from './_base'
import { PROJECT_CATEGORIES } from '../documents/project'

/**
 * Project cards, four ways: the home "Selected work" row (featured), the
 * experiments teaser (category), the /work index (all, with filters), and a
 * hand-picked set on a service page (curated).
 */
export const sectionProjectGrid = defineType({
  name: 'sectionProjectGrid',
  title: 'Project grid',
  type: 'object',
  fields: [
    ...baseFields,
    defineField({ name: 'intro', type: 'richText' }),
    defineField({
      name: 'mode',
      type: 'string',
      initialValue: 'featured',
      options: {
        list: [
          { title: 'Featured projects', value: 'featured' },
          { title: 'All projects', value: 'all' },
          { title: 'One category', value: 'category' },
          { title: 'Hand-picked', value: 'curated' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: [...PROJECT_CATEGORIES] },
      hidden: ({ parent }) => parent?.mode !== 'category',
    }),
    defineField({
      name: 'projects',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
      validation: (R) => R.max(6),
      hidden: ({ parent }) => parent?.mode !== 'curated',
    }),
    defineField({
      name: 'limit',
      type: 'number',
      description: 'Leave empty for no limit.',
      validation: (R) => R.integer().min(1).max(24),
      hidden: ({ parent }) => parent?.mode === 'curated',
    }),
    defineField({
      name: 'showFilters',
      title: 'Show category filters',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.mode !== 'all',
    }),
    defineField({ name: 'cta', title: 'Button', type: 'ctaLink' }),
  ],
  preview: sectionPreview('Project grid'),
})
