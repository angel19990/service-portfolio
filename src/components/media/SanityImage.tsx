import NextImage from 'next/image'
import { urlFor, assetSize } from '@/sanity/lib/image'
import type { ImageMedia } from '@/sanity/types'

/**
 * Sanity images go through `next/image` with a Sanity loader so hotspot/crop —
 * the whole reason images live in Sanity rather than Blob — survives. A crop that
 * works at 1440 rarely works at 375.
 *
 * `fill={false}` is the "show the whole image" path: the real source dimensions
 * come out of the asset id via `assetSize`, so the image sizes itself at its own
 * ratio and the browser reserves the right box before it loads. It used to ship
 * a hardcoded 1600×1000, which is a lie for every asset that is not 8:5 — the
 * reserved box was wrong and the layout settled after load.
 */
export function SanityImage({
  value,
  sizes = '(max-width: 768px) 100vw, 50vw',
  className = '',
  priority = false,
  fill = true,
}: {
  value?: ImageMedia | null
  sizes?: string
  className?: string
  priority?: boolean
  fill?: boolean
}) {
  if (!value?.asset) return null

  const src = urlFor(value as never).width(1600).url()
  // An empty alt is a claim that the image is decorative, so it must be explicit
  // rather than a fallback for missing content.
  const alt = value.decorative ? '' : (value.alt ?? '')
  const objectFit = value.fit === 'cover' ? 'object-cover' : 'object-contain'

  if (!fill) {
    const size = assetSize(value) ?? { width: 1600, height: 1000 }
    return (
      <NextImage
        src={src}
        alt={alt}
        width={size.width}
        height={size.height}
        sizes={sizes}
        priority={priority}
        className={`h-auto w-full ${objectFit} ${className}`}
      />
    )
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`${objectFit} ${className}`}
    />
  )
}
