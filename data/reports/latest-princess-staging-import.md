# Princess Staging Import Report

Generated: 2026-07-01T14:32:31.636Z

Mode: staging-only

Source: https://www.princess.com/cruise-search/?trade=all&resType=C

## Counts

| Metric | Count |
| --- | ---: |
| Source ships | 17 |
| Source trades | 15 |
| Source ports | 379 |
| Source products | 999 |
| Products sampled | 999 |
| Staged sailings | 1990 |
| Schema errors | 0 |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | n/a |
| Max observed starting price | n/a |

Princess' light public search feed does not expose trustworthy fare details, so staged records use `startingPrice: null`.

## By Region

- alaska: 260
- asia: 249
- california-coast: 39
- caribbean: 421
- hawaii: 34
- mediterranean: 588
- mexico: 66
- other: 126
- south-pacific: 150
- transatlantic: 57

## By Ship

- Caribbean Princess: 140
- Coral Princess: 90
- Crown Princess: 21
- Diamond Princess: 140
- Discovery Princess: 109
- Emerald Princess: 112
- Enchanted Princess: 164
- Grand Princess: 101
- Island Princess: 75
- Majestic Princess: 77
- Regal Princess: 187
- Royal Princess: 92
- Ruby Princess: 57
- Sapphire Princess: 121
- Sky Princess: 107
- Star Princess: 112
- Sun Princess: 285

## Promotion Rules

- Do not auto-promote Princess staged records as public deals.
- Open the Princess source and verify exact ship, date, duration, itinerary, current fare, price basis, taxes/fees, and booking link before promotion.
- Keep promoted Princess records at `itinerary_verified_price_check_required` unless a human verifies price at publish time.

## Blockers

- None
