# Norwegian Staging Import Report

Generated: 2026-05-16T20:06:34.115Z

Mode: staging-only

## Counts

| Metric | Count |
| --- | ---: |
| Search pages | 1 |
| Source itineraries sampled | 30 |
| Staged sailings | 148 |
| Schema errors | 0 |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | 439 |
| Max observed starting price | 2499 |

## By Ship

- Norwegian Aqua: 32
- Norwegian Bliss: 4
- Norwegian Epic: 18
- Norwegian Escape: 26
- Norwegian Getaway: 19
- Norwegian Joy: 1
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
