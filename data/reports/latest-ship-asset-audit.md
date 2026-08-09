# CruiseKit Ship Asset Audit

Generated: 2026-08-08T18:36:07.007Z

## Scope

- Site assets: `apps/web/public/assets/ships`
- Web ship catalog: `apps/web/lib/data/ships.ts`
- Mobile ship catalog: `../CruiseKit-Mobile/assets/data/ships.json`
- Mobile rich sailing catalog: `../CruiseKit-Mobile/assets/data/sailing_catalog.json`
- Review manifest: `data/ship-image-review.json`
- Contact sheet: `data/reports/ship-asset-contact-sheet.html`

## Counts

| Metric | Count |
| --- | ---: |
| Web catalog ships | 126 |
| Mobile catalog ships | 130 |
| Mobile rich-catalog rows | 3875 |
| Mobile rich-catalog resolved ship IDs | 99 |
| Mobile rich-catalog unresolved bare-code rows | 36 |
| Expected ship IDs | 137 |
| Site ship JPG assets | 135 |
| Missing assets | 2 |
| Orphaned assets | 0 |
| Manually blocked assets | 2 |
| Assets without verified source metadata | 16 |
| CDN assets checked | 0 |
| CDN failures | 0 |
| Hardcoded site ship references | 6 |
| Hardcoded site reference issues | 0 |

## Missing Ship Assets

- brilliant-lady (Brilliant Lady, Virgin Voyages)
- norwegian-aura (Norwegian Aura, Norwegian)

## Manually Blocked Assets

- brilliant-lady (Brilliant Lady) - No suitable hero image with audited commercial-reuse rights is available. The former official-site derivative was removed because Virgin Voyages did not grant commercial redistribution rights.
- norwegian-aura (Norwegian Aura) - No suitable hero image with commercial-reuse rights was found. NCL's current legal notice requires advance written permission for commercial copying or redistribution.

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

- warning: mobile-sailing-catalog-bare-codes - 36 rich-catalog row(s) use bare ship codes outside the audited website reference; they were reported instead of silently omitted from sailing-derived ship IDs: celebrity:AT=6, virgin-voyages:BR=30.
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

- info: brilliant-lady - No suitable hero image with audited commercial-reuse rights is available. The former official-site derivative was removed because Virgin Voyages did not grant commercial redistribution rights.
- info: norwegian-aura - No suitable hero image with commercial-reuse rights was found. NCL's current legal notice requires advance written permission for commercial copying or redistribution.
