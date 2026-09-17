import { Modal } from '@/components/interactive'
import { MediaItemView } from '@/components/media/Media'
import type { MediaItem } from '@/sanity/types'

/**
 * The project gallery: a grid of thumbnails, each opening a lightbox with the
 * item at full size. The thumbnail is rendered here (server) and passed to the
 * client `Modal` as the trigger's children; the trigger is Radix's own button,
 * so no `asChild` crosses the boundary.
 */
export function ProjectGallery({ items, title }: { items: MediaItem[]; title: string }) {
  if (!items.length) return null
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
      {items.map((item, i) => {
        const label = item._type === 'videoMedia' ? item.alt : item.decorative ? `Image ${i + 1}` : (item.alt ?? `Image ${i + 1}`)
        return (
          <li key={item._key ?? i}>
            <Modal
              title={label || title}
              eyebrow={title}
              triggerLabel={`Open ${label || `item ${i + 1}`} at full size`}
              triggerClassName="media-fit block w-full text-left transition-transform duration-[--duration-md] ease-[--ease-out-expo] can-hover:hover:-translate-y-0.5"
              trigger={
                <MediaItemView
                  item={item}
                  sizes="(max-width: 768px) 50vw, 30vw"
                  passive
                  fit="cover"
                  className="aspect-[4/3] w-full overflow-hidden [&_img]:h-full [&_img]:object-cover [&_video]:h-full"
                />
              }
            >
              <MediaItemView item={item} sizes="(max-width: 768px) 100vw, 1200px" className="media-fit" />
              {item.caption && <p className="mt-4 text-[0.9375rem] text-muted">{item.caption}</p>}
            </Modal>
          </li>
        )
      })}
    </ul>
  )
}
