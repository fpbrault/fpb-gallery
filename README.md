# fpb-gallery

A bilingual photography portfolio built with Next.js App Router and Sanity. English URLs are unprefixed; French URLs use `/fr`. The Sanity Studio is embedded at `/studio` and supports authenticated draft-mode visual editing.

## Requirements

- Node.js 22 or newer
- npm
- A Sanity project and dataset

## Local setup

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Fill in every required value in `.env.local`, then open [http://localhost:3000](http://localhost:3000). Studio is at `/studio`.

## Environment variables

| Variable                         | Visibility  | Purpose                                                 |
| -------------------------------- | ----------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | Public      | Sanity project ID                                       |
| `NEXT_PUBLIC_SANITY_DATASET`     | Public      | Sanity dataset name                                     |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Public      | Pinned API version                                      |
| `NEXT_PUBLIC_SANITY_USE_CDN`     | Public      | Use the Sanity CDN for published reads                  |
| `NEXT_PUBLIC_SITE_URL`           | Public      | One canonical site origin for metadata and sitemap URLs |
| `SANITY_API_READ_TOKEN`          | Server only | Viewer token for draft mode and visual editing          |
| `SANITY_WEBHOOK_SECRET`          | Server only | Secret used to verify Sanity revalidation webhooks      |

Never expose either server-only secret through a `NEXT_PUBLIC_` variable. Rotate the read token after deploying the security cutover.

## Sanity authoring and publishing

The Presentation tool opens the site through `GET /api/preview`. Sanity creates and validates the short-lived preview secret; the application additionally allowlists the destination before enabling draft mode. The read token stays on the server.

Configure a Sanity webhook to send `POST /api/revalidate` with this projection:

```groq
{_id, _type}
```

Enable webhook signature authentication and use the same value as `SANITY_WEBHOOK_SECRET`. The endpoint rejects unsigned requests, unknown document types, malformed payloads, and bodies over 16 KiB. Publishing invalidates known cache tags; callers cannot submit arbitrary paths.

## Localization and routes

`src/proxy.ts` internally rewrites unprefixed routes to the `en` App Router segment. French remains publicly prefixed with `/fr`; `/en/...` redirects to the canonical unprefixed equivalent. Public gallery, album, category, blog, custom page, preview, Studio, and metadata URLs are preserved.

## Quality commands

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:run
npm run test:e2e
npm run build
npm audit --omit=dev --audit-level=high
```

Generate schema-derived Sanity types with `npm run sanity:schema && npm run sanity:typegen` after schema changes.

## Deployment

Vercel is the production target. Configure all required variables for Preview and Production, deploy a Preview, run the Playwright suite against it with `PLAYWRIGHT_BASE_URL`, and verify the Sanity Presentation and webhook flows before promoting it. Keep the prior production deployment available as the rollback target.

See [ARCHITECTURE.md](ARCHITECTURE.md) for system boundaries and [CONTRIBUTING.md](CONTRIBUTING.md) for the change workflow.
