# Project instructions

- Preserve the existing public URLs, bilingual behaviour, content, and visual design.
- English is unprefixed; French uses `/fr`; use helpers from `src/i18n/config.ts`.
- Keep `SANITY_API_READ_TOKEN` and `SANITY_WEBHOOK_SECRET` server-only.
- Use `src/sanity/data.ts` for application reads and parameterized queries in `src/sanity/queries.ts`.
- Do not add Pages Router routes or a second preview implementation.
- Missing content must return 404; operational failures must reach an error boundary or structured server log.
- Verify changes with formatting, lint, type checking, tests, and a production build.
