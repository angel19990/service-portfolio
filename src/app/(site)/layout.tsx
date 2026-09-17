import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'
import { sanityFetch, SanityLive } from '@/sanity/lib/live'
import { navigationQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import { SiteHeader, type NavItem } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { DraftBar } from '@/components/site/DraftBar'
import type { CtaLink } from '@/sanity/types'

interface Navigation {
  primary?: NavItem[]
  cta?: NavItem
  footer?: NavItem[]
}
export interface SiteSettings {
  wordmark?: string
  email?: string
  location?: string
  social?: CtaLink[]
  careerPortfolio?: CtaLink
}

/**
 * Chrome for the public routes. `/studio` and `/dev/*` sit outside the group
 * so neither inherits a nav.
 *
 * `pt-page-top` lands on the first section rather than on `main`: sections are
 * bottom-padded only, so without this the hero would start flush against the nav.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [nav, settings, { isEnabled: isDraft }] = await Promise.all([
    sanityFetch<Navigation | null>(navigationQuery),
    sanityFetch<SiteSettings | null>(siteSettingsQuery),
    draftMode(),
  ])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-body focus:text-bg"
      >
        Skip to content
      </a>

      {isDraft && <DraftBar />}

      <SiteHeader items={nav?.primary ?? []} cta={nav?.cta} wordmark={settings?.wordmark} />

      <main id="main" className="flex-1 [&>section:first-child]:pt-page-top">
        {children}
      </main>

      <SiteFooter
        items={nav?.footer ?? []}
        social={settings?.social}
        wordmark={settings?.wordmark}
        email={settings?.email}
        location={settings?.location}
        careerPortfolio={settings?.careerPortfolio}
      />

      {/* Turns a published render into a live one: how a revalidation reaches
          an open tab without a reload. */}
      <SanityLive />
      {isDraft && <VisualEditing />}
    </>
  )
}
