import { test, expect } from '@playwright/test'

/**
 * Every URL the sitemap advertises resolves, carries exactly one h1, and has
 * no em dash. The sitemap is built from `PAGE_ROUTES` plus the project slugs,
 * so this is also the check that no route was added without a document.
 */
test.describe('sitemap', () => {
  test('every advertised URL is a real page', async ({ page, request, baseURL }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'markup does not vary by viewport')
    test.setTimeout(120_000)
    const res = await request.get('/sitemap.xml')
    expect(res.ok()).toBe(true)
    const xml = await res.text()
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
    expect(paths.length).toBeGreaterThan(5)
    expect(paths).toContain('/')
    expect(paths).toContain('/services/ux-design')

    for (const path of paths) {
      const r = await page.goto(path)
      expect(r?.status(), `${path} should be 200`).toBe(200)
      await expect(page.locator('h1'), `${path} should have exactly one h1`).toHaveCount(1)
      expect((await page.content()).includes('—'), `${path} contains an em dash`).toBe(false)
    }
    void baseURL
  })
})
