import { defineType, defineArrayMember, defineField } from 'sanity'
import { AccentIcon, AccentRender } from '../components/AccentDecorator'

const decorators = [
  { title: 'Bold', value: 'strong' },
  { title: 'Italic', value: 'em' },
  { title: 'Accent', value: 'accent', icon: AccentIcon, component: AccentRender },
]

const link = defineArrayMember({
  name: 'link',
  type: 'object',
  title: 'Link',
  fields: [
    defineField({
      name: 'href',
      type: 'url',
      validation: (R) =>
        R.required().uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
    }),
    defineField({
      name: 'newTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})

/** Single-paragraph inline copy: agenda items, stage labels, bullet leads. */
export const richInline = defineType({
  name: 'richInline',
  title: 'Inline text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [],
      marks: { decorators, annotations: [] },
    }),
  ],
  validation: (R) => R.max(1).error('One paragraph only.'),
})

/** Full body copy. */
export const richText = defineType({
  name: 'richText',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Body', value: 'normal' },
        { title: 'Sub-head', value: 'h3' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: { decorators, annotations: [link] },
    }),
  ],
})
