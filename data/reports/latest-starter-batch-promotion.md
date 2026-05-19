# Starter Batch Promotion Plan

Generated: 2026-05-19T06:02:23.420Z

Mode: apply

## Counts

| Provider | Selected |
| --- | ---: |
| Carnival | 20 |
| Norwegian | 10 |

## Carnival

Command:

```bash
pnpm run data:promote:carnival -- --apply --ids=carnival-carnival-magic-20270117-21915,carnival-carnival-magic-20270131-21917,carnival-carnival-magic-20261025-21903,carnival-carnival-valor-20260822-22085,carnival-carnival-valor-20270201-22120,carnival-carnival-breeze-20270116-20917,carnival-carnival-breeze-20270125-20919,carnival-carnival-valor-20260905-22088,carnival-carnival-valor-20260831-22087,carnival-carnival-valor-20270104-22114,carnival-carnival-paradise-20270201-21661,carnival-carnival-breeze-20261130-20907,carnival-carnival-paradise-20270109-21656,carnival-carnival-breeze-20270111-20916,carnival-carnival-breeze-20270130-20920,carnival-carnival-paradise-20270104-21655,carnival-carnival-valor-20270220-22124,carnival-carnival-valor-20261128-22106,carnival-carnival-paradise-20261128-21647,carnival-carnival-breeze-20261205-20908
```

| Ship | Date | Nights | Price | Departure | ID |
| --- | --- | ---: | ---: | --- | --- |
| Carnival Magic | 2027-01-17 | 6 | $384 | Miami, FL | `carnival-carnival-magic-20270117-21915` |
| Carnival Magic | 2027-01-31 | 6 | $384 | Miami, FL | `carnival-carnival-magic-20270131-21917` |
| Carnival Magic | 2026-10-25 | 6 | $389 | Miami, FL | `carnival-carnival-magic-20261025-21903` |
| Carnival Valor | 2026-08-22 | 5 | $352 | New Orleans, LA | `carnival-carnival-valor-20260822-22085` |
| Carnival Valor | 2027-02-01 | 5 | $354 | New Orleans, LA | `carnival-carnival-valor-20270201-22120` |
| Carnival Breeze | 2027-01-16 | 5 | $359 | Galveston, TX | `carnival-carnival-breeze-20270116-20917` |
| Carnival Breeze | 2027-01-25 | 5 | $359 | Galveston, TX | `carnival-carnival-breeze-20270125-20919` |
| Carnival Valor | 2026-09-05 | 5 | $364 | New Orleans, LA | `carnival-carnival-valor-20260905-22088` |
| Carnival Valor | 2026-08-31 | 5 | $369 | New Orleans, LA | `carnival-carnival-valor-20260831-22087` |
| Carnival Valor | 2027-01-04 | 5 | $374 | New Orleans, LA | `carnival-carnival-valor-20270104-22114` |
| Carnival Paradise | 2027-02-01 | 5 | $374 | Tampa, FL | `carnival-carnival-paradise-20270201-21661` |
| Carnival Breeze | 2026-11-30 | 5 | $379 | Galveston, TX | `carnival-carnival-breeze-20261130-20907` |
| Carnival Paradise | 2027-01-09 | 5 | $379 | Tampa, FL | `carnival-carnival-paradise-20270109-21656` |
| Carnival Breeze | 2027-01-11 | 5 | $379 | Galveston, TX | `carnival-carnival-breeze-20270111-20916` |
| Carnival Breeze | 2027-01-30 | 5 | $379 | Galveston, TX | `carnival-carnival-breeze-20270130-20920` |
| Carnival Paradise | 2027-01-04 | 5 | $384 | Tampa, FL | `carnival-carnival-paradise-20270104-21655` |
| Carnival Valor | 2027-02-20 | 5 | $384 | New Orleans, LA | `carnival-carnival-valor-20270220-22124` |
| Carnival Valor | 2026-11-28 | 5 | $389 | New Orleans, LA | `carnival-carnival-valor-20261128-22106` |
| Carnival Paradise | 2026-11-28 | 5 | $389 | Tampa, FL | `carnival-carnival-paradise-20261128-21647` |
| Carnival Breeze | 2026-12-05 | 5 | $389 | Galveston, TX | `carnival-carnival-breeze-20261205-20908` |

## Norwegian

Command:

```bash
pnpm run data:promote:norwegian -- --apply --ids=norwegian-norwegian-epic-20270117-59109,norwegian-norwegian-epic-20270124-59110,norwegian-norwegian-getaway-20270331-59676,norwegian-norwegian-epic-20261122-59101,norwegian-norwegian-escape-20270115-59230,norwegian-norwegian-escape-20270122-59231,norwegian-norwegian-escape-20270129-59232,norwegian-norwegian-escape-20270804-60495,norwegian-norwegian-escape-20260705-58718,norwegian-norwegian-escape-20260712-58719
```

| Ship | Date | Nights | Price | Departure | ID |
| --- | --- | ---: | ---: | --- | --- |
| Norwegian Epic | 2027-01-17 | 7 | $879 | Orlando (Port Canaveral), Florida | `norwegian-norwegian-epic-20270117-59109` |
| Norwegian Epic | 2027-01-24 | 7 | $879 | Orlando (Port Canaveral), Florida | `norwegian-norwegian-epic-20270124-59110` |
| Norwegian Getaway | 2027-03-31 | 5 | $879 | Orlando (Port Canaveral), Florida | `norwegian-norwegian-getaway-20270331-59676` |
| Norwegian Epic | 2026-11-22 | 7 | $889 | Orlando (Port Canaveral), Florida | `norwegian-norwegian-epic-20261122-59101` |
| Norwegian Escape | 2027-01-15 | 7 | $889 | Orlando (Port Canaveral), Florida | `norwegian-norwegian-escape-20270115-59230` |
| Norwegian Escape | 2027-01-22 | 7 | $889 | Orlando (Port Canaveral), Florida | `norwegian-norwegian-escape-20270122-59231` |
| Norwegian Escape | 2027-01-29 | 7 | $889 | Orlando (Port Canaveral), Florida | `norwegian-norwegian-escape-20270129-59232` |
| Norwegian Escape | 2027-08-04 | 5 | $889 | Orlando (Port Canaveral), Florida | `norwegian-norwegian-escape-20270804-60495` |
| Norwegian Escape | 2026-07-05 | 7 | $899 | Miami, Florida | `norwegian-norwegian-escape-20260705-58718` |
| Norwegian Escape | 2026-07-12 | 7 | $899 | Miami, Florida | `norwegian-norwegian-escape-20260712-58719` |

## Rules

- Only records with observed staging prices are eligible.
- Promoted records remain `itinerary_verified_price_check_required`.
- Run `pnpm run data:publish` after applying to refresh web/mobile bundles.
