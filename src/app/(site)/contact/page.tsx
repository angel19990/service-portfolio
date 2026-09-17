import type { Metadata } from 'next'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import { loadPage, metadataFor } from '@/sanity/lib/page'
import { CONTACT_EMAIL } from '@/lib/site'

const DESCRIPTION = `Tell me what you would like to make: a UX project, a creative video, or both. Or email ${CONTACT_EMAIL}.`

export async function generateMetadata(): Promise<Metadata> {
  const doc = await loadPage('page-contact')
  return metadataFor({ doc, path: '/contact', description: DESCRIPTION })
}

export default async function ContactPage() {
  const doc = await loadPage('page-contact')
  return <SectionRenderer sections={doc.sections} />
}
