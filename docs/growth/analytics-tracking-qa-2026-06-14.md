# Analytics Tracking QA - 2026-06-14

## Configuration

GA4 loader:

- `apps/web/components/shared/analytics-loader.tsx`

Event helper:

- `apps/web/lib/analytics.ts`

Environment state:

- `apps/web/.env.local` exists.
- Production GA4 is configured on the live site with measurement ID `G-X6NEBF4X3N`.
- Live homepage HTML exposes `gtag` and `G-X6NEBF4X3N`.
- GitHub Pages workflow run `27517472182` completed successfully with the GA4 deploy configuration.

## Event Wiring

| Event | Local wiring status | Notes |
| --- | --- | --- |
| `calculator_started` | Present | Fired from calculator form start flow. |
| `calculator_completed` | Present | Fired from calculator form completion flow. |
| `result_shared` | Present | Fired by shareable calculator result behavior. |
| `app_store_click` | Present | Fired by store badge click helper for iOS. |
| `google_play_click` | Present | Fired by store badge click helper for Android. |
| `save_trip_clicked` | Present | Fired by save/heart interaction helper. |
| `blog_cta_click` | Present | Fired by blog CTA link helper. |
| `outbound_affiliate_click` | Present | Fired by affiliate link helper. |
| `port_page_affiliate_click` | Present | Fired when affiliate source is a port-page source. |
| `utm_landing_visit` | Present | Fired by UTM landing tracker with session dedupe. |

## QA Result

Local event-name wiring is present, and production browser/network validation now confirms all required GA4 event names are emitted by the deployed site.

## Post-Deployment Check

Deployment commit: `9a5e98a`
GA4 configuration deploy commit: `84880fd`
GA4 configuration deploy: GitHub Pages workflow run `27517472182`

Live checks after deployment:

- Priority pages loaded on `https://cruisekit.app/`.
- Live homepage HTML exposes `googletagmanager`, `gtag`, and `G-X6NEBF4X3N`.
- Live GA4 network requests were observed with Playwright against production.

No unrelated GA4 property was used.

## Live Event QA

Run time: 2026-06-14 21:04 ET / 2026-06-15T01:04Z

Evidence file: `docs/growth/ga4-live-event-qa-2026-06-14.json`

| Event | Live GA4 network status | Interaction tested |
| --- | --- | --- |
| `utm_landing_visit` | Observed | Loaded `/calculator/` with unique QA UTM parameters. |
| `calculator_started` | Observed | Selected Carnival, entered fare, clicked `Next: Add-Ons`. |
| `calculator_completed` | Observed | Clicked `See Results` from the calculator add-ons step. |
| `result_shared` | Observed | Clicked `Share this gap` on the calculator result. |
| `app_store_click` | Observed | Clicked the App Store badge from the calculator/result surface. |
| `google_play_click` | Observed | Clicked the Google Play badge from the calculator/result surface. |
| `save_trip_clicked` | Observed | Clicked the first `Save this cruise` heart on `/cruises/`. |
| `blog_cta_click` | Observed | Clicked the tracked in-article CTA on `/blog/hidden-cruise-costs/`. |
| `outbound_affiliate_click` | Observed | Clicked the first Viator/affiliate link on `/ports/cozumel/`. |
| `port_page_affiliate_click` | Observed | Same port affiliate click emitted the port-page-specific event. |

Note: an initial blog CTA probe clicked the global header calculator link and did not emit `blog_cta_click`; the corrected probe clicked the in-article `Calculate your real cruise total before you book` CTA and observed the event.

## Required Follow-Up

1. Build the weekly scorecard from Search Console and GA4 once enough post-deploy data accumulates.
2. Monitor calculator start/completion, result share, app store click, save trip, and affiliate click rates by source/medium/campaign.
3. Keep using unique QA UTM campaigns for future event testing to avoid session dedupe.

Do not use an unrelated analytics property for CruiseKit QA.
