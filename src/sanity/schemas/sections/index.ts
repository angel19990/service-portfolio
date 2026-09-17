export const SECTION_TYPES = [
  'sectionHero',
  'sectionStatement',
  'sectionProjectGrid',
  'sectionServiceCards',
  'sectionSteps',
  'sectionDeliverables',
  'sectionTestimonial',
  'sectionFaq',
  'sectionCta',
  'sectionContactForm',
] as const

export type SectionType = (typeof SECTION_TYPES)[number]

/** The `of[]` for every page's `sections` array. */
export const sectionMembers = SECTION_TYPES.map((type) => ({ type }))
