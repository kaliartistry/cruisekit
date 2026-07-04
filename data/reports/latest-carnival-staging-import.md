# Carnival Staging Import Report

Generated: 2026-07-01T22:32:22.485Z

Mode: staging-only

## Counts

| Metric | Count |
| --- | ---: |
| Raw pages | 1 |
| Staged sailings | 39 |
| Schema errors | 0 |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | 746 |
| Max observed starting price | 1506 |

## By Ship

- Carnival Legend: 7
- Carnival Miracle: 17
- Carnival Sunshine: 15

## Promotion Rules

- Do not auto-promote prices into production.
- Verify exact ship/date/itinerary/link on Carnival before editing seed data.
- Keep promoted records at `itinerary_verified_price_check_required` unless a human verifies the price.
- Keep uncertain records hidden with `internal_do_not_publish`.

## Blockers

- None
