# CruiseKit Shared Agent Handoff — Web and Backend

Last verified: 2026-08-08

## Android App Links publication candidate

- Branch `codex/android-app-links-and-funnel-fixes` adds
  `/.well-known/assetlinks.json` for `com.cruisekit.mobile` using the verified
  Google Play **app-signing key** SHA-256 fingerprint
  `A0:C9:44:74:E6:D8:AF:B1:0C:5D:30:B2:05:E6:6A:6A:19:88:BA:B1:01:90:9D:32:E2:05:74:E0:89:39:A0:97`.
- This is a source publication candidate, not a verified live deployment.
  Post-merge checks remain pending for HTTP 200 JSON on both `cruisekit.app` and
  `www.cruisekit.app`, followed by Google's Digital Asset Links checker or
  Android device re-verification.

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
