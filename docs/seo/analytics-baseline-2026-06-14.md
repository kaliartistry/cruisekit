# Analytics Baseline - 2026-06-14

## Summary

This baseline is intentionally conservative. Google Search Console and Google Play Console provided CruiseKit-specific data. GA4 was accessible, but the visible active properties did not include a CruiseKit web property, so GA4 web analytics are marked unavailable rather than substituted with another product's data. App Store Connect was accessible, but CruiseKit analytics were unavailable for the app.

## Google Search Console

Property used: URL-prefix property `https://cruisekit.app/`. The domain property `sc-domain:cruisekit.app` returned an access error.

The 3-month, 6-month, and 12-month exports all contained the same effective chart window because the property only had visible data from 2026-05-26 through 2026-06-12.

Topline web search metrics:

- Clicks: 8
- Impressions: 827
- CTR: 1.0%
- Average position: 37.1
- Indexed pages visible in overview: 15 indexed, 6 not indexed
- FAQ enhancement overview: 3 valid, 0 invalid

Country split from the 3-month export:

| Country | Clicks | Impressions | CTR | Avg position |
| --- | --- | --- | --- | --- |
| United States | 7 | 689 | 1.02% | 40.6 |
| Canada | 1 | 15 | 6.67% | 18.13 |
| New Zealand | 0 | 13 | 0% | 45.31 |
| Netherlands | 0 | 11 | 0% | 8.73 |
| United Kingdom | 0 | 10 | 0% | 22.5 |
| India | 0 | 8 | 0% | 25 |
| Germany | 0 | 6 | 0% | 9.67 |
| Brazil | 0 | 5 | 0% | 7.8 |
| Australia | 0 | 5 | 0% | 24 |
| France | 0 | 4 | 0% | 9 |

Device split from the 3-month export:

| Device | Clicks | Impressions | CTR | Avg position |
| --- | --- | --- | --- | --- |
| Desktop | 4 | 629 | 0.64% | 40.18 |
| Mobile | 4 | 195 | 2.05% | 27.58 |
| Tablet | 0 | 3 | 0% | 4.67 |

## GA4

GA4 was accessible in Chrome, but the visible properties were EventSync and Kali Artistry properties. No CruiseKit GA4 property was visible in the account/property picker. The active report pages contained EventSync landing pages such as `/day-of-coordinator-app`, `/wedding-timeline-app`, and `/gift-admin`, so those numbers were not used for CruiseKit.

Result: CruiseKit web analytics baseline is unavailable until the correct GA4 property is connected or a manual export is provided.

## Google Play Console

App: CruiseKit: Cruise Planner, package `com.cruisekit.mobile`.

Dashboard and acquisition data observed:

- Production release: released 2026-06-09, rollout 100%
- Release installs: 1
- Last 28 days Grow overview: 16 device acquisitions, 10 first opens, 13 MAU, 8 seven-day retention
- Store analysis date range: 2026-05-13 through 2026-06-09
- Total acquisitions: 14
- Google Play explore acquisitions: 2
- Store listing visitors: 15
- Store listing acquisitions: 11
- Store listing conversion rate: 73.33%
- Countries/regions: India 11 store listing acquisitions
- UTM sources/campaigns: no UTM source or campaign specified for 11 store listing acquisitions
- Search terms: no data for selected configuration

## App Store Connect

App: CruiseKit: Cruise Planner, app id 6770305548, iOS 1.0.1 Prepare for Submission.

App Analytics page returned: "This app is currently unavailable for Analytics. If you think you should have access to App Analytics, contact your App Store Connect user with the admin role."

Result: App Store acquisition baseline is unavailable until analytics access is granted or the app becomes eligible for analytics.

## Tracking Implication

The implementation phase should add or normalize tracking only after keyword-map approval. Priority events remain: `calculator_started`, `calculator_completed`, `result_shared`, `app_store_click`, `google_play_click`, `save_trip_clicked`, `blog_cta_click`, `outbound_affiliate_click`, `port_page_affiliate_click`, and `utm_landing_visit`.
