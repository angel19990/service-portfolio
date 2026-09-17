import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import { loadPage, metadataFor } from '@/sanity/lib/page'
import { SERVICE_ROUTES } from '@/sanity/lib/routes'

const DESCRIPTIONS: Record<string, string> = {
  'ux-design':
    'UX and product design for teams creating or improving a digital product: user flows, key screens, an interactive prototype and handoff notes, scoped explicitly.',
  'creative-video':
    'Creative video production for brands that need an imaginative way to introduce or demonstrate a product: concept, storyboard, filming or editing, and final delivery.',
}

/** The two service detail pages are singletons; the slug is just how they are addressed. */
function idFor(slug: string) {
  return SERVICE_ROUTES.find((r) => r.slug === slug)?.id
}

export function generateStaticParams() {
  return SERVICE_ROUTES.map((r) => ({ slug: r.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const id = idFor(slug)
  if (!id) notFound()
  const doc = await loadPage(id)
  return metadataFor({ doc, path: `/services/${slug}`, description: DESCRIPTIONS[slug] })
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const id = idFor(slug)
  if (!id) notFound()
  const doc = await loadPage(id)
  return <SectionRenderer sections={doc.sections} />
}
