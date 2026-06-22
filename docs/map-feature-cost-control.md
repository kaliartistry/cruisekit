# CruiseKit Map Feature Cost Control

## Goal

Ship useful cruise map-style planning features while keeping provider usage close to zero by default.

## Phase 1 Surfaces

- Cruise route graphic: custom Flutter drawing from itinerary days, sea days, and resolved port-guide slugs.
- Port guide destination snapshot: custom Flutter drawing from bundled port-guide data.
- Web feature and port pages: static/crawlable content with custom visuals and no live map provider.
- Explore Map: the only live map surface, disabled by default and loaded only after a user switches to Map view.

## Live Map Gating

- Mobile live Explore Map requires `CRUISEKIT_EXPLORE_MAP_ENABLED=true`.
- Mobile live Explore Map also requires `AppEnvironment.mapboxAccessToken` to be non-empty.
- List view remains the default Explore experience.
- Mapbox widgets must not be constructed while the user is in List view.
- Missing token, disabled flag, or map load failure must show the list-friendly fallback.

## Provider Usage Rules

- Do not use paid directions, route, places, geocoding, or matrix APIs for Phase 1.
- Do not add background map loading to route graphics or port guide cards.
- Do not request location permission for port guide cards or the default Explore list.
- Do not add offline tile downloads in Phase 1.
- Do not commit API keys, tokens, or provider secrets.

## Analytics Rules

- Analytics events must fail closed.
- Event params must be allowlisted and avoid direct personal identifiers.
- Map events should capture only coarse context, such as `port_slug`, `region`, `view_mode`, and `cta`.

## QA Checklist

- Launch Explore and confirm the list renders without loading the live map.
- Switch to Map with the flag disabled and confirm fallback copy renders.
- Switch to Map with the flag enabled and no token, and confirm fallback copy renders.
- Confirm route graphics and port snapshot cards render without network map calls.
- Confirm port guide pages and feature pages build as static public content.
- Review bundle output for accidental token or secret exposure.
