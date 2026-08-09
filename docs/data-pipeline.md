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
bundles. Sailing records with a departure date before the current UTC date are
also excluded from public bundles, while remaining in `data/seed/sailings.json`
for history and provenance. Set `CRUISEKIT_TODAY=YYYY-MM-DD` when verifying this
date filter deterministically.

## Report command

```bash
pnpm run data:report
```

The command rebuilds bundles, then writes:

| Report | Purpose |
| --- | --- |
| `data/reports/latest-data-health.md` | Human-readable data health report for scheduled automation. |
| `data/reports/latest-data-health.json` | Structured report for future dashboards or CI checks. |
| `data/reports/latest-data-freshness.md` | Human-readable production freshness report with the 7-day public sailing threshold. |
| `data/reports/latest-data-freshness.json` | Structured freshness report for scheduled automation and approval issues. |
| `data/reports/latest-link-audit.md` | Human-readable public link audit. |
| `data/reports/latest-link-audit.json` | Structured public link audit. |

The report exits non-zero for blockers, including public sailing fare checks
older than 7 days, and exits zero when only warnings are present.

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

The first source-specific staging importer is Carnival:

```bash
pnpm run data:ingest:carnival
pnpm run data:review:carnival
```

It reads Carnival's official public cruise search JSON, stores raw snapshots,
writes canonical-shaped staging sailings, and saves observed cabin prices in a
separate `observed-prices.json` file. It does not edit production seed data.
The review command compares staged Carnival records against current seed records
and writes `data/reports/latest-carnival-staging-review.md`.

Reviewed Carnival records move live through the promotion command:

```bash
pnpm run data:promote:carnival -- --dry-run --limit 40
pnpm run data:promote:carnival -- --apply --limit 40
pnpm run data:publish
```

Promotion only uses records from the latest review recommendation set unless
specific IDs are supplied with `--ids`. Promoted records stay at
`itinerary_verified_price_check_required`, so they are visible in public bundles
but still treated as price-check-required until affiliate/API pricing exists.

Norwegian follows the same staging, review, and promotion pattern:

```bash
pnpm run data:ingest:norwegian
pnpm run data:review:norwegian
pnpm run data:promote:norwegian -- --dry-run --limit 30
pnpm run data:promote:norwegian -- --apply --limit 30
pnpm run data:publish
```

The Norwegian importer uses NCL's public vacation search plus date-specific
sailings JSON. NCL's `combinedPrice` can reflect package/offers assumptions, so
promoted records remain `itinerary_verified_price_check_required`.

Azamara uses browser-assisted official-source staging:

```bash
pnpm run data:ingest:azamara
pnpm run data:review:azamara
pnpm run data:promote:azamara -- --dry-run --limit 10
pnpm run data:promote:azamara -- --apply --limit 10
```

Azamara currently stages dated cards from the official search page for target
regions such as Caribbean and Alaska, then enriches records from detail-page
itinerary markup when reachable. Treat records as review-only until embark and
return ports, detailed itinerary ports, current fare basis, taxes/fees language,
and booking links are verified.

Royal Caribbean has a matching staging importer:

```bash
pnpm run data:ingest:royal-caribbean
```

Royal Caribbean may return an automated-access block page from some
environments. When that happens, the importer writes an explicit blocker report
instead of staging stale or guessed inventory. If official search responses are
reachable, it captures raw responses, normalizes canonical-shaped staging
records, validates them, and still requires review before promotion.

Royal Caribbean is now treated as a compliance-gated source, not a scraping
target. Do not add bypass logic, CAPTCHA workarounds, residential proxies, or
headless-browser evasion to this importer. The approved workarounds are:

1. Approved affiliate/network feeds that provide Royal Caribbean or authorized
   Royal Caribbean retail offers with usable deep links.
2. Licensed cruise inventory providers such as Traveltek, Widgety, Odysseus, or
   a GDS/host-agency feed, once commercial access is available.
3. CruisingPower/Espresso or other Royal Caribbean B2B exports only through
   proper agency, host-agency, or partner credentials.
4. Manual editorial review for itinerary-only placeholders while feed access is
   pending.

Royal Caribbean records must remain staging-only or
`internal_do_not_publish` unless the record has a compliant source URL, source
market, USD price basis, taxes/fees notes, and current booking/deep-link path.

