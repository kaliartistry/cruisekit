# CruiseKit Shared Agent Handoff — Web and Backend

Last verified: 2026-08-08

## Ship image license-hygiene stacked candidate

- Candidate verified locally on branch `codex/ship-image-license-hygiene`,
  stacked on `codex/ship-photo-and-code-data-gaps` / draft PR #56. Merge the
  base branch first; this candidate is not deployed or live.
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
- Pending after both stacked pull requests merge: wait for the GitHub Pages
  deployment, verify the sixteen replacement URLs return HTTP 200, and verify
  Carnival Festivale returns 404 so the app exercises its fallback. Record
  those states as live only after direct CDN checks pass.

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

Do not deploy the stricter member-only Firestore rules until mobile rollout adoption is sufficient. Public mobile version 1.0.14 still uses the older direct-invite flow, and an early rules deployment would break that flow. Re-evaluate only after the compatible mobile release is public and adoption is confirmed.

## Cross-platform release state

- Mobile release: `1.0.15+39`.
- iOS: submitted to App Store Connect and **Waiting for Review**; automatic release is enabled after approval.
- Android: build 39 is available to internal testers. The full production rollout is prepared but Play Console is blocking submission with an incorrect `Incomplete advertising ID declaration` result.
- Android Advertising ID declaration: **No**. The release merged manifest does not contain `com.google.android.gms.permission.AD_ID`, and the app does not use advertising ID.
- Google Play support case: `7-6177000041483`.
- Mobile `master` is not the shipped 1.0.14/1.0.15 lineage. Do not merge or rewrite it until mobile issue #17 is resolved by Kali.

## Required handoff workflow

1. Fetch GitHub and inspect the current branch, status, remotes, pull requests, and existing implementation before editing.
2. Work on a `codex/` or otherwise approved task branch; do not work directly on `main`.
3. Preserve local secrets and never commit `.env` files, signing files, tokens, API keys, or service credentials.
4. Update this file in the same pull request when the live state, release state, blocker, or cross-platform decision changes.
5. Verify the live result after deployment and record only observed facts.
