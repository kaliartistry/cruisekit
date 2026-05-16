# CruiseKit Data Pipeline

## Goal

CruiseKit needs one source of truth for cruise data that can feed both the
website and the mobile app. The website should not be the source of truth; it
should be a consumer of validated, versioned data bundles.

## Current foundation

- Canonical schemas live in `data/schema/`.
- Hand-curated seed records live in `data/seed/`.
- Public bundles are generated into `data/bundles/`.
- The Next.js site consumes `data/bundles/canonical/sailings.json`, generated
  from the canonical seed records.
- The Next.js public asset publish step exposes generated bundles at
  `/data/bundles/`.
- The Flutter app has a bundled-baseline plus remote-refresh design and can
  consume the hosted manifest when `CRUISEKIT_DATA_MANIFEST_URL` is configured.

## Build command

```bash
pnpm run data:build
```

The command validates seed records against the canonical schemas and writes:

| Bundle | Purpose |
| --- | --- |
| `data/bundles/manifest.json` | Version, generated timestamp, counts, bundle hashes. |
| `data/bundles/canonical/sailings.json` | Public canonical sailing records for web/CDN/API consumers. |
| `data/bundles/canonical/deals.json` | Public canonical deal records. |
| `data/bundles/mobile/sailings.json` | Mobile-compatible sailing shape. |
| `data/bundles/mobile/deals.json` | Mobile-compatible deal shape. |

Records with `confidence: "internal_do_not_publish"` are excluded from public
bundles.

## Report command

```bash
pnpm run data:report
```

The command rebuilds bundles, then writes:

| Report | Purpose |
| --- | --- |
| `data/reports/latest-data-health.md` | Human-readable data health report for scheduled automation. |
| `data/reports/latest-data-health.json` | Structured report for future dashboards or CI checks. |
| `data/reports/latest-link-audit.md` | Human-readable public link audit. |
| `data/reports/latest-link-audit.json` | Structured public link audit. |

The report exits non-zero for blockers and exits zero when only warnings are
present.

## Provider refresh commands

```bash
pnpm run data:refresh:viator
```

Refreshes cached Viator port products when `VIATOR_API_KEY` is configured. If
the key is missing, the command exits cleanly and writes a skipped report to
`data/reports/latest-viator-refresh.md`.

```bash
LIVE_LINK_AUDIT=1 pnpm run data:audit:links
```

Runs the public link audit with live HTTP checks. Live failures are warnings
because cruise and travel sites often block automated probes even when the link
works for users.

## Temporary no-API workflow

Until approved cruise affiliate feeds or direct provider APIs are available, use
the manual source-review workflow:

```bash
pnpm run data:review:manual
```

This reads `data/source-watchlist.json` and writes:

| Report | Purpose |
| --- | --- |
| `data/reports/latest-manual-review-queue.md` | Browser/manual verification queue by official cruise-line source. |
| `data/reports/latest-manual-review-queue.json` | Structured review queue for future admin tools. |

Rules for this temporary workflow:

- Use official cruise-line pages or approved partner portals only.
- Do not auto-copy prices from pages into production.
- Verify exact ship, date, itinerary, price basis, taxes/fees language, and
  direct URL before changing `data/seed/sailings.json`.
- Set `confidence: "itinerary_verified_price_check_required"` when itinerary is
  reliable but price may shift.
- Keep pricing conservative and visible as "check current price" until feed
  access exists.
- Quarantine uncertain records with `confidence: "internal_do_not_publish"`.

## Publish command

```bash
pnpm run data:publish
```

The command runs the health report and, if no blockers are found, copies bundles
into `apps/web/public/data/bundles/`. After the website deploys, those files are
available at:

| URL | Purpose |
| --- | --- |
| `/data/bundles/manifest.json` | Mobile/web public manifest. |
| `/data/bundles/mobile/sailings.json` | Mobile sailing bundle. |
| `/data/bundles/mobile/deals.json` | Mobile deal bundle. |
| `/data/bundles/canonical/sailings.json` | Public canonical sailing bundle. |
| `/data/bundles/canonical/deals.json` | Public canonical deal bundle. |

## Target operating model

```text
provider feeds / official sources
        ↓
ingestion scripts
        ↓
raw snapshots + staging records
        ↓
canonical staging JSON
        ↓
schema validation + data quality checks
        ↓
change report
        ↓
approved canonical seed/catalog
        ↓
versioned bundles + manifest
        ↓
website + mobile app
```

## Automation cadence

### Every other day

- Run source importers.
- Build a change report.
- Validate schema and data quality.
- Publish safe, low-risk changes.
- Hold pricing/promos/link changes for review until the source has proven stable.

### Weekly

- Run full direct-link and affiliate-link audit.
- Check stale `lastVerified` dates.
- Compare web/mobile bundle parity.
- Review source failure rates.

### Before enabling auto-publish

- Require at least two successful report-only runs from each provider.
- Require source-specific terms notes for each importer.
- Define price-change thresholds that trigger review.
- Keep raw snapshots for provenance and debugging.

## Source priority

1. Affiliate feeds or direct partner APIs.
2. Official cruise-line APIs or structured public endpoints.
3. Official cruise-line pages via browser automation when a structured source is unavailable.
4. Manual editorial verification.

Archived scrapers under `archive/scripts/` are historical reference only. They
should not become production dependencies without a fresh compliance and
reliability review.

## Ingestion staging

Provider importers write to `data/ingest/` first. They must not edit
`data/seed/*.json` directly.

```text
data/ingest/
  raw/<provider>/<run-id>/...
  staging/<provider>/<run-id>/sailings.json
  staging/<provider>/<run-id>/deals.json
  reports/<provider>/<run-id>.json
```

Promotion from staging to seed requires schema validation, source metadata,
quality checks, and a readable diff report.

## Accuracy gates

The pipeline should block or quarantine records when:

- The record fails JSON Schema validation.
- A public record has no source URL.
- A public record has no valid direct or affiliate link.
- A published sailing has a departure date in the past.
- A price changes beyond the configured threshold.
- A cruise-line page redirects to a generic landing page.
- A provider returns materially fewer records than the previous successful run.

## Next implementation steps

1. Deploy the website so `/data/bundles/manifest.json` is live.
2. Add `scripts/ingest/` with provider-specific importers that output canonical
   staging records.
3. Extend the scheduled Codex automation from report-only to report + publish +
   deployment once the deployment command is confirmed.
4. Add a guarded auto-merge/publish path only after report-only runs are stable.

## Mobile refresh configuration

The Flutter app supports best-effort remote bundle refresh. It still ships with
bundled JSON assets and falls back to them if no remote URL is configured, the
manifest fails, a bundle download fails, or a bundle hash does not match.

Configure at build time:

```bash
flutter build ios \
  --dart-define=CRUISEKIT_DATA_MANIFEST_URL=https://cruisekit.app/data/bundles/manifest.json
```

Or configure the same key in the mobile `.env` file during development.
`CRUISEKIT_DATA_BUNDLE_BASE_URL` is optional when the manifest is served from
`/data/bundles/` because bundle paths are relative to the manifest URL.
