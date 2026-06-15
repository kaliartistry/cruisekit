# Batch 1 QA Review - 2026-06-14

## Scope Reviewed

Branch reviewed: `codex/seo-batch-1`

Batch 1 local changes reviewed included:

- Metadata/content changes for calculator, guides, blog pages, layout, and sitemap.
- Tracking helpers in `apps/web/lib/analytics.ts`.
- CTA/link tracking components for blog, affiliate, heart/save, excursions, and UTM landing visits.
- Shareable calculator result behavior in `apps/web/components/calculator/cost-breakdown.tsx`.
- Sitemap additions for approved line calculator URLs.

Unrelated dirty state intentionally left untouched:

- `docs/email-draft-automation.md`
- `$CODEX_HOME/`

## Validation Commands

| Command | Result | Notes |
| --- | --- | --- |
| `git diff --check` | Pass | No whitespace errors. |
| `pnpm --filter web lint` | Pass | Warning only: functions package wants Node 22, local Node is 25.9.0. |
| `pnpm --filter web exec tsc --noEmit` | Pass | Same Node warning. |
| `pnpm --filter web build` | Pass | Generated 145 static pages. Same Node warning. |

Relevant web test script:

- No dedicated `web` test script was found during this QA pass, so no additional web tests were run.

## Sitemap Verification

Built sitemap was inspected from the generated artifact.

Approved calculator URLs present:

- `/calculator/royal-caribbean`
- `/calculator/carnival`
- `/calculator/norwegian`
- `/calculator/msc`
- `/calculator/disney`
- `/calculator/celebrity`
- `/calculator/princess`
- `/calculator/holland-america`

Unapproved placeholder calculator URLs absent:

- `/calculator/virgin-voyages`
- `/calculator/azamara`
- `/calculator/viking`

## Metadata Verification

Generated build output showed Batch 1 metadata for priority pages, including:

- Hidden costs blog title: `Hidden Cruise Costs: 15 Fees to Budget Before You Book`
- Drink package guide title: `Cruise Drink Package Calculator: Is It Worth It?`
- Tipping guide title: `Cruise Gratuity Calculator + Tipping Guide`
- Royal Caribbean calculator title: `Royal Caribbean Cruise Cost Calculator: Estimate Your Real Total`

## Tracking Baseline

Batch 1 event helpers exist for:

- `calculator_started`
- `calculator_completed`
- `result_shared`
- `app_store_click`
- `google_play_click`
- `save_trip_clicked`
- `blog_cta_click`
- `outbound_affiliate_click`
- `port_page_affiliate_click`
- `utm_landing_visit`

GA4 is gated behind `NEXT_PUBLIC_GA_MEASUREMENT_ID`. No CruiseKit measurement ID was present in `apps/web/.env.local` during this QA pass, so production event delivery was not validated.

## Build Side Effects

The web build regenerated bundle JSON files under `apps/web/public/data/bundles/` and `data/bundles/`. Those generated side effects were reverted after sitemap verification because they were unrelated to the growth changes.

## Merge/Deploy Readiness

Local Batch 1 QA passed, subject to the deployment gate:

- Do not deploy automatically.
- Ask for explicit merge/deploy approval.
- After deployment, run Search Console URL inspection, sitemap submission if needed, and analytics QA.
