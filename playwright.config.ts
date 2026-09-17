import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.VERIFY_PORT ?? 3210)

/**
 * Point the suite at a deployment instead of a local build:
 *
 *   VERIFY_URL=https://angelikacheng.com npm run verify
 *
 * The local web server is skipped entirely when this is set — otherwise
 * Playwright would boot a second copy of the site and test that instead.
 */
const REMOTE = process.env.VERIFY_URL

/**
 * Runs against `next start`, not `next dev`.
 *
 * Dev renders through Turbopack with HMR, dev overlays and unminified React —
 * none of which ship. An a11y or motion result from dev is a result about a
 * build the visitor never loads.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list']],
  use: {
    baseURL: REMOTE ?? `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  /**
   * Six projects, in two groups.
   *
   * The first three are **widths** — desktop Chrome resized to the three frame
   * sizes. They are what the a11y, keyboard and motion assertions run against,
   * because those are claims about layout and colour at a breakpoint and a
   * synthetic viewport is the cheapest honest way to hold one still.
   *
   * The last three are **devices** — a real mobile UA, `hasTouch`, a
   * `deviceScaleFactor` and, for the two iPhones, WebKit. Those four things are
   * what a width-only project cannot fake, and they are exactly what the mobile
   * bugs live in: `can-hover:` variants resolving the wrong way, `(hover: none)`
   * never matching, a 2x DPR asking the CDN for an image twice the size, iOS
   * Safari refusing an autoplay a headless Chromium grants. `iPhone SE` is in
   * because 375 is the narrowest frame and the one everything was drawn against;
   * `iPhone 15` because 393 is the width most people actually hold.
   */
  projects: [
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'iphone-se', use: { ...devices['iPhone SE'] } },
    { name: 'iphone-15', use: { ...devices['iPhone 15'] } },
    { name: 'pixel-7', use: { ...devices['Pixel 7'] } },
  ],
  webServer: REMOTE
    ? undefined
    : {
        command: `npx next start -p ${PORT}`,
        url: `http://localhost:${PORT}/`,
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
