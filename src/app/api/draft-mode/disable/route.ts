import { draftMode } from 'next/headers'

/**
 * The way out of a preview session. `defineEnableDraftMode` has no counterpart,
 * and without this the only exit is clearing cookies — which matters because a
 * draft session bypasses the cache on every request and shows unpublished copy.
 *
 * Redirects home rather than returning text, so the exit lands somewhere.
 */
export async function GET(request: Request) {
  const draft = await draftMode()
  draft.disable()
  return Response.redirect(new URL('/', request.url), 307)
}
