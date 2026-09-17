import { ImageResponse } from 'next/og'

export const alt = 'Angelika Cheng. Thoughtful UX. Playful videos.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * The share card, generated rather than screenshotted so it never goes stale.
 * Satori has no access to the site's CSS or variable fonts, so the colours are
 * restated as literals and the type falls back to a system serif.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#f6f8fa',
          color: '#141312',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, fontStyle: 'italic', color: '#f06b25' }}>Angelika Cheng</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 108, lineHeight: 1.02, letterSpacing: -2, fontStyle: 'italic', color: '#f06b25' }}>
            Thoughtful UX.
          </div>
          <div style={{ fontSize: 108, lineHeight: 1.02, letterSpacing: -2 }}>Playful videos.</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#767169', textTransform: 'uppercase', letterSpacing: 4 }}>
          <div>angelikacheng.com</div>
          <div>UX & product design · creative video</div>
        </div>
      </div>
    ),
    size,
  )
}
