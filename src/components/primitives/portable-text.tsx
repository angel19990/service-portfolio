import type { PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'

/**
 * The `accent` decorator: terracotta, italic. Fraunces ships a real italic with
 * its own "wonky" alternates, so the emphasis reads as a different voice rather
 * than a slanted copy of the same one.
 */
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
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
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

/** Single-paragraph fields: card copy, footnotes, one-line proofs. */
export const inlineComponents: PortableTextComponents = {
  marks: {
    accent,
    link,
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  },
  block: { normal: ({ children }) => <>{children}</> },
}

/** Headings: no wrapper, the Heading component supplies the element. */
export const headingComponents: PortableTextComponents = {
  marks: { accent, em: ({ children }) => <em className="italic">{children}</em> },
  block: { normal: ({ children }) => <>{children}</> },
}
