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
- `azamara`: `pnpm run data:ingest:azamara` browser-reads Azamara's official
  cruise-search cards for target regions into review-only dated staging
  records and enriches them from detail-page itinerary DOM when reachable. Run
  `pnpm run data:review:azamara` afterward. Promotion remains manual/review-gated.
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
- `msc`: `pnpm run data:ingest:msc` browser-captures MSC's official search
  GraphQL through an accessible MSC market page. MSC USA currently enters a
  waiting-room/service-unavailable flow in automation, so MSC output is
  staging-only until market, currency, and fare terms are reviewed.
- `holland-america`: `pnpm run data:ingest:holland-america` browser-reads
  Holland America's official cruise-search cards into review-only dated
  staging records. Run `pnpm run data:review:holland-america` afterward.
- `viking`: `pnpm run data:ingest:viking` browser-reads Viking's official
  search page and writes itinerary-level candidates. Viking's first search page
  does not expose dated sailings, so this importer creates a manual/partner-feed
  review queue instead of canonical production records.
- `virgin-voyages`: `pnpm run data:ingest:virgin-voyages` writes staging-only
  candidates from Virgin Voyages' official public listing pages. Run
  `pnpm run data:review:virgin-voyages` afterward.
- `royal-caribbean`: `pnpm run data:ingest:royal-caribbean` follows the same
  staging/report contract and records an explicit blocker when Royal Caribbean
  denies automated access. Royal Caribbean is compliance-gated: do not add
  CAPTCHA bypassing, proxy rotation, or browser-evasion logic. Use approved
  affiliate feeds, licensed inventory providers, CruisingPower/Espresso access
  through proper credentials, or manual review until a compliant feed is
  available.
- Other cruise sailing providers: pending approved affiliate/direct feed access
  or source-specific staging importers.
