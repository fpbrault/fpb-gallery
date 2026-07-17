# Modernization follow-up

This backlog tracks work discovered after the App Router cutover. Preserve public URLs, bilingual behavior, content, Studio authoring, and the existing visual design throughout.

## Active slice: typed content pipeline

- [x] Replace generic query casting in `src/sanity/data.ts` with generated Sanity query-result types.
- [x] Split content access into domain modules for site shell, albums, blog, and pages.
- [x] Define explicit, normalized view models at the application boundary.
- [x] Add defensive mapping for nullable or legacy Sanity fields without hiding infrastructure failures.
- [x] Delete the duplicate hand-maintained Sanity transport types after consumers use domain view models.
- [x] Add unit tests for domain mapping and legacy fallbacks.
- [x] Re-enable strict lint rules for application code where this slice removes `any` and unsafe casts.

## Correctness and public behavior

- [ ] Make blog cursor pagination deterministic with an opaque `publishDate` plus `_id` cursor.
- [ ] Generate localized canonical alternatives using the actual English and French slugs.
- [ ] Pass post and album identifiers to the OG endpoint so content-specific images are used.
- [x] Localize Portable Text internal links.
- [x] Correct Portable Text external-link target and `rel` behavior.
- [ ] Build a complete Portable Text image collection so rich-content lightboxes navigate between images.
- [x] Remove Studio font choices now that frontend typography is code-owned.
- [ ] Remove or replace the brittle Studio `/v1/users/me` author initialization request.
- [ ] Require meaningful post cover-image alt text unless explicitly decorative.
- [ ] Validate required localized post content and unique English/French post slugs.

## Code-owned presentation configuration

The original project exposed presentation settings in Sanity so non-technical adopters could customize deployments. This installation no longer needs that product-level flexibility: design configuration should have one source of truth in code, while Sanity remains responsible for editorial content.

- [x] Define the supported light and dark themes, default theme, body font, and display font in a typed code configuration module.
- [x] Preserve the current rendered fonts, colors, light/dark behavior, and pre-paint theme initialization during the cutover.
- [x] Remove font, theme-name, and custom-theme color fields from the site-settings query and application view models.
- [x] Remove the corresponding font and theme controls, previews, references, and validation from the Sanity Studio schema.
- [x] Delete runtime custom-theme conversion and CSS generation after the code-owned themes are active.
- [x] Remove `culori`, unused font loaders, and other dependencies or utilities made obsolete by the cutover.
- [x] Retain the visitor theme toggle and restrict it to the two code-owned themes.
- [x] Audit the remaining site-settings fields and document why each belongs to editorial content or deployment configuration.
- [x] Update architecture, setup, and authoring documentation to describe the new ownership boundary.
- [x] Add tests for configured theme names, font loading, persisted theme selection, and flash-free initialization.

## Component and feature architecture

- [x] Rebuild the Portable Text component map with generated value types and normal React component composition.
- [ ] Separate gallery thumbnail, Photo Album, and lightbox slide models.
- [ ] Split gallery URL state, responsive behavior, captions, and image rendering into focused modules.
- [x] Simplify navigation into one typed link model shared by desktop and mobile renderers.
- [x] Remove unused header contact props and duplicate locale context plumbing.
- [ ] Add drawer focus trapping, Escape handling, focus restoration, and close-on-navigation behavior.
- [ ] Replace generic files such as `components/lib/utils.ts` with domain-specific modules or remove them.
- [ ] Remove dead integrations and ineffective code, including unused visibility state and obsolete Studio helpers.

## Quality gates and testing

- [x] Remove global ESLint rule suppressions; retain only narrow, documented exceptions.
- [ ] Add tests for localized metadata, Portable Text links, gallery deep links, and image fallbacks.
- [ ] Add component tests for navigation and drawer keyboard behavior.
- [ ] Add integration tests for Sanity query normalization and infrastructure failures.
- [ ] Run the Playwright route, preview, pagination, Studio, and visual-regression suites against a real preview environment.
- [ ] Add desktop/mobile and light/dark visual baselines after the first verified Vercel preview.

## Operations and observability

- [ ] Remove the temporary `/sw.js` retirement worker after legacy browser registrations have expired.
- [ ] Configure the read-only CI Sanity project, dataset, and token secrets.
- [ ] Configure and verify the signed Sanity webhook in Preview and Production.
- [ ] Add provider-backed error monitoring for Sanity reads, preview, revalidation, OG generation, and builds.
- [ ] Crawl all known English and French URLs for status, canonical, alternate, and sitemap parity.
- [ ] Rotate the existing Sanity read token after the security cutover is deployed.
- [ ] Retain and document the previous Vercel production deployment as the rollback target.
- [ ] Review the remaining moderate transitive advisories as new Next and Sanity releases become available.
