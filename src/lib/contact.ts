/**
 * The contact form's field spec and validation, shared by the client form and
 * the API route so both sides agree on what a valid inquiry is. No `server-only`
 * here: the client imports it for the service list and the field names.
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
  email: string
  company?: string
  service: ServiceKey
  brief: string
  timing?: string
  budget?: string
  links?: string
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export function validate(input: Record<string, unknown>): { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors } {
  const errors: ContactErrors = {}
  const name = str(input.name)
  const email = str(input.email)
  const company = str(input.company)
  const service = str(input.service)
  const brief = str(input.brief)
  const timing = str(input.timing)
  const budget = str(input.budget)
  const links = str(input.links)

  if (name.length < 2) errors.name = 'Please tell me your name.'
  else if (name.length > 120) errors.name = 'That name is a little long.'

  if (!EMAIL.test(email)) errors.email = 'Please enter an email address I can reply to.'

  if (company.length > 200) errors.company = 'Keep the company or project name under 200 characters.'

  if (!isServiceKey(service)) errors.service = 'Choose the kind of project.'

  if (brief.length < 20) errors.brief = 'A few sentences about the project helps me reply with something useful.'
  else if (brief.length > 4000) errors.brief = 'Please keep the brief under 4000 characters; we can go deeper by email.'

  if (timing.length > 200) errors.timing = 'Keep timing under 200 characters.'
  if (budget.length > 200) errors.budget = 'Keep the budget under 200 characters.'

  if (links) {
    const bad = links
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .find((l) => !/^https?:\/\/\S+$/.test(l))
    if (bad) errors.links = 'Links should be full URLs, one per line, starting with http:// or https://.'
    if (links.length > 2000) errors.links = 'Keep links under 2000 characters.'
  }

  if (Object.keys(errors).length) return { ok: false, errors }
  return {
    ok: true,
    data: {
      name,
      email,
      company: company || undefined,
      service: service as ServiceKey,
      brief,
      timing: timing || undefined,
      budget: budget || undefined,
      links: links || undefined,
    },
  }
}

/** The plain-text email body. */
export function formatInquiry(d: ContactInput): string {
  const label = SERVICES.find((s) => s.value === d.service)?.label ?? d.service
  return [
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    d.company ? `Company / project: ${d.company}` : null,
    `Service: ${label}`,
    d.timing ? `Timing: ${d.timing}` : null,
    d.budget ? `Budget: ${d.budget}` : null,
    '',
    'Brief:',
    d.brief,
    d.links ? ['', 'Links:', d.links].join('\n') : null,
  ]
    .filter((line) => line !== null)
    .join('\n')
}
