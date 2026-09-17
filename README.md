# angelikacheng.com

Angelika Cheng's creative brand and services site: UX & product design and creative video production, with selected work, original experiments, and a project inquiry form.

The detailed UX career portfolio for hiring managers lives separately at [angelikaux.com](https://angelikaux.com); this site links to it from the footer.

## Stack

- **Next.js 16** (App Router, React 19) with **Tailwind v4** design tokens in `src/app/globals.css`
- **Sanity 6** for content, embedded Studio at `/studio`, live content via `next-sanity`, draft preview through the Presentation tool
- **Resend** for the contact form (`/api/contact`)
- **Playwright + axe** for accessibility, keyboard, mobile, reduced-motion and copy checks

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

### Environment variables (`.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project id |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | API date, e.g. `2026-09-17` |
| `SANITY_API_WRITE_TOKEN` | Editor token: used by `npm run seed` and server reads of drafts |
| `SANITY_API_READ_TOKEN` | Viewer token: handed to the browser for draft-mode live preview |
| `SANITY_REVALIDATE_SECRET` | Shared secret for the Sanity → `/api/revalidate` webhook |
| `RESEND_API_KEY` | Resend API key for the contact form |
| `CONTACT_TO` | Inbox that receives inquiries (defaults to `hello@angelikacheng.com`) |
| `CONTACT_FROM` | Sender. Use `onboarding@resend.dev` until the domain is verified in Resend |
| `CONTACT_DRY_RUN` | Set to `1` to log submissions instead of sending (used by the test suite) |

The dataset is public, so the site renders without tokens. Tokens are only needed for seeding, draft preview and the revalidate webhook.

## Content

Pages are Sanity singletons with fixed ids (`page-home`, `page-services`, `page-service-ux`, `page-service-video`, `page-work`, `page-about`, `page-contact`) built from a small set of sections. Projects (`project`) and the two services (`service-ux`, `service-video`) are separate documents.

```bash
npm run seed -- --dry   # print the starter documents
npm run seed            # write them with SANITY_API_WRITE_TOKEN (idempotent)
npm run seed:cli        # the same, authenticated as the logged-in `sanity` CLI user
```

The seed writes copy only. Add images and video in the Studio afterward.

## Verify

```bash
npm run build && npm run verify        # production build + Playwright suite across 6 viewports
npm run verify:survey                  # non-asserting a11y survey printout
VERIFY_URL=https://angelikacheng.com npm run verify   # against a deployment
```

## Deploy

1. `vercel link` to a new Vercel project and add the env vars above (Production + Preview).
2. Add `angelikacheng.com` (and a `www` redirect) as the domain.
3. In Sanity: add the production and preview origins under CORS (with credentials), and create a webhook to `https://angelikacheng.com/api/revalidate` for `_type in ["page", "project", "service", "siteSettings", "navigation"]` using `SANITY_REVALIDATE_SECRET`.
4. In Resend: verify the domain, then set `CONTACT_FROM` to an address on it.

## Conventions

- No em dashes in visible copy (enforced by `tests/copy.spec.ts`).
- Exactly one `h1` per page (enforced by the `page` schema).
- Every image needs `alt` unless marked decorative; every video needs a poster.
- Client components take pre-rendered `ReactNode`s and plain data; no Portable Text or Sanity types cross the boundary.
- Never import `sanity.config` from a Server Component.
