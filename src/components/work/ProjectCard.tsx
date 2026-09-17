import Link from 'next/link'
import { Reveal } from '@/components/interactive'
import { Media } from '@/components/media/Media'
import type { ProjectCardData, ProjectCategory, ProjectType } from '@/sanity/types'

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  ux: 'UX & Products',
  video: 'Creative Videos',
  experiment: 'Experiments',
}

export const TYPE_LABEL: Record<ProjectType, string> = {
  client: 'Client work',
  personal: 'Personal project',
  concept: 'Independent concept',
}

/**
 * One project, as a card: the finished result first, then the name, the two
 * labels (what kind of work, and whose it was), the role and the challenge.
 * The context note rides along so a concept is never shown without its
 * disclaimer, on any surface.
 */
export function ProjectCard({ project, index = 0 }: { project: ProjectCardData; index?: number }) {
  const isVideo = project.category === 'video'
  return (
    <Reveal as="li" index={index} variant="up" data-category={project.category} className="flex">
      <Link
        href={`/work/${project.slug}`}
        className="surface-card group flex w-full flex-col overflow-hidden transition-[transform,box-shadow] duration-[--duration-md] ease-[--ease-out-expo] can-hover:hover:-translate-y-1"
      >
        {project.cover?.length ? (
          <Media
            value={project.cover}
            sizes="(max-width: 768px) 100vw, 45vw"
            passive
            fit="cover"
            className={`w-full overflow-hidden ${isVideo ? 'aspect-[4/5]' : 'aspect-[4/3]'} [&_img]:h-full [&_img]:object-cover [&_video]:h-full`}
          />
        ) : (
          <div className={`w-full bg-tint ${isVideo ? 'aspect-[4/5]' : 'aspect-[4/3]'}`} aria-hidden />
        )}

        <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2 text-label uppercase">
            <span className={`rounded-full px-2.5 py-1 ${isVideo ? 'bg-coral text-ink' : 'bg-pop text-ink'}`}>
              {CATEGORY_LABEL[project.category]}
            </span>
            <span className="text-muted">{TYPE_LABEL[project.projectType]}</span>
          </div>
          <h3 className="font-display text-title-dense text-ink transition-colors can-hover:group-hover:text-accent">
            {project.title}
          </h3>
          {project.role && <p className="text-[0.9375rem] text-muted">{project.role}</p>}
          {project.summary && <p className="text-text">{project.summary}</p>}
          {project.contextNote && (
            <p className="mt-auto border-t border-rule-soft pt-3 text-[0.875rem] text-muted">{project.contextNote}</p>
          )}
        </div>
      </Link>
    </Reveal>
  )
}
