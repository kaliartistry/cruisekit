# Norwegian Staging Import Report

Generated: 2026-07-01T22:30:33.279Z

Mode: staging-only

## Counts

| Metric | Count |
| --- | ---: |
| Search pages | 2 |
| Source itineraries sampled | 50 |
| Staged sailings | 79 |
| Schema errors | 0 |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | 859 |
| Max observed starting price | 5699 |

## By Ship

- Norwegian Dawn: 12
- Norwegian Epic: 10
- Norwegian Gem: 21
- Norwegian Pearl: 13
- Norwegian Sky: 2
- Norwegian Sun: 1
- Norwegian Viva: 20

## Promotion Rules

- Do not auto-promote prices into production.
- Verify exact ship/date/itinerary/link on NCL before editing seed data.
- Keep promoted Norwegian records at `itinerary_verified_price_check_required` unless a human verifies the price.
- Keep uncertain records hidden with `internal_do_not_publish`.

## Blockers

- None
