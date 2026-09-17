'use client'

import { useEffect, useId, useRef, useState, useTransition, type FormEvent, type ReactNode } from 'react'
import { SERVICES, isServiceKey, type ContactErrors } from '@/lib/contact'

type State =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; errors?: ContactErrors; message?: string }

/**
 * The inquiry form. Every piece of surrounding copy arrives pre-rendered from
 * the server section, so no Portable Text crosses the boundary; the field
 * labels are the one thing fixed here.
 *
 * `?service=ux|video|both` preselects the service so the buttons on the service
 * cards land the visitor on a form that already knows what they want. It is
 * read from `location` after mount rather than with `useSearchParams`: that
 * hook would force a Suspense boundary whose server-rendered fallback is an
 * unhydrated copy of this form, and a fast visitor could submit it natively.
 *
 * Native `required` and `type="email"` are the first line; the API route is the
 * authority and its field errors are rendered beside the fields they name, with
 * a summary that takes focus so a keyboard or screen-reader user hears it.
 */
export function ContactForm({
  timingOptions = [],
  budgetOptions = [],
  successHeading,
  success,
  errorFallback,
  emailNote,
}: {
  timingOptions?: string[]
  budgetOptions?: string[]
  successHeading: string
  success: ReactNode
  errorFallback: ReactNode
  emailNote: ReactNode
}) {
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  // When the form mounted, for the server's time trap. A ref rather than state:
  // nothing renders from it, it just rides along with the submission.
  const startedAt = useRef(0)
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    startedAt.current = Date.now()
    const preset = new URLSearchParams(window.location.search).get('service')
    if (isServiceKey(preset)) {
      const radio = formRef.current?.querySelector<HTMLInputElement>(`input[name="service"][value="${preset}"]`)
      if (radio) radio.checked = true
    }
  }, [])

  const [state, setState] = useState<State>({ status: 'idle' })
  const [pending, startTransition] = useTransition()

  // `onSubmit` rather than a form `action`: React resets uncontrolled fields
  // after an action runs, which would wipe the visitor's brief on a validation
  // error. Native constraint validation still runs before this fires.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload = { ...Object.fromEntries(new FormData(e.currentTarget).entries()), startedAt: startedAt.current }
    startTransition(async () => {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: ContactErrors; message?: string }
        if (res.ok && json.ok) setState({ status: 'success' })
        else setState({ status: 'error', errors: json.errors, message: json.message })
      } catch {
        setState({ status: 'error' })
      }
    })
  }

  useEffect(() => {
    if (state.status === 'error') summaryRef.current?.focus()
    if (state.status === 'success') successRef.current?.focus()
  }, [state])

  if (state.status === 'success') {
    return (
      <div role="status" className="surface-tint flex flex-col gap-stack p-8 md:p-10">
        <h2 ref={successRef} tabIndex={-1} className="font-display text-title-dense text-ink focus:outline-none">
          {successHeading}
        </h2>
        <div className="flex flex-col gap-stack text-text">{success}</div>
        <div className="text-[0.9375rem] text-muted">{emailNote}</div>
      </div>
    )
  }

  const errors = state.status === 'error' ? (state.errors ?? {}) : {}
  const errorList = Object.entries(errors)
  const field = (name: keyof ContactErrors) => ({
    id: `${uid}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${uid}-${name}-error` : undefined,
  })
  const inputClass =
    'w-full rounded-md border border-rule bg-surface px-4 py-3 text-body text-ink placeholder:text-muted/70 aria-[invalid]:border-accent'
  const labelClass = 'text-[0.9375rem] font-medium text-ink'
  const fieldError = (name: keyof ContactErrors) =>
    errors[name] ? (
      <p id={`${uid}-${name}-error`} className="text-[0.875rem] text-accent">
        {errors[name]}
      </p>
    ) : null

  return (
    <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-6">
      {state.status === 'error' && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="flex flex-col gap-2 rounded-md border border-accent/40 bg-accent/5 p-4 focus:outline-none"
        >
          {errorList.length ? (
            <>
              <p className="font-medium text-ink">Please check {errorList.length === 1 ? 'one field' : `${errorList.length} fields`}:</p>
              <ul className="flex flex-col gap-1 text-[0.9375rem] text-text">
                {errorList.map(([name, message]) => (
                  <li key={name}>
                    <a href={`#${uid}-${name}`} className="underline underline-offset-2">
                      {message}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex flex-col gap-2 text-text">
              {state.message && <p className="font-medium text-ink">{state.message}</p>}
              {errorFallback}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-name`} className={labelClass}>
            Name
          </label>
          <input {...field('name')} type="text" required autoComplete="name" className={inputClass} />
          {fieldError('name')}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-email`} className={labelClass}>
            Email
          </label>
          <input {...field('email')} type="email" required autoComplete="email" className={inputClass} />
          {fieldError('email')}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${uid}-company`} className={labelClass}>
          Company or project name <span className="font-normal text-muted">(optional)</span>
        </label>
        <input {...field('company')} type="text" autoComplete="organization" className={inputClass} />
        {fieldError('company')}
      </div>

      <fieldset className="flex flex-col gap-3" aria-describedby={errors.service ? `${uid}-service-error` : undefined}>
        <legend className={labelClass}>What kind of project?</legend>
        <div className="flex flex-wrap gap-3">
          {SERVICES.map((s) => (
            <label
              key={s.value}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-rule bg-surface px-4 text-[0.9375rem] text-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-bg"
            >
              <input
                type="radio"
                name="service"
                value={s.value}
                required
                className="size-4 accent-accent"
              />
              {s.label}
            </label>
          ))}
        </div>
        {fieldError('service')}
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${uid}-brief`} className={labelClass}>
          Project goal and brief
        </label>
        <textarea
          {...field('brief')}
          required
          rows={6}
          className={inputClass}
          placeholder="What are you making, who is it for, and what should it do?"
        />
        {fieldError('brief')}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${uid}-timing`} className={labelClass}>
            Desired timing
          </label>
          {timingOptions.length ? (
            <select {...field('timing')} defaultValue="" className={inputClass}>
              <option value="">Choose one</option>
              {timingOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input {...field('timing')} type="text" className={inputClass} />
          )}
          {fieldError('timing')}
        </div>
        {budgetOptions.length > 0 && (
          <div className="flex flex-col gap-2">
            <label htmlFor={`${uid}-budget`} className={labelClass}>
              Budget range <span className="font-normal text-muted">(optional)</span>
            </label>
            <select {...field('budget')} defaultValue="" className={inputClass}>
              <option value="">Choose one</option>
              {budgetOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {fieldError('budget')}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${uid}-links`} className={labelClass}>
          Relevant links <span className="font-normal text-muted">(optional, one per line)</span>
        </label>
        <textarea {...field('links')} rows={2} className={inputClass} placeholder="https://" />
        {fieldError('links')}
      </div>

      {/* Honeypot: off-screen, unlabeled for humans, ignored by the browser's
          autofill. A filled value drops the submission silently on the server. */}
      <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center rounded-full border border-accent bg-accent px-6 py-3 text-body font-medium text-white shadow-sm transition-[background-color,transform] duration-[--duration-sm] disabled:opacity-60 can-hover:hover:-translate-y-px can-hover:hover:bg-ink can-hover:hover:border-ink"
        >
          {pending ? 'Sending' : 'Send the brief'}
        </button>
        <div className="text-[0.9375rem] text-muted">{emailNote}</div>
      </div>
    </form>
  )
}
