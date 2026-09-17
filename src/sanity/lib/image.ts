import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

/** Honours the asset's hotspot/crop — the reason images live in Sanity rather than Blob. */
export const urlFor = (source: Image) => builder.image(source).auto('format').fit('max')

/**
 * The source dimensions, read out of the asset id.
 *
 * Sanity encodes them there — `image-<sha1>-914x820-webp` — which is the only
 * way to get an image's real ratio without dereferencing the asset document. The
 * page queries deliberately do not deref (`queries.ts` fetches `sections[]{...}`
 * whole), so this is what lets `next/image` ship a correct `width`/`height` and
 * an image render at its own ratio instead of inside a hardcoded box.
 *
 * Returns undefined for a malformed or missing ref; callers fall back to a ratio.
 */
export function assetSize(source?: { asset?: { _ref?: string } } | null) {
  const match = /-(\d+)x(\d+)-[a-z]+$/.exec(source?.asset?._ref ?? '')
  if (!match) return undefined
  const width = Number(match[1])
  const height = Number(match[2])
  return width > 0 && height > 0 ? { width, height } : undefined
}

/**
 * The CDN URL for a file asset, read out of its reference.
 *
 * Sanity encodes the id and extension there: `file-<sha1>-mp4`. Building the
 * URL by hand means the page queries can keep fetching sections whole instead
 * of dereferencing every video's asset document.
 */
export function fileUrl(source?: { asset?: { _ref?: string } } | null): string | undefined {
  const match = /^file-([a-f0-9]+)-([a-z0-9]+)$/.exec(source?.asset?._ref ?? '')
  if (!match) return undefined
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${match[1]}.${match[2]}`
}
