# Norwegian Staging Import Report

Generated: 2026-07-01T14:31:54.560Z

Mode: staging-only

## Counts

| Metric | Count |
| --- | ---: |
| Search pages | 1 |
| Source itineraries sampled | 30 |
| Staged sailings | 149 |
| Schema errors | 0 |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | 429 |
| Max observed starting price | 2499 |

## By Ship

- Norwegian Aqua: 32
- Norwegian Breakaway: 8
- Norwegian Epic: 18
- Norwegian Escape: 22
- Norwegian Getaway: 18
- Norwegian Joy: 3
- Norwegian Luna: 18
- Norwegian Pearl: 6
- Norwegian Prima: 16
- Norwegian Viva: 8

## Promotion Rules

- Do not auto-promote prices into production.
- Verify exact ship/date/itinerary/link on NCL before editing seed data.
- Keep promoted Norwegian records at `itinerary_verified_price_check_required` unless a human verifies the price.
- Keep uncertain records hidden with `internal_do_not_publish`.

## Blockers

- None
