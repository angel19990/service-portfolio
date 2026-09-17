import { defineType, defineField } from 'sanity'

export const ctaLink = defineType({
  name: 'ctaLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (R) => R.required().max(40) }),
    defineField({
      name: 'href',
      type: 'string',
      description: 'A route (/contact?service=ux) or a full URL.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'tone',
      type: 'string',
      initialValue: 'outline',
      options: { list: ['outline', 'filled'], layout: 'radio', direction: 'horizontal' },
    }),
    defineField({ name: 'external', title: 'Opens in a new tab', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
})

export const navItem = defineType({
  name: 'navItem',
  title: 'Nav item',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (R) => R.required().max(24) }),
    defineField({ name: 'href', type: 'string', validation: (R) => R.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
})

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Overrides the page title in search and social. ~60 characters.',
      validation: (R) => R.max(70),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      validation: (R) => R.max(165),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
  ],
})

/** One stage of the project process, with what the client brings to it. */
export const step = defineType({
  name: 'step',
  title: 'Step',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (R) => R.required().max(60) }),
    defineField({ name: 'body', type: 'richText' }),
    defineField({
      name: 'clientInput',
      title: 'What I need from you',
      type: 'string',
      description: 'Optional. The input the client supplies at this stage.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'clientInput' } },
})

export const faqItem = defineType({
  name: 'faqItem',
  title: 'Question',
  type: 'object',
  fields: [
    defineField({ name: 'question', type: 'string', validation: (R) => R.required().max(120) }),
    defineField({ name: 'answer', type: 'richText', validation: (R) => R.required() }),
  ],
  preview: { select: { title: 'question' } },
})

/** A design or creative decision worth explaining on a project story. */
export const decision = defineType({
  name: 'decision',
  title: 'Decision',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (R) => R.required().max(80) }),
    defineField({ name: 'body', type: 'richText' }),
  ],
  preview: { select: { title: 'title' } },
})
