# Princess Staging Import Report

Generated: 2026-08-26T13:15:43.330Z

Mode: staging-only

Source: https://www.princess.com/cruise-search/?trade=all&resType=C

## Counts

| Metric | Count |
| --- | ---: |
| Source ships | 17 |
| Source trades | 15 |
| Source ports | 385 |
| Source products | 1013 |
| Products sampled | 1013 |
| Staged sailings | 2109 |
| Schema errors | 0 |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | n/a |
| Max observed starting price | n/a |

Princess' light public search feed does not expose trustworthy fare details, so staged records use `startingPrice: null`.

## By Region

- alaska: 402
- antarctica: 11
- asia: 238
- australia-new-zealand: 111
- california-coast: 51
- canada-new-england: 28
- caribbean: 430
- hawaii: 41
- mediterranean: 537
- mexico: 74
- other: 36
- panama-canal: 53
- south-pacific: 42
- transatlantic: 55

## By Ship

- Caribbean Princess: 124
- Coral Princess: 108
- Crown Princess: 137
- Diamond Princess: 129
- Discovery Princess: 128
- Emerald Princess: 128
- Enchanted Princess: 152
- Grand Princess: 92
- Island Princess: 95
- Majestic Princess: 72
- Regal Princess: 171
- Royal Princess: 105
- Ruby Princess: 63
- Sapphire Princess: 115
- Sky Princess: 101
- Star Princess: 128
- Sun Princess: 261

## Promotion Rules

- Do not auto-promote Princess staged records as public deals.
- Open the Princess source and verify exact ship, date, duration, itinerary, current fare, price basis, taxes/fees, and booking link before promotion.
- Keep promoted Princess records at `itinerary_verified_price_check_required` unless a human verifies price at publish time.

## Blockers

- None
