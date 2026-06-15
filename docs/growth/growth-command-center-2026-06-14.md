# CruiseKit Growth Command Center - 2026-06-14

## Current State

- Branch: `main`
- Deployment status: deployed to GitHub Pages from `main`
- Merge status: `codex/seo-batch-1` fast-forward merged into `main`
- Deployment commit: `9a5e98a`
- GitHub Pages workflow run: `27516588884`
- GA4 deploy commit: `84880fd`
- GA4 deploy workflow run: `27517472182`
- Production GA4 measurement ID: `G-X6NEBF4X3N`
- Primary acquisition hook: cost calculator
- Retention hook: app save/planning workflow
- Keyword source of truth: `docs/seo/keyword-map-2026-06-14-v2-authenticated.csv`

## Gates

- Do not deploy, merge, stage, commit, or push without explicit approval.
- Do not implement homepage hero repositioning without explicit approval.
- Do not create new public SEO URLs unless a separate approved new-page proposal exists.
- Do not post to Reddit or Facebook, send creator outreach, send DMs, join groups, start paid ads, add affiliate links, or create accounts/properties without exact approval.
- Keep unrelated dirty state untouched, including `docs/email-draft-automation.md`, `$CODEX_HOME/`, and pre-existing SEO artifacts.

## Batch 1 QA Snapshot

Batch 1 was reviewed locally before Batch 2 work started. Validation results are recorded in `docs/growth/batch-1-qa-review-2026-06-14.md`.

Passing commands recorded:

- `git diff --check`
- `pnpm --filter web lint`
- `pnpm --filter web exec tsc --noEmit`
- `pnpm --filter web build`

Known warning:

- The Firebase functions package declares Node 22 while the local runtime is Node 25.9.0. The web lint, typecheck, and build still passed.

## Batch 2 Scope

Allowed without extra approval:

- Title/meta/Open Graph updates
- FAQ/H2 additions using mapped keyword language
- Internal links
- Calculator CTA improvements
- Line-specific add-on copy

Approval required:

- Major homepage hero repositioning
- New public URLs
- Deployment or merge

## Operating Cadence

Daily during the 30-day sprint:

- Record completed implementation or research work in `docs/growth/30-day-execution-log.md`.
- Preserve source, blocker, and approval status in each artifact.
- Keep one primary CruiseKit URL per keyword cluster to avoid cannibalization.

Weekly:

- Fill `docs/growth/weekly-scorecard-template.md` with Search Console, analytics, calculator, app click, saved-trip, and affiliate data once deployed and connected.

## Open Approvals Needed

- Approval before any community, creator, paid, or affiliate activation.
