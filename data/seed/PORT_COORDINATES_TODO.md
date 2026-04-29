# Port Coordinates — TODO

The Sailing schema requires `portCoordinates: PortCoordinate[]` on every record (may be empty), but ShipSafe SDK consumers (CruiseKit-Mobile MyDay pillar, future "all aboard" warning) need lat/lng for *every* itinerary port to function correctly. This file tracks ports that appear in `data/seed/sailings.json` but don't yet have coordinates populated.

## Verification status of seed records

**All 12 seed sailings are currently `confidence: "itinerary_verified_price_check_required"`.**

The itinerary structure (line, ship, route, port list) is hand-authored from established cruise-line knowledge. The exact pricing and the deep-link URLs are not session-verified — `directLink` points to the cruise-line ship landing page, not a specific sailing detail page. Before promoting any record to `confidence: "verified_from_cruise_line"`:

1. Open the `directLink` URL in a real browser (not a script).
2. Find the actual sailing on the corresponding date.
3. Verify `startingPrice`, `priceBasis`, `taxesAndFeesIncluded`, and `nights`.
4. Replace `directLink` with the deep link to that specific sailing.
5. Update `lastVerified` to the date you verified.
6. Bump `confidence` to `verified_from_cruise_line`.

Until promoted, the UI renders these with the "Itinerary verified · price changes — check current rate" label and the CTA copy "Check current price", which is honest about the trust tier.

## Ports missing coordinates in current seed

These ports appear in `itineraryPorts[]` for one or more sailings but have no entry in the corresponding `portCoordinates[]`. Backfill in this file as coordinates are sourced.

| Port | Appears in | Reason missing | Suggested source |
| --- | --- | --- | --- |
| Costa Maya, Mexico | Wonder of the Seas, Norwegian Encore, Norwegian Escape | Coordinates of the Costa Maya cruise pier (Mahahual) need confirmation — public 18.733, -87.683 is the town center, not the pier | Carnival or RCI port guide PDF |
| Roatan, Honduras | Wonder of the Seas, Norwegian Encore, Norwegian Escape | Two cruise berths on Roatan (Mahogany Bay vs. Coxen Hole) — need to know which berth each line uses | Cruise line port guide |
| Half Moon Cay, Bahamas | Carnival Venezia | Tender port — coordinates needed for tender drop-off, not the island center | Carnival port guide |
| Grand Turk, Turks & Caicos | Carnival Venezia, Carnival Magic, Carnival Celebration | Grand Turk Cruise Center pier | Grand Turk Cruise Center |
| Celebration Key, Bahamas | Carnival Venezia, Carnival Celebration | New Carnival private destination on Grand Bahama; final pier coords not public on schema authoring date | Carnival official site post-launch |
| Amber Cove, Dominican Republic | Carnival Magic, Carnival Celebration | Carnival's private port near Puerto Plata | Carnival port guide |
| Tortola, BVI | Norwegian Getaway | Road Town cruise pier vs. tender | BVI Ports Authority |

## Process for backfilling

1. Confirm the **berth** (not the city center) — a 2km error here breaks the ShipSafe SDK "time-to-walk-back" calculation.
2. Add to the relevant sailing's `portCoordinates[]` array with `portName` matching the string in `itineraryPorts[]` (case-sensitive).
3. Optionally fill `berth` with the terminal/pier name and `source` with the citation.
4. Run `pnpm run schema:validate` to confirm the record still passes.
5. Bump `updatedAt`.

## Future: shared port registry

Hand-populating coordinates per-sailing is correct for launch but doesn't scale. The next iteration should extract a `port-registry.json` keyed by canonical port name, then have sailings reference it by port slug. That's a future batch — not in scope here.
