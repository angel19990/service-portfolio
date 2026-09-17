import { Heading, RichText, Eyebrow, Button, Rule } from '@/components/primitives'
import type { PortableTextBlock } from '@/sanity/types'

export const metadata = { title: 'Tokens', robots: { index: false } }

/* Hand-built Portable Text so the primitives are exercised against the real
   shape the CMS produces, not against plain strings. */
const span = (text: string, marks: string[] = []) => ({ _type: 'span', _key: text.slice(0, 6), text, marks })
const block = (children: unknown[], key: string): PortableTextBlock =>
  ({ _type: 'block', _key: key, style: 'normal', markDefs: [], children }) as PortableTextBlock

const HEADING = {
  level: 'h2' as const,
  collapseOnMobile: true,
  lines: [block([span('Thoughtful UX.', ['accent'])], 'l1'), block([span('Playful videos.')], 'l2')],
}

const BODY: PortableTextBlock[] = [
  block(
    [
      span('I help businesses turn ideas into '),
      span('clear digital experiences', ['strong']),
      span(' and '),
      span('imaginative videos', ['accent']),
      span('.'),
    ],
    'b1',
  ),
]

const TIERS = [
  ['display', 'text-display', 'Playful videos.'],
  ['title-cover', 'text-title-cover', 'Angelika'],
  ['title', 'text-title', 'Two offers, scoped to fit.'],
  ['title-dense', 'text-title-dense', 'Four stages, no surprises'],
  ['h2', 'text-h2', 'Section heading'],
  ['body', 'text-body', 'A rough note is enough to start.'],
  ['eyebrow', 'text-eyebrow', 'Selected work'],
  ['label', 'text-label', 'Client work'],
] as const

const COLORS = [
  ['bg', 'bg-bg'], ['surface', 'bg-surface'], ['ink', 'bg-ink'], ['text', 'bg-text'],
  ['muted', 'bg-muted'], ['muted-2', 'bg-muted-2'], ['accent', 'bg-accent'],
  ['rule', 'bg-rule'], ['rule-soft', 'bg-rule-soft'], ['scrim', 'bg-scrim'],
] as const

/* Class names must appear literally in the source: Tailwind scans text, so a
   template literal like `rounded-${r}` generates nothing. */
const RADII = [
  ['xs', 'rounded-xs'], ['sm', 'rounded-sm'], ['md', 'rounded-md'], ['lg', 'rounded-lg'],
  ['xl', 'rounded-xl'], ['2xl', 'rounded-2xl'], ['full', 'rounded-full'],
] as const

const SURFACES = [
  ['surface-card', 'surface-card rounded-[1.25rem]'],
  ['surface-card-strong', 'surface-card-strong rounded-[1.25rem]'],
  ['media-frame', 'media-frame'],
  ['media-fit', 'media-fit bg-surface'],
  ['media-empty', 'media-empty'],
] as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-gutter pb-section">
      <div className="mx-auto flex w-full max-w-content flex-col gap-band">
        <Eyebrow>{title}</Eyebrow>
        {children}
      </div>
    </section>
  )
}

/** Proof page: every token and primitive, rendered with real values. */
export default function TokensPage() {
  return (
    <main className="pt-page-top">
      <Section title="Type ramp">
        <ul className="flex flex-col gap-6">
          {TIERS.map(([name, cls, sample]) => (
            <li key={name} className="grid gap-2 md:grid-cols-[8rem_1fr] md:items-baseline">
              <code className="text-label uppercase text-muted">{name}</code>
              <p className={`${name === 'eyebrow' || name === 'label' ? 'uppercase' : 'font-display'} ${cls} text-ink`}>{sample}</p>
            </li>
          ))}
        </ul>
        <Rule />
        <Heading value={HEADING} tier="title" />
        <RichText value={BODY} />
        <div className="flex flex-wrap gap-3">
          <Button cta={{ label: 'Filled', href: '#', tone: 'filled' }} />
          <Button cta={{ label: 'Outline', href: '#' }} />
          <Button cta={{ label: 'External', href: 'https://example.com', external: true }} />
        </div>
      </Section>

      <Section title="Colour">
        <ul className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {COLORS.map(([name, cls]) => (
            <li key={name} className="flex flex-col gap-2">
              <div className={`aspect-square rounded-md border border-rule ${cls}`} />
              <code className="text-label uppercase text-muted">{name}</code>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Radius">
        <ul className="grid grid-cols-4 gap-4 md:grid-cols-7">
          {RADII.map(([name, cls]) => (
            <li key={name} className="flex flex-col gap-2">
              <div className={`aspect-square bg-ink ${cls}`} />
              <code className="text-label uppercase text-muted">{name}</code>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Surfaces">
        <ul className="grid gap-4 md:grid-cols-3">
          {SURFACES.map(([name, cls]) => (
            <li key={name} className={`${cls} flex aspect-[3/2] items-end p-5`}>
              <code className="text-label uppercase">{name}</code>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  )
}
