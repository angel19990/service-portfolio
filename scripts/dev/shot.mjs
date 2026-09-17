import { chromium } from '@playwright/test'
const [,, url, out, width = '1440', full = 'full'] = process.argv
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 }, reducedMotion: 'reduce' })
await page.goto(url, { waitUntil: 'networkidle' })
await page.addStyleTag({ content: '[data-reveal]{opacity:1 !important;transform:none !important;transition:none !important}' })
await page.waitForTimeout(300)
await page.screenshot({ path: out, fullPage: full === 'full' })
await browser.close()
