import type { Metadata } from 'next'
import { ProjectStory } from '@/components/work/ProjectStory'
import { loadProject, metadataFor } from '@/sanity/lib/page'
import { sanityFetch } from '@/sanity/lib/client'
import { projectSlugsQuery } from '@/sanity/lib/queries'

/**
 * Every project is prerendered. `dynamicParams` stays at its default so a
 * project added in the Studio after a build still resolves on first request
 * rather than 404ing until the next deploy.
 */
export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(projectSlugsQuery)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const doc = await loadProject(slug)
  return metadataFor({ doc, path: `/work/${slug}`, description: doc.summary, type: 'article' })
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = await loadProject(slug)
  return <ProjectStory doc={doc} />
}
