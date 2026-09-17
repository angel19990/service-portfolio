/**
 * Shown only while draft mode is on.
 *
 * A preview session bypasses the cache on every request and renders unpublished
 * copy, and the cookie outlives the tab that set it. Without a visible marker and
 * an exit, the usual failure is someone reading drafts for a week and reporting
 * that the live site is showing work that was never published.
 */
export function DraftBar() {
  return (
    <div className="sticky top-0 z-[60] flex flex-wrap items-center justify-between gap-2 bg-ink px-gutter py-2 text-label uppercase text-bg">
      <span>
        Draft preview <span className="text-accent">·</span> showing unpublished content
      </span>
      <a
        href="/api/draft-mode/disable"
        className="rounded-full border border-bg/40 px-3 py-1 transition-colors duration-[--duration-sm] can-hover:hover:border-accent can-hover:hover:text-accent"
      >
        Exit preview
      </a>
    </div>
  )
}
