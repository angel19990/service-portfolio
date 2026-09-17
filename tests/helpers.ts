import AxeBuilder from '@axe-core/playwright'
import { expect, type Page } from '@playwright/test'

export const ROUTES = [
  '/',
  '/services',
  '/services/ux-design',
  '/services/creative-video',
  '/work',
  '/work?filter=video',
  '/about',
  '/contact',
  '/contact?service=ux',
  '/work/truthful-acting',
  '/work/disney-cruise-line-concept',
  '/work/makeup-game-reel',
] as const

/** Projects with a real touch device profile. */
export const DEVICE_PROJECTS = ['iphone-se', 'iphone-15', 'pixel-7']

interface AxeNode {
  target: unknown[]
  html: string
  any?: { id: string; data?: Record<string, unknown> }[]
}

/**
 * The recorded contrast tradeoffs, as exact colour pairs: the same decision
 * angelikaux.com carries. The accent is the site's emphasis, on the wordmark,
 * the italic heading spans, the bold runs in body copy and the step numbers,
 * and at #f06b25 it does not reach AA as text on either ground it sits on.
 *
 * Exact pairs rather than "ignore color-contrast", so a *new* low-contrast
 * pairing still fails. If a token under these moves, re-run `verify:survey`
 * and re-record; do not widen the list to buy a component a colour.
 */
const ALLOWED: { fg: string; bg: string; why: string }[] = [
  { fg: '#f06b25', bg: '#f6f8fa', why: 'accent text on the ground, 2.88:1' },
  { fg: '#f06b25', bg: '#fefeff', why: 'accent text on a card surface, 3.04:1' },
  // The wordmark on the glass header, which is the ground at 90% and composites
  // differently depending on what has been scrolled under it. Only visible in
  // non-default states, once a card sits behind the bar.
  { fg: '#f06b25', bg: '#f7f9fb', why: 'accent wordmark on the glass header, 2.91:1' },
]

const allowed = (fg?: string, bg?: string) =>
  ALLOWED.some((a) => a.fg === fg?.toLowerCase() && a.bg === bg?.toLowerCase())

/**
 * Freezes every reveal in its revealed state, so nothing is ever measured
 * mid-fade.
 *
 * A stylesheet, not an attribute sweep, because reveals are two-way: the shared
 * observer re-evaluates on *any* layout change, and a late lazy image or Radix's
 * dialog scroll-lock is enough to release everything off-screen again. Setting
 * `data-revealed` by hand only wins that race until the next reflow, and losing
 * it is expensive to read — axe reports `#141312` heading text failing contrast,
 * because at that instant it genuinely is some fraction of itself over the page.
 * Overriding the rendered state cannot be raced.
 *
 * This is gotcha 22 one layer deeper. What it costs is that these specs no longer
 * prove the observer sets the attribute; `reduced-motion.spec.ts` and the eye
 * cover that.
 */
async function pinReveals(page: Page) {
  // Not cached per page: a `goto` drops the tag, and re-adding it is cheaper than
  // tracking which document is current.
  await page.addStyleTag({
    content:
      '[data-reveal]{opacity:1 !important;transform:none !important;transition:none !important}',
  })
}

export async function checkA11y(page: Page, label: string) {
  await pinReveals(page)

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  const violations = results.violations
    .map((v) => {
      if (v.id !== 'color-contrast') return v
      const nodes = (v.nodes as unknown as AxeNode[]).filter((n) => {
        const data = n.any?.find((c) => c.id === 'color-contrast')?.data as
          | { fgColor?: string; bgColor?: string }
          | undefined
        return !allowed(data?.fgColor, data?.bgColor)
      })
      return { ...v, nodes }
    })
    .filter((v) => v.nodes.length > 0)

  const summary = violations
    .map(
      (v) =>
        `${v.id} (${v.impact}) ×${v.nodes.length}\n    ${v.nodes
          .slice(0, 3)
          .map((n) => (n as unknown as AxeNode).html.slice(0, 120))
          .join('\n    ')}`,
    )
    .join('\n  ')

  expect(violations, `${label}\n  ${summary}`).toEqual([])
}

/**
 * Brings the page to its settled state before anything measures it.
 *
 * axe computes contrast from *rendered* pixels, so sampling during the entrance
 * reports a `text-muted-2` label as `#ece9e5` at 1.18:1 — a number that describes
 * a frame of an animation, not the design. Freezing the reveals first is the
 * difference between 314 violations and the real count.
 *
 * The scroll still runs after the freeze: it forces lazy images and anything else
 * that only happens once a band has been seen.
 */
export async function settle(page: Page) {
  await pinReveals(page)

  // Bounded, because this wait is best-effort and its default timeout is the
  // whole 30s test budget. A page with several videos may never reach
  // networkidle with nine workers sharing bandwidth, and nothing measured
  // below depends on a video finishing: axe reads colour, size and position.
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {})

  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
      await new Promise((r) => requestAnimationFrame(() => r(null)))
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  })

  await page.waitForTimeout(150)
}
