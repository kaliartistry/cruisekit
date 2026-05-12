# Canonical Schema — Sailings & Deals

Single source of truth for cruise sailing and deal records, consumed by:

- **Web (Next.js)** at `/apps/web/` — TypeScript models generated to `/shared/models/ts/`.
- **Mobile (Flutter)** at `/Users/kaliartistry-mac/CruiseKit-Mobile/` — Dart models generated to `/shared/models/dart/lib/` and pulled into the mobile repo via a pinned `git:` dependency.

## Files

| File | Purpose |
| --- | --- |
| `sailing.schema.json` | Top-level Sailing record. Holds `$defs` for `Confidence`, `PortCoordinate`, and `SourceMetadata` referenced from other files. |
| `deal.schema.json` | Top-level Deal record. References the shared `$defs` in `sailing.schema.json` by absolute `$id`. |

JSON Schema dialect: **2020-12**.

## Regenerating models

From the repo root:

```bash
pnpm run schema:gen
```

This runs Quicktype against both schemas and writes:

- `shared/models/ts/sailing.ts`
- `shared/models/ts/deal.ts`
- `shared/models/dart/lib/sailing.dart`
- `shared/models/dart/lib/deal.dart`

Re-run after **any** edit to `*.schema.json`. Generated files are committed (so consumers don't need a codegen step on `pnpm install`).

## Validating seed records

```bash
pnpm run schema:validate
```

Runs Ajv over `data/seed/sailings.json` and `data/seed/deals.json`. Fails with a non-zero exit code if any record violates the schema. The web build (`pnpm --filter web build`) runs this in `prebuild`, so a malformed seed record breaks CI/deploys.

## Confidence enum — the trust ladder

| Value | Meaning | Renders publicly? |
| --- | --- | --- |
| `verified_from_cruise_line` | Hand-checked against the cruise line's own page on `lastVerified` date. | Yes |
| `itinerary_verified_price_check_required` | Itinerary structure is real, but price may have shifted. CTA copy nudges users to "Check current price". | Yes |
| `editorial_only` | Editorial pick / curated highlight. | Yes |
| `internal_do_not_publish` | Staging tier. **Never** rendered to end users. | **No** — filtered at the data loader. |

The loader (`apps/web/lib/data/real-deals.ts`) drops `internal_do_not_publish` records before they reach the UI. Don't second-guess this — write a more specific tier if a record needs to be visible.

## How a future affiliate feed maps in

When a real-time feed comes online (Awin, CJ, direct partner), the import pipeline should produce one canonical `Sailing` record per feed row:

1. **Identity** — derive `id` deterministically (`<cruiseLine>-<shipSlug>-<YYYYMMDD>`) so re-imports update existing records rather than duplicating.
2. **Source** — populate `source` with `provider` (e.g. `Awin:GoToSea`), `sourceType: "affiliate-feed"`, `affiliateNetwork: "Awin"`, `advertiserName`, `lastImported` (now), `lastVerified` (now), `confidence: "verified_from_cruise_line"` (feed-fresh data).
3. **Links** — set `affiliateLink` to the tracked URL from the feed; keep `directLink` pointed at the cruise-line page (used as fallback if affiliateLink ever 404s or the program is paused).
4. **Pricing** — set `priceBasis` based on what the feed publishes; default to `unspecified` only when the feed truly doesn't say.
5. **Coordinates** — `portCoordinates` is required but may be `[]`. ShipSafe SDK consumers detect missing entries and fall back to port-name lookups.

The schema treats feed-sourced and manually-verified records identically — confidence/source fields carry the provenance. Don't add a `feedRecord` flag.

## Editing the schema

- **Adding a field**: prefer optional (`required` does not include it; `type` allows `null`) so existing seed records remain valid. Once all records carry it, promote to required.
- **Renaming a field**: rename in schema, regenerate models, update consumers, update seed records — all in one PR. Quicktype output is deterministic; diff stays small.
- **Adding a confidence tier**: only do this if a genuinely new trust scenario appears. Don't split tiers cosmetically.

## Consumers (current)

- `apps/web/lib/data/real-deals.ts` — loads `data/seed/sailings.json`, validates, filters `internal_do_not_publish`, exports `SAILINGS: Sailing[]`.
- `apps/web/app/cruises/cruise-search.tsx` — `DealCard` renders source/confidence/CTA from the canonical fields.
- `apps/web/app/pillar-cards.tsx` — homepage carousel.
- `shared/models/dart/` — pub package consumed by `CruiseKit-Mobile` once mobile-side wiring lands.

## `deals.json` is currently empty — and that's fine

`data/seed/deals.json` is intentionally an empty array (`[]`). No web UI component renders deals today; the cruise cards on the homepage and `/cruises` page are sourced from `sailings.json`. The empty file is validated for shape only, so prebuild stays green.

**If you wire a "Deals" UI surface in the future:** treat the zero-deal state as a hide-the-section path, not a render-skeletons-forever path. Never synthesize placeholder deal records. Example:

```ts
const deals = await loadDeals();
if (deals.length === 0) return null; // hide section
```

Never display fake or estimated deals — every record in `deals.json` must carry real `source` provenance per the schema.
