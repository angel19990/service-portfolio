import type { Metadata } from 'next'
import { Fraunces, DM_Sans } from 'next/font/google'
import './globals.css'
import { SITE_URL } from '@/sanity/lib/routes'
import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from '@/lib/site'

/*
 * Self-hosted through next/font: no render-blocking third-party stylesheet and
 * no FOIT on the display tier. Both are variable fonts with real italics, so
 * nothing on the site is synthesised.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-fraunces',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-dm-sans',
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
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} h-full`}>
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
