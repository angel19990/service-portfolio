import type { SchemaTypeDefinition } from 'sanity'

// objects
import { richHeading } from './objects/richHeading'
import { richInline, richText } from './objects/text'
import { imageMedia, videoMedia } from './objects/media'
import { ctaLink, navItem, seo, step, faqItem, decision } from './objects/shared'

// sections
import { sectionHero } from './sections/hero'
import { sectionStatement } from './sections/statement'
import { sectionProjectGrid } from './sections/projectGrid'
import { sectionServiceCards } from './sections/serviceCards'
import { sectionSteps } from './sections/steps'
import { sectionDeliverables } from './sections/deliverables'
import { sectionTestimonial } from './sections/testimonial'
import { sectionFaq } from './sections/faq'
import { sectionCta } from './sections/cta'
import { sectionContactForm } from './sections/contactForm'

// documents
import { page } from './documents/page'
import { project } from './documents/project'
import { service } from './documents/service'
import { siteSettings, navigation } from './documents/settings'

export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  page,
  project,
  service,
  siteSettings,
  navigation,

  // sections
  sectionHero,
  sectionStatement,
  sectionProjectGrid,
  sectionServiceCards,
  sectionSteps,
  sectionDeliverables,
  sectionTestimonial,
  sectionFaq,
  sectionCta,
  sectionContactForm,

  // section members
  step,
  faqItem,
  decision,

  // shared objects
  richHeading,
  richInline,
  richText,
  imageMedia,
  videoMedia,
  ctaLink,
  navItem,
  seo,
]
