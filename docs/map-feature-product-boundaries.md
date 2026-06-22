# CruiseKit Map Feature Product Boundaries

## Positioning

CruiseKit map-style features are planning and destination discovery tools. They help travelers understand itinerary order, compare cruise ports, and preview port-area context before a sailing.

Use this language:

- Visual cruise planning
- Cruise route map
- Port guide destination snapshot
- Explore cruise ports
- Destination discovery
- Port-area planning notes
- Walkability, tender status, currency, connectivity, activities, food, and getting-around context

Avoid this language:

- Live turn-by-turn directions
- User-position tracking
- Offline route guidance
- Ship-return routing
- Emergency routing
- Safety scoring tied to map features
- Guaranteed timing or arrival claims

## Product Boundaries

- Route graphics are not provider maps. They visualize itinerary order from `ItineraryDay` data.
- Port guide snapshot cards are not provider maps. They summarize bundled port-guide facts and informational pier context when available.
- Explore Map is the only live map view. It is optional, feature-flagged, and loaded only after the user explicitly chooses Map view.
- Pier metadata is informational. It should not be presented as an authoritative docking assignment or day-of operational source.
- Walkability is a planning hint. Do not reuse legacy safety-score fields for new map or guide surfaces.

## Deferred Work

- No paid directions, route, places, geocoding, or matrix APIs.
- No precise user-location tracking.
- No offline map or tile downloads.
- No active paywall or in-app purchase for Phase 1.
- No full POI database.
- No comparison pages until a later factual and legal review approves them.

## Review Checklist

- The default path remains Explore List, not live Map.
- Map view has a disabled/token-missing fallback.
- New copy frames maps as planning/discovery.
- New code does not touch unrelated route, offline, location, or emergency workflows.
- New analytics events use allowlisted params only.
- Public pages have crawlable direct-answer copy and visible FAQs.
