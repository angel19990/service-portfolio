/**
 * Seeds the starter content for angelikacheng.com.
 *
 *   npm run seed -- --dry   print the documents, write nothing
 *   npm run seed            createOrReplace every document in one transaction,
 *                           using SANITY_API_WRITE_TOKEN from .env.local
 *   npm run seed:cli        the same, authenticated as the logged-in Sanity CLI
 *                           user (`sanity exec --with-user-token`), so no token
 *                           has to be issued first
 *
 * Idempotent: every document has a fixed `_id` and every array item a
 * deterministic `_key`, so re-running replaces the same documents in place and
 * the Studio's history shows a real diff rather than a rewrite.
 *
 * Writes copy only. No media field is set anywhere, so the seeded site builds
 * and renders with zero assets; images and video are added in the Studio.
 *
 * Runs under `tsx` as CommonJS: no top-level await, and `dotenv` has to be told
 * where `.env.local` is because the project path contains a space.
 */
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { config } from 'dotenv'
import { createClient } from '@sanity/client'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
config({ path: resolve(root, '.env.local') })

const DRY = process.argv.includes('--dry')

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name} in .env.local`)
  return value
}

/* ---------- Portable Text helpers ---------- */

const key = (seed: string) => createHash('sha1').update(seed).digest('hex').slice(0, 12)

type Mark = 'accent' | 'em' | 'strong'
type Span = { _type: 'span'; _key: string; text: string; marks: string[] }
type Block = {
  _type: 'block'
  _key: string
  style: 'normal' | 'h3'
  markDefs: { _key: string; _type: 'link'; href: string; newTab: boolean }[]
  children: Span[]
  listItem?: 'bullet'
  level?: number
}

/**
 * A run is plain text, a marked span (`{ text, mark }`) or a link
 * (`{ text, href }`). A paragraph is one run or a list of them.
 */
type Run = string | { text: string; mark?: Mark; href?: string }
type Runs = Run | Run[]
function block(seed: string, runs: Runs, style: 'normal' | 'h3' = 'normal', list = false): Block {
  const items: Run[] = Array.isArray(runs) ? runs : [runs]
  const markDefs: Block['markDefs'] = []
  const children: Span[] = items.map((run, i) => {
    const spanKey = key(`${seed}:${i}`)
    if (typeof run === 'string') return { _type: 'span', _key: spanKey, text: run, marks: [] }
    if (run.href) {
      const linkKey = key(`${seed}:link:${i}`)
      markDefs.push({ _key: linkKey, _type: 'link', href: run.href, newTab: /^https?:/.test(run.href) })
      return { _type: 'span', _key: spanKey, text: run.text, marks: [linkKey] }
    }
    return { _type: 'span', _key: spanKey, text: run.text, marks: run.mark ? [run.mark] : [] }
  })
  return {
    _type: 'block',
    _key: key(seed),
    style,
    markDefs,
    children,
    ...(list ? { listItem: 'bullet', level: 1 } : {}),
  }
}

/** Body copy: one block per paragraph. */
const rich = (seed: string, paragraphs: Runs[]) =>
  paragraphs.map((p, i) => block(`${seed}:${i}`, p))

/** One-paragraph inline copy. */
const inline = (seed: string, runs: Runs) => [block(seed, runs)]

/** A heading: one block per visual line. */
const heading = (seed: string, level: 'h1' | 'h2' | 'h3', lines: Runs[], collapseOnMobile = true) => ({
  _type: 'richHeading',
  level,
  collapseOnMobile,
  lines: lines.map((l, i) => block(`${seed}:line:${i}`, l)),
})

const cta = (seed: string, label: string, href: string, tone: 'outline' | 'filled' = 'outline', external = false) => ({
  _type: 'ctaLink',
  _key: key(seed),
  label,
  href,
  tone,
  external,
})

const nav = (seed: string, label: string, href: string) => ({ _type: 'navItem', _key: key(seed), label, href })

const ref = (id: string, seed: string) => ({ _type: 'reference', _key: key(seed), _ref: id })

/* ---------- Site chrome ---------- */

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'Angelika Cheng',
  tagline: 'Thoughtful UX. Playful videos.',
  wordmark: 'Angelika Cheng',
  email: 'hello@angelikacheng.com',
  location: 'Orlando, FL',
  social: [
    cta('social:instagram', 'Instagram', 'https://www.instagram.com/angelikacheng', 'outline', true),
    cta('social:linkedin', 'LinkedIn', 'https://www.linkedin.com/in/angelika-cheng/', 'outline', true),
  ],
  scheduleLink: cta('schedule', 'Schedule a video call', 'https://calendar.app.google/YFRvgyju7D4i42ky8', 'outline', true),
  careerPortfolio: cta('career', 'Hiring for a UX role? Visit my career portfolio', 'https://angelikaux.com', 'outline', true),
  defaultSeo: {
    _type: 'seo',
    description:
      'Angelika Cheng is a product designer and creative video maker who helps businesses turn ideas into clear digital experiences and imaginative videos.',
  },
}

const navigation = {
  _id: 'navigation',
  _type: 'navigation',
  primary: [nav('nav:work', 'Work', '/work'), nav('nav:services', 'Services', '/services'), nav('nav:about', 'About', '/about')],
  cta: { _type: 'navItem', label: 'Start a project', href: '/contact' },
  footer: [nav('foot:work', 'Work', '/work'), nav('foot:services', 'Services', '/services'), nav('foot:about', 'About', '/about'), nav('foot:contact', 'Contact', '/contact')],
}

/* ---------- Services ---------- */

const serviceUx = {
  _id: 'service-ux',
  _type: 'service',
  title: 'UX & Product Design',
  key: 'ux',
  href: '/services/ux-design',
  order: 1,
  situation: inline('svc:ux:situation', 'Your team is creating or improving a digital product and needs a clearer user experience.'),
  promise:
    'I help turn a product idea or a confusing flow into an understandable experience your team can evaluate and build.',
  scope: ['A focused UX review and redesign of an existing flow', 'A defined flow designed from scratch, as a clickable prototype'],
  deliverables: ['User flows', 'Key interface screens', 'An interactive prototype', 'Handoff notes for your developers'],
  proof: inline('svc:ux:proof', [
    'See ',
    { text: 'Truthful Acting', href: '/work/truthful-acting' },
    ' for client work and ',
    { text: 'the Disney Cruise Line concept', href: '/work/disney-cruise-line-concept' },
    ' for an independent redesign.',
  ]),
  note: inline('svc:ux:note', 'Each engagement is scoped explicitly before it starts. Development is available only as a separately defined scope.'),
  cta: cta('svc:ux:cta', 'Discuss a UX project', '/contact?service=ux', 'filled'),
}

const serviceVideo = {
  _id: 'service-video',
  _type: 'service',
  title: 'Creative Video Production',
  key: 'video',
  href: '/services/creative-video',
  order: 2,
  situation: inline('svc:video:situation', 'Your brand needs an imaginative way to introduce or demonstrate a product.'),
  promise: 'I turn your product into a memorable visual concept and a finished short video, made for your channels.',
  scope: ['Concept and storyboard', 'Filming, or editing from footage you supply', 'On-camera performance', 'Motion graphics and final delivery'],
  deliverables: ['A product reel', 'A launch video', 'An animated demo, in the formats and versions we agree on'],
  proof: inline('svc:video:proof', [
    'Watch ',
    { text: 'the creative videos', href: '/work?filter=video' },
    ', each with a note on my role and the creative decisions behind it.',
  ]),
  note: inline(
    'svc:video:note',
    'This is video production for your own use. Posting to my audience is a separate arrangement.',
  ),
  cta: cta('svc:video:cta', 'Discuss a video project', '/contact?service=video', 'filled'),
}

/* ---------- Projects ---------- */

const projects = [
  {
    _id: 'project-truthful-acting',
    _type: 'project',
    title: 'Truthful Acting platform',
    slug: { _type: 'slug', current: 'truthful-acting' },
    category: 'ux',
    projectType: 'client',
    featured: true,
    order: 1,
    summary: 'An acting school needed one place for classes, enrollment and student resources that did not depend on a web developer to update.',
    client: 'Truthful Acting',
    role: 'UX design and development',
    brief: rich('proj:ta:brief', [
      'Truthful Acting runs classes and workshops for actors. Information about them lived across a dated website, social posts and email threads, so prospective students asked the same questions over and over and enrollment depended on someone replying.',
      'The brief was a platform the school could run itself: clear class pages, a straightforward path to enrol, and content the team could update without help.',
    ]),
    decisions: [
      {
        _type: 'decision',
        _key: key('proj:ta:d1'),
        title: 'Lead with the schedule, not the philosophy',
        body: rich('proj:ta:d1', ['Visitors arrive wanting to know what is running and when. The teaching approach still has its place, one level down, once the practical question is answered.']),
      },
      {
        _type: 'decision',
        _key: key('proj:ta:d2'),
        title: 'A content model the school owns',
        body: rich('proj:ta:d2', ['Every class, instructor and term is a document the team edits directly. The site reads from it, so a change on the admin side is live without a developer.']),
      },
    ],
    outcomes: ['Class and enrollment flows', 'Editable content model', 'Responsive site, designed and built'],
    externalLink: cta('proj:ta:link', 'Read the full case study on angelikaux.com', 'https://angelikaux.com/work/truthful-acting', 'outline', true),
  },
  {
    _id: 'project-disney-cruise-line-concept',
    _type: 'project',
    title: 'Disney Cruise Line: Independent Concept Redesign',
    slug: { _type: 'slug', current: 'disney-cruise-line-concept' },
    category: 'ux',
    projectType: 'concept',
    featured: true,
    order: 2,
    summary: 'A self-initiated redesign of the cruise booking flow, exploring how a family could compare sailings and choose a stateroom with less back-and-forth.',
    contextNote: 'Self-initiated side project. Not commissioned by Disney and not the official Disney Cruise Line website.',
    client: 'Independent concept',
    role: 'UX design, prototyping',
    brief: rich('proj:dcl:brief', [
      'Booking a cruise is a long comparison: dates, ships, itineraries, stateroom categories and prices all change together. This concept asks how that comparison could feel guided rather than exhausting.',
      'It is a proposed design, not a shipped product, and it is separate from any professional work for Disney.',
    ]),
    decisions: [
      {
        _type: 'decision',
        _key: key('proj:dcl:d1'),
        title: 'One comparison surface instead of a funnel',
        body: rich('proj:dcl:d1', ['Rather than committing to a date before seeing rooms, the concept keeps sailings, staterooms and price visible together so a change in one updates the others.']),
      },
    ],
    outcomes: ['Concept flows', 'Key screens', 'Clickable prototype', 'Status: concept, not commissioned'],
    externalLink: cta('proj:dcl:link', 'Read the full case study on angelikaux.com', 'https://angelikaux.com/work/dcl-booking', 'outline', true),
  },
  {
    _id: 'project-makeup-game-reel',
    _type: 'project',
    title: 'Makeup-game reel',
    slug: { _type: 'slug', current: 'makeup-game-reel' },
    category: 'video',
    projectType: 'personal',
    featured: true,
    order: 3,
    summary: 'A personal concept reel that turns a makeup routine into a game level, made to test how far a single product idea can be pushed with performance and motion.',
    client: 'Personal concept',
    role: 'Concept, performance, editing, motion graphics',
    brief: rich('proj:reel:brief', [
      'A placeholder story for the first creative-video example. Replace this brief with the real concept, the creative decisions, and the finished reel once it is uploaded in the Studio.',
    ]),
    outcomes: ['Short vertical reel', 'Concept and storyboard', 'Edit and motion graphics'],
  },
  {
    _id: 'project-interface-experiment',
    _type: 'project',
    title: 'Interface experiment: placeholder',
    slug: { _type: 'slug', current: 'interface-experiment' },
    category: 'experiment',
    projectType: 'personal',
    featured: false,
    order: 10,
    summary: 'A placeholder for an original interface concept or process breakdown. Replace the title, summary and story with a real experiment.',
    client: 'Personal project',
    role: 'Everything',
    brief: rich('proj:exp:brief', ['Replace this with the experiment itself: what was tried, what it showed, and what to try next.']),
    outcomes: ['Status: placeholder'],
  },
]

/* ---------- Pages ---------- */

const statement = (seed: string, fields: Record<string, unknown>) => ({
  _type: 'sectionStatement',
  _key: key(seed),
  ...fields,
})

const ctaSection = (seed: string, fields: Record<string, unknown>) => ({
  _type: 'sectionCta',
  _key: key(seed),
  ...fields,
})

const stepsHowAProjectWorks = (seed: string) => ({
  _type: 'sectionSteps',
  _key: key(seed),
  eyebrow: 'How a project works',
  heading: heading(`${seed}:h`, 'h2', ['Four stages, no surprises.']),
  steps: [
    {
      _type: 'step',
      _key: key(`${seed}:1`),
      title: 'Share the brief and goal',
      body: rich(`${seed}:1`, ['Tell me what you are making, who it is for, and what a good outcome looks like. A rough note is enough to start.']),
      clientInput: 'The brief, links, and any existing material',
    },
    {
      _type: 'step',
      _key: key(`${seed}:2`),
      title: 'Agree on scope, deliverables, timeline and quote',
      body: rich(`${seed}:2`, ['I come back with a proposed scope and a quote. We adjust until it fits, then confirm in writing.']),
      clientInput: 'Decisions on scope and timing',
    },
    {
      _type: 'step',
      _key: key(`${seed}:3`),
      title: 'Design or produce, with agreed review points',
      body: rich(`${seed}:3`, ['The work happens in rounds with reviews we schedule up front, so you see progress early and can steer it.']),
      clientInput: 'Feedback at each review',
    },
    {
      _type: 'step',
      _key: key(`${seed}:4`),
      title: 'Review and deliver the final work',
      body: rich(`${seed}:4`, ['A final review, then delivery in the agreed formats with notes on how to use what you have.']),
      clientInput: 'Sign-off',
    },
  ],
})

const pageHome = {
  _id: 'page-home',
  _type: 'page',
  title: 'Home',
  slug: { _type: 'slug', current: 'home' },
  sections: [
    {
      _type: 'sectionHero',
      _key: key('home:hero'),
      heading: heading('home:hero:h', 'h1', [{ text: 'Thoughtful UX.', mark: 'accent' }, 'Playful videos.']),
      body: rich('home:hero:body', [
        'I am Angelika, a product designer and creative video maker. I help businesses turn ideas into clear digital experiences and imaginative videos.',
      ]),
      ctas: [cta('home:hero:cta1', 'View my work', '/work', 'filled'), cta('home:hero:cta2', 'Start a project', '/contact')],
      mediaALabel: 'UX & product design',
      mediaBLabel: 'Creative video',
    },
    {
      _type: 'sectionProjectGrid',
      _key: key('home:work'),
      eyebrow: 'Selected work',
      heading: heading('home:work:h', 'h2', ['Recent projects.']),
      mode: 'featured',
      limit: 3,
      cta: cta('home:work:cta', 'See all work', '/work'),
    },
    {
      _type: 'sectionServiceCards',
      _key: key('home:services'),
      eyebrow: 'Two ways to work together',
      heading: heading('home:services:h', 'h2', ['Pick the one your project needs.']),
      footnote: rich('home:services:foot', [
        [
          'Need both a product experience and a video to introduce it? ',
          { text: 'Tell me about your launch.', href: '/contact?service=both' },
        ],
      ]),
    },
    stepsHowAProjectWorks('home:steps'),
    {
      _type: 'sectionProjectGrid',
      _key: key('home:experiments'),
      eyebrow: 'Original experiments',
      heading: heading('home:experiments:h', 'h2', ['Things I make to find out.']),
      intro: rich('home:experiments:intro', ['Personal reels, independent interface concepts and process breakdowns. Somewhere useful to continue from Instagram.']),
      mode: 'category',
      category: 'experiment',
      limit: 3,
      cta: cta('home:experiments:cta', 'See all experiments', '/work?filter=experiment'),
    },
    statement('home:about', {
      eyebrow: 'About',
      heading: heading('home:about:h', 'h2', ['Design, performance,', 'music and editing.']),
      body: rich('home:about:body', [
        'I came to product design by an unconventional route, and the performing and editing I do for fun shape how I work: I storyboard a flow the way I would a scene, and I cut a prototype the way I would a reel.',
      ]),
      layout: 'split',
      ctas: [cta('home:about:cta', 'More about me', '/about')],
    }),
    ctaSection('home:cta', {
      heading: heading('home:cta:h', 'h2', ['What would you like to make?']),
      ctas: [cta('home:cta:1', 'Start a project', '/contact', 'filled')],
      tone: 'ink',
      showEmail: true,
    }),
  ],
}

const pageServices = {
  _id: 'page-services',
  _type: 'page',
  title: 'Services',
  slug: { _type: 'slug', current: 'services' },
  sections: [
    statement('services:intro', {
      eyebrow: 'Work with me',
      heading: heading('services:intro:h', 'h1', ['Two offers,', 'scoped to fit.']),
      headingTier: 'title',
      body: rich('services:intro:body', [
        'UX and product design for teams making something digital, and creative video for brands that want a product introduced with imagination. Each engagement is scoped explicitly before it starts.',
      ]),
    }),
    {
      _type: 'sectionServiceCards',
      _key: key('services:cards'),
      footnote: rich('services:cards:foot', [
        [
          'Need both a product experience and a video to introduce it? ',
          { text: 'Tell me about your launch.', href: '/contact?service=both' },
        ],
      ]),
    },
    stepsHowAProjectWorks('services:steps'),
    ctaSection('services:cta', {
      heading: heading('services:cta:h', 'h2', ['Not sure which one fits?']),
      body: rich('services:cta:body', ['Describe the project and I will suggest a scope.']),
      ctas: [cta('services:cta:1', 'Start a project', '/contact', 'filled')],
      showEmail: true,
    }),
  ],
}

const faq = (seed: string, items: [string, string][]) => ({
  _type: 'sectionFaq',
  _key: key(seed),
  eyebrow: 'Questions',
  heading: heading(`${seed}:h`, 'h2', ['Before you ask.']),
  items: items.map(([question, answer], i) => ({
    _type: 'faqItem',
    _key: key(`${seed}:${i}`),
    question,
    answer: rich(`${seed}:${i}:a`, [answer]),
  })),
})

const pageServiceUx = {
  _id: 'page-service-ux',
  _type: 'page',
  title: 'UX & Product Design',
  slug: { _type: 'slug', current: 'ux-design' },
  sections: [
    statement('svcux:intro', {
      eyebrow: 'UX & Product Design',
      heading: heading('svcux:intro:h', 'h1', ['Turn a product idea', 'into an experience', 'your team can build.']),
      headingTier: 'title',
      body: rich('svcux:intro:body', [
        'For teams creating or improving a digital product who need a clearer user experience. I take a product idea or a confusing flow and turn it into something understandable that the team can evaluate, test and build.',
      ]),
      ctas: [cta('svcux:intro:cta', 'Discuss a UX project', '/contact?service=ux', 'filled')],
    }),
    {
      _type: 'sectionProjectGrid',
      _key: key('svcux:work'),
      eyebrow: 'Relevant work',
      heading: heading('svcux:work:h', 'h2', ['Examples.']),
      mode: 'curated',
      projects: [ref('project-truthful-acting', 'svcux:work:1'), ref('project-disney-cruise-line-concept', 'svcux:work:2')],
    },
    {
      _type: 'sectionDeliverables',
      _key: key('svcux:deliverables'),
      eyebrow: 'Deliverables',
      heading: heading('svcux:deliverables:h', 'h2', ['What you get.']),
      includedLabel: 'Typically included',
      included: ['User flows', 'Key interface screens', 'An interactive prototype', 'Handoff notes'],
      separateLabel: 'Scoped separately',
      separate: ['Front-end or full-stack development', 'User research recruitment and incentives', 'Ongoing design support after delivery'],
      note: rich('svcux:deliverables:note', ['Two common shapes: a focused UX review and redesign of an existing flow, or a defined flow designed from scratch with a clickable prototype. Every quote lists exactly what is included.']),
    },
    stepsHowAProjectWorks('svcux:steps'),
    faq('svcux:faq', [
      ['How do you scope a UX project?', 'We start from your brief and agree on the flows in scope, the deliverables and the number of review rounds before any design starts. That scope is what the quote is based on.'],
      ['Can you also build it?', 'Development is available only as a separately defined scope. Most projects end with a prototype and handoff notes that your developers build from.'],
      ['What do you need from us?', 'The brief, access to the current product if there is one, any research or analytics you already have, and someone who can make decisions at each review.'],
      ['How are revisions handled?', 'Review rounds are agreed up front and built into the timeline. Changes beyond them are quoted before they happen.'],
      ['What happens after I send the form?', 'I read it, reply with a few questions or a proposed scope, and we take it from there. No booking is required before we talk.'],
    ]),
    ctaSection('svcux:cta', {
      heading: heading('svcux:cta:h', 'h2', ['Have a product that needs a clearer experience?']),
      ctas: [cta('svcux:cta:1', 'Discuss a UX project', '/contact?service=ux', 'filled')],
      tone: 'ink',
      showEmail: true,
    }),
  ],
}

const pageServiceVideo = {
  _id: 'page-service-video',
  _type: 'page',
  title: 'Creative Video Production',
  slug: { _type: 'slug', current: 'creative-video' },
  sections: [
    statement('svcvid:intro', {
      eyebrow: 'Creative Video Production',
      heading: heading('svcvid:intro:h', 'h1', ['Introduce your product', 'with a video people', 'remember.']),
      headingTier: 'title',
      body: rich('svcvid:intro:body', [
        'For brands that need an imaginative way to introduce or demonstrate a product. I turn the product into a memorable visual concept and deliver a finished short video for your own channels.',
      ]),
      ctas: [cta('svcvid:intro:cta', 'Discuss a video project', '/contact?service=video', 'filled')],
    }),
    {
      _type: 'sectionProjectGrid',
      _key: key('svcvid:work'),
      eyebrow: 'Finished videos',
      heading: heading('svcvid:work:h', 'h2', ['Examples.']),
      mode: 'category',
      category: 'video',
      limit: 3,
    },
    {
      _type: 'sectionDeliverables',
      _key: key('svcvid:deliverables'),
      eyebrow: 'Deliverables',
      heading: heading('svcvid:deliverables:h', 'h2', ['What you get.']),
      includedLabel: 'Possible scope',
      included: ['Concept and storyboard', 'Filming, or editing from supplied footage', 'On-camera performance', 'Motion graphics', 'Final delivery in agreed formats and versions'],
      separateLabel: 'Not included by default',
      separate: ['Posting to my own audience', 'Paid media or distribution', 'Licensed music beyond what we agree on'],
      note: rich('svcvid:deliverables:note', ['Each project specifies which of these are included. The result is a product reel, a launch video or an animated demo, made for your use.']),
    },
    stepsHowAProjectWorks('svcvid:steps'),
    faq('svcvid:faq', [
      ['Can you work from footage we already have?', 'Yes. Supplied footage, product renders and screen recordings are all workable starting points. We agree on what you supply and what I shoot.'],
      ['Do you appear in the videos?', 'On-camera performance is part of the scope when the concept calls for it. It is listed explicitly in the quote so there is no ambiguity.'],
      ['What formats do we receive?', 'The formats and versions we agree on up front, typically a vertical cut for social and a horizontal cut for web, plus the source project if that is in scope.'],
      ['Will you post it to your audience?', 'The service is video production for your channels. Posting to my audience is a separate arrangement, if offered at all.'],
      ['What happens after I send the form?', 'I read it, reply with a few questions or a proposed concept direction, and we take it from there.'],
    ]),
    ctaSection('svcvid:cta', {
      heading: heading('svcvid:cta:h', 'h2', ['Have a product that deserves a better introduction?']),
      ctas: [cta('svcvid:cta:1', 'Discuss a video project', '/contact?service=video', 'filled')],
      tone: 'ink',
      showEmail: true,
    }),
  ],
}

const pageWork = {
  _id: 'page-work',
  _type: 'page',
  title: 'Work',
  slug: { _type: 'slug', current: 'work' },
  sections: [
    statement('work:intro', {
      eyebrow: 'Selected work',
      heading: heading('work:intro:h', 'h1', ['Products, videos', 'and experiments.']),
      headingTier: 'title',
      body: rich('work:intro:body', ['Client work, personal projects and independent concepts, each labelled as what it is. Short stories here; deeper reading on angelikaux.com where it helps.']),
    }),
    {
      _type: 'sectionProjectGrid',
      _key: key('work:grid'),
      mode: 'all',
      showFilters: true,
    },
    ctaSection('work:cta', {
      heading: heading('work:cta:h', 'h2', ['Have a similar project?']),
      ctas: [cta('work:cta:1', 'Start a project', '/contact', 'filled')],
      showEmail: true,
    }),
  ],
}

const pageAbout = {
  _id: 'page-about',
  _type: 'page',
  title: 'About',
  slug: { _type: 'slug', current: 'about' },
  sections: [
    statement('about:intro', {
      eyebrow: 'About',
      heading: heading('about:intro:h', 'h1', ['I design like a performer', 'and edit like a designer.']),
      headingTier: 'title',
      body: rich('about:intro:body', [
        'I am Angelika Cheng, a product designer and creative video maker. My path into design was not a straight line: theatre, hospitality and music came first, and each of them still shows up in the work.',
        'Performance taught me to think about an audience one moment at a time. Editing taught me that what you leave out is the design. Both are why my UX work reads as a story and my videos hold together as a system.',
      ]),
      layout: 'split',
    }),
    statement('about:perspective', {
      eyebrow: 'How I work',
      heading: heading('about:perspective:h', 'h2', ['Clear first, clever second.']),
      body: rich('about:perspective:body', [
        'Whether the deliverable is a prototype or a reel, I start with the one thing the audience needs to understand and build outward from it. Imagination goes on top of clarity, not instead of it.',
        'I work with small teams and founders directly, keep scope explicit, and show work early so it can be steered.',
      ]),
      meta: ['Product design', 'Prototyping', 'Video concept', 'Editing', 'Motion graphics', 'Performance'],
    }),
    ctaSection('about:cta', {
      heading: heading('about:cta:h', 'h2', ['Two ways to reach me.']),
      body: rich('about:cta:body', ['For a business commission, start a project here. For a UX role, the career portfolio has the full case studies and my resume.']),
      ctas: [
        cta('about:cta:1', 'Start a project', '/contact', 'filled'),
        cta('about:cta:2', 'UX career portfolio', 'https://angelikaux.com', 'outline', true),
      ],
    }),
  ],
}

const pageContact = {
  _id: 'page-contact',
  _type: 'page',
  title: 'Contact',
  slug: { _type: 'slug', current: 'contact' },
  sections: [
    {
      _type: 'sectionContactForm',
      _key: key('contact:form'),
      eyebrow: 'Start a project',
      heading: heading('contact:form:h', 'h1', ["Tell me what you'd like to make."]),
      intro: rich('contact:form:intro', ['A few lines about the project is enough to start. The form opens an email in your own mail app with everything filled in; or skip it and book a call.']),
      nextSteps: rich('contact:form:next', [
        [{ text: 'What happens next. ', mark: 'strong' }, 'I read every email myself and reply within a few business days with questions or a proposed scope. If you would rather talk first, schedule a video call.'],
      ]),
      timingOptions: ['As soon as possible', 'In the next month', 'In the next quarter', 'Not sure yet'],
      budgetOptions: ['Not sure yet', 'Under $2k', '$2k to $5k', '$5k to $10k', 'Over $10k'],
      successHeading: 'Your email is ready.',
      successBody: rich('contact:form:success', ['Your mail app should now be open with the brief filled in. Send it when it reads right, and I will reply within a few business days. If nothing opened, use the button below.']),
      emailNote: rich('contact:form:email', [['Prefer to write it yourself? Email ', { text: 'hello@angelikacheng.com', href: 'mailto:hello@angelikacheng.com' }, '.']]),
    },
    faq('contact:faq', [
      ['Do I need a full brief?', 'No. A rough description of what you are making and what you hope it does is enough. I will ask for what I need.'],
      ['Can we talk before I write anything?', 'Yes. Schedule a video call using the link on this page, or email a line or two. The form simply helps me reply with something useful the first time.'],
      ['Do you take on both UX and video for one launch?', 'Yes. Choose "Both" in the form and describe the launch; I will propose how the two fit together.'],
    ]),
  ],
}

/* ---------- Write ---------- */

const documents = [
  siteSettings,
  navigation,
  serviceUx,
  serviceVideo,
  ...projects,
  pageHome,
  pageServices,
  pageServiceUx,
  pageServiceVideo,
  pageWork,
  pageAbout,
  pageContact,
]

/** No em dashes anywhere a visitor can see (mirrors tests/copy.spec.ts). */
function assertNoEmDash(value: unknown, path = 'root') {
  if (typeof value === 'string') {
    if (value.includes('—')) throw new Error(`Em dash in ${path}: ${value}`)
    return
  }
  if (Array.isArray(value)) value.forEach((v, i) => assertNoEmDash(v, `${path}[${i}]`))
  else if (value && typeof value === 'object')
    Object.entries(value).forEach(([k, v]) => assertNoEmDash(v, `${path}.${k}`))
}

function main() {
  assertNoEmDash(documents)

  if (DRY) {
    console.log(JSON.stringify(documents, null, 2))
    console.log(`\n${documents.length} documents (dry run, nothing written)`)
    return Promise.resolve()
  }

  const client = createClient({
    projectId: requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
    dataset: requireEnv('NEXT_PUBLIC_SANITY_DATASET'),
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-09-17',
    // `||`, not `??`: the write token is an empty placeholder until one is issued.
    // SANITY_AUTH_TOKEN is what `sanity exec --with-user-token` injects.
    token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN || requireEnv('SANITY_API_WRITE_TOKEN'),
    useCdn: false,
  })

  const tx = documents.reduce((t, doc) => t.createOrReplace(doc as never), client.transaction())
  return tx.commit().then((result) => {
    console.log(`Seeded ${result.results.length} documents into ${client.config().dataset}`)
    for (const r of result.results) console.log(`  ${r.operation}  ${r.id}`)
  })
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