MSC and Viking use browser-assisted official-source staging:

```bash
pnpm run data:ingest:msc
pnpm run data:ingest:viking
```

MSC currently stages records from an accessible MSC market page because the USA
site routes automation into a waiting-room/service-unavailable flow. Treat those
records as review-only until market, currency, fare basis, taxes/fees, and
booking links are verified. Viking's search page exposes itinerary-level cards,
not dated sailing inventory, so its importer writes
`itinerary-candidates.json` for manual or partner-feed follow-up.

Holland America uses browser-assisted official-source staging:

```bash
pnpm run data:ingest:holland-america
pnpm run data:review:holland-america
pnpm run data:promote:holland-america -- --dry-run --limit 10
pnpm run data:promote:holland-america -- --apply --limit 10
```

Holland America currently stages dated search-card records from the official US
site. Treat those records as review-only until detailed itinerary ports, price
basis, taxes/fees language, and booking links are verified.

## Publish command

```bash
pnpm run data:publish
```

The command runs the health, freshness, link, and image reports and, if no
blockers are found, copies bundles into `apps/web/public/data/bundles/`. After
the website deploys, those files are available at:

| URL | Purpose |
| --- | --- |
| `/data/bundles/manifest.json` | Mobile/web public manifest. |
| `/data/bundles/mobile/sailings.json` | Mobile sailing bundle. |
| `/data/bundles/mobile/deals.json` | Mobile deal bundle. |
| `/data/bundles/canonical/sailings.json` | Public canonical sailing bundle. |
| `/data/bundles/canonical/deals.json` | Public canonical deal bundle. |

## Guarded publish candidate

Use this command when the data looks ready but still needs a human approval
before it goes live:

```bash
pnpm run data:publish:candidate
```

The command builds bundles, runs the data health report, data freshness report,
link audit, and image audit, then prepares public bundles only when there are
zero blockers and zero warnings. It writes:

| Report | Purpose |
| --- | --- |
| `data/reports/latest-publish-candidate.md` | Human-readable go/no-go summary. |
| `data/reports/latest-publish-candidate.json` | Structured publish candidate report. |

This command never commits, pushes, or deploys. If the candidate is ready,
review the pending diff, then commit and push to `main` to trigger the website
deploy.

Use this command to check the live website before pushing traffic harder:

```bash
pnpm run site:readiness
```

It checks important public pages, sitemap/robots basics, live bundle counts, and
manifest freshness, then writes `data/reports/latest-launch-readiness.*`.

## Cloud automation

The recurring website/data checks run in GitHub Actions, so they do not depend
on the local Mac being awake:

| Schedule | Workflow job | Command | Output |
| --- | --- | --- | --- |
| Daily | `daily` | `pnpm run data:automation:daily` | `cruisekit-daily-data-reports` artifact |
| Monday/Wednesday/Friday | `publish-candidate` | `pnpm run data:publish:candidate` | `cruisekit-publish-candidate` artifact |
| Monday | `weekly-ingest` | `pnpm run data:ingest:weekly-report` + `pnpm run data:freshness` | `cruisekit-weekly-ingest-reports` artifact and `needs-kali` issue when stale |
| Friday | `launch-readiness` | `pnpm run site:readiness` | `cruisekit-launch-readiness` artifact |
| Monthly | `monthly-coverage` | `pnpm run data:automation:monthly` | `cruisekit-monthly-coverage-report` artifact |
| Daily | `Deploy CruiseKit to GitHub Pages` | `pnpm --filter web build` | GitHub Pages deploy |

The `CruiseKit Data Automation` jobs are report-only. They do not commit, push,
deploy, promote cruise records, or upload mobile builds. GitHub Pages deploys
happen from the separate deploy workflow when changes are pushed to `main`, when
the workflow is run manually, and once per day on the schedule above. That daily
deploy rebuilds the web app and data bundles from the current approved seed
records without committing generated files, so expired sailings age out of the
live `/data/bundles/` output automatically.

The weekly ingest job also runs the provider staging-review tools and then runs
the production freshness gate. Public sailing fare checks are expected to be no
more than 7 days old. If the public bundle is stale, the weekly job creates or
updates a GitHub issue titled `[needs-kali] CruiseKit data freshness review`,
labels it `needs-kali`, uploads the reports, and fails the run so the stale
state is visible.

