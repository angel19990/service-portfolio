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
 * One project, as a card in the angelikaux.com style: the finished result
 * running edge to edge, then a muted uppercase label line, the title in the
 * display face, the role and the challenge. The context note rides along so a
 * concept is never shown without its disclaimer, on any surface.
 */
export function ProjectCard({ project, index = 0 }: { project: ProjectCardData; index?: number }) {
  const isVideo = project.category === 'video'
  const ratio = isVideo ? 'aspect-[4/5]' : 'aspect-[4/3]'
  return (
    <Reveal as="li" index={index} variant="up" data-category={project.category} className="flex">
      <Link
        href={`/work/${project.slug}`}
        className={[
          'surface-card group flex h-full w-full flex-col overflow-hidden rounded-[1.25rem] border border-white/65',
          'transform-gpu transition-[border-color,box-shadow,transform] duration-[820ms] ease-[cubic-bezier(0.19,1,0.22,1)]',
          'can-hover:hover:-translate-y-0.5 can-hover:hover:border-accent/40 can-hover:hover:shadow-[0_22px_48px_-30px_rgb(20_19_18/0.2),0_6px_16px_rgb(20_19_18/0.05)]',
        ].join(' ')}
      >
        {project.cover?.length ? (
          <Media
            value={project.cover}
            sizes="(max-width: 768px) 100vw, 45vw"
            passive
            fit="cover"
            className={`w-full overflow-hidden ${ratio} [&_img]:h-full [&_img]:object-cover [&_video]:h-full`}
          />
        ) : (
          <div className={`w-full bg-ink/[0.03] ${ratio}`} aria-hidden />
        )}

        <div className="flex flex-1 flex-col gap-2.5 p-5">
          <span className="text-label uppercase text-muted">
            {[project.client, CATEGORY_LABEL[project.category], TYPE_LABEL[project.projectType]]
              .filter(Boolean)
              .join(' · ')}
          </span>
          <span className="font-display text-h2 text-ink transition-colors duration-[820ms] ease-[cubic-bezier(0.19,1,0.22,1)] can-hover:group-hover:text-accent">
            {project.title}
          </span>
          {project.role && <span className="text-[0.9375rem] text-muted">{project.role}</span>}
          {project.summary && <span className="max-w-[52ch] text-text">{project.summary}</span>}
          {project.contextNote && (
            <span className="mt-auto border-t border-rule-soft pt-3 text-[0.875rem] text-muted">{project.contextNote}</span>
          )}
        </div>
      </Link>
    </Reveal>
  )
}
