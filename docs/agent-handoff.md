# CruiseKit Shared Agent Handoff — Web and Backend

## 2026-10-08: unpublished SEO/GEO and press drafts

Branch `codex/genie-seo-geo-20261008` starts from main `c0e6390`. Root Organization and SoftwareApplication use the exact Genie description in `apps/web/lib/config/brand-facts.ts`; the app's store destinations remain unchanged. `/press/` is a static server page with Genie's verbatim boilerplate, three supplied key facts, the existing PNG/SVG logos, founder Kali McCarthy and Kali's approved press-only contact `info@cruisekit.app`. It is linked from the footer and canonical sitemap. No new client component or dependency was added. Support/account/legal/pricing surfaces remain unchanged.

Genie confirmed `Independent cruise planning toolkit` as the exact tagline during Kali-authorized direct coordination in Muse on 2026-10-08. The wording is unchanged from the rendered draft. Final Node 22 static export, TypeScript and scoped ESLint checks pass. Desktop 1440 and phone 390 previews pass image, overflow and console checks; screenshots are held in this task's evidence folder. Both schema descriptions and the boilerplate are compared verbatim to the supplied Part 2 package. No public publication, deployment, native/store release, credential change or backend change was performed. Everything remains in isolated local checkouts until Kali says ship. Earlier release/provider notes below remain historical.

## 2026-10-05 — website pricing release verified; native remains held

