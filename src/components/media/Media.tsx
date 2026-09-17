import { MediaVideo } from '@/components/interactive'
import { SanityImage } from './SanityImage'
import { urlFor, fileUrl } from '@/sanity/lib/image'
import type { MediaItem, MediaSlot, ImageMedia } from '@/sanity/types'

/**
 * Renders one image or video. Server component: the video's URLs and poster are
 * resolved here and handed to the client `MediaVideo` as plain strings.
 *
 * The item sizes itself from its own dimensions rather than a fixed box, so a
 * vertical reel renders tall and a wide screen renders as a band.
 */
export function MediaItemView({
  item,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  passive = false,
  fit,
  className = 'media-fit',
}: {
  item: MediaItem
  sizes?: string
  priority?: boolean
  /** Inside a link or button: no tap-to-play control of its own. */
  passive?: boolean
  fit?: 'contain' | 'cover'
  className?: string
}) {
  if (item._type === 'videoMedia') {
    const mp4Url = item.mp4Url || fileUrl(item.file)
    if (!mp4Url) return null
    const poster = item.poster?.asset ? urlFor(item.poster as never).width(900).url() : undefined
    return (
      <>
        {/* A `<video>` poster is invisible to the preload scanner; a hero clip's
            poster is the LCP element, so it gets the same treatment `next/image`
            gives its own priority images. React hoists the tag into <head>. */}
        {priority && poster && <link rel="preload" as="image" href={poster} fetchPriority="high" />}
        <MediaVideo
          mp4Url={mp4Url}
          webmUrl={item.webmUrl}
          poster={poster}
          alt={item.alt}
          aspect={item.aspect ?? '16/9'}
          eager={priority}
          controls={item.controls}
          passive={passive}
          fit={fit ?? 'contain'}
          className={className}
        />
      </>
    )
  }
  return (
    <div className={className}>
      <SanityImage value={item as ImageMedia} sizes={sizes} priority={priority} fill={false} />
    </div>
  )
}

/** Renders a `mediaSlot` (an array of at most one item), or nothing. */
export function Media({
  value,
  ...rest
}: {
  value?: MediaSlot | null
} & Omit<Parameters<typeof MediaItemView>[0], 'item'>) {
  const item = value?.[0]
  if (!item) return null
  return <MediaItemView item={item} {...rest} />
}
