import 'server-only'
import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from './live'
import { pageQuery, projectQuery } from './queries'
import { urlFor } from './image'
import type { Image } from 'sanity'
import type { ProjectDoc } from '@/sanity/types'

export interface Seo {
  title?: string
  description?: string
  ogImage?: { asset?: { _ref: string } }
  noIndex?: boolean
}

export interface SectionRef {
  _type: string
  _key?: string
}

export interface PageDoc {
  _id: string
  title: string
  slug?: { current: string }
  seo?: Seo
  sections?: SectionRef[]
}

/**
 * Pages carry fixed ids (`page-home`, `page-work`, …) rather than being looked
 * up by slug: the route knows which document it is, and a slug lookup would let
 * a typo in the Studio 404 a hardcoded route.
 *
 * `cache()` because every route calls this twice: once in `generateMetadata` and
 * once in the page body. One request, one fetch.
 */
export const loadPage = cache(async (id: string): Promise<PageDoc> => {
  const doc = await sanityFetch<PageDoc | null>(pageQuery, { id })
  if (!doc) notFound()
  return doc
})

export const loadProject = cache(async (slug: string): Promise<ProjectDoc> => {
  const doc = await sanityFetch<ProjectDoc | null>(projectQuery, { slug })
  if (!doc) notFound()
  return doc
})

/**
 * `seo` overrides, document fields fall back, and the root layout's template
 * appends " · Angelika Cheng" to whatever comes out.
 */
export function metadataFor({
  doc,
  path,
  description,
  type = 'website',
  title: titleOverride,
}: {
  doc: { title: string; seo?: Seo }
  path: string
  description?: string
  type?: 'website' | 'article'
  /** For routes whose document title is not what a share should say ("Home"). */
  title?: string
}): Metadata {
  const seo = doc.seo ?? {}
  const title = seo.title ?? titleOverride ?? doc.title
  const desc = seo.description ?? description
  /*
   * `/opengraph-image` is the generated card in `src/app/opengraph-image.tsx`.
   * Named explicitly rather than left to the file convention: a route whose
   * `generateMetadata` returns its own `openGraph` object replaces the parent's,
   * and the convention's image goes with it. `metadataBase` makes it absolute.
   */
  const { url: og, width: ogW, height: ogH } = seo.ogImage?.asset
    ? { url: urlFor(seo.ogImage as Image).width(1200).height(630).fit('crop').url(), width: 1200, height: 630 }
    : { url: '/opengraph-image', width: 1200, height: 630 }

  return {
    title,
    description: desc,
    alternates: { canonical: path },
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description: desc,
      url: path,
      type,
      images: [{ url: og, width: ogW, height: ogH, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [og],
    },
  }
}
