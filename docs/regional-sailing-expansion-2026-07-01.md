# Regional Sailing Expansion - 2026-07-01

## What changed

- Added regional buckets for `south-america`, `antarctica`, `panama-canal`, `canada-new-england`, and `australia-new-zealand`.
- Regenerated shared TypeScript and Dart sailing models from `data/schema/sailing.schema.json`.
- Normalized 14 existing `other` seed records into clear supported regions and left 1 ambiguous record unchanged for manual review.
- Imported, reviewed, and promoted 41 official NCL regional sailings:
  - Mediterranean: 16
  - Panama Canal: 9
  - South America: 8
  - Asia: 8
- Kept promoted NCL records at `itinerary_verified_price_check_required`; fares remain visible as observed starting prices but must be checked before booking or featuring.

## Importer boundaries

- NCL was used for live regional population because its official API output included date-specific links and usable itinerary port lists.
- Azamara regional search was run with Mediterranean, Asia, South America, and Panama terms; it returned 0 usable staging records for this pass.
- Holland America regional normalization support was updated, but no new Holland America regional records were promoted because the current importer captures search-card fields without full port lists.
- MSC regional normalization support was updated, but MSC remains manual-review-only because current accessible output is from a non-US market/currency path.
- Princess, Virgin Voyages, Royal Caribbean, and Carnival normalization support was updated for future staging/review runs; no records from those lines were promoted in this pass without full compliant review.

## App data behavior

The mobile app was inspected in `/Users/kaliartistry-mac/CruiseKit-Mobile` without changing that dirty worktree.

- `lib/config/app_environment.dart` defaults `CRUISEKIT_DATA_MANIFEST_URL` to `https://cruisekit.app/data/bundles/manifest.json`.
- `lib/services/data_refresh_service.dart` fetches the remote manifest, validates bundle hashes, maps `mobileSailings` and `mobileDeals`, and keeps bundled JSON fallback behavior.
- Because this PR updates the same public/mobile bundles, the new sailings should reach the app through the remote manifest after the website deploy publishes `apps/web/public/data/bundles/manifest.json`.

## Map approach

No map-cost expansion was added.

- MyDay/MyCrew route and port context remain bundled-data visuals.
- The app's route preview uses custom drawing, not a live map provider.
- Explore List remains the default mode.
- The Mapbox view is constructed only when the user explicitly opens Explore Map.
- `CRUISEKIT_EXPLORE_MAP_ENABLED` and `MAPBOX_ACCESS_TOKEN` continue to gate live Mapbox loading.
- No paid directions, geocoding, places, matrix, Navigation SDK, or offline-map preload work was added.

## Cost position checked

- Mapbox pricing lists Maps SDKs for Mobile with up to 25,000 monthly active users free, then $4 per 1,000 for the next tier: https://www.mapbox.com/pricing
- Mapbox pricing lists Map Loads for Web with up to 50,000 monthly loads free: https://www.mapbox.com/pricing
- Mapbox offline maps are not a cost-control shortcut for this phase because offline resources are included in regular MAU billing and offline regions are constrained by tile-pack limits: https://docs.mapbox.com/help/dive-deeper/mobile-offline/
- Google Maps remains a later comparison item, not a current switch, because its pricing is SKU-based across maps, routes, geocoding, places, tiles, and other services: https://developers.google.com/maps/billing-and-pricing/pricing

## Verification

- `pnpm run schema:gen`
- `pnpm run data:normalize:regions -- --apply`
- `NCL_DESTINATIONS=MEDITERRANEAN,ASIA,SOUTH_AMERICA,PANAMA_CANAL NCL_MAX_ITINERARIES=8 NCL_MAX_SAILINGS_PER_ITINERARY=3 pnpm run data:ingest:norwegian`
- `NORWEGIAN_REVIEW_LIMIT=80 NORWEGIAN_REVIEW_TARGET_REGIONS=mediterranean,asia,south-america,panama-canal pnpm run data:review:norwegian`
- `pnpm run data:promote:norwegian -- --apply --limit 80`
- `pnpm run data:publish:candidate`

The publish candidate completed with 0 blockers and 0 warnings, preparing 279 public sailings and 279 mobile sailings.
