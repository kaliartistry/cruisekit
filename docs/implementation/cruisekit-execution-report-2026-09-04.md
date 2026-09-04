# CruiseKit execution report — September 4, 2026

This is the end-to-end implementation record for the September 4 CruiseKit
distribution handoff. Work was performed from the production website default
branch and the mobile app's verified shipped lineage. Current production,
first-party store state, and current official cruise-line sources were used
when they differed from the research snapshot.

## Executive result

- All website P0 work and the ordered website calculator/planning follow-up are
  merged to `main`, deployed, and live at `https://cruisekit.app`.
- The public data feed was rebuilt from the current source and now publishes
  422 current/future sailings with zero returned rows and no health warnings.
- Android 1.0.21 code 48 is a completed 100% Production release. The Play
  listing now uses the CruiseKit name and the corrected metadata.
- iOS 1.0.21 build 48 is signed, uploaded, processed as VALID, attached, and
  submitted to App Review. Both version and review submission read back
  `WAITING_FOR_REVIEW`; release type remains MANUAL.
- Search Console confirms the sitemap submission, GA4 collection and the live
  dashboard were read back, and current Play/App Store acquisition and
  stability panels were inspected without changing advertising state.
- The final passenger QA passed on the production website and on a fresh
  Android 36 install. Android QA found one save-flow defect; it was fixed,
  regression-tested, merged, rebuilt as code 48, and published before this
  report was closed.
- No purchase was made. No paid campaign, budget, bid, or advertising spend was
  created or increased.

## Production releases and rollback points

