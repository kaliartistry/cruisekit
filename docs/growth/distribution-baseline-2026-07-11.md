# CruiseKit Distribution Baseline — 2026-07-11

Status: instrumentation implemented; production seven-day observation window begins after deployment.

## Primary metric

`save_cruise_completed / calculator_completed`

This is the decision metric for the first 30 days. App handoff and MyCrew metrics are downstream diagnostics, not substitutes.

## Required seven-day export

Export event counts by date and source/medium/campaign for:

- `calculator_started`
- `calculator_completed`
- `result_shared`
- `save_cruise_started`
- `save_cruise_completed`
- `saved_cruise_handoff_opened`
- `app_handoff_clicked`
- `app_handoff_imported`
- `mycrew_invite_created`
- `mycrew_invite_opened`
- `mycrew_invite_accepted`
- `referred_cruise_created`

## Privacy rule

Do not export or attach fares, estimated totals, cabin numbers, traveler names, invite codes, user IDs, or group IDs. Reporting is aggregate-only.

## Baseline limitation

Historical production data cannot contain the newly introduced events. The first trustworthy baseline is the first complete seven-day period after the website, Firebase rules/functions, association file, and compatible mobile build are deployed.
