# CruiseKit Ship Asset Audit

Generated: 2026-07-03T13:20:17.274Z

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
| Site ship JPG assets | 114 |
| Missing assets | 12 |
| Orphaned assets | 0 |
| Manually blocked assets | 1 |
| Assets without verified source metadata | 114 |
| CDN assets checked | 126 |
| CDN failures | 12 |
| Hardcoded site ship references | 6 |
| Hardcoded site reference issues | 0 |

## Missing Ship Assets

- koningsdam (Koningsdam, Holland America)
- msc-grandiosa (MSC Grandiosa, Msc)
- msc-opera (MSC Opera, Msc)
- msc-virtuosa (MSC Virtuosa, Msc)
- nieuw-statendam (Nieuw Statendam, Holland America)
- noordam (Noordam, Holland America)
- oosterdam (Oosterdam, Holland America)
- resilient-lady (Resilient Lady, Virgin Voyages)
- spectrum-of-the-seas (Spectrum of the Seas, Royal Caribbean)
- utopia-of-the-seas (Utopia of the Seas, Royal Caribbean)
- valiant-lady (Valiant Lady, Virgin Voyages)
- zuiderdam (Zuiderdam, Holland America)

## Manually Blocked Assets

- carnival-breeze (Carnival Breeze) - Current asset renders as an airplane, not the Carnival Breeze cruise ship.

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

- blocker: carnival-breeze - Current asset renders as an airplane, not the Carnival Breeze cruise ship.
- blocker: grandeur-of-the-seas - Ship asset has invalid JPG bytes: apps/web/public/assets/ships/grandeur-of-the-seas.jpg
- blocker: koningsdam - Missing ship asset: apps/web/public/assets/ships/koningsdam.jpg
- blocker: msc-grandiosa - Missing ship asset: apps/web/public/assets/ships/msc-grandiosa.jpg
- blocker: msc-opera - Missing ship asset: apps/web/public/assets/ships/msc-opera.jpg
- blocker: msc-virtuosa - Missing ship asset: apps/web/public/assets/ships/msc-virtuosa.jpg
- blocker: nieuw-statendam - Missing ship asset: apps/web/public/assets/ships/nieuw-statendam.jpg
- blocker: noordam - Missing ship asset: apps/web/public/assets/ships/noordam.jpg
- blocker: oosterdam - Missing ship asset: apps/web/public/assets/ships/oosterdam.jpg
- blocker: resilient-lady - Missing ship asset: apps/web/public/assets/ships/resilient-lady.jpg
- blocker: spectrum-of-the-seas - Missing ship asset: apps/web/public/assets/ships/spectrum-of-the-seas.jpg
- blocker: utopia-of-the-seas - Missing ship asset: apps/web/public/assets/ships/utopia-of-the-seas.jpg
- blocker: valiant-lady - Missing ship asset: apps/web/public/assets/ships/valiant-lady.jpg
- blocker: zuiderdam - Missing ship asset: apps/web/public/assets/ships/zuiderdam.jpg
- blocker: koningsdam - Live CDN ship asset failed: 404 https://cruisekit.app/assets/ships/koningsdam.jpg
- blocker: msc-grandiosa - Live CDN ship asset failed: 404 https://cruisekit.app/assets/ships/msc-grandiosa.jpg
- blocker: msc-opera - Live CDN ship asset failed: 404 https://cruisekit.app/assets/ships/msc-opera.jpg
- blocker: msc-virtuosa - Live CDN ship asset failed: 404 https://cruisekit.app/assets/ships/msc-virtuosa.jpg
- blocker: nieuw-statendam - Live CDN ship asset failed: 404 https://cruisekit.app/assets/ships/nieuw-statendam.jpg
- blocker: noordam - Live CDN ship asset failed: 404 https://cruisekit.app/assets/ships/noordam.jpg
- blocker: oosterdam - Live CDN ship asset failed: 404 https://cruisekit.app/assets/ships/oosterdam.jpg
- blocker: resilient-lady - Live CDN ship asset failed: 404 https://cruisekit.app/assets/ships/resilient-lady.jpg
- blocker: spectrum-of-the-seas - Live CDN ship asset failed: 404 https://cruisekit.app/assets/ships/spectrum-of-the-seas.jpg
- blocker: utopia-of-the-seas - Live CDN ship asset failed: 404 https://cruisekit.app/assets/ships/utopia-of-the-seas.jpg
- blocker: valiant-lady - Live CDN ship asset failed: 404 https://cruisekit.app/assets/ships/valiant-lady.jpg
- blocker: zuiderdam - Live CDN ship asset failed: 404 https://cruisekit.app/assets/ships/zuiderdam.jpg

## Warnings

- warning: adventure-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: allure-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: anthem-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: brilliance-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: brilliant-lady - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: caribbean-princess - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-breeze - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-celebration - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-conquest - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-dream - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-festivale - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-firenze - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-freedom - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-horizon - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-jubilee - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-legend - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-liberty - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-magic - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-miracle - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-paradise - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-pride - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-spirit - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-sunrise - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-sunshine - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-valor - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-venezia - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: carnival-vista - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-apex - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-ascent - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-beyond - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-constellation - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-eclipse - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-edge - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-equinox - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-infinity - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-millennium - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-reflection - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-silhouette - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-solstice - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-summit - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: celebrity-xcel - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: crown-princess - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: discovery-princess - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: disney-adventure - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: disney-destiny - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: disney-dream - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: disney-fantasy - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: disney-magic - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: disney-treasure - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: disney-wish - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: disney-wonder - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: emerald-princess - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: enchanted-princess - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: enchantment-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: eurodam - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: explorer-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: freedom-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: grandeur-of-the-seas - Could not read JPG dimensions: apps/web/public/assets/ships/grandeur-of-the-seas.jpg
- warning: grandeur-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: harmony-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: icon-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: independence-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: island-princess - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: jewel-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: liberty-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: majestic-princess - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: mardi-gras - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: mariner-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: msc-bellissima - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: msc-divina - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: msc-meraviglia - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: msc-seascape - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: msc-seashore - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: msc-seaside - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: msc-world-america - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: navigator-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: nieuw-amsterdam - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-aqua - Ship asset is low resolution (640x150): apps/web/public/assets/ships/norwegian-aqua.jpg
- warning: norwegian-aqua - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-bliss - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-breakaway - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-encore - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-escape - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-gem - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-getaway - Ship asset is low resolution (640x150): apps/web/public/assets/ships/norwegian-getaway.jpg
- warning: norwegian-getaway - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-jade - Ship asset is low resolution (640x150): apps/web/public/assets/ships/norwegian-jade.jpg
- warning: norwegian-jade - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-joy - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-luna - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-pearl - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-prima - Ship asset is low resolution (640x150): apps/web/public/assets/ships/norwegian-prima.jpg
- warning: norwegian-prima - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-sky - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-star - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-sun - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: norwegian-viva - Ship asset is low resolution (640x150): apps/web/public/assets/ships/norwegian-viva.jpg
- warning: norwegian-viva - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: oasis-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: odyssey-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: ovation-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: pride-of-america - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: quantum-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: radiance-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: regal-princess - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: rotterdam - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: royal-princess - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: ruby-princess - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: scarlet-lady - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: serenade-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: sky-princess - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: star-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: star-princess - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: sun-princess - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: symphony-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: vision-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: volendam - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: westerdam - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: wonder-of-the-seas - Ship asset lacks verified source metadata in data/ship-image-review.json.
- warning: zaandam - Ship asset lacks verified source metadata in data/ship-image-review.json.

## Info

- None
