import { expect, test, type Page } from '@playwright/test'
import { ROUTES, DEVICE_PROJECTS, settle } from './helpers'

/**
 * The things that get in a phone user's way, asserted rather than eyeballed:
 * a row that scrolls the page sideways, a control too small to hit, a dialog
 * that scrolls the page behind it, a nav sheet with links below the fold.
 * These run on the device projects, where `hasTouch` is real and
 * `(hover: none)` matches.
 */
test.beforeEach(async ({}, testInfo) => {
  test.skip(!DEVICE_PROJECTS.includes(testInfo.project.name), 'device projects only')
})

/* ---------------------------------------------------------------- overflow */

test.describe('no sideways scroll', () => {
  for (const route of ROUTES) {
    test(`${route} fits its viewport`, async ({ page }) => {
      await page.goto(route)
      await settle(page)

      const report = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth
        const offenders: { tag: string; cls: string; right: number; width: number }[] = []
        for (const el of document.querySelectorAll<HTMLElement>('body *')) {
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) continue
          // A child of something that scrolls horizontally on purpose is not an
          // overflow: `.rail-x` is a rail and is supposed to run past its box.
          if (el.closest('.rail-x, [data-scroll-x]')) continue
          if (r.right > vw + 1 || r.left < -1) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: el.className?.toString().slice(0, 80) ?? '',
              right: Math.round(r.right),
              width: Math.round(r.width),
            })
          }
        }
        return { vw, scrollWidth: document.documentElement.scrollWidth, offenders: offenders.slice(0, 6) }
      })

      expect(
        report.scrollWidth,
        `${route}: page scrolls sideways.\n  ${JSON.stringify(report.offenders, null, 2)}`,
      ).toBeLessThanOrEqual(report.vw + 1)
    })
  }
})

/* ------------------------------------------------------------ tap targets */

/**
 * WCAG 2.2 AA 2.5.8 is 24x24 CSS px, with an exemption for a target inline in
 * a sentence. This measures the control and skips anchors inside a paragraph.
 */
async function undersizedTargets(page: Page, min: number) {
  return page.evaluate((minSize) => {
    const sel = 'a, button, summary, input, select, textarea, [tabindex="0"]'
    const out: { tag: string; label: string; w: number; h: number }[] = []
    for (const el of document.querySelectorAll<HTMLElement>(sel)) {
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (r.bottom < 0 || r.right < 0) continue
      // `sr-only` is a 1x1 clipped box until it takes focus.
      if (cs.clipPath !== 'none' && r.width <= 2 && r.height <= 2) continue
      // The honeypot is parked off-screen on purpose.
      if (el.closest('[aria-hidden="true"]')) continue
      // 2.5.8's inline exemption.
      if (el.tagName === 'A' && el.closest('p, li, dd, blockquote')) continue
      // A radio inside a pill-sized label: the label is the target.
      if (el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'radio' && el.closest('label')) continue
      if (r.width < minSize || r.height < minSize) {
        out.push({
          tag: el.tagName.toLowerCase(),
          label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 46),
          w: Math.round(r.width),
          h: Math.round(r.height),
        })
      }
    }
    return out
  }, min)
}

test.describe('tap targets', () => {
  for (const route of ROUTES) {
    test(`${route} has no control under 24px`, async ({ page }) => {
      await page.goto(route)
      await settle(page)
      const small = await undersizedTargets(page, 24)
      expect(small, `${route}\n  ${JSON.stringify(small, null, 2)}`).toEqual([])
    })
  }
})

/* ----------------------------------------------------------- touch affordances */

test.describe('touch', () => {
  test('the work filter rail is one row and filters on tap', async ({ page }) => {
    await page.goto('/work')
    await settle(page)

    const rail = page.getByRole('navigation', { name: 'Filter projects' })
    const links = rail.getByRole('link')
    if ((await links.count()) < 2) test.skip()

    // Side by side: every pill shares the first pill's top edge.
    const tops = await links.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)))
    expect(new Set(tops).size, `filters wrapped onto more than one row: ${tops}`).toBe(1)

    await links.nth(2).tap()
    await expect(page).toHaveURL(/filter=video/)
    await expect(page.locator('.project-grid')).toHaveAttribute('data-filter', 'video')
    const shown = await page.$$eval('.project-grid > li', (els) =>
      els.filter((e) => getComputedStyle(e).display !== 'none').map((e) => (e as HTMLElement).dataset.category),
    )
    expect(shown.every((c) => c === 'video'), `non-video cards still visible: ${shown}`).toBe(true)
  })

  /**
   * Asserted through the mechanism rather than by scrolling, because a
   * synthesised touch drag over a dialog is a coin flip. What has to be true is
   * that the body cannot scroll while the dialog is open and the dialog's own
   * body can.
   */
  test('an open lightbox scrolls itself, not the page behind it', async ({ page }) => {
    await page.goto('/work/truthful-acting')
    await settle(page)

    const trigger = page.locator('button[aria-haspopup="dialog"]:visible').first()
    if (!(await trigger.count())) test.skip()
    await trigger.scrollIntoViewIfNeeded()
    const before = await page.evaluate(() => window.scrollY)

    await trigger.tap()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    const state = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]') as HTMLElement
      const body = [...d.children].find((c) => getComputedStyle(c).overflowY === 'auto') as HTMLElement | undefined
      return {
        bodyLocked:
          getComputedStyle(document.body).overflow === 'hidden' ||
          document.body.hasAttribute('data-scroll-locked') ||
          getComputedStyle(document.body).position === 'fixed',
        hasScrollBody: Boolean(body),
        dialogBottom: Math.round(d.getBoundingClientRect().bottom),
        viewport: window.innerHeight,
        pageY: window.scrollY,
      }
    })

    expect(state.hasScrollBody, 'the dialog has no scrollable body').toBe(true)
    expect(state.bodyLocked, 'the page behind the dialog is not scroll-locked').toBe(true)
    expect(state.dialogBottom).toBeLessThanOrEqual(state.viewport + 1)
    expect(state.pageY, 'opening the dialog moved the page').toBe(before)
  })

  test('the nav sheet opens, is reachable and closes', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: /open menu/i })
    await toggle.tap()

    const sheet = page.getByRole('navigation', { name: 'Primary' }).filter({ visible: true })
    await expect(sheet).toBeVisible()
    const links = sheet.getByRole('link')
    const vh = page.viewportSize()!.height
    for (const bottom of await links.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().bottom))) {
      expect(bottom, 'a nav link sits below the fold of a scroll-locked sheet').toBeLessThanOrEqual(vh)
    }

    await page.getByRole('button', { name: /close menu/i }).tap()
    await expect(sheet).toBeHidden()
  })

  test('the header keeps the primary action on one line', async ({ page }) => {
    // Below 360px the pill is hidden and the sheet carries the link instead.
    test.skip(page.viewportSize()!.width < 360, 'pill hidden at this width')
    await page.goto('/')
    const cta = page.locator('header a[href="/contact"]').first()
    await expect(cta).toBeVisible()
    const box = await cta.boundingBox()
    expect(box!.height, 'the header button wrapped to two lines').toBeLessThan(48)
  })
})
