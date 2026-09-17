import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation'
import { PAGE_ROUTES } from './lib/routes'

/**
 * The document → route map the Presentation tool uses for "open this document's
 * page" and for the "used on N pages" list beside a document.
 */
const ROUTE_BY_ID: Record<string, { title: string; href: string }> = Object.fromEntries(
  PAGE_ROUTES.map((r) => [r.id, { title: r.title, href: r.path }]),
)

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    page: defineLocations({
      select: { id: '_id', title: 'title' },
      resolve: (doc) => {
        const route = doc?.id ? ROUTE_BY_ID[doc.id] : undefined
        if (!route) return { locations: [] }
        return { locations: [{ title: route.title, href: route.href }] }
      },
    }),

    project: defineLocations({
      select: { slug: 'slug.current', title: 'title', featured: 'featured', category: 'category' },
      resolve: (doc) => ({
        locations: [
          ...(doc?.slug ? [{ title: doc.title ?? 'Project', href: `/work/${doc.slug}` }] : []),
          { title: 'Work', href: doc?.category ? `/work?filter=${doc.category}` : '/work' },
          ...(doc?.featured ? [{ title: 'Home · selected work', href: '/' }] : []),
        ],
      }),
    }),

    service: defineLocations({
      select: { title: 'title', href: 'href' },
      resolve: (doc) => ({
        locations: [
          { title: 'Home · two ways to work together', href: '/' },
          { title: 'Services', href: '/services' },
          ...(doc?.href ? [{ title: doc.title ?? 'Service detail', href: doc.href }] : []),
        ],
      }),
    }),

    siteSettings: defineLocations({
      select: { _id: '_id' },
      resolve: () => ({
        message: 'The wordmark, email and social links appear on every route.',
        locations: [{ title: 'Home', href: '/' }],
      }),
    }),

    navigation: defineLocations({
      select: { _id: '_id' },
      resolve: () => ({
        message: 'The nav and footer links appear on every route.',
        locations: [{ title: 'Home', href: '/' }],
      }),
    }),
  },
}
