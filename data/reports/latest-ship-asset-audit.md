# CruiseKit Ship Asset Audit

Generated: 2026-08-08T19:59:03.179Z

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
| Site ship JPG assets | 134 |
| Missing assets | 3 |
| Orphaned assets | 0 |
| Manually blocked assets | 3 |
| Assets without verified source metadata | 0 |
| CDN assets checked | 0 |
| CDN failures | 0 |
| Hardcoded site ship references | 6 |
| Hardcoded site reference issues | 0 |

## Missing Ship Assets

- brilliant-lady (Brilliant Lady, Virgin Voyages)
- carnival-festivale (Carnival Festivale, Carnival)
- norwegian-aura (Norwegian Aura, Norwegian)

## Manually Blocked Assets

- brilliant-lady (Brilliant Lady) - No suitable hero image with audited commercial-reuse rights is available. The former official-site derivative was removed because Virgin Voyages did not grant commercial redistribution rights.
- carnival-festivale (Carnival Festivale) - Carnival Festivale is a future ship, and no truthful exterior photograph with audited commercial-reuse rights is available. The former Carnival News rendering was removed because a press-site download is not a commercial redistribution license.
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

## Info

- info: brilliant-lady - No suitable hero image with audited commercial-reuse rights is available. The former official-site derivative was removed because Virgin Voyages did not grant commercial redistribution rights.
- info: carnival-festivale - Carnival Festivale is a future ship, and no truthful exterior photograph with audited commercial-reuse rights is available. The former Carnival News rendering was removed because a press-site download is not a commercial redistribution license.
- info: norwegian-aura - No suitable hero image with commercial-reuse rights was found. NCL's current legal notice requires advance written permission for commercial copying or redistribution.
