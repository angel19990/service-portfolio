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
            className="inline-flex items-center rounded-full border border-accent/55 bg-[linear-gradient(180deg,rgb(240_107_37/0.95),rgb(227_97_30/0.95))] px-4 py-2.5 text-body text-ink shadow-sm transition-[transform,box-shadow] duration-[--duration-sm] can-hover:hover:-translate-y-px"
          >
            See the work
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border border-accent/55 bg-white/60 px-4 py-2.5 text-body text-ink shadow-xs transition-colors duration-[--duration-sm] can-hover:hover:border-accent can-hover:hover:bg-accent"
          >
            Start a project
          </Link>
        </div>
      </div>
    </section>
  )
}
