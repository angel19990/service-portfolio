import type { Metadata } from 'next'
import { Prata, Inter } from 'next/font/google'
import './globals.css'
import { SITE_URL } from '@/sanity/lib/routes'
import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from '@/lib/site'

/*
 * Self-hosted through next/font: no render-blocking third-party stylesheet and
 * no FOIT on the display tier, where Prata carries every heading. The same
 * pairing as angelikaux.com, so the two sites read as one person's.
 */
const prata = Prata({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-prata',
  display: 'swap',
})

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  // One domain, defined once: `SITE_URL` already drives the sitemap, robots and
  // canonicals, and a second literal here is how a domain change misses one.
  metadataBase: new URL(SITE_URL),
  // The separator is a middle dot, not an em dash. Titles show up in a browser
  // tab, a search result and a share card, so the voice has to hold there too.
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: { type: 'website', siteName: SITE_NAME },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${prata.variable} ${inter.variable} h-full`}>
      <head>
        {/* Every image on the site is cross-origin from the Sanity CDN; the
            handshake is paid before the LCP request can start without this. */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
