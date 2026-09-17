import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

/**
 * The Sanity webhook target.
 *
 * `<SanityLive />` already pushes invalidations to open tabs, so this is not
 * what makes an edit appear; it is what makes an edit appear to a *cold*
 * visitor. The two fetches that deliberately bypass the Live API,
 * `generateStaticParams` and `sitemap.ts`, sit on the Next data cache under the
 * `sanity` tag, and nothing else busts it. Without this, adding a project in
 * the Studio leaves `/work/<new-slug>` 404ing until the next deploy.
 *
 * `parseBody` validates the signature and waits out Content Lake's eventual
 * consistency, so a revalidation triggered here re-queries the new content
 * rather than racing it.
 *
 * Configure at sanity.io/manage → API → Webhooks:
 *   URL     https://angelikacheng.com/api/revalidate
 *   Trigger create · update · delete
 *   Filter  _type in ["page", "project", "service", "siteSettings", "navigation"]
 *   Secret  SANITY_REVALIDATE_SECRET
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET

  // Refuse rather than run unauthenticated: an open revalidation endpoint is a
  // free cache-flush button for anyone who finds the URL.
  if (!secret) {
    return NextResponse.json(
      { message: 'SANITY_REVALIDATE_SECRET is not set' },
      { status: 500 },
    )
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string; _id?: string }>(
    req,
    secret,
  )

  if (!isValidSignature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
  }
  if (!body?._type) {
    return NextResponse.json({ message: 'Bad payload' }, { status: 400 })
  }

  // Next 16 requires a cacheLife profile. `max` is stale-while-revalidate: the
  // next visitor gets the cached page and the fresh one lands behind them, which
  // is right for a portfolio. `updateTag` (immediate expiry) is Server-Action
  // only and would block this response on a re-query.
  revalidateTag('sanity', 'max')

  return NextResponse.json({
    revalidated: true,
    tag: 'sanity',
    documentType: body._type,
    documentId: body._id,
  })
}
