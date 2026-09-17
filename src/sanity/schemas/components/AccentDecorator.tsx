import type { ReactNode } from 'react'

/**
 * The site's signature emphasis: accent colour, italic.
 * Modelled as a Portable Text *decorator* rather than an annotation because it
 * carries no data. That gives it a toolbar button and a hotkey for free.
 */
export function AccentIcon() {
  return (
    <span style={{ fontWeight: 700, fontStyle: 'italic', color: '#b4380d' }}>A</span>
  )
}

export function AccentRender(props: { children?: ReactNode }) {
  return (
    <span style={{ color: '#b4380d', fontStyle: 'italic' }}>{props.children}</span>
  )
}
