# Analytics Tracking QA - 2026-06-14

## Configuration

GA4 loader:

- `apps/web/components/shared/analytics-loader.tsx`

Event helper:

- `apps/web/lib/analytics.ts`

Environment state:

- `apps/web/.env.local` exists.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` was not present during local QA.
- Production GA4 delivery was not validated because no CruiseKit GA4 measurement ID/property was configured locally.

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

Local event-name wiring is present. Browser/network validation against GA4 is blocked until a real CruiseKit GA4 stream ID is configured.

## Required Follow-Up

When the production GA4 stream exists:

1. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to the deployed web environment.
2. Open the deployed site with `?utm_source=qa&utm_medium=test&utm_campaign=batch_1_tracking_qa`.
3. Confirm `utm_landing_visit` in GA4 DebugView or Realtime.
4. Start and complete calculator flow; confirm `calculator_started` and `calculator_completed`.
5. Share calculator result; confirm `result_shared`.
6. Click app badges; confirm `app_store_click` and `google_play_click`.
7. Click blog CTA; confirm `blog_cta_click`.
8. Click excursion/affiliate link from a port page; confirm `port_page_affiliate_click`.
9. Click affiliate link outside port page; confirm `outbound_affiliate_click`.

Do not use an unrelated analytics property for CruiseKit QA.
