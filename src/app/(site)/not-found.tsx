import Link from 'next/link'

export const metadata = { title: 'Not found' }

/** Inside the route group so a missing page keeps the nav and footer. */
export default function NotFound() {
  return (
    <section className="px-gutter pb-section">
      <div className="mx-auto flex w-full max-w-content flex-col gap-stack">
        <p className="text-label uppercase text-accent">404</p>
        <h1 className="font-display text-title text-ink">This page doesn&rsquo;t exist.</h1>
        <p className="max-w-[52ch] text-text">The link may be out of date. The work is all in one place.</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            href="/work"
            className="inline-flex items-center rounded-full border border-accent bg-accent px-5 py-2.5 text-body font-medium text-white transition-colors duration-[--duration-sm] can-hover:hover:bg-ink can-hover:hover:border-ink"
          >
            See the work
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border border-ink/25 px-5 py-2.5 text-body font-medium text-ink transition-colors duration-[--duration-sm] can-hover:hover:border-accent can-hover:hover:bg-accent can-hover:hover:text-white"
          >
            Start a project
          </Link>
        </div>
      </div>
    </section>
  )
}
