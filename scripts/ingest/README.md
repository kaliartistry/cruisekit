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
- `norwegian`: `pnpm run data:ingest:norwegian` writes staging-only NCL
  sailing candidates from NCL's official vacation-search JSON and date-specific
  sailings endpoint. Run `pnpm run data:review:norwegian` afterward.
- `princess`: `pnpm run data:ingest:princess` writes staging-only Princess
  inventory candidates from Princess' official public cruise-search JSON. The
  light feed does not publish reliable fares, so all Princess records require
  price review before promotion. Run `pnpm run data:review:princess` afterward.
- `virgin-voyages`: `pnpm run data:ingest:virgin-voyages` writes staging-only
  candidates from Virgin Voyages' official public listing pages. Run
  `pnpm run data:review:virgin-voyages` afterward.
- `royal-caribbean`: `pnpm run data:ingest:royal-caribbean` follows the same
  staging/report contract and records an explicit blocker when Royal Caribbean
  denies automated access.
- Other cruise sailing providers: pending approved affiliate/direct feed access
  or source-specific staging importers.