Kali's conditionally approved website-only pricing release is live and verified. [PR #77](https://github.com/kaliartistry/cruisekit/pull/77) merged candidate `8583f28d5444d86160beea07307fb0b1fe204d2e` as `7a067630452e54288cfe08d8492995b9c909a56d`. [Final PR Checks](https://github.com/kaliartistry/cruisekit/actions/runs/37386287014) passed on Node 22: 139 web tests, 10 ship tests, 63 rules tests, web/functions lint and no duplicate routes. Its synthetic checkout `e798be8e` has exactly the candidate's tree `847d6c642143444a75bcc90ebbf0520485d92a20`. The normal [Pages release](https://github.com/kaliartistry/cruisekit/actions/runs/37386633573) built 193 pages and succeeded at 23:09 UTC; provider deployment `6871449825` confirms the published pricing merge.

Actual public [calculator](https://cruisekit.app/calculator/), [sailings](https://cruisekit.app/cruises/), cost hub, comparisons/groups, Medjet guide and seven affected articles pass headless desktop 1440 / phone 390 verification. Conditional USD fixtures reconcile: included 2,000 + 238 = 2,238; explicitly extra 2,000 + 308 + 238 = 2,546; six nights 2,000 + 204 = 2,204; unknown per-person 123.45 x 2 + 238 = 484.90 subtotal. Keyboard/errors/repeated flows, save/restore, exact package quantities, NCL five/six-night thresholds, historical disclosures and preserved fragment links pass with no uncaught page errors or horizontal overflow. QA intentionally blocks external optional resources; it does not certify third-party networking.

No fresh sailing quotes were promoted. All four public fare payloads match the prior live baseline byte-for-byte; 362 public sailings retain 215 July 1 and 147 August 26 checks, with NCL 184 / Carnival 136 / Virgin 27 / Holland 15. The new manifest generation time is not a fare verification date. Stale/unverified status, source, currency/unit and recorded check dates remain visible; stale fares do not auto-fill current calculator estimates. All 53 staged fare candidates remain untouched/unapproved. Existing daily seven-day freshness checks now report through the existing issue updater; runtime expired package rates require a current quote, and the real-date material-fact CI gate remains intact. Newly checked package facts have November 4 recheck deadlines; unchanged historical defaults retain their own dates.

Rollback only this pricing integration: create an isolated branch from then-current main, revert merge `7a067630452e54288cfe08d8492995b9c909a56d` with mainline 1, review/CI and deploy through the existing Pages workflow. Prior live baseline is `5df4a4726212440470b746f729f2ff20083bbbce`; do not reset over unrelated work. This handoff-only follow-up does not alter customer behavior.

Native source remains `8b996023f9ee0b243e8a29067ef620a77d813107`; frozen submitted 1.0.28 (56), Issue 17 lineage, private CI allowance and native build/device/store release gates remain held. No native build/store access/write, paid provider, new credential/security change, backend deployment, held motion/prototype merge, external-drive access or foreground browser control occurred. Earlier HOLD/No Go/CI-not-run notes below are retained history. The task's `PRICING-WEB-RELEASE-RECEIPT.json` and live QA evidence pin public hashes, deployment and rollback.

## 2026-10-05 — website-only release preparation

Kali conditionally authorized publication of this pricing integration after its final release gates pass. That lifts the website HOLD only for the verified pricing scope; native build 56, native lineage/CI/device/store work and unrelated held design remain held. The base/live website is `5df4a4726212440470b746f729f2ff20083bbbce`; only `codex/truthful-pricing-main-integration-20261005` is eligible. No staged fare changes, paid provider, credential, security or backend deployment is included.

PR Checks passed on exact prior candidate `a9ed7aa4f6f3363b097d299a8091b45ac00453ca`, run [37367725584 attempt 2](https://github.com/kaliartistry/cruisekit/actions/runs/37367725584/attempts/2): Node 22, 135 web tests, 10 ship tests, 63 rules tests, web/functions lint and duplicate-route check. The first attempt never acquired a hosted runner; the single approved retry passed. Normal release build (including data hooks) produces 193 pages and the same 362 stale public fares as live. Canonical/mobile fare payload hashes match live exactly; generated timestamps do not certify fare freshness. All 53 unapproved staged changes remain excluded.

Final content review found additional indexed prose that contradicted the repaired calculator. The release revision corrects tax-inclusion examples, retired NCL arithmetic and CHEERS onboard pricing; removes final-bill guarantees; labels monetary article previews and historical package examples; and preserves cost-hub fragment links when misleading headings change. Regression tests guard these contracts. Final local validation passes 139 web tests (one intentional export skip), lint/types, duplicate-route check and the normal production-feature-flag build. Headless desktop 1440 / phone 390 calculator/package/comparison/group flows and seven affected articles pass; keyboard fragment links remain usable, with headings clear of the sticky navigation and no horizontal overflow or uncaught page errors. Exact final-commit CI is the remaining source gate. GitHub Pages was degraded earlier and became operational at 22:40 UTC; recheck service health immediately before publishing.

Use the existing main-branch GitHub Pages workflow, then verify its deployed commit and actual public calculator, stale-data disclosure and corrected articles. Publication is not yet recorded by this entry. Record the confirmed deploy and rollback receipt after verification. Revert only the pricing merge if rollback is needed; the baseline is the commit above. Older No Go/HOLD/CI-not-run notes below are historical and do not override this website-only conditional authorization.

## 2026-10-05 — pricing source recheck candidate, HOLD

Ready for pricing integration review; No Go for production release. Thirteen of the fourteen expired material facts are reverified on official pages (Oct 5 retrieval / Nov 4 deadline). Legacy NCL remains unavailable with its old audit amount/date; web asks for a booking quote and native excludes it from estimates. NCL now distinguishes 2–5-night USD 32 from 6+ USD 28.50 adult/day. MSC officially checked May 11 booking cohort uses USD 17 / 23 (earlier 16 / 20). Virgin Bar Tab uses explicit fixed purchase quantities independent of adults/nights; comparison/group/tracker consumers are reconciled. Comparison Wi-Fi retains starting-at/plan/day/cents qualifiers; the legacy NCL FAQ and MSC cohort prose are corrected and guarded. Per-line historical update dates are preserved; source-checked package fields carry actual provenance. The seven-day fare gate and real-date fact gate are unchanged.

Review branches: web `codex/truthful-pricing-main-integration-20261005` from pinned main `5df4a4726212440470b746f729f2ff20083bbbce`, paired mobile `codex/truthful-pricing-20261005` from complete preserved baseline `cf954e2a9f72233f0576297bc7893883e6b82c5f`. Handoff/pricing documentation accompanies the commits; the task's revised receipt pins their exact pushed heads. Web 135 tests + bounded export pass, TypeScript/ESLint clean, 193-page direct build; native 374 full tests + 37 final affected tests/analyzer and actual headless iPhone simulator pass. Desktop/phone browser and phone/tablet widget flows include billing units, five/six nights, cents, errors, keyboard/repeat and comparison/group behavior.

All fare cohorts remain stale with honest fallback; 53 staged fares are untouched/unapproved. CI has not run: branch pushes do not trigger web PR checks or native non-main CI; no dispatch occurred. Remaining release gates are applicable exact-commit CI, native lineage/new version/build/release QA, separate held-design integration decision if needed, then Kali's specific release approval. Website HOLD and frozen native 1.0.28 (56) remain. No merge/deploy/store access/write, release artifacts, new credentials/provider/security changes, external-drive or foreground app access. See [pricing verification](pricing-verification-2026-10-05.md) for fact matrix, conditions, evidence and rollback. Older status and No Go sections below are historical; this recheck closes only the expired-fact and Bar Tab unit blockers.

## 2026-10-05 — pricing integration review, No Go

The second correctness review preserves website HOLD and frozen native 1.0.28 (56). Current-main web pricing work is isolated on `codex/truthful-pricing-main-integration-20261005` from `5df4a4726212440470b746f729f2ff20083bbbce`; do not merge the held design baseline wholesale. Package timing, gratuity exemptions, Wi-Fi quantities, bundle handling and saved-result contracts are preserved. Native repairs include the engine-backed running subtotal, preserved bundle flags and matching verified quote context for price-watch alerts; legacy watches remain stored. Release blockers: fourteen expired current-main price facts, unresolved Virgin fixed-credit billing units, applicable exact-commit CI, approved new native version/build and release QA, then Kali's specific release approval. Source/data refresh and publication were not performed. See the task's integration recommendation and current-main `docs/pricing-verification-2026-10-05.md` for evidence, scope and rollback. Earlier store/live-state notes are historical; no store status was rechecked.


Last verified: 2026-09-10

## September 10 price-fact follow-up (PR #74, branch `fix/price-constants-2026-09`)

- The 2026-09-04 refactor moved calculator constants to `PRICE_FACTS`, but
  blog and guide prose still carried retired numbers (CHEERS $82.54/18%,
  the $21.80 Free at Sea gratuity and its derived totals, Royal Caribbean
  three-tier gratuities, MSC $16, Holland America packages at old prices and
  18%, Celebrity's retired Always Included / Elevate / Indulge tiers, Virgin
  "unbundled in early 2026"). Those passages now interpolate `PRICE_FACTS`
  through `usd()` / `usdRounded()`, and `price-facts.test.ts` bans the retired
  figures from `blog-posts.ts` and `guides.ts`.
- New official facts (verified 2026-09-10): Holland America Quench $17.95,
  Signature $55.95, Elite $60.95, Have It All $65, 20% beverage service
  charge; Princess beverage-only Plus $64.99, Premier $84.99, Zero-Alcohol
  $29.99, Classic Soda $14.99; Carnival Bottomless Bubbles $9.50; NCL Free at
  Sea ages 3-20 $12.50; Celebrity Concierge/AquaClass $20.50. Facts
  re-verified on official pages today carry `retrievedAt 2026-09-10`,
  `recheckBy 2026-12-09`. Carnival gratuities, Carnival Wi-Fi, and MSC keep
  their 2026-09-04 dates (official pages block automated fetch; MSC remains
  `corroborated`).
- Princess "Plus/Premier Beverage Package" calculator tiers are the bundles
  (`includesGratuities`/`includesWifi`), so they stay at bundle prices;
  drinks-only tiers were added alongside. Do not price the bundle tiers at the
  beverage-only rate.
- Governance gap closed: `priceFactIsStale` defaulted `today` to a frozen
  2026-09-04, so the freshness test could never fail. It now uses the real
  date, and `pr-checks.yml` runs `pnpm --filter web test`. Expect PRs to fail
  after 2026-12-09 until facts are re-verified; that is intended.
- Cross-repo: `pnpm --filter web run export:mobile-cruise-costs` regenerates
  `CruiseKit-Mobile/assets/data/cruise_costs.json` from `CRUISE_LINE_COSTS`.
  The mobile app's Spend presets (`lib/data/drink_package_presets.dart`)
  are a separate hand-maintained list updated in the mobile repo the same day.
- `.ck-data/` in the local checkout is an untracked build copy, not a
  maintained source; ignore it. The `feat/cruisekit-growth-engine-v1` branch
  predates the PRICE_FACTS refactor and still has the old constants; rebase
  it on `main` before merging.

## September 4 execution state

- The calculator-truth, SEO/port, measurement/attribution, and calculator UX
  candidates described below have been integrated as Releases A–D. PRs #67,
  #68, #69, and #70 are merged to `main`; all four GitHub Pages deployments
  succeeded, ending at production commit
  `3673666356b489f147b56aba4b1f45b52d876eac`.
- Final production passenger QA passed across 18 desktop/mobile page states:
  calculator save/restore/share and app attribution, gratuities, payment
  calendar download, ship-time, five port answers, canonicals, and sitemap.
  The complete implementation and blocker record is in
  `docs/implementation/cruisekit-execution-report-2026-09-04.md`.
- Search Console sitemap submission and authenticated Analytics dashboard
  readback remain blocked by the locked shared Mac; the live sitemap and GA
  collection requests were verified directly.

## Calculator two-price and Wi-Fi UX candidate

- Candidate branch `codex/execution-calculator-ux-20260904` is based on
  production `main` at `3871fa9bdeced2cf6aff96a3297e738d6f2274cc`.
  It has not been pushed, merged, or deployed.
- The existing Total Cruise Cost Calculator now treats purchase timing as a
  calculation input. Carnival CHEERS renders the official $83.94/day
  pre-cruise and $89.94/day onboard prices together, applies the selected one
  to the result, and shows the full party/voyage savings. Virgin renders the
  $20 prepaid and $22 onboard gratuities together while preserving the legacy
  included cohort.
- Carnival Social, Value, and Premium Wi-Fi now use official paired prices
  from the central fact register. The calculator shows daily and voyage totals,
  asks how many plans the party actually needs, and avoids silently charging
  every guest. `/calculator/#wifi` is the one Wi-Fi cost hub; every line page
  links back to it and no new Wi-Fi route exists.
- Royal Caribbean and Celebrity drink and Wi-Fi package prices remain dynamic
  traveler inputs. Celebrity's former fixed planning placeholders no longer
  render as current public prices. Fixed Wi-Fi assumptions without an official
  pair are explicitly labeled as planning inputs, and the passenger copy notes
  that a port-heavy itinerary can reduce the value of ship internet.
- The candidate does not change calculator save, share, app-offer, attribution,
  or analytics components. Local verification: 20 test files / 82 tests; full
  web ESLint; Next.js static export of 191 pages; Playwright at 1440x1000 and
  390x844 covering Carnival, Virgin, Celebrity, and the Wi-Fi anchor with no
  console warnings/errors or horizontal overflow. Browser plugin was not
  available, so the repository Playwright runtime was used.

## Technical SEO and five-port arrival-answer candidate

- Candidate branch `codex/execution-seo-ports-20260904` is based on production
  `main` at `834cd6b58c2a86e6135d13074f20305d3ed4eea3`. It has not been pushed,
  merged, or deployed.
- The sitemap now emits only final trailing-slash URLs. A build-output verifier
  confirms every sitemap entry has a corresponding exported page, and `llms.txt`
  uses the same canonical form.
- Self-referencing canonicals cover the 15 live pages that were missing them.
  `/calculator/` is the bounded canonical for its query-string forms; measured
  parameter URLs remain live, indexable, and excluded from the sitemap.
- `/ship-time-vs-port-time/` now gives the all-aboard clock decision above the
  fold, links current NCL and Royal Caribbean guidance, and absorbs the useful
  intent of the older blog article. The old article is removed from sitemap and
  index surfaces and uses a zero-delay static-export handoff plus a canonical to
  the dedicated guide. GitHub Pages cannot emit a server-side 301 from Next.js
  static export, so replacing this with an edge/server redirect remains a
  hosting-level follow-up if that capability is added.
- A single-switch pilot changes only Half Moon Cay, Falmouth, Aruba, Curaçao,
  and Celebration Key to answer dock/tender intent in the title, H1, and first
  answer block. Current official sources override the September report: Half
  Moon Cay is ship-specific after Carnival opened its north-side pier in June
  2026, while Holland America still publishes tendering guidance for south-side
  visits. Aruba is presented as usually docked with provisional berth caveat;
  the other three are normally docked. Every pilot page renders its source links
  and September 4, 2026 verification date.
- The port title formatter no longer produces duplicated labels such as
  `Aruba, Aruba` or `Curaçao, Curaçao`. Free activities now appear before tour
  and affiliate blocks on port pages.
- Local verification: 17 test files / 63 tests; full web ESLint; Next.js static
  export of 191 pages; static SEO verifier over 178 sitemap URLs, 15 repaired
  canonicals, and five pilot pages; passenger-flow Playwright at 1440x1000 and
  390x844 with no console warnings/errors or horizontal overflow. Browser plugin
  was not available, so the repository Playwright runtime was used.

## Sailing data and CHEERS pricing refresh candidate

- Branch `fix/data-freshness` was refreshed from official-source staging runs
  dated 2026-08-26. The reviewed promotion adds 117 sailings (Carnival 40,
  Norwegian 40, Holland America 13, Virgin Voyages 24) and applies 54 price
  corrections (Carnival 16, Norwegian 36, Holland America 2), with no seed
  deletions or retirements.
- Every newly promoted sailing remains labeled
  `itinerary_verified_price_check_required`. Princess, MSC, Viking, Royal
  Caribbean, and Azamara remain staging-only; Royal Caribbean recorded its
  expected automated-access blocker and Azamara returned zero candidates.
- Seed sailings increase from 433 to 550 and the public bundle from 388 to 439.
  Data health reports zero schema blockers, but the stricter freshness report
  still identifies 268 public sailings older than the seven-day threshold.
  This is a curated partial refresh, not a claim that the entire catalog is
  current.
- Carnival CHEERS is corrected from `$82.54` to `$83.94` per day pre-cruise,
  including the 20% service charge; the calculator description now states the
  pre-cruise base and onboard all-in price explicitly.
- Local verification passed: 550 sailings and zero deals validated with zero
  schema errors; 10/10 ship-data tests; 57/57 web tests; full web ESLint; and a
  Next.js static export of 191 pages. Node 26 emitted the repository's expected
  Node 22 engine warning locally; GitHub Pages builds with Node 22.
- Pending: protected-main PR review/merge, GitHub Pages deployment, and direct
  live verification of bundle counts, checked dates, and the CHEERS value.

## Total Cruise Cost comparison sharing repair

- PR #63 merged to `main` as
  `1cc06f6a80e4783abc2705e512b1002d29af3efc` on 2026-08-23. GitHub Pages
  run `32685973786` built and deployed that exact merge successfully.
- The final side-by-side result on `https://cruisekit.app/calculator/` now has
  a clearly labeled **Share result** control. Its text contains the two cruise
  line names, broad estimated real totals, broad cost categories, and the
  canonical calculator link; it omits ship, itinerary, departure, date,
  cabin, party, and passenger details.
- The comparison control reuses the existing Total Cruise Cost share behavior.
  The single-result share and the separate Drink Package Calculator share were
  preserved; no EventSync, CruiseKit-Mobile, pricing data, or unrelated
  calculator route changed.
- Verification passed: 15 web test files / 57 tests, full web ESLint, a Next.js
  static export of 193 pages, and local rendered QA for comparison and single
  results at 1440x1000 and 390x844.
- Independent live QA passed after deployment for the Disney Cruise Line vs
  Norwegian Cruise Line comparison and the Disney single result on desktop
  and 390x844 mobile. Both visible controls opened the browser/native share
  flow, mobile had no horizontal overflow, and no browser console warnings or
  errors were observed.

## Drink-package ToolLoop and calculator sharing publication

- PR #61 merged to `main` as
  `b04772358b6195e76f3562ffe38aef1c52fcd4de` on 2026-08-23. GitHub Pages
  run `32684219903` built and deployed that exact merge successfully.
- The existing canonical Drink Package Calculator remains
  `https://cruisekit.app/cruise-drink-package-calculator/`; no duplicate tool
  route was added. The no-trailing-slash variant returns HTTP 301 to the
  canonical slash URL. The full-cruise-cost routes, editorial drink-package
  guide, and unrelated MSC price tracker remain separate.
- The drink calculator now uses current records verified 2026-08-23 for all
  eight supported lines, shows the verification date and 30-day maintainer
  cadence, and supports whole-trip gratuity, required younger-guest packages,
  partial-sailing coverage, bundled perks, and Virgin Bar Tab credit.
- Drink-calculator analytics emit only cruise line, bounded party-size range,
  bounded sailing-length range, bounded result bucket, and completion. Exact
  prices, spend, savings, and itinerary details are not sent. Saved estimates
  remain browser-local.
- Search Console baseline values and the preregistered six-week query set are
  preserved in
  `docs/seo/drink-package-tooloop-launch-baseline-2026-08-23.md`. Those values
  are the predecessor capture through 2026-08-21, not a fresh release-day pull.
- Two share surfaces are live and were verified independently: **Share result**
  on `/cruise-drink-package-calculator/` and **Share result** on the separate
  `/calculator/` Total Cruise Cost result. Both opened the native/browser share
  flow at 1440x1000 and 390x844. The Total Cruise Cost summary includes the
  advertised fare, estimated real total, broad cost categories, and canonical
  calculator link; it omits ship, departure, itinerary, child, and passenger
  details.
- Verification passed: 15 web test files / 55 tests; scoped ESLint; a Next.js
  static export of 193 pages; local and live desktop/mobile rendered QA; live
  partial-sailing and MSC Minors Package calculations; canonical behavior; and
  zero local or live browser console errors.

## Mobile 1.0.18 website screenshot refresh publication

- PR #59 merged `codex/refresh-approved-mobile-screenshots` to `main` as
  `a51a0f4ab412daf80f590423c664303b260ae034` on 2026-08-10 at 11:24 PM ET.
- GitHub Pages run `31455308346` built and deployed that exact commit
  successfully at 2026-08-10 11:26 PM ET.
- The seven stale canonical website phone captures are replaced byte-for-byte
  with the approved 1.0.18 iPhone 6.7-inch release assets. The existing
  `mycrew-invite.png` already matched the approved release asset and is kept.
- Every reference to the retired May-era five-tab `myday-today`,
  `myday-itinerary`, and `myday-crew-map` visuals is remapped to a current
  MyDay, itinerary-ports, or MyCrew invite asset. The legacy files remain
  preserved but are no longer referenced.
- MyDay and group-check-in captions, drink-package alt text, first-time guide
  image metadata, and the `/app` sample-data disclosure are aligned with what
  the approved frames actually show.
- The approved 1024x500 mobile feature graphic is added for landscape cards
  and social previews so editorial pages no longer crop a portrait phone frame
  down to an unreadable strip.
- The overlapping `/myday` hero uses three current, screen-only 1.0.18 source
  captures so its overlap does not hide marketing headlines. The complete
  approved presentation frames remain unchanged in the screenshot galleries.
- The homepage deal-card port chips now use unique React keys, removing the
  existing Tampa/Galveston duplicate-key errors encountered during rendered QA.
- Android tablet images are intentionally excluded. The local 7-inch and
  10-inch sets predate the approved iPad captures and are not current Android
  device screenshots.
- Local verification passed: web lint; 13 test files / 37 tests; Next.js static
  export of 193 pages; approved-asset hash checks; and rendered QA at 1440x1000
  and 390x844 across `/`, `/app`, `/myday`, `/cruise-group-check-in-app`,
  `/faq`, `/what-is-cruisekit`, and the first-time guide. No horizontal
  overflow was observed, and the app gallery/menu/anchor navigation worked.
- Live verification passed after the Pages deployment: all 12 approved
  presentation, feature, and hero image files matched their expected SHA-256
  hashes; `/`, `/app`, `/myday`, `/cruise-group-check-in-app`, `/faq`,
  `/what-is-cruisekit`, `/guides`, and `/cruisekit-public-information`
  returned HTTP 200; and desktop/mobile browser QA on `/myday` and `/app`
  found no broken images, horizontal overflow, or console errors.

## Android App Links publication

- PR #55 merged `codex/android-app-links-and-funnel-fixes` to `main` and
  published `/.well-known/assetlinks.json` for `com.cruisekit.mobile` using
  the verified Google Play **app-signing key** SHA-256 fingerprint
  `A0:C9:44:74:E6:D8:AF:B1:0C:5D:30:B2:05:E6:6A:6A:19:88:BA:B1:01:90:9D:32:E2:05:74:E0:89:39:A0:97`.
- Direct checks on 2026-08-09 observed HTTP 200 JSON at
  `https://cruisekit.app/.well-known/assetlinks.json`. The `www` host
  intentionally returns HTTP 301 to the apex host and is not declared by the
  mobile app.
- Google Digital Asset Links and Android device re-verification remain pending;
  do not record App Links as device-verified until those checks pass.

## Ship image license-hygiene candidate

- Candidate verified locally on branch `codex/ship-image-license-hygiene` /
  PR #57. Base PR #56 has merged and PR #57 is now retargeted to `main`; this
  candidate is not deployed or live.
- Sixteen inherited ship JPEGs had no recoverable rights provenance. Git
  history traces them to a Google Places photo harvester that discarded source
  and author-attribution metadata. Several were also wrong-subject duplicates.
  All sixteen are replaced with visually checked, ship-specific Commons
  sources under CC BY, CC BY-SA, or CC0 terms and recorded in
  `data/ship-image-review.json`.
- Carnival Festivale now intentionally uses the designed fallback for its 40
  bundled sailings. The exact Carnival News rendering was traced and removed,
  because its download link does not grant commercial redistribution rights
  and a future ship has no truthful licensed exterior photograph yet.
- The registry now accounts for 134 verified JPEGs and three intentional
  fallbacks. Every verified record has an explicitly approved commercial-use
  license label and its matching canonical license or public-domain URL.
  `ATTRIBUTION.txt` is generated from the registry and includes every verified
  asset.
- PR checks now run `pnpm run data:test:ship-gaps`. The suite blocks an
  unregistered JPG, a verified record with a disallowed or mismatched
  license/deed pair, a blocked record that still has a file, missing provenance
  fields, stale generated attribution, and reviewed heroes outside the
  1600x900/100-250KB budget.
- Pending after PR #57 merges: wait for the GitHub Pages deployment, verify the
  sixteen replacement URLs return HTTP 200, and verify Carnival Festivale
  returns 404 so the app exercises its fallback. Record those states as live
  only after direct CDN checks pass.

## Ship hero assets and ship-code normalization candidate

- Candidate verified locally: 2026-08-08.
- Branch `codex/ship-photo-and-code-data-gaps` adds ten commercially reusable
  1600x900 ship hero JPEGs: Grand Princess, Coral Princess, Sapphire Princess,
  Diamond Princess, Norwegian Epic, Norwegian Dawn, Azamara Journey, Norwegian
  Jewel, MSC Poesia, and Viking Star.
- Celebrity Ascent was already present and live; its existing CC BY 4.0 credit
  is corrected to `Sakis Antoniou / Commons user ND44`. Public source and
  license credits are linked from the website footer through
  `/assets/ships/ATTRIBUTION.txt`.
- Brilliant Lady intentionally uses the app's designed fallback. The former
  official-site derivative was removed because commercial redistribution
  rights were not granted, and the available CC BY-SA alternative was
  AI-upscaled and did not meet the hero-quality bar. Norwegian Aura also stays
  on the fallback because NCL's legal notice requires written permission for
  commercial copying. Both decisions are recorded as `allowMissing` in
  `data/ship-image-review.json`.
- The reported 4,018 mobile sailings reconcile to 3,875 rich-catalog rows plus
  143 runtime sailings. The 110 targeted rich-catalog rows trace to archived
  pre-canonical captures; the active web seed and web-published bundles contain
  no bare ship names. The mobile rich catalog also retains 36 `AT`/`BR` rows
  that its existing display map already resolves; the asset audit now reports
  these unresolved stored codes explicitly instead of silently omitting them.
- `data/reference/ship-code-names.json` records official-source mappings for
  `RS` to Resilient Lady, `AX` to Celebrity Apex, `CS` to Celebrity
  Constellation, `EC` to Celebrity Eclipse, and `EG` to Celebrity Edge.
  `pnpm data:normalize:ship-codes` applies those mappings to an explicitly
  supplied catalog without rewriting raw archive provenance or coupling this
  repository to a local mobile checkout.
- This branch does not change a CruiseKit Mobile file, app binary, store
  listing, or screenshot set. The CDN photo additions become available to the
  existing app after the website deploy. The 110 affected names live in a
  bundled rich catalog and still require correction there, so reaching shipped
  users with that part requires a separately reviewed mobile catalog update and
  a new build; that follow-on is intentionally outside this website/data
  branch.
- Pending after merge: wait for the GitHub Pages deployment, verify HTTP 200 for
  each of the ten new asset URLs, and verify the intentional 404/fallback state
  for Brilliant Lady and Norwegian Aura. Do not record these as live until the
  public CDN checks pass.

## Deal-help retirement

- Branch `codex/retire-deal-help-web-20260714` retires the personal cruise-deal
  help offer and its Resend email automation.
- The six existing `dealLeadRequests` records remain preserved as historical
  admin-only data. New client creates are denied.
- The `emailDealLeadRequest`, `retryDealLeadEmail`, and `sendDealLeadReply`
  functions must be deleted from production when this branch is deployed.
- The verified `cruisekit.app` Resend domain can be removed only after that
  backend deployment is verified. The domain removal does not delete the
  historical Firestore records.

This file is the durable handoff between Codex, Claude Code, and human contributors for the website/backend repository. GitHub and the deployed services are authoritative; chat history is not.

## Repository and production

- Repository: `https://github.com/kaliartistry/cruisekit`
- Default branch: `main`
- Production website: `https://cruisekit.app`
- Hosting: GitHub Pages via `.github/workflows/deploy.yml`
- Backend: Firebase Authentication, Firestore, and Cloud Functions
- Mobile repository: `https://github.com/kaliartistry/CruiseKit-Mobile`

## Current live state

- Website foundation work was merged in PR #47.
- Apple association-file publishing was corrected in PR #48.
- The GitHub Pages deployment for `main` completed successfully.
- The homepage, Cozumel port page, account-deletion page, and `/.well-known/apple-app-site-association` return HTTP 200.
- Port pages use repository-hosted static map assets rather than paid per-visit Mapbox requests. Keep the map generation/data path centralized when adding or updating ports.
- Cloud Functions `findGroupByInvite` and `deleteUserAccount` are deployed and reject unauthenticated requests.

## Verification baseline

- Web tests: 25 passing.
- Static export: 193 pages generated.
- Functions tests: 6 passing.
- Firestore rules tests: 63 passing after replacing the retired lead-create
  matrix with an explicit all-creates-denied test.

Re-run the relevant checks after source changes; these numbers record the 2026-07-10 release baseline, not a permanent guarantee.

## Important compatibility decision

Do not deploy the stricter member-only Firestore rules until mobile rollout
adoption is sufficient. The compatible 1.0.18 release is now public on both
stores, but adoption has not been measured or approved as sufficient. Keep the
rules gate closed until that separate verification is complete.

## Cross-platform release state

- Mobile release: `1.0.18+43`.
- iOS: App Store Connect and Apple's public lookup show 1.0.18/build 43
  **Ready for Distribution** after manual release on 2026-08-10 at 10:43 PM ET.
  The public listing supports iPhone and iPad and has eight screenshots for
  each device family.
- Android: Google Play production shows 1.0.18/code 43 **Available on Google
  Play** at 100% in the existing one-country scope, with no unpublished
  changes. Alpha 18 and Internal 39 remain unchanged.
- The Google Play default-listing screenshots still show the July listing set;
  this website-only refresh does not mutate Play listing media.
- Mobile `master` is not the shipped 1.0.14/1.0.15 lineage. Do not merge or rewrite it until mobile issue #17 is resolved by Kali.

## Required handoff workflow

1. Fetch GitHub and inspect the current branch, status, remotes, pull requests, and existing implementation before editing.
2. Work on a `codex/` or otherwise approved task branch; do not work directly on `main`.
3. Preserve local secrets and never commit `.env` files, signing files, tokens, API keys, or service credentials.
4. Update this file in the same pull request when the live state, release state, blocker, or cross-platform decision changes.
5. Verify the live result after deployment and record only observed facts.
