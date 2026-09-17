import 'server-only'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

/**
 * Server-only.
 *
 * `staging` is a private dataset, so reads need a token — an unauthenticated
 * query against it returns almost nothing *silently* rather than erroring, which
 * is indistinguishable from a failed migration. The `server-only` import makes a
 * client-component import fail at build time rather than leaking the token.
 *
 * `useCdn` is off while a token is in play: the CDN caches by URL and would serve
 * stale content straight past a revalidation.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  perspective: 'published',
})

/**
 * The build-time fetch. Anything that *renders content* uses the Live Content API
 * version in `live.ts` instead, so drafts and pushed invalidations reach it.
 *
 * This one stays for the two places that must not consult draft mode:
 * `generateStaticParams` and `sitemap.ts`. Both run where `draftMode()` and
 * `cookies()` are unavailable, and neither should ever enumerate an unpublished
 * route.
 */
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate: 60, tags: ['sanity'] },
  })
}
