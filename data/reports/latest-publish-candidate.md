# CruiseKit Publish Candidate

Generated: 2026-05-23T20:57:57.722Z

Status: READY FOR MANUAL REVIEW

This is a guarded publish candidate. It never commits, pushes, or deploys.

## Summary

| Metric | Value |
| --- | ---: |
| Public sailings | 148 |
| Mobile sailings | 148 |
| Mobile deals | 148 |
| Blockers | 0 |
| Warnings | 0 |
| Public bundles prepared | yes |

## Steps

| Step | Status | Exit |
| --- | --- | ---: |
| build data bundles | ok | 0 |
| data health | ok | 0 |
| link audit | ok | 0 |
| image audit | ok | 0 |
| prepare public data bundles | ok | 0 |

## Findings

### Data health

- blocker: none
- warning: none

### Link audit

- blocker: none
- warning: none

### Image audit

- blocker: none
- warning: none

## Pending Git Changes

- ` M apps/web/app/sitemap.ts`
- ` M apps/web/public/data/bundles/manifest.json`
- ` M data/bundles/manifest.json`
- ` M data/reports/latest-daily-automation.json`
- ` M data/reports/latest-daily-automation.md`
- ` M data/reports/latest-data-health.json`
- ` M data/reports/latest-data-health.md`
- ` M data/reports/latest-image-audit.json`
- ` M data/reports/latest-image-audit.md`
- ` M data/reports/latest-link-audit.json`
- ` M data/reports/latest-link-audit.md`
- ` M data/reports/latest-manual-review-queue.json`
- ` M data/reports/latest-manual-review-queue.md`
- ` M docs/data-pipeline.md`
- ` M package.json`
- `?? data/reports/latest-launch-readiness.json`
- `?? data/reports/latest-launch-readiness.md`
- `?? data/reports/latest-publish-candidate.json`
- `?? data/reports/latest-publish-candidate.md`
- `?? scripts/run-launch-readiness-report.mjs`
- `?? scripts/run-publish-candidate.mjs`

## Manual Next Step

Review the pending diff. If it only contains expected data bundle/report changes, commit and push to `main` to trigger GitHub Pages.
