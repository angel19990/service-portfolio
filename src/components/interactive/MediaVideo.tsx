'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Replaces the deck's video lifecycle entirely.
 *
 * The source stripped every authored `autoplay`, played only the active slide's
 * videos, and then force-kicked all of them on the first user gesture to defeat
 * autoplay blocking. On a scrolling site the equivalent is simpler and cheaper:
 * play only what is on screen, and never play at all when the user has asked for
 * reduced motion or is on a metered connection — in which case the poster the
 * source never had is the whole experience.
 */
export function MediaVideo({
  mp4Url,
  webmUrl,
  poster,
  alt,
  aspect = '16/9',
  /** Fill a parent that already has a height, instead of setting its own ratio. */
  fill = false,
  /**
   * The video is a preview inside something else that owns the click — a modal
   * trigger or a teaser link. Suppresses the tap-to-play fallback, because a
   * button inside a button (or inside an anchor) is `nested-interactive`: it is
   * unreachable by keyboard and ambiguous to a screen reader, and the enclosing
   * control already goes somewhere better.
   */
  passive = false,
  /**
   * This clip is above the fold. Fetches on mount instead of on intersection, and
   * starts playing without waiting for the observer to fire.
   *
   * `preload="none"` is right for the twenty clips below the fold and wrong for
   * the one at the top of the page: the observer cannot fire until layout is done,
   * so a hero video does not even *begin* downloading until the browser has
   * finished the work it was going to do anyway, and the reader watches a poster
   * for a couple of seconds on a band that is supposed to move.
   */
  eager = false,
  /**
   * This clip is something to watch, not something to have on.
   *
   * Every other video here is a two-to-fifteen second silent loop standing in
   * for a screenshot, and the lifecycle above is built for exactly that: muted,
   * looping, played and paused by an observer, with no way to scrub because
   * there is nothing to scrub to. A 49-second before-and-after walkthrough with
   * a music bed is the opposite kind of object — it has a beginning, and a
   * viewer who arrives at second 30 of a loop has been shown the end first.
   *
   * So this flag turns the lifecycle off rather than adding to it: native
   * controls, no loop, no autoplay, no observer, and `preload="metadata"` so
   * the poster and the duration cost nothing until somebody presses play. It is
   * also why the reduced-motion and save-data branches below do not apply — both
   * exist to stop a video moving on its own, and this one never does.
   */
  controls = false,
  fit = 'cover',
  className = '',
}: {
  mp4Url: string
  webmUrl?: string
  poster?: string
  alt: string
  aspect?: string
  fill?: boolean
  passive?: boolean
  eager?: boolean
  controls?: boolean
  fit?: 'cover' | 'contain'
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [blocked, setBlocked] = useState(false)
  const [still, setStill] = useState(false)
  /**
   * The clip's own ratio, once it is known.
   *
   * `aspect` is authored, and an authored ratio is a claim about a file that
   * nobody re-checks. Both case-study heroes were tagged `16/9` on a 886×1920
   * portrait clip, then corrected to `9/16` — closer, still not true, and the
   * 0.4615 file inside a 0.5625 box letterboxed by 22px a side. That was
   * invisible while the box was a black phone bezel and is a pair of grey bars
   * the moment it is not.
   *
   * So the authored value is demoted to a placeholder: it reserves the box
   * before the file arrives, which is what stops the layout shifting, and the
   * file overrules it the instant its metadata lands. A wrong tag now costs one
   * frame of a slightly-wrong box rather than a permanent letterbox.
   */
  const [trueRatio, setTrueRatio] = useState<string | null>(null)
  const ratio = trueRatio ?? aspect

  useEffect(() => {
    const el = ref.current
    if (!el) return

    /*
     * `onLoadedMetadata` alone loses the race it exists to win.
     *
     * The `<video>` is server-rendered, so the browser can have the file's
     * metadata before React ever attaches a listener to it — guaranteed on a warm
     * cache, and routine with `preload="auto"`. The event fired, nobody was
     * listening, and the box kept the authored ratio forever. `readyState >= 1`
     * is HAVE_METADATA: ask the element what it already knows instead of waiting
     * to be told.
     */
    if (el.readyState >= 1 && el.videoWidth && el.videoHeight) {
      setTrueRatio(`${el.videoWidth}/${el.videoHeight}`)
    }

    // A controlled clip has no lifecycle to run: it plays when it is asked to
    // and never otherwise. The ratio correction above still applies.
    if (controls) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const conn = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    const saveData = Boolean(conn?.saveData) || /^(slow-)?2g$/.test(conn?.effectiveType ?? '')

    if (reduced || saveData) {
      setStill(true)
      return
    }

    // Eager clips do not wait to be seen — they already are. The observer still
    // attaches, so scrolling past one pauses it like any other.
    if (eager) el.play().catch(() => setBlocked(true))

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => setBlocked(true))
        } else {
          el.pause()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [eager, controls])

  // Reduced motion or save-data: the poster is the content, and no video element
  // is mounted at all so nothing downloads.
  if (still && poster) {
    return (
      <img
        src={poster}
        alt={alt}
        // Same correction as the video: the poster is a frame of the clip, so its
        // own dimensions are the truth about both.
        onLoad={(e) => {
          const { naturalWidth: w, naturalHeight: h } = e.currentTarget
          if (w && h) setTrueRatio(`${w}/${h}`)
        }}
        className={`block h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
        style={fill ? undefined : { aspectRatio: ratio }}
      />
    )
  }

  return (
    <div
      className={`relative ${fill ? 'h-full w-full' : ''}`}
      style={fill ? undefined : { aspectRatio: ratio }}
    >
      <video
        ref={ref}
        onLoadedMetadata={(e) => {
          const { videoWidth: w, videoHeight: h } = e.currentTarget
          if (w && h) setTrueRatio(`${w}/${h}`)
        }}
        muted={!controls}
        loop={!controls}
        controls={controls}
        playsInline
        preload={controls ? 'metadata' : eager ? 'auto' : 'none'}
        poster={poster}
        aria-label={alt}
        className={`block h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
      >
        {webmUrl && <source src={webmUrl} type="video/webm" />}
        <source src={mp4Url} type="video/mp4" />
      </video>

      {blocked && !passive && (
        <button
          type="button"
          onClick={() => {
            ref.current?.play().then(() => setBlocked(false)).catch(() => {})
          }}
          className="absolute inset-0 grid place-items-center bg-scrim/40 text-bg"
        >
          <span className="grid size-14 place-items-center rounded-full border border-bg/70 text-xl">
            ▶
          </span>
          <span className="sr-only">Play {alt}</span>
        </button>
      )}
    </div>
  )
}
