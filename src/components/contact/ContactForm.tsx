'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { SERVICES, isServiceKey, validate, buildMailto, type ContactErrors } from '@/lib/contact'

type State = { status: 'idle' } | { status: 'ready'; href: string } | { status: 'error'; errors: ContactErrors }

/**
 * The inquiry form. It gathers the brief, then composes a `mailto:` and opens
 * the visitor's own mail app; nothing is sent from here and there is no server.
 *
 * Every piece of surrounding copy arrives pre-rendered from the server section,
 * so no Portable Text crosses the boundary. `?service=ux|video|both` preselects
 * the service, read from `location` after mount.
 *
 * Validation errors render beside the fields they name, with a summary that
 * takes focus so a keyboard or screen-reader user hears it.
 */
export function ContactForm({
  email,
  schedule,
  timingOptions = [],
  budgetOptions = [],
  successHeading,
  success,
  emailNote,
}: {
  email: string
  schedule?: { label: string; href: string }
  timingOptions?: string[]
  budgetOptions?: string[]
  successHeading: string
  success: ReactNode
  emailNote: ReactNode
}) {
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const readyRef = useRef<HTMLHeadingElement>(null)
  const [state, setState] = useState<State>({ status: 'idle' })

  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get('service')
    if (isServiceKey(preset)) {
      const radio = formRef.current?.querySelector<HTMLInputElement>(`input[name="service"][value="${preset}"]`)
      if (radio) radio.checked = true
    }
  }, [])

  useEffect(() => {
    if (state.status === 'error') summaryRef.current?.focus()
    if (state.status === 'ready') readyRef.current?.focus()
  }, [state])

  // `onSubmit` rather than a form `action`: React resets uncontrolled fields
  // after an action runs, which would wipe the brief on a validation error.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = validate(Object.fromEntries(new FormData(e.currentTarget).entries()))
    if (!result.ok) {
      setState({ status: 'error', errors: result.errors })
      return
    }
    const href = buildMailto(email, result.data)
    setState({ status: 'ready', href })
    window.location.href = href
  }

  if (state.status === 'ready') {
    return (
      <div role="status" className="surface-tint flex flex-col gap-stack p-8 md:p-10">
        <h2 ref={readyRef} tabIndex={-1} className="font-display text-title-dense text-ink focus:outline-none">
          {successHeading}
        </h2>
        <div className="flex flex-col gap-stack text-text">{success}</div>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={state.href}
            className="inline-flex items-center rounded-full border border-accent bg-accent px-5 py-2.5 text-body font-medium text-white transition-colors duration-[--duration-sm] can-hover:hover:bg-ink can-hover:hover:border-ink"
          >
            Open the email again
          </a>
          {schedule && (
            <a
              href={schedule.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body text-ink underline decoration-pop decoration-[2px] underline-offset-4 transition-colors can-hover:hover:text-accent"
            >
              {schedule.label}
              <span aria-hidden> ↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
        <div className="text-[0.9375rem] text-muted">{emailNote}</div>
      </div>
    )
  }

  const errors = state.status === 'error' ? state.errors : {}
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
          <label htmlFor={`${uid}-company`} className={labelClass}>
            Company or project name <span className="font-normal text-muted">(optional)</span>
          </label>
          <input {...field('company')} type="text" autoComplete="organization" className={inputClass} />
          {fieldError('company')}
        </div>
      </div>

      <fieldset className="flex flex-col gap-3" aria-describedby={errors.service ? `${uid}-service-error` : undefined}>
        <legend className={labelClass}>What kind of project?</legend>
        <div className="flex flex-wrap gap-3">
          {SERVICES.map((s) => (
            <label
              key={s.value}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-rule bg-surface px-4 text-[0.9375rem] text-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-bg"
            >
              <input type="radio" name="service" value={s.value} required className="size-4 accent-accent" />
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

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          className="inline-flex items-center rounded-full border border-accent bg-accent px-6 py-3 text-body font-medium text-white shadow-sm transition-[background-color,transform] duration-[--duration-sm] can-hover:hover:-translate-y-px can-hover:hover:bg-ink can-hover:hover:border-ink"
        >
          Open in my mail app
        </button>
        {schedule && (
          <a
            href={schedule.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-body text-ink underline decoration-pop decoration-[2px] underline-offset-4 transition-colors can-hover:hover:text-accent"
          >
            {schedule.label}
            <span aria-hidden> ↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        <div className="basis-full text-[0.9375rem] text-muted">{emailNote}</div>
      </div>
    </form>
  )
}
