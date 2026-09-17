import type { PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'

/**
 * The `accent` decorator is the deck's signature emphasis — accent colour, italic.
 * It is a decorator rather than an annotation because it carries no data, which
 * means it renders in exactly one place: here.
 */
// Prata ships no italic face, so the browser synthesises an oblique — which is
// exactly what the deck did with `font-style: italic` on `.slide-title .orange`.
const accent = ({ children }: { children?: React.ReactNode }) => (
  <em className="text-accent italic">{children}</em>
)

const link = ({
  value,
  children,
}: {
  value?: { href?: string; newTab?: boolean }
  children?: React.ReactNode
}) => {
  const href = value?.href ?? '#'
  const external = value?.newTab || /^https?:\/\//.test(href)
  const className =
    'underline decoration-rule underline-offset-4 transition-colors can-hover:hover:decoration-accent can-hover:hover:text-accent'
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

/** Body copy: paragraphs, sub-heads and bullets. */
export const bodyComponents: PortableTextComponents = {
  marks: {
    accent,
    link,
    strong: ({ children }) => <strong className="font-semibold text-accent">{children}</strong>,
  },
  block: {
    normal: ({ children }) => <p className="max-w-[62ch]">{children}</p>,
    h3: ({ children }) => (
      <h3 className="font-display text-h2 text-ink mt-band first:mt-0">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="flex flex-col gap-stack max-w-[62ch]">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-accent">
        {children}
      </li>
    ),
  },
}

/** Single-paragraph fields — agenda items, bullet leads, capability details. */
export const inlineComponents: PortableTextComponents = {
  marks: {
    accent,
    link,
    strong: ({ children }) => <strong className="font-semibold text-accent">{children}</strong>,
  },
  block: { normal: ({ children }) => <>{children}</> },
}

/** Headings: no wrapper, the Heading component supplies the element. */
export const headingComponents: PortableTextComponents = {
  marks: { accent, em: ({ children }) => <em className="italic">{children}</em> },
  block: { normal: ({ children }) => <>{children}</> },
}