| Batch | Scope | PR / production commit | Deployment | Rollback |
| --- | --- | --- | --- | --- |
| A | Calculator arithmetic, price/cohort facts, central register, methodology and freshness governance | [PR 67](https://github.com/kaliartistry/cruisekit/pull/67) / `a44a4106de8760a9a26e0abcfe57fcb5dfba6f3d` | [Pages run 33907348536](https://github.com/kaliartistry/cruisekit/actions/runs/33907348536), success | `rollback/web-before-release-a-20260904` |
| B | Sitemap/canonical repair, ship-time answer page, five-port arrival pilot | [PR 68](https://github.com/kaliartistry/cruisekit/pull/68) / `3871fa9bdeced2cf6aff96a3297e738d6f2274cc` | [Pages run 33908487710](https://github.com/kaliartistry/cruisekit/actions/runs/33908487710), success | `rollback/web-before-release-b-20260904` |
| C | Consent-aware measurement, save/share/app offers, QR, Apple tokens, Play referrer | [PR 69](https://github.com/kaliartistry/cruisekit/pull/69) / `866c450e9c77b5787e4bcb47f77615f4ef3a5121` | [Pages run 33909046692](https://github.com/kaliartistry/cruisekit/actions/runs/33909046692), success | `rollback/web-before-release-c-20260904` |
| D | Calculator UX, gratuity relocation, Wi-Fi/purchase-timing comparison, payment deadline and `.ics` calendar | [PR 70](https://github.com/kaliartistry/cruisekit/pull/70) / `3673666356b489f147b56aba4b1f45b52d876eac` | [Pages run 33910820754](https://github.com/kaliartistry/cruisekit/actions/runs/33910820754), success | `rollback/web-before-release-d-20260904` |
| Data refresh | Current production sailing/deal bundles | [PR 72](https://github.com/kaliartistry/cruisekit/pull/72) / `183b567bcbfb00e4ed89a2f13c162c91745f449f` | [Pages run 33918254163](https://github.com/kaliartistry/cruisekit/actions/runs/33918254163), success | Revert PR 72 merge; code rollbacks above remain intact |

The dirty historical checkout at `/Users/kaliartistry-mac/Cruise Travel Agent`
was preserved. Integration, testing, and release work used isolated clean
worktrees.

## P0 implementation

### Calculator truth and freshness

- Corrected fare semantics so the entered advertised fare is explicitly per
  person and is multiplied by the party size exactly once.
- Corrected gratuity and package facts against current official sources,
  including Carnival's current standard rate, Virgin Voyages' pre-October 7,
  2025 legacy cohort versus current prepaid/onboard cohorts, NCL's current
  Free at Sea positioning, and Princess package/final-payment cohorts.
- Removed the invalid Virgin standard-versus-suite model. Current Virgin
  gratuities use booking date and payment timing, not cabin class.
- Kept Royal Caribbean and Celebrity package pricing as traveler-entered live
  quote inputs because the lines do not publish one universal sailing price.
- Centralized governed facts with source URL, retrieval date, recheck date,
  status, scope/conditions, and an append-only audit trail. Tests fail closed
  for expired or inconsistent facts.
- Rebuilt the methodology page around inputs, equations, cohorts, uncertainty,
  confirmation language, and price freshness.

### Search and zero-click recovery

- Repaired trailing-slash canonical consistency and regenerated the sitemap.
- Preserved measured calculator parameter URLs as indexable. A live parameter
  route returns `index, follow` and canonicals to the clean calculator URL.
- Added the direct-answer ship-time versus port-time guide.
- Added a single-switch five-port arrival pilot for Half Moon Cay, Falmouth,
  Aruba, Curaçao, and Celebration Key. Each page answers dock/tender status,
  explains passenger-day impact, shows its verification date, and links to
  official sources.
- The production sitemap returns HTTP 200 and includes the ship-time page and
  all five pilot pages.

### Measurement and attribution

- Added an allowlisted, bounded analytics contract with consent gating. It does
  not send fares, spend amounts, notes, names, emails, booking details, invite
  codes, full URLs, or query strings.
- Added reachable calculator start, completion, save, restore, share/copy,
  app-offer, QR/store-click, and affiliate impression/click events.
- Added a 30-day local result save and restore flow, a post-result app offer,
  desktop QR codes, Apple provider token `128557928` with bounded `ct` values,
  and Android Play URLs that preserve bounded UTMs in Install Referrer.
- Moved mobile funnel events into reachable MyDay, add-cruise, Spend, itinerary,
  port, MyCrew/deep-link, and share paths. Later-day activation is emitted once
  only when a saved cruise is used on a later local date.
- Production network inspection confirmed the deployed GA collection requests.
  With consent granted, the completed calculator journey emitted
  `session_entry`, `calculator_started`, `calculator_completed`,
  `calculator_result_generated`, `qr_offer_displayed`,
  `app_handoff_viewed`, and `app_offer_viewed`. No request contained a fare,
  full URL, or PII.
- The authenticated GA4 property is CruiseKit property `541659242`, measurement
  ID `G-X6NEBF4X3N`; the mobile Firebase configuration identifies project
  `cruisekit-app`. Its September 4 dashboard read-back showed 27 active users,
  51 views, and 217 events in the preceding seven days; the current event table
  included 29 `app_handoff_viewed`, 16 `calculator_started`, and 13
  `result_viewed` events. GA4 remains a consenting-user floor.
- Search Console property `https://cruisekit.app/` confirmed the live
  `sitemap.xml` submission with the message that Google will process it and
  monitor future changes.
- The authenticated three-month Search Console report (last update seven hours
  before read-back) showed 399 clicks, 34.4K impressions, 1.2% CTR, and average
  position 16.2. Its separate Generative AI features beta report showed 7.98K
  impressions from June 3 through September 2. Top AI-feature pages were the
  main calculator (1,226 impressions), Royal Caribbean calculator (1,065),
  drink-package calculator (764), MSC calculator (699), Carnival calculator
  (695), and Norwegian calculator (566). Google exposes impressions but not
  click or CTR totals in that beta report, so none were inferred.

## Ordered follow-up implementation

- The gratuity calculator is now a first-class calculator destination; the old
  guide path redirects to it.
- The payment-deadline calculator covers cruise-line/booking cohorts, displays
  package cutoffs, and exports verified all-day `.ics` reminders with a clear
  invoice-confirmation warning.
- Calculator add-ons now expose purchase timing and total-voyage impact.
  Carnival's public pre-cruise/onboard Wi-Fi comparison and current CHEERS
  timing are explicit; dynamic-price lines require the passenger's quote.
- Device/store naming is aligned to `CruiseKit`; MyDay remains the day-planning
  feature name.
- Android uses the official Install Referrer client and current edge-to-edge
  behavior.
- Unreachable encrypted walking-graph and POI payloads were removed from the
  release bundle. The code-48 AAB is 64,616,177 bytes, down 90,791,698 bytes
  (58.4%) from the recorded 155,407,875-byte bundle.
- Native Android and iOS countdown widgets use only the active cruise's
  departure and return dates in shared native storage. They support empty,
  countdown, sailing-today, onboard, and completed states and deep-link to
  MyDay without copying ship, itinerary, cabin, booking, spend, crew, invite,
  or identity data.

## Mobile commits and stores

The shipped lineage is `codex/fix-missing-cruises-20260825`; GitHub `master`
remains a divergent documentation pointer and was not rewritten while
[issue 17](https://github.com/kaliartistry/CruiseKit-Mobile/issues/17) is open.

| Change | Commit / merge |
| --- | --- |
| Privacy-safe events, referrer, naming, reliability, asset cleanup, 1.0.21+47 | `3aa3255` |
| Native iOS and Android countdown widgets | `76cb5df` |
| Store metadata | `c96413e` |
| Empty iOS define-list release-script repair | `dba18b3` |
| Passenger save-flow correction and 1.0.21+48 | `27c976f` |
| Implementation integration | [PR 28](https://github.com/kaliartistry/CruiseKit-Mobile/pull/28), merge `537f0b5b848c5721e20fb8cc6fb49758efada97f` |
| Passenger correction | [PR 29](https://github.com/kaliartistry/CruiseKit-Mobile/pull/29), merge `5641647b6149550d18da68d24dc7a54f3e02bc8e` |
| Release metadata and signing integration | [PR 30](https://github.com/kaliartistry/CruiseKit-Mobile/pull/30), merge `766375801298bbc0afa5d102a16d8b1b3065ab14` |
| Widget distribution signing | [PR 31](https://github.com/kaliartistry/CruiseKit-Mobile/pull/31), merge `13701e1befb5ec40b86d2a3d20a4771edc9df68c` |
| Current production catalog | [PR 32](https://github.com/kaliartistry/CruiseKit-Mobile/pull/32), merge `026fb6148be18611e37febfe6e534bdf6c47c8bb` |
| Widget executable metadata | [PR 33](https://github.com/kaliartistry/CruiseKit-Mobile/pull/33), merge `3a248ad90d448aed8175f86dcb8db6f41c2cc5fa` |
| Final signed-release and store handoff | [PR 34](https://github.com/kaliartistry/CruiseKit-Mobile/pull/34), merge `265d3de7f406940eb4bf73fb23437b9efea78b08` |

### Google Play

- Production: `1.0.21`, version code `48`, status `completed`, 100%.
- Title: `CruiseKit: Cruise Day Planner`.
- Short description: `Cruise countdown, port guides, ship time, spend and drink package value.`
- Signed AAB SHA-256:
  `8fde59021bf6d5d1b647e2c14795116109cd5d7f51267c67553cf8f86a0ac487`.
- Target SDK 36; no Advertising ID or location permission in the merged
  manifest. Historical ad data was not changed and no campaign controls were
  touched.

### App Store Connect

- Public version: 1.0.20, `READY_FOR_SALE`.
- Candidate: 1.0.21, `WAITING_FOR_REVIEW`, manual release.
- The public 1.0.20 listing still displays `MyDay by CruiseKit`; the submitted
  1.0.21 metadata carries the CruiseKit naming alignment and will not become
  public unless App Review approves it and it is manually released.
- App Store version ID: `ef4de2d0-85df-4395-aa95-8dbc89dd01ec`.
- Metadata is aligned to `CruiseKit: Cruise Day Planner`; subtitle, keywords,
  description, promotional text, release notes, and the required age-rating
  answers are updated.
- Screenshot correction is complete: eight `COMPLETE` iPhone 6.7-inch images
  and eight `COMPLETE` iPad 13-inch images, correctly ordered. Four duplicate
  retry records were removed.
- Widget bundle identifier `com.cruisekit.mobile.CountdownWidget` was
  registered as Apple resource `722538D2FS`; App Groups capability is enabled
  on it and on main app resource `PT5P32D98M`.
- App Group `group.com.cruisekit.mobile` is registered as resource
  `8YUQ3N2N8M` and associated to both bundles. Regenerated distribution profile
  UUIDs are `6aa5ed22-1ba3-4f10-a00d-027aeaa7b36c` for the host and
  `f4af0d4d-4160-4f53-acde-671ac99504fb` for the widget.
- Final IPA SHA-256:
  `ff857c3457cba006fa3122e81fb68ebe23806a85b8c3bd40f07a2b60653d6b7a`
  (54,457,130 bytes). Apple delivery/build UUID:
  `e9df64dd-fa9c-4ed0-a713-7d21fb6c1b26`; processing is VALID, the build is
  App Store eligible, and `usesNonExemptEncryption=false`.
- Build 48 is attached to 1.0.21. Review submission
  `502a87a0-4eb1-4339-be82-72d1f4014efd` was submitted at
  `2026-09-04T21:16:32.058Z` and reads `WAITING_FOR_REVIEW`.

### Current first-party distribution baseline

- Google Play's dedicated device-acquisition report for August 7 through
  September 3 shows 395 impressions, 10 acquisitions (9 Explore and 1 combined
  Paid and direct), 6 first opens, and 7 monthly active devices. The combined
  bucket cannot establish that its one acquisition came from paid ads.
- App Store Analytics for June 6 through September 3 shows 5.59K impressions,
  141 product-page views, 54 first-time downloads, 1 redownload, 96 updates,
  and a 1.28% daily-average conversion rate. First-time downloads split to 32
  App Store Search, 9 Web Referrer, 6 App Referrer, 4 Browse, and 3
  Unavailable.
- Apple campaign and retention panels say there is not enough data. Apple
  crashes and Play code-48 crash/ANR rates are also unavailable at current
  volume; dashes were not treated as zero. Play showed no crash/ANR issue
  clusters for the current release.

## Verification

### Website release gates

- Release A: 69 tests, lint, and 191-page production build passed.
- Release B: 75 tests, lint, production build, and SEO export verification
  passed.
- Release C: 86 tests, lint, production build, attribution-link inspection,
  and desktop/mobile passenger QA passed.
- Release D: 96 tests across 25 files, lint, 193-page production build, and SEO
  verification passed; the sitemap contains 179 URLs.
- Data refresh: production manifest generated
  `2026-09-04T20:51:29.484Z`, with 422 mobile sailing rows and zero returned
  rows. Live and embedded mobile SHA-256 values match exactly:
  `00f8754371e0b5956e268a2b53104a2fd68f4c97d21054724735be6cbd59f552`
  for sailings and
  `bff624855cb009bf14b3c9b5b5fd0f64e19de38cf2ea4899fb325c18a45f4c49`
  for the deal view.

### Final production passenger QA

Playwright exercised 18 desktop/mobile page states against production with
zero console errors, zero non-navigation request failures, and zero horizontal
overflow:

- Carnival, 7 nights, two adults, $1,250 per-person fares: advertised total
  $2,500; gratuities $238; port fees/taxes $308; real total $3,046.
- Result save, reload/restore, and share/copy succeeded. Desktop rendered two
  store QR codes. Apple links contained `pt=128557928` and bounded `ct`; Play
  links contained the encoded Install Referrer campaign fields.
- Current Virgin onboard cohort: $22 × 2 guests × 7 nights = $308.
- Princess new-booking sailing date June 15, 2027: February 15, 2027
  final-payment planning date and June 11, 2027 package cutoff. Both dates were
  verified inside the downloaded calendar file, and the invoice-confirmation
  warning remained visible.
- Ship-time answer, all five port answers, their canonicals, and their source
  links rendered correctly.
- Home, calculator, gratuity, deadline, ship-time, port, and calculator-result
  pages passed at 390 × 844 CSS pixels.

Rendered evidence on the release host:

- `/tmp/cruisekit-final-passenger-qa/01-calculator-result-desktop.png`
- `/tmp/cruisekit-final-passenger-qa/02-gratuity-virgin-onboard.png`
- `/tmp/cruisekit-final-passenger-qa/03-deadline-princess.png`
- `/tmp/cruisekit-final-passenger-qa/06-deadline-princess-future.png`
- `/tmp/cruisekit-final-passenger-qa/cruisekit-princess-deadlines-2027.ics`
- `/tmp/cruisekit-final-passenger-qa/04-calculator-result-mobile.png`
- `/tmp/cruisekit-final-passenger-qa/evidence.json`

### Mobile release gates and passenger QA

- `flutter analyze`: clean.
- `flutter test`: 258/258 passed.
- Android debug APK, signed release AAB, and iOS simulator with embedded Widget
  extension compiled.
- The signed iPhone+iPad archive and export succeeded. Strict signature
  verification passed for the host and widget; both are 1.0.21 (48), both carry
  `group.com.cruisekit.mobile`, and the widget exports its executable plus
  `__swift5_entry` and `LC_MAIN`.
- Fresh Android 36 passenger journey passed: launch, choose Carnival, October
  2026, select a sailing, save, MyDay countdown, $15 Spend quick-add and tip
  prompt, share/copy, More, itinerary-only Ports, and Grand Cayman tender guide.
- QA found that an early sailing selection in a 41-result list left the Save
  action below the remaining results. Build 48 now scrolls to optional details
  and `Save selected cruise`; a 25-row regression test and fresh-device proof
  pass.

## Before/after evidence

| Before | After |
| --- | --- |
| A per-person fare could be treated as a party total | Explicit per-person input, one party-size multiplication, tested $2,500 base for two $1,250 fares |
| Virgin used a cabin-class model and stale included-gratuity assumption | Legacy-versus-current booking cohorts plus prepaid/onboard timing |
| Price facts and dates were distributed and weakly governed | Central typed register, audit trail, retrieved/recheck dates, expiry tests, methodology |
| Sitemap/canonicals omitted or conflicted for important routes | Live 179-URL sitemap, canonical consistency, measured parameter URLs preserved |
| Ship-time and tender questions lacked direct, source-backed answers | Ship-time page plus five verified dock/tender pilot answers |
| Calculator ended at a result with incomplete attribution | Save/restore/share, app offer, desktop QR, Apple token, Play referrer, consent-aware events |
| Key mobile events lived in dormant code and no install referrer was captured | Events moved into reachable screens; official Android Install Referrer added |
| Mobile naming and listing were inconsistent | CruiseKit device/store naming and updated Play/App Store metadata |
| Large unreachable graph/POI assets shipped | Code-48 AAB is 58.4% smaller and guarded against re-inclusion |
| No native countdown surface | Privacy-minimized Android/iOS countdown widgets implemented |
| Long sailing results could hide the final save action | Selection now moves the passenger directly to the Save action |

## External gates and measurement limits

- No implementation, credential, signing, deployment, or store-submission
  blocker remains. Apple App Review is now the external gate for 1.0.21.
  Because release type is MANUAL, approval will not publish the version without
  a later explicit release action.
- Current install volumes are below both stores' thresholds for numerical
  crash/ANR and retention rates. App Store campaign reporting also says there
  is not enough data, and the existing App Store Connect API key lacks the
  permission required to export `analyticsReportRequests`; authenticated
  dashboard totals and source types were still read directly.
- Google Play's general dashboard and dedicated acquisition report showed
  different cached comparison/active-device figures. The dated dedicated
  report is used above as the acquisition source of truth.

## Commercial controls

No purchase occurred. No paid advertising campaign was created. No campaign
budget or bid was changed. No incremental advertising spend was authorized or
incurred.
