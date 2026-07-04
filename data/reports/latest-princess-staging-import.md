# Princess Staging Import Report

Generated: 2026-07-01T23:21:16.023Z

Mode: staging-only

Source: https://www.princess.com/cruise-search/?trade=all&resType=C

## Counts

| Metric | Count |
| --- | ---: |
| Source ships | 17 |
| Source trades | 15 |
| Source ports | 379 |
| Source products | 1021 |
| Products sampled | 1021 |
| Staged sailings | 2078 |
| Schema errors | 0 |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | n/a |
| Max observed starting price | n/a |

Princess' light public search feed does not expose trustworthy fare details, so staged records use `startingPrice: null`.

## By Region

- alaska: 290
- antarctica: 11
- asia: 249
- australia-new-zealand: 109
- california-coast: 44
- canada-new-england: 28
- caribbean: 460
- hawaii: 40
- mediterranean: 588
- mexico: 70
- other: 39
- panama-canal: 51
- south-pacific: 42
- transatlantic: 57

## By Ship

- Caribbean Princess: 140
- Coral Princess: 90
- Crown Princess: 109
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
