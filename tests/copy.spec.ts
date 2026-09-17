import { test, expect } from '@playwright/test'
import { ROUTES } from './helpers'

/**
 * The em dash is out, everywhere a visitor can meet one. Copy lives in three
 * places in this project (Sanity, metadata constants, component strings) so
 * the check has to be on the rendered page.
 *
 * One project only: the HTML does not vary by viewport.
 */
test.describe('copy', () => {
  for (const route of ROUTES) {
    test(`no em dash reaches ${route}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'markup does not vary by viewport')
      await page.goto(route)
      const html = await page.content()
      const found = [...html.matchAll(/.{0,60}—.{0,60}/g)].map((m) => m[0])
      expect(found, `${route}\n  ${found.join('\n  ')}`).toEqual([])
    })
  }
})
