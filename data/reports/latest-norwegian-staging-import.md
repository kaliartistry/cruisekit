# Norwegian Staging Import Report

Generated: 2026-07-01T23:20:36.930Z

Mode: staging-only

## Counts

| Metric | Count |
| --- | ---: |
| Search pages | 1 |
| Source itineraries sampled | 40 |
| Staged sailings | 40 |
| Schema errors | 0 |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | 1620 |
| Max observed starting price | 4489 |

## By Ship

- Norwegian Jade: 38
- Norwegian Sky: 1
- Norwegian Spirit: 1

## Promotion Rules

- Do not auto-promote prices into production.
- Verify exact ship/date/itinerary/link on NCL before editing seed data.
- Keep promoted Norwegian records at `itinerary_verified_price_check_required` unless a human verifies the price.
- Keep uncertain records hidden with `internal_do_not_publish`.

## Blockers

- None
