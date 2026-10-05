# Truthful pricing candidate — October 5, 2026

This is a review candidate on `codex/truthful-pricing-20261005`. Website HOLD and the submitted native 1.0.28 (56) artifacts remain unchanged. No customer data, production, store, subscription, provider, credential or security-setting changes were made. Older store notes are historical; store status was not rechecked here.

## Calculation contract

- USD only. A quote explicitly represents a booking/whole party, each person, or each cabin. Per-person and per-cabin quotes assume equal prices; otherwise enter the booking total. The party total is multiplied once.
- Exact nights replace duration buckets, including separate five- and six-night choices. Gratuities use guests × exact nights × stored cabin rate; suite rates are distinct.
- Included required taxes/fees add zero. Excluded taxes require an explicit whole-party amount. Unknown inclusion produces a prominently labeled subtotal, with unresolved taxes excluded. Daily-average government fees never establish a booking's taxes.
- Conditional Carnival fixture: two guests, seven nights, stored USD 17 standard gratuity rate, no optional extras. Included USD 2,000 + 238 = 2,238. Excluded USD 2,000 + 308 + 238 = 2,546. These are arithmetic examples, not all-fare terms or fresh booking quotes. Five nights adds 170; six nights adds 204. Stored gratuities may differ from a prepaid/bundled quote; confirm inclusions.
- Visible amounts retain cents, line items round before summation, and invalid/negative/nonfinite amounts fail validation. Changed native inputs clear old results. Optional activity spend defaults to zero.
- Comparisons use the same entered fare and historical add-on assumptions, and do not identify a cheaper live sailing. Unknown native package-rate placeholders are excluded and visibly labeled; confirm their current rates separately.

## Source evidence and fallback

[Official Carnival US offer terms](https://www.carnival.com/legal/specials-terms-conditions), reviewed October 5, describe matching offers as per person at their stated occupancy and include required cruise fees/expenses and government taxes. Gratuities and packages have separate terms. Verify the particular offer, currency and occupancy; do not generalize inclusion to every booking.

[Official MedjetAssist](https://medjetassist.com/medjetassist) rendered annual-pricing = 315 and short-term-pricing = 99 on October 5. The page and [membership options](https://medjetassist.com/membership-options) identify regular individual annual and 8-day short-term products. The $99/year claim is corrected to individual 8-day from $99 versus annual from $315 USD. Standard short-term eligibility is US/Canada/Mexico residents under 75; Diamond ages 75–84, family, discounts and Horizon have separate terms/prices. Enroll before departure. Inpatient hospitalization at least 150 miles from home, destination inpatient care and medical stability apply. This is transport membership, not medical-treatment insurance. Rendered source evidence is in the task QA receipt; no enrollment/purchase occurred.

[GitHub issue 52](https://github.com/kaliartistry/cruisekit/issues/52), run 37304778690/job 111745718915, artifact 11343353124: retrieved the actual artifact, SHA-256 `5d55ccd23a0678a2b4d467518b1cc18e586426e9dc9c61276d8c4bce219f07f6`, 146,388 bytes. The fresh report generated October 5 at 11:48:09Z says 362/362 public checks are 40–96 days old against the seven-day policy (NCL 184, Carnival 136, Virgin 27, Holland 15).

Ingest succeeded; the public freshness gate failed. Publish-candidate was skipped by its separate schedule condition. Older “latest” review files in the artifact must not be treated as October 5 observations. Fresh Carnival staged 1,023 / 23 material changes and NCL staged 142 / 30 changes are 53 review candidates, not verified live quotes. Prima October 11 seed 679 → staged 879 and Valor October 22 476 → 731 remain unpromoted. NCL coverage is Caribbean-only; 89 NCL / 9 Carnival missing records are not confirmed cancellations.

No sailing fare was re-stamped, approved or promoted. The preserved web candidate has 388 historical records (July 1 checks); its seven-day gate correctly fails all 388. The preserved native deal asset has 373 records (225 July 1 and 148 August 26 checks), all stale on October 5. These differ from GitHub's 362-record public cohort. Generated app-export data establishes provenance, not pricing authority.

Each browsing card shows currency, source basis and recorded check date/status. Stale/unverified prices cannot prefill a current calculator quote or become current native budget/total estimates or price-watch alerts. Historical March 28 fare tables cannot autofill. Historical add-on defaults are identified as planning assumptions: March 28 web, stored September 10 native data. Official current rates for all providers have not been reverified.

## Durable checks and next gate

Runtime guards recompute age against the current clock with a seven-day bound; invalid, missing and future dates are unverified. Existing daily data automation is reused, with an explicit freshness failure and the existing issue updater; the weekly gate and report-only publishing behavior remain. No new scheduler, credentials or paid provider is introduced. This daily change is only in the candidate branch until separately approved integration.

The existing upstream canonical `apps/web/lib/data/price-facts.ts` at GitHub main 5df4a472 was inspected. The older held web checkout predates it; this candidate does not invent an alternate authoritative price table or overwrite that newer module. Reconcile this held candidate with current GitHub source before release.

Before any release, review current quote/package terms and cross-repository integration, run accepted candidate QA, then obtain Kali's specific release approval. The signed IPA/AAB/dSYMs remain frozen. The debug simulator target is not the submitted build 56 artifact; an approved new release build/version is required. No deployment or store upload is authorized by these notes.

## Verification and rollback

Verification checkpoint: web 57/57 tests, TypeScript and local static build passed; native 362/362 full tests, 28/28 focused tests and analyzer passed; real iPhone simulator integration passed. Compiled desktop/phone calculator regressions passed; an inherited phone insurance-guide overflow was repaired. Calendar dates render in UTC to preserve source day/month. The task QA folder stores focused and full test logs, TypeScript/analyzer output, local static web build, browser regressions, real iPhone simulator integration/screenshots, source-input/secret and symlink audits, and the downloaded artifact. Web flows cover desktop 1440 and phone 390 widths, keyboard, validation errors, repeat input edits, fare units, cents, inclusive/exclusive/unknown taxes and stale-prefill suppression. Native tests cover calculations and phone/tablet layouts plus the iPhone platform flow using real wizard widgets, bundled sources and the production theme; analytics/review prompts are disabled only in the test harness.

No signed release/Android installer or physical-device release QA was run: the initial scope prohibits changing the frozen artifacts or publishing. No claim of a live/current sailing quote is made. Browser external image requests were intentionally blocked during local app QA, yielding resource warnings but no uncaught page errors.

Rollback is to discard the pricing commit(s) on these candidate branches or compare against the preserved baseline below. Originals, held review/export checkouts, source datasets and frozen binaries are untouched; no production rollback is needed. Do not merge a candidate baseline wholesale to main/master without integration review.

## Preserved web baseline

Baseline commit `ca2d0cece51fa7249301d7a23a4cf71aa1a3f156`; prior held/source parent `6f7e3686727f228ea1749eba57f195e2e6ef49be`; source ancestry parent `fc1588d993b7aa3eac77aa7200e7ca49f56cc09f`. Full source inputs are independent internal copies. Native's 367 formerly untracked held inputs exactly match original tracked files and were preserved in the baseline. The pricing diff is separate from inherited design work.
