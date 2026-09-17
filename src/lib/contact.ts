/**
 * The contact form's field spec, validation and the mailto it composes.
 *
 * There is no server: the form gathers the brief so the visitor's email arrives
 * with everything in it, then hands off to their own mail app.
 */
export const SERVICES = [
  { value: 'ux', label: 'UX & product design' },
  { value: 'video', label: 'Creative video' },
  { value: 'both', label: 'Both' },
] as const

export type ServiceKey = (typeof SERVICES)[number]['value']
export const isServiceKey = (v: unknown): v is ServiceKey => SERVICES.some((s) => s.value === v)

export interface ContactInput {
  name: string
  company?: string
  service: ServiceKey
  brief: string
  timing?: string
  budget?: string
  links?: string
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export function validate(input: Record<string, unknown>): { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors } {
  const errors: ContactErrors = {}
  const name = str(input.name)
  const company = str(input.company)
  const service = str(input.service)
  const brief = str(input.brief)
  const timing = str(input.timing)
  const budget = str(input.budget)
  const links = str(input.links)

  if (name.length < 2) errors.name = 'Please tell me your name.'
  if (!isServiceKey(service)) errors.service = 'Choose the kind of project.'
  if (brief.length < 20) errors.brief = 'A few sentences about the project helps me reply with something useful.'

  if (links) {
    const bad = links
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .find((l) => !/^https?:\/\/\S+$/.test(l))
    if (bad) errors.links = 'Links should be full URLs, one per line, starting with http:// or https://.'
  }

  if (Object.keys(errors).length) return { ok: false, errors }
  return {
    ok: true,
    data: {
      name,
      company: company || undefined,
      service: service as ServiceKey,
      brief,
      timing: timing || undefined,
      budget: budget || undefined,
      links: links || undefined,
    },
  }
}

export function serviceLabel(key: ServiceKey) {
  return SERVICES.find((s) => s.value === key)?.label ?? key
}

/** The plain-text email body. */
export function formatInquiry(d: ContactInput): string {
  return [
    `Hi Angelika,`,
    '',
    d.brief,
    '',
    `Project: ${serviceLabel(d.service)}`,
    d.company ? `Company / project: ${d.company}` : null,
    d.timing ? `Timing: ${d.timing}` : null,
    d.budget ? `Budget: ${d.budget}` : null,
    d.links ? `Links:\n${d.links}` : null,
    '',
    d.name,
  ]
    .filter((line) => line !== null)
    .join('\n')
}

/** A `mailto:` that opens the visitor's mail app with the brief filled in. */
export function buildMailto(to: string, d: ContactInput): string {
  const subject = `${serviceLabel(d.service)} project: ${d.company || d.name}`
  const params = new URLSearchParams({ subject, body: formatInquiry(d) })
  // URLSearchParams encodes spaces as "+", which mail clients read literally.
  return `mailto:${to}?${params.toString().replace(/\+/g, '%20')}`
}
