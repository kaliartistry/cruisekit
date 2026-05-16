# Princess Staging Import Report

Generated: 2026-05-16T20:19:17.900Z

Mode: staging-only

Source: https://www.princess.com/cruise-search/?trade=all&resType=C

## Counts

| Metric | Count |
| --- | ---: |
| Source ships | 17 |
| Source trades | 15 |
| Source ports | 380 |
| Source products | 872 |
| Products sampled | 872 |
| Staged sailings | 1931 |
| Schema errors | 0 |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | n/a |
| Max observed starting price | n/a |

Princess' light public search feed does not expose trustworthy fare details, so staged records use `startingPrice: null`.

## By Region

- alaska: 352
- asia: 264
- california-coast: 44
- caribbean: 484
- hawaii: 40
- mediterranean: 367
- mexico: 70
- other: 123
- south-pacific: 151
- transatlantic: 36

## By Ship

- Caribbean Princess: 87
- Coral Princess: 97
- Crown Princess: 110
- Diamond Princess: 153
- Discovery Princess: 118
- Emerald Princess: 119
- Enchanted Princess: 121
- Grand Princess: 110
- Island Princess: 85
- Majestic Princess: 54
- Regal Princess: 184
- Royal Princess: 98
- Ruby Princess: 60
- Sapphire Princess: 124
- Sky Princess: 88
- Star Princess: 119
- Sun Princess: 204

## Promotion Rules

- Do not auto-promote Princess staged records as public deals.
- Open the Princess source and verify exact ship, date, duration, itinerary, current fare, price basis, taxes/fees, and booking link before promotion.
- Keep promoted Princess records at `itinerary_verified_price_check_required` unless a human verifies price at publish time.

## Blockers

- None
