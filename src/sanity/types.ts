import type { PortableTextBlock } from '@portabletext/types'

export type { PortableTextBlock }

export interface RichHeading {
  level?: 'h1' | 'h2' | 'h3'
  lines?: PortableTextBlock[]
  collapseOnMobile?: boolean
}

export interface CtaLink {
  _key?: string
  label: string
  href: string
  tone?: 'outline' | 'filled'
  external?: boolean
}

export interface ImageMedia {
  _type: 'imageMedia'
  _key?: string
  asset?: { _ref: string }
  alt?: string
  decorative?: boolean
  caption?: string
  fit?: 'contain' | 'cover'
}

export interface VideoMedia {
  _type: 'videoMedia'
  _key?: string
  file?: { asset?: { _ref: string } }
  mp4Url?: string
  webmUrl?: string
  poster?: { asset?: { _ref: string } }
  alt: string
  aspect?: string
  controls?: boolean
  caption?: string
}

export type MediaItem = ImageMedia | VideoMedia

/** A single image-or-video field: an array holding at most one item. */
export type MediaSlot = MediaItem[]

export type ProjectCategory = 'ux' | 'video' | 'experiment'
export type ProjectType = 'client' | 'personal' | 'concept'

/** The card projection from `projectCardsQuery`. */
export interface ProjectCardData {
  _id: string
  title: string
  slug: string
  category: ProjectCategory
  projectType: ProjectType
  summary?: string
  cover?: MediaSlot
  contextNote?: string
  client?: string
  role?: string
}

export interface Decision {
  _key?: string
  title: string
  body?: PortableTextBlock[]
}

/** The full document from `projectQuery`. */
export interface ProjectDoc extends ProjectCardData {
  featured?: boolean
  order?: number
  brief?: PortableTextBlock[]
  decisions?: Decision[]
  outcomes?: string[]
  gallery?: MediaItem[]
  externalLink?: CtaLink
  year?: string
  collaborators?: string
  seo?: {
    title?: string
    description?: string
    ogImage?: { asset?: { _ref: string } }
    noIndex?: boolean
  }
}

/** The card projection from `servicesQuery`. */
export interface ServiceCardData {
  _id: string
  title: string
  key: 'ux' | 'video'
  href: string
  media?: MediaSlot
  situation?: PortableTextBlock[]
  promise?: string
  scope?: string[]
  deliverables?: string[]
  proof?: PortableTextBlock[]
  note?: PortableTextBlock[]
  cta?: CtaLink
}

export interface Step {
  _key?: string
  title: string
  body?: PortableTextBlock[]
  clientInput?: string
}

export interface FaqItem {
  _key?: string
  question: string
  answer?: PortableTextBlock[]
}
