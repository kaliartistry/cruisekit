# AI Discovery Detail Pass - 2026-06-22

## Scope

- Strengthened direct AI/search discovery links for CruiseKit public reference, guide, FAQ, methodology, and disclosure pages.
- Added image-backed guide detail heroes using local CruiseKit assets.
- Replaced remaining third-party port image URLs with checked-in CruiseKit image assets.

## Verification Plan

- Run link and image audits.
- Run web lint and production build.
- Render-check the updated public pages before shipping.
- Request Google Search Console indexing for the highest-priority public discovery pages where Search Console permits it.

## Completed Verification

- `corepack pnpm run data:audit:images` - 0 blockers, 0 warnings.
- `corepack pnpm run data:audit:links` - 0 blockers, 0 warnings.
- `corepack pnpm --filter web lint` - passed.
- `corepack pnpm --filter web build` - passed, including static generation for guide and port pages.
- Render QA passed on desktop and mobile for `/guides/first-time-cruise-guide`, `/guides/drink-package-guide`, `/cruisekit-public-information`, and `/ai/cruisekit-summary`.

## Search Console Indexing Requests

Submitted indexing requests through Google Search Console for:

- `https://cruisekit.app/guides`
- `https://cruisekit.app/faq`
- `https://cruisekit.app/ports`
- `https://cruisekit.app/ai/cruisekit-summary`
- `https://cruisekit.app/cruisekit-public-information`
