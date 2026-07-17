# Architecture

## Request and locale flow

Next.js runs a single App Router application. `src/proxy.ts` preserves public URLs while routing requests internally through `src/app/[locale]`: English has no prefix and French uses `/fr`. Locale utilities live in `src/i18n`; feature components do not infer locale from legacy router state.

## Content boundary

Sanity configuration and schemas live in `src/sanity`. Server reads go through domain repositories in `src/sanity/repositories`, which combine explicit GROQ projections, generated query-result types, normalized feature view models, cache tags, and the live-content integration. Browser-side Studio code uses the tokenless browser client. `SANITY_API_READ_TOKEN` may only be imported by modules marked `server-only`.

Published content is cached by domain tags: site settings, navigation, pages, posts, albums, and categories. Sanity sends `{_id, _type}` to the signed revalidation endpoint; the application maps types to known tags.

## Presentation boundary

Typography and theme palettes are deployment configuration in `src/config/presentation.ts`, `src/config/fonts.ts`, and `tailwind.config.js`. The application compiles one Raleway font and the fixed `light` and `mytheme` palettes. A root-head script validates the stored visitor choice, falls back to the operating-system preference, and applies the theme before paint.

Sanity remains the editorial source of truth for the site title, description, author, social links, navigation, and page content. It does not control fonts or themes. Legacy presentation fields and custom-theme documents may remain in the remote dataset for rollback, but the application and current Studio schema ignore them.

## Application features

- `src/components/Layout`: shared shell, navigation, language, and theme controls
- `src/components/Albums`: responsive galleries and keyboard-capable lightbox behaviour
- `src/features/blog`: cursor pagination and client interaction
- `src/components/PortableText`: rich content rendering
- `src/app/api`: bounded preview, revalidation, pagination, and OG interfaces

Missing content calls `notFound()` and infrastructure failures reach App Router error boundaries. Metadata, canonical alternates, robots, sitemap, Open Graph, and Twitter cards use App Router metadata APIs.

## Security boundaries

- Public Sanity project coordinates are separate from server-only tokens.
- Draft mode requires a valid Sanity preview secret and an allowlisted relative destination.
- Revalidation is POST-only, signature-verified, size-capped, schema-validated, and tag-only.
- GROQ values are passed as parameters rather than interpolated into query text.

## Validation

Vitest covers pure contracts and API security. Playwright covers public route, locale, canonical, and 404 behaviour. GitHub Actions performs locked installation, production dependency audit, formatting, lint, type checking, unit tests, build, and browser smoke tests.
