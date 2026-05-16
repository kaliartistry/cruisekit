# Starter Batch Promotion Plan

Generated: 2026-05-16T22:29:11.251Z

Mode: apply

## Counts

| Provider | Selected |
| --- | ---: |
| Carnival | 6 |
| Norwegian | 4 |

## Carnival

Command:

```bash
pnpm run data:promote:carnival -- --apply --ids=carnival-carnival-magic-20260927-21899,carnival-carnival-sunrise-20260831-22008,carnival-carnival-magic-20260913-21897,carnival-carnival-magic-20261212-21910,carnival-carnival-magic-20260830-21895,carnival-carnival-magic-20270103-21913
```

| Ship | Date | Nights | Price | Departure | ID |
| --- | --- | ---: | ---: | --- | --- |
| Carnival Magic | 2026-09-27 | 6 | $359 | Miami, FL | `carnival-carnival-magic-20260927-21899` |
| Carnival Sunrise | 2026-08-31 | 5 | $379 | Miami, FL | `carnival-carnival-sunrise-20260831-22008` |
| Carnival Magic | 2026-09-13 | 6 | $379 | Miami, FL | `carnival-carnival-magic-20260913-21897` |
| Carnival Magic | 2026-12-12 | 6 | $379 | Miami, FL | `carnival-carnival-magic-20261212-21910` |
| Carnival Magic | 2026-08-30 | 6 | $384 | Miami, FL | `carnival-carnival-magic-20260830-21895` |
| Carnival Magic | 2027-01-03 | 6 | $384 | Miami, FL | `carnival-carnival-magic-20270103-21913` |

## Norwegian

Command:

```bash
pnpm run data:promote:norwegian -- --apply --ids=norwegian-norwegian-getaway-20270312-59673,norwegian-norwegian-prima-20260816-58196,norwegian-norwegian-prima-20260906-58199,norwegian-norwegian-prima-20260920-58201
```

| Ship | Date | Nights | Price | Departure | ID |
| --- | --- | ---: | ---: | --- | --- |
| Norwegian Getaway | 2027-03-12 | 5 | $859 | Orlando (Port Canaveral), Florida | `norwegian-norwegian-getaway-20270312-59673` |
| Norwegian Prima | 2026-08-16 | 7 | $879 | Orlando (Port Canaveral), Florida | `norwegian-norwegian-prima-20260816-58196` |
| Norwegian Prima | 2026-09-06 | 7 | $879 | Orlando (Port Canaveral), Florida | `norwegian-norwegian-prima-20260906-58199` |
| Norwegian Prima | 2026-09-20 | 7 | $879 | Orlando (Port Canaveral), Florida | `norwegian-norwegian-prima-20260920-58201` |

## Rules

- Only records with observed staging prices are eligible.
- Promoted records remain `itinerary_verified_price_check_required`.
- Run `pnpm run data:publish` after applying to refresh web/mobile bundles.
