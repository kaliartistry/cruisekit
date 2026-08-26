# Norwegian Staging Import Report

Generated: 2026-08-26T12:59:13.001Z

Mode: staging-only

## Counts

| Metric | Count |
| --- | ---: |
| Search pages | 1 |
| Source itineraries sampled | 30 |
| Staged sailings | 146 |
| Schema errors | 0 |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | 249 |
| Max observed starting price | 2349 |

## By Ship

- Norwegian Aqua: 33
- Norwegian Breakaway: 8
- Norwegian Epic: 19
- Norwegian Escape: 25
- Norwegian Getaway: 18
- Norwegian Joy: 2
- Norwegian Luna: 18
- Norwegian Pearl: 6
- Norwegian Prima: 9
- Norwegian Viva: 8

## Promotion Rules

- Do not auto-promote prices into production.
- Verify exact ship/date/itinerary/link on NCL before editing seed data.
- Keep promoted Norwegian records at `itinerary_verified_price_check_required` unless a human verifies the price.
- Keep uncertain records hidden with `internal_do_not_publish`.

## Blockers

- None
