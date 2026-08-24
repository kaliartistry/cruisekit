# CruiseKit Shared Agent Handoff — Web and Backend

Last verified: 2026-08-23

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
