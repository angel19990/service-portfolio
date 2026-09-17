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
/** Every project below the `lg` breakpoint, where the header collapses to a sheet. */
export const NARROW_PROJECTS = ['mobile', 'tablet', ...DEVICE_PROJECTS]

interface AxeNode {
  target: unknown[]
  html: string
  any?: { id: string; data?: Record<string, unknown> }[]
}

/**
 * Recorded contrast tradeoffs, as exact colour pairs. Empty on purpose: every
 * text colour in the palette clears AA on every ground it is used on. If a
 * pair ever lands here, it should be because the design decided to keep it,
 * not because a token moved. Suppressing the rule instead would suppress the
 * next regression too.
 */
const ALLOWED: { fg: string; bg: string; why: string }[] = []

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