Manual GitHub runs can target a single job by choosing the `job` workflow input
instead of running every automation job at once.

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

- Run every provider importer in report-only mode.
- Run staging-review reports for providers that support review summaries.
- Run full direct-link and affiliate-link audit.
- Block the weekly freshness gate when public `lastVerified` dates are older than 7 days.
- Compare web/mobile bundle parity.
- Review source failure rates.
- Create or update a `needs-kali` issue when source-backed price/link/date
  changes need approval before seed records can be promoted.

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
- A generated public bundle contains a sailing with a departure date in the past.
- A price changes beyond the configured threshold.
- A cruise-line page redirects to a generic landing page.
- A provider returns materially fewer records than the previous successful run.

## Next implementation steps

1. Deploy the website so `/data/bundles/manifest.json` is live.
2. Add `scripts/ingest/` with provider-specific importers that output canonical
   staging records.
3. Done: the deploy workflow now runs daily, rebuilding and publishing public
   bundles without committing generated files.
4. Add a guarded auto-merge/publish path only after report-only runs are stable.
5. Done: `scripts/audit-bundle-images.mjs` now includes a deal image trust
   pass. It maps each voyage to port/region image expectations, blocks obvious
   non-cruise imagery such as planes/airports, and writes image usage plus
   mismatch findings into `data/reports/latest-image-audit.*`.

## Mobile refresh configuration

The Flutter app supports best-effort remote bundle refresh. It still ships with
bundled JSON assets and falls back to them if no remote URL is configured, the
manifest fails, a bundle download fails, or a bundle hash does not match.

Configure at build time:

```bash
flutter build ios \
  --dart-define=CRUISEKIT_DATA_MANIFEST_URL=https://cruisekit.app/data/bundles/manifest.json
```

Do not bundle a real `.env` file into the mobile app. Runtime keys such as
Mapbox, ShipSafe, and data bundle URLs should be passed as `--dart-define`
values or injected by the release build system. `CRUISEKIT_DATA_BUNDLE_BASE_URL`
is optional when the manifest is served from `/data/bundles/` because bundle
paths are relative to the manifest URL.

## Why `mobileSailingCatalog` is not published (audited 2026-08-09)

The Flutter app's `DataRefreshService` already maps two manifest keys,
`mobileSailingCatalog` and `sailingCatalog`, onto its bundled
`assets/data/sailing_catalog.json`. Publishing either key in
`/data/bundles/manifest.json` would therefore reach already-shipped installs
with no app release. `scripts/build-data-bundles.mjs` intentionally does not
emit that key today, because this repository has no catalog source that would
be an improvement over the asset the app already ships:

- The module that produced `sailing_catalog.json`,
  `apps/web/lib/data/sailing-catalog.ts`, was deleted in commit `1f5c62c` when
  the canonical schema/seed pipeline replaced it. It derived the catalog at
  build time from the raw provider captures now parked in
  `archive/scraped-sailings-2026-04/scraped/`. Its exporter,
  `archive/scripts/export_plan_data.ts`, still imports the deleted path and no
  longer runs.
- Those archived captures are a frozen April 2026 snapshot. Reviving them would
  republish the same rows the app already carries, including the ones that have
  since expired, so it would not fix freshness. Archived scrapers and their
  captures are historical reference only and must not become production
  dependencies without a fresh compliance and reliability review.
- The live canonical seed is not a substitute. It covers Norwegian, Carnival,
  Virgin Voyages, Holland America, Azamara, and four Royal Caribbean records,
  and it contains no Celebrity, MSC, or Princess sailings at all. The bundled
  catalog carries roughly 3,875 rows across nine lines. Because a refreshed
  bundle replaces the bundled asset wholesale, publishing a seed-derived
  catalog would shrink the app's line/ship/date setup picker instead of
  refreshing it.

Feeding the key therefore requires a real catalog ingest in this repository
first: current provider coverage for the lines the picker depends on, a
redistribution review for booking links, prices, and provider image URLs, and
Kali's approval to publish that data from `cruisekit.app`. Until that exists,
the missing manifest key is the symptom, not the blocker. A missing key is a
safe no-op on the app side.
