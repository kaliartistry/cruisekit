# Provider Importers

Production provider importers belong here.

Each importer should:

1. Fetch from one approved provider/source.
2. Save raw responses under `data/ingest/raw/<provider>/<run-id>/`.
3. Normalize to canonical staging files under
   `data/ingest/staging/<provider>/<run-id>/`.
4. Write a report under `data/ingest/reports/<provider>/<run-id>.json`.
5. Never edit `data/seed/*.json` directly.

Promotion to public data happens in a separate review step.

## Current providers

- `viator`: handled by `scripts/update-viator-products.mjs` because Viator
  products are port-page excursion content, not canonical cruise sailings.
- `carnival`: `pnpm run data:ingest:carnival` writes staging-only Carnival
  sailing candidates from Carnival's official public cruise search JSON.
  Run `pnpm run data:review:carnival` afterward to compare staged records with
  canonical seed records. Promotion remains manual/review-gated.
- Other cruise sailing providers: pending approved affiliate/direct feed access
  or source-specific staging importers.
