import { test } from '@playwright/test'
import { ROUTES, checkA11y, settle } from './helpers'

/** The default state of every route, at every width. */
test.describe('axe: default state', () => {
  for (const route of ROUTES) {
    test(`${route}`, async ({ page }, testInfo) => {
      await page.goto(route)
      await settle(page)
      await checkA11y(page, `${route} @ ${testInfo.project.name}`)
    })
  }
})

/**
 * The states a page is actually read in. A component is accessible at rest
 * almost by accident; the failures live in the state a user put it in.
 */
test.describe('axe: non-default states', () => {
  test('FAQ expanded', async ({ page }, testInfo) => {
    await page.goto('/services/ux-design')
    await settle(page)
    const header = page.locator('main button[aria-expanded="false"]').first()
    if (!(await header.count())) test.skip()
    await header.click()
    await page.waitForTimeout(500)
    await checkA11y(page, `ux-design, FAQ expanded @ ${testInfo.project.name}`)
  })

  test('work filter: second filter selected', async ({ page }, testInfo) => {
    await page.goto('/work')
    await settle(page)
    const filters = page.getByRole('navigation', { name: 'Filter projects' }).getByRole('link')
    if ((await filters.count()) < 2) test.skip()
    await filters.nth(1).click()
    await page.waitForTimeout(400)
    await checkA11y(page, `work, filter 2 @ ${testInfo.project.name}`)
  })

  test('gallery lightbox open', async ({ page }, testInfo) => {
    await page.goto('/work/truthful-acting')
    await settle(page)
    const trigger = page.locator('button[aria-haspopup="dialog"]:visible').first()
    if (!(await trigger.count())) test.skip()
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await dialog.first().waitFor({ state: 'visible' })
    await page.waitForTimeout(400)
    await checkA11y(page, `truthful-acting, lightbox open @ ${testInfo.project.name}`)
  })

  test('contact form: error state', async ({ page }, testInfo) => {
    await page.goto('/contact')
    await settle(page)
    await page.fill('input[name="name"]', 'Test Person')
    await page.getByRole('radio', { name: 'UX & product design' }).check()
    await page.fill('textarea[name="brief"]', 'too short')
    await page.click('button[type="submit"]')
    await page.locator('form [role="alert"]').waitFor()
    await checkA11y(page, `contact, error state @ ${testInfo.project.name}`)
  })

  test('contact form: ready state', async ({ page }, testInfo) => {
    await page.goto('/contact?service=video')
    await settle(page)
    await page.fill('input[name="name"]', 'Test Person')
    await page.fill('textarea[name="brief"]', 'A short launch video for a small product, for the website and social.')
    await page.click('button[type="submit"]')
    await page.locator('[role="status"]').waitFor()
    await checkA11y(page, `contact, ready state @ ${testInfo.project.name}`)
  })

  // Runs at every width: the bar is a menu button at 1440 too.
  test('nav sheet open', async ({ page }, testInfo) => {
    await page.goto('/work')
    await settle(page)
    await page.getByRole('button', { name: /open menu/i }).click()
    await page.waitForTimeout(300)
    await checkA11y(page, `work, nav sheet open @ ${testInfo.project.name}`)
  })
})
