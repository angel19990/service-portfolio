import { defineType, defineField, defineArrayMember } from 'sanity'
import { AccentIcon, AccentRender } from '../components/AccentDecorator'
import type { PortableTextBlock } from 'sanity'

/** Flattens a richHeading's blocks to plain text — used by every section preview. */
export function headingText(heading?: { lines?: PortableTextBlock[] }): string {
  return (heading?.lines ?? [])
    .map((block) =>
      ((block?.children ?? []) as { text?: string }[])
        .map((child) => child.text ?? '')
        .join(''),
    )
    .join(' ')
    .trim()
}

/**
 * One Portable Text block per *visual line*.
 *
 * The deck leans on `<br/>` for every title lockup and Portable Text has no
 * hard-break primitive, so block-per-line is the only deterministic model. It
 * migrates by splitting on `<br/>`, gives editors an obvious rule (Enter = new
 * line), and unlocks `collapseOnMobile` — which rejoins the authored lines below
 * 768 so a two-line desktop lockup doesn't shatter into five ragged ones at 375.
 */
export const richHeading = defineType({
  name: 'richHeading',
  title: 'Heading',
  type: 'object',
  fields: [
    defineField({
      name: 'level',
      title: 'Semantic level',
      type: 'string',
      initialValue: 'h2',
      options: {
        list: [
          { title: 'H1 — page title (exactly one per page)', value: 'h1' },
          { title: 'H2 — section title', value: 'h2' },
          { title: 'H3 — sub-section', value: 'h3' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'lines',
      title: 'Lines',
      description:
        'Press Enter to start a new visual line. Select text and hit A for the accent emphasis.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Line', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Accent', value: 'accent', icon: AccentIcon, component: AccentRender },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [],
          },
        }),
      ],
      validation: (R) => R.required().min(1).max(4),
    }),
    defineField({
      name: 'collapseOnMobile',
      title: 'Join lines below 768px',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { lines: 'lines', level: 'level' },
    prepare: ({ lines, level }) => ({
      title: headingText({ lines }) || 'Untitled',
      subtitle: String(level ?? '').toUpperCase(),
    }),
  },
})
