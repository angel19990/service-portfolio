import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/client'
import { sitemapQuery } from '@/sanity/lib/queries'
import { PAGE_ROUTES, SITE_URL } from '@/sanity/lib/routes'

interface SitemapData {
  pages: { _id: string; _updatedAt: string; noIndex?: boolean }[]
  projects: { slug: string; _updatedAt: string; featured?: boolean; noIndex?: boolean }[]
}

/**
 * The routes come from `PAGE_ROUTES`, not from the dataset: a page document
 * without a route would otherwise be advertised at a URL that 404s.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { pages, projects } = await sanityFetch<SitemapData>(sitemapQuery)
  const byId = new Map(pages.map((p) => [p._id, p]))

  const pageEntries = PAGE_ROUTES.filter((r) => !byId.get(r.id)?.noIndex).map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(byId.get(r.id)?._updatedAt ?? Date.now()),
    changeFrequency: 'monthly' as const,
    priority: r.path === '/' ? 1 : 0.8,
  }))

  const projectEntries = projects
    .filter((p) => !p.noIndex)
    .map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: new Date(p._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: p.featured ? 0.9 : 0.6,
    }))

  return [...pageEntries, ...projectEntries]
}
