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
          background: '#faf7f2',
          color: '#1c1917',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, color: '#6b655d' }}>
          <div style={{ width: 18, height: 18, borderRadius: 9999, background: '#f9c74f' }} />
          angelikacheng.com
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 108, lineHeight: 1.02, letterSpacing: -2, color: '#b4380d' }}>
            Thoughtful UX.
          </div>
          <div style={{ fontSize: 108, lineHeight: 1.02, letterSpacing: -2 }}>Playful videos.</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 30, color: '#3a3632' }}>
          <div>Angelika Cheng</div>
          <div>UX & product design · creative video</div>
        </div>
      </div>
    ),
    size,
  )
}
