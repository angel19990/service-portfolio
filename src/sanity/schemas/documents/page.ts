import { defineType, defineField } from 'sanity'
import { sectionMembers } from '../sections'

type SectionValue = { heading?: { level?: string } }

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 60 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'sections',
      type: 'array',
      of: sectionMembers,
      validation: (R) =>
        R.required()
          .min(1)
          .custom((sections) => {
            const h1s = ((sections ?? []) as SectionValue[]).filter(
              (s) => s?.heading?.level === 'h1',
            ).length
            if (h1s === 0) return 'One section must carry the H1.'
            if (h1s > 1) return `Only one H1 per page — found ${h1s}.`
            return true
          }),
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `/${subtitle}` : undefined }),
  },
})
