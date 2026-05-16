# Royal Caribbean Staging Import Report

Generated: 2026-05-16T20:07:05.695Z

Mode: staging-only

Source: https://www.royalcaribbean.com/cruises?destinationIds=CARIB

## Counts

| Metric | Count |
| --- | ---: |
| Raw responses | 0 |
| Staged sailings | 0 |
| Schema errors | 0 |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | n/a |
| Max observed starting price | n/a |

## Blockers

- Royal Caribbean returned its automated-access block page for the search URL.

## Notes

- This importer never edits `data/seed/*.json`.
- Promote only reviewed records after source links and current prices are verified.
- If Royal Caribbean blocks automated access, use this report as the source-status record and retry from an allowed environment.
