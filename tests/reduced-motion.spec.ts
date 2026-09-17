import { expect, test } from '@playwright/test'
import { ROUTES } from './helpers'

// `emulateMedia` rather than the `use` option: it applies to the page the test
// already has, so it cannot be silently dropped by a project-level override.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

/**
 * Under `prefers-reduced-motion: reduce` the site must be complete, not just
 * still. `Reveal` starts every section at `opacity: 0` and only clears it on
 * intersection; if the reduced-motion branch ever stops firing, the page
 * renders blank for exactly the users who asked for less movement.
 */
test.describe('reduced motion', () => {
  for (const route of ROUTES) {
    test(`${route} renders fully with no entrance animation`, async ({ page }) => {
      await page.goto(route)
      await page.waitForLoadState('domcontentloaded')
      await page.waitForTimeout(300)

      const state = await page.evaluate(() => {
        const els = [...document.querySelectorAll('[data-reveal]')]
        return {
          total: els.length,
          hidden: els.filter((e) => Number(getComputedStyle(e).opacity) < 0.999).length,
          transformed: els.filter((e) => {
            const t = getComputedStyle(e).transform
            return t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)'
          }).length,
        }
      })

      expect(state.hidden, `${state.hidden}/${state.total} sections invisible`).toBe(0)
      expect(state.transformed, 'sections should not be offset').toBe(0)
    })
  }

  test('nothing runs an animation', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(400)
    const moving = await page.locator('main').evaluate((root) => {
      const els = [root, ...root.querySelectorAll('*')] as HTMLElement[]
      return els.filter((e) => {
        const cs = getComputedStyle(e)
        const dur = parseFloat(cs.animationDuration) || 0
        return cs.animationName !== 'none' && dur > 0.05
      }).length
    })
    expect(moving, 'nothing should be running an animation under reduced motion').toBe(0)
  })

  test('every image has an alt attribute', async ({ page }) => {
    for (const route of ['/', '/work', '/about']) {
      await page.goto(route)
      await page.waitForTimeout(300)
      const missingAlt = await page.locator('main img:not([alt])').count()
      expect(missingAlt, `${route}: every image needs an alt attribute`).toBe(0)
    }
  })
})
