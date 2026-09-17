import { defineType, defineField, defineArrayMember } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({
      name: 'wordmark',
      type: 'string',
      initialValue: 'Angelika Cheng',
      description: 'The name in the header and footer.',
    }),
    defineField({
      name: 'email',
      type: 'string',
      description: 'Shown in the footer and offered as the alternative to the form.',
    }),
    defineField({ name: 'location', type: 'string' }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'array',
      of: [defineArrayMember({ type: 'ctaLink' })],
      description: 'Instagram, LinkedIn. Rendered in the footer.',
    }),
    defineField({
      name: 'careerPortfolio',
      title: 'Career portfolio link',
      type: 'ctaLink',
      description: 'The footer line for recruiters, pointing at angelikaux.com.',
    }),
    defineField({ name: 'defaultSeo', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'primary',
      type: 'array',
      of: [defineArrayMember({ type: 'navItem' })],
      validation: (R) => R.required().min(2).max(5),
    }),
    defineField({
      name: 'cta',
      title: 'Header button',
      type: 'navItem',
      description: 'The filled button at the end of the nav: Start a project.',
    }),
    defineField({
      name: 'footer',
      type: 'array',
      of: [defineArrayMember({ type: 'navItem' })],
    }),
  ],
  preview: { prepare: () => ({ title: 'Navigation' }) },
})
