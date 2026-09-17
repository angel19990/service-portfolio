import { Accordion, Modal, Reveal } from '@/components/interactive'
import { Eyebrow } from '@/components/primitives'
import { ProjectCard } from '@/components/work/ProjectCard'
import { ServiceCard } from '@/components/services/ServiceCard'
import { SectionSteps } from '@/components/sections/SectionSteps'
import type { ProjectCardData, ServiceCardData } from '@/sanity/types'

export const metadata = { title: 'Components', robots: { index: false } }

const box = (label: string, ratio = 'aspect-video') => (
  <div className={`${ratio} grid place-items-center rounded-lg bg-tint text-label uppercase text-muted`}>{label}</div>
)

const PROJECTS: ProjectCardData[] = [
  {
    _id: 'p1',
    title: 'Truthful Acting platform',
    slug: 'truthful-acting',
    category: 'ux',
    projectType: 'client',
    role: 'UX design and development',
    summary: 'An acting school needed one place for classes, enrollment and resources.',
  },
  {
    _id: 'p2',
    title: 'Makeup-game reel',
    slug: 'makeup-game-reel',
    category: 'video',
    projectType: 'personal',
    role: 'Concept, performance, editing',
    summary: 'A makeup routine as a game level.',
  },
  {
    _id: 'p3',
    title: 'Disney Cruise Line: Independent Concept Redesign',
    slug: 'disney-cruise-line-concept',
    category: 'ux',
    projectType: 'concept',
    role: 'UX design, prototyping',
    summary: 'A self-initiated redesign of the booking flow.',
    contextNote: 'Self-initiated side project. Not commissioned by Disney and not the official Disney Cruise Line website.',
  },
]

const SERVICE: ServiceCardData = {
  _id: 's1',
  title: 'UX & Product Design',
  key: 'ux',
  href: '/services/ux-design',
  promise: 'I help turn a product idea or a confusing flow into an understandable experience your team can evaluate and build.',
  scope: ['A focused UX review and redesign', 'A defined flow and clickable prototype'],
  deliverables: ['User flows', 'Key screens', 'Interactive prototype', 'Handoff notes'],
  cta: { label: 'Discuss a UX project', href: '/contact?service=ux', tone: 'filled' },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-gutter pb-section">
      <div className="mx-auto flex w-full max-w-content flex-col gap-band">
        <Eyebrow>{title}</Eyebrow>
        {children}
      </div>
    </section>
  )
}

/** Proof page: every interactive and card component with sample data. */
export default function ComponentsPage() {
  return (
    <main className="pt-page-top">
      <Section title="Project cards">
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p._id} project={p} index={i} />
          ))}
        </ul>
      </Section>

      <Section title="Service card">
        <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ServiceCard service={SERVICE} />
          <ServiceCard service={{ ...SERVICE, _id: 's2', key: 'video', title: 'Creative Video Production', href: '/services/creative-video', cta: { label: 'Discuss a video project', href: '/contact?service=video', tone: 'filled' } }} index={1} />
        </ul>
      </Section>

      <SectionSteps
        data={{
          eyebrow: 'Steps',
          steps: [
            { title: 'Share the brief', clientInput: 'The brief' },
            { title: 'Agree on scope', clientInput: 'Decisions' },
            { title: 'Design or produce', clientInput: 'Feedback' },
            { title: 'Review and deliver', clientInput: 'Sign-off' },
          ],
        }}
      />

      <Section title="Accordion">
        <Accordion
          ariaLabel="Sample questions"
          items={[
            { id: 'q1', title: 'How do you scope a project?', body: <p>From the brief, before any design starts.</p> },
            { id: 'q2', title: 'Can you also build it?', body: <p>As a separately defined scope.</p> },
          ]}
        />
      </Section>

      <Section title="Modal">
        <Modal title="Lightbox" eyebrow="Gallery" triggerLabel="Open the sample lightbox" triggerClassName="w-64 text-left" trigger={box('Trigger')}>
          {box('Full size', 'aspect-[3/2]')}
        </Modal>
      </Section>

      <Section title="Reveal">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {(['up', 'fade', 'left', 'right'] as const).map((v, i) => (
            <Reveal key={v} as="li" index={i} variant={v}>
              {box(v, 'aspect-square')}
            </Reveal>
          ))}
        </ul>
      </Section>
    </main>
  )
}
