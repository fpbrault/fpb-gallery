# Contributing

1. Create a focused branch from `main`.
2. Install with `npm ci`; do not regenerate the lockfile with a different package manager.
3. Keep English URLs unprefixed and French URLs under `/fr`.
4. Keep Sanity tokens and webhook secrets in server-only modules.
5. Use parameterized, explicit GROQ projections and update view-model types with schema changes.
6. Preserve the current visual design unless a change explicitly requests a redesign.
7. Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test:run`, and `npm run build` before opening a pull request.

For visual changes, run Playwright at desktop/mobile widths in both themes and attach before/after evidence. For content model changes, document the migration or defensive legacy fallback.

Presentation is code-owned: keep supported theme names and font identifiers in `src/config/presentation.ts`, the statically analyzable `next/font` declaration in `src/config/fonts.ts`, and palettes in `tailwind.config.js`. Sanity remains editorial and must not become a second source of truth for these values.
