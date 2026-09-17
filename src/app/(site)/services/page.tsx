import type { Metadata } from 'next'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import { loadPage, metadataFor } from '@/sanity/lib/page'

const DESCRIPTION =
  'Two ways to work together: UX and product design for teams building something digital, and creative video production for brands introducing a product.'

export async function generateMetadata(): Promise<Metadata> {
  const doc = await loadPage('page-services')
  return metadataFor({ doc, path: '/services', description: DESCRIPTION })
}

export default async function ServicesPage() {
  const doc = await loadPage('page-services')
  return <SectionRenderer sections={doc.sections} />
}
