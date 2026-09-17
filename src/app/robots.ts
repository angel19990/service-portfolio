import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/sanity/lib/routes'

/** `/studio` and `/dev/*` are working surfaces, not pages. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/studio', '/studio/', '/dev/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
