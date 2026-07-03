# CruiseKit Ship Asset Audit

Generated: 2026-07-03T14:09:42.469Z

## Scope

- Site assets: `apps/web/public/assets/ships`
- Web ship catalog: `apps/web/lib/data/ships.ts`
- Mobile ship catalog: `../CruiseKit-Mobile-analytics-tracking/assets/data/ships.json`
- Review manifest: `data/ship-image-review.json`
- Contact sheet: `data/reports/ship-asset-contact-sheet.html`

## Counts

| Metric | Count |
| --- | ---: |
| Web catalog ships | 126 |
| Mobile catalog ships | 126 |
| Expected ship IDs | 126 |
| Site ship JPG assets | 126 |
| Missing assets | 0 |
| Orphaned assets | 0 |
| Manually blocked assets | 0 |
| Assets without verified source metadata | 16 |
| CDN assets checked | 0 |
| CDN failures | 0 |
| Hardcoded site ship references | 6 |
| Hardcoded site reference issues | 0 |

## Missing Ship Assets

- None

## Manually Blocked Assets

- None

## Orphaned Site Assets

- None

## Hardcoded Site Ship References

- apps/web/app/cruisekit-facts/page.tsx:158 - /assets/ships/icon-of-the-seas.jpg
- apps/web/app/guides/[guide-slug]/page.tsx:55 - /assets/ships/oasis-of-the-seas.jpg
- apps/web/app/guides/[guide-slug]/page.tsx:63 - /assets/ships/carnival-celebration.jpg
- apps/web/app/guides/guides-index-client.tsx:39 - /assets/ships/oasis-of-the-seas.jpg
- apps/web/app/guides/guides-index-client.tsx:47 - /assets/ships/carnival-celebration.jpg
- apps/web/app/what-is-cruisekit/page.tsx:164 - /assets/ships/oasis-of-the-seas.jpg

## Blockers

- None

## Warnings

- warning: allure-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-firenze - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-vista - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-constellation - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-equinox - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-reflection - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: eurodam - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: icon-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: mardi-gras - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: msc-meraviglia - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: msc-seashore - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-joy - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: pride-of-america - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: radiance-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: serenade-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: westerdam - Ship asset lacks verified source metadata in data/ship-image-review.json.

## Info

- None
