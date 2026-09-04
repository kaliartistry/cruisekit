# CruiseKit execution report — September 4, 2026

This is the end-to-end implementation record for the September 4 CruiseKit
distribution handoff. Work was performed from the production website default
branch and the mobile app's verified shipped lineage. Current production,
first-party store state, and current official cruise-line sources were used
when they differed from the research snapshot.

## Executive result

- All website P0 work and the ordered website calculator/planning follow-up are
  merged to `main`, deployed, and live at `https://cruisekit.app`.
- Android 1.0.21 code 48 is a completed 100% Production release. The Play
  listing now uses the CruiseKit name and the corrected metadata.
- iOS 1.0.21 metadata and screenshot correction are complete in App Store
  Connect, but the binary cannot yet be signed or submitted. The exact blocker
  is the new countdown widget's App Group and distribution provisioning.
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
  Search Console and Analytics dashboard readback remain listed under blockers.

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
- Candidate: 1.0.21, `PREPARE_FOR_SUBMISSION`, manual release.
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

## Verification

### Website release gates

- Release A: 69 tests, lint, and 191-page production build passed.
- Release B: 75 tests, lint, production build, and SEO export verification
  passed.
- Release C: 86 tests, lint, production build, attribution-link inspection,
  and desktop/mobile passenger QA passed.
- Release D: 96 tests across 25 files, lint, 193-page production build, and SEO
  verification passed; the sitemap contains 179 URLs.

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
- Princess new-booking sailing date June 15, 2026: February 15 final-payment
  planning date and June 11 package cutoff. Both dates were verified inside the
  downloaded calendar file.
- Ship-time answer, all five port answers, their canonicals, and their source
  links rendered correctly.
- Home, calculator, gratuity, deadline, ship-time, port, and calculator-result
  pages passed at 390 × 844 CSS pixels.

Rendered evidence on the release host:

- `/tmp/cruisekit-final-passenger-qa/01-calculator-result-desktop.png`
- `/tmp/cruisekit-final-passenger-qa/02-gratuity-virgin-onboard.png`
- `/tmp/cruisekit-final-passenger-qa/03-deadline-princess.png`
- `/tmp/cruisekit-final-passenger-qa/04-calculator-result-mobile.png`
- `/tmp/cruisekit-final-passenger-qa/evidence.json`

### Mobile release gates and passenger QA

- `flutter analyze`: clean.
- `flutter test`: 258/258 passed.
- Android debug APK, signed release AAB, and iOS simulator with embedded Widget
  extension compiled.
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

## Exact remaining blockers

1. **Apple signed archive and submission.** Register App Group
   `group.com.cruisekit.mobile`, associate it with
   `com.cruisekit.mobile` and `com.cruisekit.mobile.CountdownWidget`, and
   regenerate/download App Store distribution profiles. The present
   `CruiseKit App Store` profile lacks `com.apple.security.application-groups`;
   no profile exists for the widget target. The Apple API completed the bundle
   identifier and capability setup, but App Group registration requires the
   authenticated Developer portal or Xcode account session. The shared Mac is
   locked, so browser completion is currently unavailable.
2. **Search Console submission and dashboard readback.** The production
   sitemap is correct and live, but the prepared Search Console submission
   cannot be clicked while the Mac is locked. The command-line attempt also
   failed because the Search Console API is disabled for the active ADC quota
   project. Analytics dashboard readback is similarly blocked by the locked
   authenticated browser and ADC lacks `analytics.readonly`; deployed GA
   collection was instead verified at the network layer.

Once the Mac is unlocked, the remaining sequence is: submit `sitemap.xml` in
Search Console; register/associate the Apple App Group; regenerate profiles;
build and hash the signed IPA; upload build 48; wait for processing; attach it
to 1.0.21; set export compliance; and submit with manual release.

## Commercial controls

No purchase occurred. No paid advertising campaign was created. No campaign
budget or bid was changed. No incremental advertising spend was authorized or
incurred.
