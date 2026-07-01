# CruiseKit Publish Candidate

Generated: 2026-07-01T14:42:48.347Z

Status: READY FOR MANUAL REVIEW

This is a guarded publish candidate. It never commits, pushes, or deploys.

## Summary

| Metric | Value |
| --- | ---: |
| Public sailings | 238 |
| Mobile sailings | 238 |
| Mobile deals | 238 |
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

- ` M data/reports/latest-norwegian-staging-review.md`
- ` M data/reports/latest-princess-staging-import.json`
- ` M data/reports/latest-princess-staging-import.md`
- ` M data/reports/latest-princess-staging-review.json`
- ` M data/reports/latest-princess-staging-review.md`
- ` M data/reports/latest-publish-candidate.json`
- ` M data/reports/latest-publish-candidate.md`
- ` M data/reports/latest-royal-caribbean-staging-import.json`
- ` M data/reports/latest-royal-caribbean-staging-import.md`
- ` M data/reports/latest-viking-staging-import.json`
- ` M data/reports/latest-viking-staging-import.md`
- ` M data/reports/latest-virgin-voyages-promotion.json`
- ` M data/reports/latest-virgin-voyages-promotion.md`
- ` M data/reports/latest-virgin-voyages-staging-import.json`
- ` M data/reports/latest-virgin-voyages-staging-import.md`
- ` M data/reports/latest-virgin-voyages-staging-review.json`
- ` M data/reports/latest-virgin-voyages-staging-review.md`
- ` M data/seed/sailings.json`
- ` M package.json`
- ` M scripts/audit-bundle-images.mjs`
- ` M scripts/build-data-bundles.mjs`
- ` M scripts/data-freshness-report.mjs`
- `?? data/reports/latest-data-freshness.json`
- `?? data/reports/latest-data-freshness.md`
- `?? data/reports/latest-reviewed-data-refresh.json`
- `?? data/reports/latest-reviewed-data-refresh.md`
- `?? data/reports/latest-weekly-ingest.json`
- `?? data/reports/latest-weekly-ingest.md`
- `?? scripts/finalize-reviewed-data-refresh.mjs`

## Manual Next Step

Review the pending diff. If it only contains expected data bundle/report changes, commit and push to `main` to trigger GitHub Pages.
