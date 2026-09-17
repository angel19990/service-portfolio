/**
 * The route ↔ singleton mapping, in one place.
 *
 * Ids use dashes, never dots: on a public dataset Sanity treats a dotted id
 * (`page.home`) as a private namespace, like `drafts.*`, and anonymous reads
 * skip it silently.
 *
 * `page-home` renders at `/` while the rest render at their slug, so the
 * relationship is not derivable from the document alone. The Studio desk
 * (`structure.ts`), the Presentation tool (`presentation.ts`) and the sitemap
 * all read this list rather than the dataset, so a page that exists in Sanity
 * but has no route cannot silently appear anywhere.
 *
 * Dependency-free on purpose: this module is imported by the Studio config, so
 * nothing here may pull in `server-only` or the live client.
 */
export const PAGE_ROUTES = [
  { path: '/', id: 'page-home', title: 'Home' },
  { path: '/services', id: 'page-services', title: 'Services' },
  { path: '/services/ux-design', id: 'page-service-ux', title: 'Service: UX & Product Design' },
  { path: '/services/creative-video', id: 'page-service-video', title: 'Service: Creative Video' },
  { path: '/work', id: 'page-work', title: 'Work' },
  { path: '/about', id: 'page-about', title: 'About' },
  { path: '/contact', id: 'page-contact', title: 'Contact' },
] as const

export type PageId = (typeof PAGE_ROUTES)[number]['id']

/** The two service detail pages, keyed by the slug segment under `/services/`. */
export const SERVICE_ROUTES = [
  { slug: 'ux-design', id: 'page-service-ux' },
  { slug: 'creative-video', id: 'page-service-video' },
] as const

export const SITE_URL = 'https://angelikacheng.com'

/** The career portfolio lives on its own domain; the footer links there. */
export const CAREER_PORTFOLIO_URL = 'https://angelikaux.com'
