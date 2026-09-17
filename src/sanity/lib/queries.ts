import { groq } from 'next-sanity'

/**
 * Sections are fetched whole: they are shallow, heterogeneous unions and the
 * renderer discriminates on `_type`, so the type system is the guard rather
 * than a per-type projection. The `_cacheVersion` literal is a cache-buster:
 * bump it when a query's shape changes.
 */
const CACHE = '"_cacheVersion": "2026-09-17-services"'

export const pageQuery = groq`
  *[_type == "page" && _id == $id][0]{
    _id, title, slug, seo, ${CACHE},
    sections[]{ ... }
  }
`

/** Everything a project story needs. */
export const projectQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    ${CACHE},
    _id, title, "slug": slug.current, category, projectType, featured, order,
    summary, cover, contextNote, brief, decisions, outcomes, gallery, externalLink,
    client, year, role, collaborators, seo
  }
`

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)].slug.current
`

/**
 * Card rows for sectionProjectGrid. One query, four modes, so the section
 * never has to branch on which GROQ to run:
 *   featured → featured == true
 *   category → category == $category
 *   curated  → _id in $ids (ordered by the editor's list, re-sorted client-side)
 *   all      → every project
 * `$limit` is applied after ordering; pass a large number for no limit.
 */
export const projectCardsQuery = groq`
  *[
    _type == "project" && defined(slug.current) &&
    (
      ($mode == "featured" && featured == true) ||
      ($mode == "category" && category == $category) ||
      ($mode == "curated" && _id in $ids) ||
      $mode == "all"
    )
  ] | order(order asc)[0...$limit]{
    ${CACHE},
    _id, title, "slug": slug.current, category, projectType, summary, cover, contextNote, client, role
  }
`

/** The service cards, in order; `$ids` narrows to a hand-picked pair. */
export const servicesQuery = groq`
  *[_type == "service" && (count($ids) == 0 || _id in $ids)] | order(order asc){
    ${CACHE},
    _id, title, key, href, media, situation, promise, scope, deliverables, proof, note, cta
  }
`

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`
export const navigationQuery = groq`*[_type == "navigation"][0]`

/**
 * Sitemap input. `noIndex` comes along so a page hidden from search is also
 * absent from the sitemap.
 */
export const sitemapQuery = groq`{
  "pages": *[_type == "page" && !(_id in path("drafts.**"))]{
    _id, _updatedAt, "noIndex": seo.noIndex
  },
  "projects": *[_type == "project" && defined(slug.current) && !(_id in path("drafts.**"))]{
    "slug": slug.current, _updatedAt, featured, "noIndex": seo.noIndex
  }
}`
