# CruiseKit Publish Candidate

Generated: 2026-07-01T19:30:48.080Z

Status: READY FOR MANUAL REVIEW

This is a guarded publish candidate. It never commits, pushes, or deploys.

## Summary

| Metric | Value |
| --- | ---: |
| Public sailings | 279 |
| Mobile sailings | 279 |
| Mobile deals | 279 |
| Blockers | 0 |
| Warnings | 0 |
| Public bundles prepared | yes |
| Count source | apps/web/public/data/bundles/manifest.json |

## Steps

| Step | Status | Exit |
| --- | --- | ---: |
| build data bundles | ok | 0 |
| data health | ok | 0 |
| data freshness | ok | 0 |
| link audit | ok | 0 |
| image audit | ok | 0 |
| prepare public data bundles | ok | 0 |

## Findings

### Data health

- blocker: none
- warning: none

### Data freshness

- blocker: none
- warning: none

### Link audit

- blocker: none
- warning: none

### Image audit

- blocker: none
- warning: none

## Pending Git Changes

- ` M data/reports/latest-norwegian-staging-import.md`
- ` M data/reports/latest-norwegian-staging-review.json`
- ` M data/reports/latest-norwegian-staging-review.md`
- ` M data/reports/latest-publish-candidate.json`
- ` M data/reports/latest-publish-candidate.md`
- ` M data/schema/sailing.schema.json`
- ` M data/seed/sailings.json`
- ` M package.json`
- ` M packages/shared/types/cruise.ts`
- ` M scripts/audit-bundle-images.mjs`
- ` M scripts/build-data-bundles.mjs`
- ` M scripts/ingest/azamara.mjs`
- ` M scripts/ingest/carnival.mjs`
- ` M scripts/ingest/holland-america.mjs`
- ` M scripts/ingest/msc.mjs`
- ` M scripts/ingest/norwegian.mjs`
- ` M scripts/ingest/princess.mjs`
- ` M scripts/ingest/royal-caribbean.mjs`
- ` M scripts/ingest/virgin-voyages.mjs`
- ` M scripts/review-norwegian-staging.mjs`
- ` M scripts/review-official-source-staging.mjs`
- ` M scripts/review-princess-staging.mjs`
- ` M shared/models/dart/lib/deal.dart`
- ` M shared/models/dart/lib/sailing.dart`
- ` M shared/models/ts/sailing.ts`
- `?? data/reports/latest-regional-normalization.json`
- `?? data/reports/latest-regional-normalization.md`
- `?? docs/regional-sailing-expansion-2026-07-01.md`
- `?? scripts/normalize-regional-seed-records.mjs`

## Manual Next Step

Review the pending diff. If it only contains expected data bundle/report changes, commit and push to `main` to trigger GitHub Pages.
