# Authority Hub and Quality Pass - 2026-06-22

## Scope

Added a public CruiseKit information hub and strengthened crawl paths into the CruiseKit entity/reference cluster. Also ran a quality pass across the new hub and the public authority pages updated earlier today.

## Changes

- Added `/cruisekit-public-information`.
- Added homepage public-reference section linking to the hub, facts page, short explainer, and AI/search summary.
- Added hub links from `/app`, `/ai/cruisekit-summary`, `/methodology`, `/help`, `/faq`, and the footer.
- Added `/cruisekit-public-information` to `sitemap.xml` and `llms.txt`.
- Added JSON-LD to the new hub.
- Added `data-scroll-behavior="smooth"` to the root `<html>` element to satisfy the Next.js route-transition warning.
- Swapped duplicate lower-page images on `/what-is-cruisekit` and `/ship-time-vs-port-time` so above-fold LCP images do not share the same source as lower lazy cards.

## Verification

- `node ops/scripts/preflight-audit.js --write-inventory`
- `corepack pnpm --filter web lint`
- `corepack pnpm --filter web build`
- Playwright desktop/mobile probe for:
  - `/cruisekit-public-information/`
  - `/`
  - `/app/`
  - `/ai/cruisekit-summary/`
  - `/methodology/`
  - `/help/`
  - `/faq/`
  - `/what-is-cruisekit/`
  - `/cruisekit-facts/`
  - `/ship-time-vs-port-time/`
- Playwright click proof from `/`, `/app/`, `/ai/cruisekit-summary/`, `/methodology/`, `/help/`, and `/faq/` into `/cruisekit-public-information/`.

## QA Results

- All checked pages returned 200 locally.
- No console warnings or errors in the final compact Playwright pass.
- No horizontal overflow on desktop or mobile checked viewports.
- No visible framework error overlay.
- New hub has at least one loaded image in the first viewport on desktop and mobile.
- The three visual authority pages from earlier today still have loaded first-viewport imagery on desktop and mobile.
- Six entry pages successfully navigate to the new hub.

## Improvement Found

- `apps/web/public/assets/ports/celebration-key.jpg` is HTML saved with a `.jpg` extension. It is referenced by port/deal image mapping and should be replaced with a safe local image or remapped to a valid existing asset in a follow-up.
