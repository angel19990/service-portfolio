import { RichText, Eyebrow, Button } from '@/components/primitives'
import { Reveal } from '@/components/interactive'
import { Media } from '@/components/media/Media'
import { SectionCta } from '@/components/sections/SectionCta'
import { ProjectGallery } from './ProjectGallery'
import { CATEGORY_LABEL, TYPE_LABEL } from './ProjectCard'
import type { ProjectDoc } from '@/sanity/types'

/**
 * The one project-story template. Finished result first, then status and
 * context, the brief, the role, the decisions, the outcomes, the gallery, and
 * the invitation. Every block is optional except the title and summary, so a
 * story can go live as a card-with-a-paragraph and grow in the Studio.
 */
export function ProjectStory({ doc }: { doc: ProjectDoc }) {
  const meta = [
    { label: 'For', value: doc.client },
    { label: 'Role', value: doc.role },
    { label: 'With', value: doc.collaborators },
    { label: 'Year', value: doc.year },
  ].filter((m) => m.value)

  const inquiry =
    doc.category === 'video'
      ? { label: 'Discuss a video project', href: '/contact?service=video' }
      : doc.category === 'ux'
        ? { label: 'Discuss a UX project', href: '/contact?service=ux' }
        : { label: 'Start a project', href: '/contact' }

  let i = 0
  return (
    <>
      <section className="px-gutter pb-band">
        <Reveal index={i++} variant="up" className="mx-auto flex w-full max-w-content flex-col gap-stack">
          <p className="text-label uppercase text-muted">
            {[doc.client, CATEGORY_LABEL[doc.category], TYPE_LABEL[doc.projectType]].filter(Boolean).join(' · ')}
          </p>
          <h1 className="max-w-[20ch] font-display text-title text-balance text-ink">{doc.title}</h1>
          {doc.summary && <p className="max-w-[62ch] text-[1.125rem] text-text md:text-[1.25rem]">{doc.summary}</p>}
          {doc.contextNote && (
            <p role="note" className="max-w-[62ch] rounded-lg border border-rule-soft bg-surface/70 px-4 py-3 text-[0.9375rem] text-muted">
              {doc.contextNote}
            </p>
          )}
          {meta.length > 0 && (
            <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-rule-soft pt-6 md:grid-cols-4">
              {meta.map((m) => (
                <div key={m.label} className="flex flex-col gap-1">
                  <dt className="text-label uppercase text-muted">{m.label}</dt>
                  <dd className="text-text">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Reveal>
      </section>

      {doc.cover?.length ? (
        <section className="px-gutter pb-section">
          <Reveal index={i++} variant="up" className="mx-auto w-full max-w-content">
            <Media value={doc.cover} sizes="(max-width: 768px) 100vw, 78rem" priority />
          </Reveal>
        </section>
      ) : null}

      {doc.brief && doc.brief.length > 0 && (
        <section className="px-gutter pb-section">
          <Reveal index={i++} variant="up" className="mx-auto grid w-full max-w-content gap-stack lg:grid-cols-[1fr_1.6fr] lg:items-start">
            <Eyebrow>The brief</Eyebrow>
            <RichText value={doc.brief} />
          </Reveal>
        </section>
      )}

      {doc.decisions && doc.decisions.length > 0 && (
        <section className="px-gutter pb-section">
          <Reveal index={i++} variant="up" className="mx-auto grid w-full max-w-content gap-stack lg:grid-cols-[1fr_1.6fr] lg:items-start">
            <Eyebrow>Decisions</Eyebrow>
            <ol className="flex flex-col gap-6">
              {doc.decisions.map((d, n) => (
                <li key={d._key ?? n} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-rule-soft pt-6 first:border-t-0 first:pt-0">
                  <span aria-hidden className="font-display text-h2 text-accent">
                    {String(n + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-display text-h2 text-ink">{d.title}</h2>
                    {d.body && <RichText value={d.body} />}
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>
      )}

      {doc.outcomes && doc.outcomes.length > 0 && (
        <section className="px-gutter pb-section">
          <Reveal index={i++} variant="up" className="mx-auto grid w-full max-w-content gap-stack lg:grid-cols-[1fr_1.6fr] lg:items-start">
            <Eyebrow>Deliverables and outcomes</Eyebrow>
            <ul className="flex flex-col gap-2.5 text-text">
              {doc.outcomes.map((o) => (
                <li key={o} className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-accent">
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      {doc.gallery && doc.gallery.length > 0 && (
        <section className="px-gutter pb-section">
          <Reveal index={i++} variant="up" className="mx-auto flex w-full max-w-content flex-col gap-stack">
            <Eyebrow>Gallery</Eyebrow>
            <ProjectGallery items={doc.gallery} title={doc.title} />
          </Reveal>
        </section>
      )}

      {doc.externalLink && (
        <section className="px-gutter pb-section">
          <Reveal index={i++} variant="up" className="mx-auto w-full max-w-content">
            <Button cta={doc.externalLink} />
          </Reveal>
        </section>
      )}

      <SectionCta
        index={i}
        data={{
          heading: {
            level: 'h2',
            lines: [
              {
                _type: 'block',
                _key: 'similar',
                style: 'normal',
                markDefs: [],
                children: [{ _type: 'span', _key: 's', text: 'Have a similar project?', marks: [] }],
              },
            ],
          },
          ctas: [{ _key: 'inquiry', label: inquiry.label, href: inquiry.href, tone: 'filled' }],
          tone: 'ink',
          showEmail: true,
        }}
      />
    </>
  )
}
