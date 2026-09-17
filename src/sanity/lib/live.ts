import { createClient, type QueryParams } from 'next-sanity'
import { defineLive } from 'next-sanity/live'
import { apiVersion, dataset, projectId } from '../env'

/**
 * Live Content API wiring.
 *
 * `sanityFetch` here replaces the hand-rolled one in `client.ts` for everything
 * that renders content: it resolves the perspective from draft mode, tags the
 * result for the Live API, and `<SanityLive />` in the site layout opens the
 * socket that pushes invalidations. Published pages stay statically prerendered —
 * `draftMode().isEnabled` is readable without opting a route into dynamic
 * rendering, and a draft request bypasses the cache via `__prerender_bypass`.
 *
 * The client carries a token of its own. `serverToken` covers *drafts and release
 * versions only* — published reads go through the client as configured, and
 * `staging` is private, so a token-less client returns nothing and every route
 * 404s through `notFound()`. next-sanity builds `<SanityLive />`'s browser config
 * field by field and puts `browserToken` in it, so this one stays on the server.
 *
 * The published example in the next-sanity docs omits it because their dataset is
 * public. Ours is not.
 */
const serverToken = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  token: serverToken,
})

/**
 * A **Viewer**-role token, distinct from the Editor token the migration scripts
 * use. `browserToken` is handed to the browser when a draft-mode session opens a
 * live connection, so a write token here would put dataset write access in the
 * page source of every preview.
 *
 * The server falls back to the write token because `staging` is private and an
 * unauthenticated read returns almost nothing *silently* — the site would render
 * empty rather than error. The browser gets no such fallback: without a read
 * token, draft previews outside the Presentation tool simply do not open.
 */
/*
 * `||`, not `??`. The key exists in `.env.local` as an empty placeholder until a
 * Viewer token is issued, and `??` only falls back on null/undefined — so `??`
 * hands `defineLive` an empty-string token, which authenticates as nobody. On a
 * private dataset that returns almost nothing *silently*, and every route 404s
 * through `notFound()` with no error anywhere to explain it.
 */
const readToken = process.env.SANITY_API_READ_TOKEN || undefined

const live = defineLive({
  client,
  browserToken: readToken,
  serverToken,
})

export const SanityLive = live.SanityLive

/**
 * Kept at the project's own `(query, params) => T` signature rather than
 * next-sanity's `({query}) => {data}`.
 *
 * The generic on the raw `sanityFetch` types the *query string*, not the result —
 * it exists to receive `defineQuery` typegen output, which this project does not
 * use. Passing a document type there is silently wrong, so the result is cast
 * once here instead of at ten call sites.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
): Promise<T> {
  const { data } = await live.sanityFetch({
    query,
    params,
    /*
     * Appended to the fine-grained `syncTags` Content Lake returns, not a
     * replacement for them.
     *
     * Those tags are what `<SanityLive />` invalidates, and they only reach a tab
     * that is already open. A statically prerendered page with no open tab has
     * nothing listening, so without a tag the revalidation webhook can match, an
     * edit would never reach a cold visitor. This is the shared handle both paths
     * can pull.
     */
    tags: ['sanity'],
  })
  return data as T
}
