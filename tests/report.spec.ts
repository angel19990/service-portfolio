import AxeBuilder from '@axe-core/playwright'
import { test } from '@playwright/test'
import { ROUTES, settle } from './helpers'

/**
 * Not an assertion — a survey. Prints every violation with its foreground colour
 * so the accent allowlist can be checked against reality rather than assumed.
 * Run with `npx playwright test -g "a11y survey"`.
 */
test.describe('a11y survey', () => {
  test('all routes', async ({ page }, testInfo) => {
    test.setTimeout(300_000)
    const lines: string[] = []
    for (const route of ROUTES) {
      await page.goto(route)
      await settle(page)
      const r = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
      for (const v of r.violations) {
        for (const n of v.nodes) {
          const d = n.any?.find((c) => c.id === 'color-contrast')?.data as
            | { fgColor?: string; bgColor?: string; contrastRatio?: number }
            | undefined
          lines.push(
            `${route} | ${v.id} | ${v.impact} | ${d ? `fg=${d.fgColor} bg=${d.bgColor} ratio=${d.contrastRatio}` : ''} | ${String(n.html).replace(/\s+/g, ' ').slice(0, 110)}`,
          )
        }
      }
    }
    console.log(`\n===== ${testInfo.project.name} — ${lines.length} violation nodes =====`)
    console.log(lines.join('\n') || '  none')
  })
})
