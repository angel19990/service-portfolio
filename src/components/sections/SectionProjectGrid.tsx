import { Suspense } from 'react'
import { RichText, Button } from '@/components/primitives'
import { sanityFetch } from '@/sanity/lib/live'
import { projectCardsQuery } from '@/sanity/lib/queries'
import { SectionShell } from './SectionShell'
import { ProjectCard } from '@/components/work/ProjectCard'
import { ProjectFilter } from '@/components/work/ProjectFilter'
import type { RichHeading, PortableTextBlock, CtaLink, ProjectCardData, ProjectCategory } from '@/sanity/types'

export interface SectionProjectGridData {
  id?: string
  _key?: string
  eyebrow?: string
  heading?: RichHeading
  intro?: PortableTextBlock[]
  mode?: 'featured' | 'all' | 'category' | 'curated'
  category?: ProjectCategory
  projects?: { _ref: string }[]
  limit?: number
  showFilters?: boolean
  cta?: CtaLink
}

/**
 * Project cards in one of four modes. Fetches its own rows: the section is the
 * unit of reuse, and a page should not have to know which projects it shows.
 *
 * Curated rows come back in `order` order; they are re-sorted to the editor's
 * list so a hand-picked set reads in the order it was picked.
 */
export async function SectionProjectGrid({ data, index = 0 }: { data: SectionProjectGridData; index?: number }) {
  const mode = data.mode ?? 'featured'
  const ids = mode === 'curated' ? (data.projects ?? []).map((p) => p._ref) : []
  if (mode === 'curated' && !ids.length) return null

  let projects = await sanityFetch<ProjectCardData[]>(projectCardsQuery, {
    mode,
    category: data.category ?? '',
    ids,
    limit: mode === 'curated' ? 24 : (data.limit ?? 24),
  })
  if (mode === 'curated') {
    projects = ids.map((id) => projects.find((p) => p._id === id)).filter((p): p is ProjectCardData => !!p)
  }
  if (!projects.length) return null

  const grid = (
    <ul className="project-grid grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
      {projects.map((p, i) => (
        <ProjectCard key={p._id} project={p} index={i} />
      ))}
    </ul>
  )

  return (
    <SectionShell id={data.id} eyebrow={data.eyebrow} heading={data.heading} index={index}>
      {data.intro && <RichText value={data.intro} />}
      {mode === 'all' && data.showFilters ? (
        // `useSearchParams` in the filter needs a Suspense boundary so the page
        // stays statically prerendered.
        <Suspense fallback={grid}>
          <ProjectFilter>{grid}</ProjectFilter>
        </Suspense>
      ) : (
        grid
      )}
      {data.cta && (
        <div>
          <Button cta={data.cta} />
        </div>
      )}
    </SectionShell>
  )
}
