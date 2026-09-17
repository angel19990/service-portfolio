import type { Metadata } from 'next'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import { loadPage, metadataFor } from '@/sanity/lib/page'

const DESCRIPTION =
  'Selected UX and product design work, creative videos and original experiments, each labelled as client work, a personal project or an independent concept.'

export async function generateMetadata(): Promise<Metadata> {
  const doc = await loadPage('page-work')
  return metadataFor({ doc, path: '/work', description: DESCRIPTION })
}

export default async function WorkPage() {
  const doc = await loadPage('page-work')
  return <SectionRenderer sections={doc.sections} />
}
