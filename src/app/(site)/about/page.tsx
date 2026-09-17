import type { Metadata } from 'next'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import { loadPage, metadataFor } from '@/sanity/lib/page'

const DESCRIPTION =
  'Product designer and creative video maker with an unconventional path through theatre, hospitality and music, and how each of them shapes the work.'

export async function generateMetadata(): Promise<Metadata> {
  const doc = await loadPage('page-about')
  return metadataFor({ doc, path: '/about', description: DESCRIPTION })
}

export default async function AboutPage() {
  const doc = await loadPage('page-about')
  return <SectionRenderer sections={doc.sections} />
}
