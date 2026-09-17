import type { Metadata } from 'next'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import { loadPage, metadataFor } from '@/sanity/lib/page'
import { SITE_TITLE, SITE_DESCRIPTION } from '@/lib/site'

export async function generateMetadata(): Promise<Metadata> {
  const doc = await loadPage('page-home')
  return {
    ...metadataFor({ doc, path: '/', description: SITE_DESCRIPTION, title: SITE_TITLE }),
    // The root template appends " · Angelika Cheng"; the home title already
    // carries the name, so it opts out.
    title: { absolute: doc.seo?.title ?? SITE_TITLE },
  }
}

export default async function HomePage() {
  const doc = await loadPage('page-home')
  return <SectionRenderer sections={doc.sections} />
}
