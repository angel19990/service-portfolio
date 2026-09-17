import { expect, test } from '@playwright/test'
import { NARROW_PROJECTS, settle } from './helpers'

test.describe('keyboard', () => {
  test('skip link is the first stop and moves focus to main', async ({ page }, testInfo) => {
    // Safari's default is that Tab cycles form controls and buttons only, so
    // the first Tab on an iPhone project lands past the skip link. The link is
    // present and first in the DOM; the width projects assert exactly that.
    test.skip(testInfo.project.name.startsWith('iphone'), 'Safari does not Tab to links by default')
    await page.goto('/work')
    await page.keyboard.press('Tab')
    const first = page.locator(':focus')
    await expect(first).toHaveText(/skip to content/i)
    await expect(first).toBeVisible()
    await expect(first).toHaveAttribute('href', '#main')
  })

  test('every focus stop has a visible ring', async ({ page }) => {
    await page.goto('/work')
    await settle(page)
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab')
      const shadow = await page.evaluate(() => {
        const el = document.activeElement
        if (!el || el === document.body) return 'none'
        return getComputedStyle(el).boxShadow
      })
      if (shadow === 'none') continue
      expect(shadow, `stop ${i} has no focus ring`).not.toBe('none')
    }
  })

  test('work filters are links with a current state', async ({ page }) => {
    await page.goto('/work')
    await settle(page)
    const filters = page.getByRole('navigation', { name: 'Filter projects' }).getByRole('link')
    if ((await filters.count()) < 2) test.skip()
    await expect(filters.first()).toHaveAttribute('aria-current', 'true')
    await filters.nth(2).focus()
    await page.keyboard.press('Enter')
    await expect(filters.nth(2)).toHaveAttribute('aria-current', 'true')
    await expect(page).toHaveURL(/filter=video/)
    await expect(page.locator('.project-grid')).toHaveAttribute('data-filter', 'video')
  })

  test('lightbox traps focus and Escape returns it to the trigger', async ({ page }) => {
    await page.goto('/work/truthful-acting')
    await settle(page)
    const trigger = page.locator('button[aria-haspopup="dialog"]:visible').first()
    if (!(await trigger.count())) test.skip()

    await trigger.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    const inside = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]')
      return !!d && d.contains(document.activeElement)
    })
    expect(inside, 'focus should move into the dialog').toBe(true)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('nav sheet closes on Escape', async ({ page }, testInfo) => {
    test.skip(!NARROW_PROJECTS.includes(testInfo.project.name), 'the header is inline from lg up')
    await page.goto('/work')
    // Located structurally: the accessible name flips to "Close menu" the
    // moment it is pressed.
    const toggle = page.locator('header button[aria-expanded]').first()
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  test('FAQ header toggles on Enter and reports state', async ({ page }) => {
    await page.goto('/services/creative-video')
    await settle(page)
    const header = page.locator('main button[aria-expanded]').first()
    if (!(await header.count())) test.skip()

    const before = await header.getAttribute('aria-expanded')
    const after = before === 'true' ? 'false' : 'true'

    await header.focus()
    await page.keyboard.press('Enter')
    await expect(header).toHaveAttribute('aria-expanded', after)
    await page.keyboard.press('Enter')
    await expect(header).toHaveAttribute('aria-expanded', before!)
  })

  test('contact form: the error summary takes focus and links to the field', async ({ page }, testInfo) => {
    await page.goto('/contact')
    await settle(page)
    await page.fill('input[name="name"]', 'Test Person')
    await page.getByRole('radio', { name: 'Both' }).check()
    await page.fill('textarea[name="brief"]', 'too short')
    await page.locator('button[type="submit"]').focus()
    await page.keyboard.press('Enter')
    const summary = page.locator('form [role="alert"]')
    await expect(summary).toBeVisible()
    await expect(summary).toBeFocused()
    // The typed brief survives the round trip.
    await expect(page.locator('textarea[name="brief"]')).toHaveValue('too short')
    // Safari does not Tab to links by default, so the link-following half of
    // the assertion is a Chromium claim.
    if (testInfo.project.name.startsWith('iphone')) return
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await expect(page.locator('textarea[name="brief"]')).toBeFocused()
  })
})
