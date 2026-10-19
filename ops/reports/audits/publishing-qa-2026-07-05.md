# Publishing QA Report - 2026-07-05

Public-safe GrowthOps QA pass for the current CruiseKit site branch.

## Scope

- Branch: `codex/growthops-2026-07-05`
- Baseline respected: June 22, 2026 technical SEO and authority-page baseline was not repeated.
- Selected backlog lane: `phase6-001` publishing QA.
- Approval-gated work avoided: comparison pages, best claims, official/partner/certification claims, pricing changes, legal/privacy changes, paid tools, outreach, and user-data work.

## Repo State Reviewed

- Pulled latest `origin/main` before branching.
- Read `ops/prompts/system.md` and `ops/prompts/daily_report.md`.
- Ran `node ops/scripts/preflight-audit.js --write-inventory`.
- Generated `ops/reports/daily/2026-07-05.md`.
- Reviewed `ops/tasks/backlog.yml`, recent merged PRs, open PRs, and `ops/reports/audits`.

## Current Inventory Signals

- Routes inventoried: 40.
- Content pages inventoried: 32.
- JSON-LD/schema detections: 14.
- Duplicate App Router routes: none detected by preflight or duplicate check.
- Route metadata coverage from the inventory scanner: 37 of 40 route files.
- Scanner-noted metadata gaps remain on `/blog`, `/my-trips`, and `/track`; `/blog` is already covered by open PR #35, while `/my-trips` and `/track` are account/app-oriented routes and should not be treated as public SEO defects without a product decision.

## Open PR Overlap Avoided

The following open PRs already cover adjacent GrowthOps work, so this run did not duplicate them:

- PR #40: feature page schema graph.
- PR #37: MyDay schema metadata.
- PR #35: blog index metadata.
- PR #29: Group Hub schema metadata.
- PR #24: AI visibility QA report.
- PR #23: trust boundary clarification.
- PR #21: cruise spend tracker authority page.

## Checks Run

- `git diff --check`
  - Result: passed. Git reported line-ending normalization warnings for generated inventory JSON files.
- `node ops/scripts/duplicate-check.js`
  - Result: no duplicate routes reported.
- `node ops/scripts/link-check.js`
  - Result: static href scan completed; this script inventories local hrefs and does not currently validate route existence or HTTP status.
- `node ops/scripts/preflight-audit.js --write-inventory`
  - Result: completed and wrote current inventory/audit artifacts.
- `corepack pnpm --filter web lint`
  - Result: passed. Existing warning: current local Node is v24.11.1 while `functions` requests Node 22.
- `corepack pnpm --filter web build`
  - Result: passed and prerendered 190 app pages. Existing warning: Next.js inferred the workspace root from a parent lockfile.
- `node ops/scripts/postflight-audit.js`
  - Result: passed overall. Duplicate-route, static link, web lint, functions lint, and Firestore rules checks passed. The broad secret scan uses `git grep` and reported a command failure because no pattern matches were returned; a targeted changed-file secret scan should still be reviewed before commit.
- Targeted changed-file secret-pattern scan
  - Result: no matches in changed files.

## Recommendations

1. Let the existing open PRs land before adding more schema work to the same page families.
2. Treat `/blog` metadata as already in progress via PR #35.
3. Keep `/my-trips` and `/track` out of public SEO work unless Kali approves their public indexing/positioning.
4. A future safe improvement would be upgrading `ops/scripts/link-check.js` from a static href inventory to a route-existence check with ignored dynamic-route patterns.
5. A future safe audit-script improvement would be making the postflight secret scan distinguish "no matches" from a scanner failure.

## Approval Notes

No `needs-kali` issue was created or updated for this run because the selected work was a public-safe QA report and did not require pricing, legal/privacy, comparison, official/partner/certification, paid-tool, outreach, or user-data approval.
