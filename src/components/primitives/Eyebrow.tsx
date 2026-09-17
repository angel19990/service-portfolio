/**
 * A short accent rule, then uppercase tracked text. The rule scales with the
 * type ramp so it stays proportional to the label beside it at every width.
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
      className={`flex items-center gap-4 text-eyebrow uppercase ${
        tone === 'accent' ? 'text-accent' : 'text-muted'
      } ${className}`}
    >
      {rule && <span aria-hidden className="h-[3px] w-8 shrink-0 rounded-full bg-pop" />}
      {children}
    </p>
  )
}
