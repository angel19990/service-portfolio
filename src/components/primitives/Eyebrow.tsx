/**
 * Source `.eyebrow` — a 48px accent rule, a 20px gap, then uppercase 0.28em text.
 * The rule scales with the type ramp rather than staying a fixed 48px, so it
 * stays proportional to the label beside it at every width.
 */
export function Eyebrow({
  children,
  tone = 'muted',
  rule = true,
  className = '',
}: {
  children?: React.ReactNode
  tone?: 'muted' | 'accent'
  rule?: boolean
  className?: string
}) {
  if (!children) return null
  return (
    <p
      className={`flex items-center gap-5 text-eyebrow uppercase ${
        tone === 'accent' ? 'text-accent' : 'text-muted'
      } ${className}`}
    >
      {rule && <span aria-hidden className="h-px w-12 shrink-0 bg-accent" />}
      {children}
    </p>
  )
}
