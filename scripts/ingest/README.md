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

The weekly job retains its Monday 11:34 UTC schedule and report-only permissions.
The original discovery runner and all provider importer files are preserved
byte-for-byte; the earlier candidate's blanket source-policy gate was removed.
An independent one-sailing pilot passes scoped observation files into the verifier.
It currently stops on Virgin's explicit collection restriction, emits zero quotes,
and fails visibly without certifying the catalog. Existing discovery is not a
replacement quote adapter or evidence of source permission; none was executed
during this pilot. No commit, push or publication path is added.

No complete permitted live quote adapter has yet been established. Virgin terms
Part I section 11 explicitly prohibit data collection; NCL robots disallows the
date-specific path; Holland robots disallows its booking funnel. Carnival's
material-reuse terms need precise review without presuming a blanket permission
requirement for price facts. Public research and missing adapter implementation
are already authorized engineering. A policy toggle cannot replace an actual
source contract/field mapping. No evasion, credentials or paid source is added.

Legacy staging `lastVerified`/`generatedAt` values describe importer/record history;
they do not populate `data/seed/fare-verifications.json`. Promotion preserves the
original date rather than stamping a promotion date. A confirmed price requires
an owner-reviewed initial quote tuple, actual `observedAt`, source timestamp when
provided, hashed raw evidence, precise cabin/rate/package/occupancy/tax context,
and the same sailing/itinerary. Only complete normal changes below 15% become
eligible candidates. Large, ambiguous, new or unmatched results require review.
Sold-out, missing or changed results retain the last good fare and never assert
cancellation. See [weekly verification scope](../../docs/weekly-fare-verification.md).

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
