# Paid Test Readiness Plan

Status: planning only. No ad account setup, billing, pixel setup, or campaign launch was performed.

## Paid Test Goal

Validate whether a cost-calculator hook can acquire qualified cruise planners at a sustainable cost.

Primary landing page:

- `https://cruisekit.app/calculator`

Secondary landing pages:

- `https://cruisekit.app/blog/hidden-cruise-costs`
- `https://cruisekit.app/calculator/royal-caribbean`
- `https://cruisekit.app/calculator/carnival`
- `https://cruisekit.app/blog/norwegian-free-at-sea-explained`

## Minimum Tracking Before Launch

- GA4 measurement ID configured.
- `utm_landing_visit` confirmed.
- `calculator_started` confirmed.
- `calculator_completed` confirmed.
- `result_shared` confirmed.
- `app_store_click` and `google_play_click` confirmed.
- Store download reporting access confirmed.

## Test Structure

| Test | Hook | Landing | Success metric |
| --- | --- | --- | --- |
| A | Find out what your cruise will actually cost before you book | `/calculator` | Calculator completion rate |
| B | That cheap cruise fare is not the whole vacation | `/blog/hidden-cruise-costs` | Calculator click-through |
| C | Is Free at Sea really free? | `/blog/norwegian-free-at-sea-explained` | Guide to calculator click |
| D | Carnival CHEERS break-even math | `/blog/carnival-cheers-drink-package-worth-it` | Calculator click-through |

## Approval Gate

Before any launch:

- User approves budget.
- User approves platform and account.
- User approves creative.
- User approves landing URLs.
- User approves UTM naming.
- Billing and account setup are performed only with explicit approval.
