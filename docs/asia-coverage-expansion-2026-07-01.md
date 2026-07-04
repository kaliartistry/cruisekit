# Same-Day Asia Coverage Expansion - 2026-07-01

## Summary

- Starting live/public state: 357 public/mobile sailings, including 8 Asia sailings, all Norwegian.
- Promoted 31 additional Norwegian Asia sailings from official NCL staging review.
- New candidate bundles contain 388 public/mobile sailings and 39 Asia sailings.
- All promoted Asia records remain `itinerary_verified_price_check_required`.

## Provider Results

| Provider | Result | Promotion decision |
| --- | --- | --- |
| Norwegian | 40 staged, 31 new Asia candidates, 9 exact matches, 0 price changes | Promoted 31 explicit reviewed IDs with direct links and full port lists |
| Azamara | 0 staged from `https://www.azamara.com/cruises?destinations=ASIA` | Report-only |
| MSC | 0 staged from accessible MSC market Asia probe | Report-only |
| Princess | 2,078 staged; review surfaced Asia records but the light feed has no itinerary ports or fare detail | Report-only |
| Holland America | 14 staged; review surfaced no Asia candidates and records remain card-only | Report-only |

## Validation

- `pnpm run data:publish:candidate` passed after converting `jeju.jpg` from PNG bytes to a real JPEG.
- `pnpm run schema:validate` passed: 433 sailings, 0 errors, 0 warnings.
- `node ops/scripts/duplicate-check.js` passed: no duplicates.
- `pnpm --filter web lint` passed.
- `pnpm --filter web build` passed.
- `pnpm --filter cruisekit-functions lint` passed.

## Notes

- Price, link, and availability-sensitive fields were not auto-verified.
- The app receives these records through the same public/mobile bundle manifest once the data PR is merged and GitHub Pages deploys.
