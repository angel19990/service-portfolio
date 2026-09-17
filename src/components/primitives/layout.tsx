/** Hairline. `soft` is the within-group divider; the default separates groups. */
export function Rule({ soft = false, className = '' }: { soft?: boolean; className?: string }) {
  return <hr className={`border-0 h-px ${soft ? 'bg-rule-soft' : 'bg-rule'} ${className}`} />
}

/**
 * The page's horizontal rhythm. Gutter and section padding are both fluid, so
 * every band inherits the same 375→1440 ramp instead of hardcoding breakpoints.
 */
export function Band({
  children,
  id,
  className = '',
  tight = false,
}: {
  children: React.ReactNode
  id?: string
  className?: string
  tight?: boolean
}) {
  return (
    <section
      id={id}
      className={`px-gutter ${tight ? 'py-band' : 'pb-section'} ${className}`}
    >
      <div className="mx-auto w-full max-w-[90rem]">{children}</div>
    </section>
  )
}

/** Vertical stack at the section's internal rhythm. */
export function Stack({
  children,
  gap = 'block',
  className = '',
}: {
  children: React.ReactNode
  gap?: 'stack' | 'block'
  className?: string
}) {
  return (
    <div className={`flex flex-col ${gap === 'stack' ? 'gap-stack' : 'gap-band'} ${className}`}>
      {children}
    </div>
  )
}
