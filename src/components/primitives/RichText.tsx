import { PortableText } from '@portabletext/react'
import { bodyComponents, inlineComponents } from './portable-text'
import type { PortableTextBlock } from '@/sanity/types'

export function RichText({
  value,
  className = '',
}: {
  value?: PortableTextBlock[]
  className?: string
}) {
  if (!value?.length) return null
  return (
    <div className={`flex flex-col gap-stack text-text ${className}`}>
      <PortableText value={value} components={bodyComponents} />
    </div>
  )
}

/** Single paragraph, no wrapper — for text that sits inside another element. */
export function InlineText({ value }: { value?: PortableTextBlock[] }) {
  if (!value?.length) return null
  return <PortableText value={value} components={inlineComponents} />
}
