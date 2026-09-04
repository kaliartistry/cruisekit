# CruiseKit Web Measurement and Attribution Contract

Last updated: 2026-09-04

This contract is enforced by `apps/web/lib/analytics-contract.ts`. Website
analytics remains off until the visitor explicitly grants consent. Event names
and parameters outside the code allowlist are dropped. GA4 therefore reports a
consenting-user floor, not a complete traffic or conversion denominator.

CruiseKit does not send names, emails, booking references, exact sailing IDs,
exact fares, exact monetary results, free text, query strings, fragments, or
full URLs. Paths are bounded pathnames only. Campaign/source values are bounded
opaque tokens. Party size and nights are buckets.

## Calculator funnel

| Event | When | Allowlisted context |
|---|---|---|
| `calculator_viewed` | Total-cost calculator mounts | calculator family, entry path, source surface, device category |
| `calculator_started` | Visitor advances from trip basics for the first time | family, cruise-line ID, entry path, manual-fare boolean, party/nights buckets, single/comparison |
| `calculator_completed` | Historical continuity event for a newly generated result signature | same bounded result context as generated |
| `calculator_result_generated` | A unique result signature is generated in the session | family, cruise-line ID, entry path, manual-fare boolean, category count, party/nights buckets, single/comparison |
| `calculator_result_saved` | Visitor saves a result in local browser storage | family, cruise-line ID, party/nights buckets, single/comparison, browser target |
| `calculator_result_returned` | Visitor restores a locally saved result | family, cruise-line ID, party/nights buckets, single/comparison |
| `result_shared` | Historical continuity event after a successful share/copy | family, cruise-line ID, single/comparison, method |
| `calculator_result_shared` | Result is successfully shared or copied | family, cruise-line ID, single/comparison, method |
| `result_copied` | Clipboard fallback succeeds | family, cruise-line ID, single/comparison |

`calculator_completed` and `calculator_result_generated` are deduplicated in
session storage on the complete bounded result signature. The storage key
contains no monetary amount or exact trip identifier.

`session_entry` records pathname and device category for consented sessions even
when no UTM parameter is present. `utm_landing_visit` remains the bounded
campaign-specific counterpart when a safe UTM token is present.

## App offer and store funnel

| Event | When | Allowlisted context |
|---|---|---|
| `app_offer_viewed` | Post-result or other app handoff renders | family when applicable, placement, source surface, device category |
| `app_handoff_viewed` | Historical continuity counterpart | same bounded offer context |
| `qr_offer_displayed` | A store QR is visible on desktop | platform, family when applicable, placement, source surface, desktop |
| `app_store_click` | App Store badge or QR link is opened | family when applicable, placement, source surface, device category |
| `google_play_click` | Play badge or QR link is opened | family when applicable, placement, source surface, device category |
| `app_handoff_clicked` | Store/deep-link handoff is opened | platform plus bounded distribution context |

Desktop post-result offers provide separate App Store and Google Play QR codes.
Apple links use App Store Connect provider token `128557928` and a bounded `ct`
campaign label such as `cost_result`, `saved_trip`, `footer`, or `port_guide`;
`ct` is never a user identifier. Google Play links preserve safe inbound UTM
source/medium/campaign values inside the encoded Install Referrer and add the
bounded website placement as `utm_content`.

## Other existing events

The enforced contract also covers app landing, download/calculator CTAs,
distribution saves and handoffs, MyCrew invitations, bounded UTM landing visits,
viewable affiliate offers and clicks, and the drink-package calculator. Existing
`outbound_affiliate_click` remains for continuity while `affiliate_click` is the
canonical counterpart. Drink calculator events use
cruise-line slugs, party/nights buckets, result buckets, and a completion
boolean only.

## Consent operations

No consent-prompt event is sent to GA4 before consent. A first-party essential
operational sink has not been introduced because the current repository has no
approved no-identifier retention and disclosure architecture for it. Until that
exists, acquisition and conversion rates based on these events must be labelled
as consenting-user floors.
