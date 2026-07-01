# Norwegian Staging Import Report

Generated: 2026-07-01T19:26:33.699Z

Mode: staging-only

## Counts

| Metric | Count |
| --- | ---: |
| Search pages | 4 |
| Source itineraries sampled | 29 |
| Staged sailings | 41 |
| Schema errors | 0 |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | 859 |
| Max observed starting price | 3989 |

## By Ship

- Norwegian Bliss: 2
- Norwegian Dawn: 7
- Norwegian Epic: 6
- Norwegian Gem: 7
- Norwegian Jade: 8
- Norwegian Jewel: 1
- Norwegian Star: 10

## Promotion Rules

- Do not auto-promote prices into production.
- Verify exact ship/date/itinerary/link on NCL before editing seed data.
- Keep promoted Norwegian records at `itinerary_verified_price_check_required` unless a human verifies the price.
- Keep uncertain records hidden with `internal_do_not_publish`.

## Blockers

- None
