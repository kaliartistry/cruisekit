# CruiseKit Data Freshness Report

Generated: 2026-07-01T23:27:57.656Z

Current date: 2026-07-01

Production freshness threshold: 7 days.

## Summary

| Metric | Count |
| --- | ---: |
| Public sailings | 388 |
| Stale public sailings | 0 |
| Weekly watchlist sources | 9 |
| Blockers | 0 |
| Warnings | 0 |
| Info | 7 |

## Public Bundle By Cruise Line

| Cruise line | Public sailings | Stale | Oldest check | Latest check |
| --- | ---: | ---: | --- | --- |
| carnival | 117 | 0 | 2026-07-01 | 2026-07-01 |
| holland-america | 20 | 0 | 2026-07-01 | 2026-07-01 |
| norwegian | 217 | 0 | 2026-07-01 | 2026-07-01 |
| virgin-voyages | 34 | 0 | 2026-07-01 | 2026-07-01 |

## Weekly Source Watchlist

| Cruise line | Cadence | Importer | Last import | Last review | Public sailings |
| --- | --- | --- | --- | --- | ---: |
| royal-caribbean | weekly | yes | 2026-07-01T14:32:32.121Z | missing | 0 |
| carnival | weekly | yes | 2026-07-01T22:32:22.485Z | 2026-07-01T22:32:27.063Z | 117 |
| norwegian | weekly | yes | 2026-07-01T23:20:36.930Z | 2026-07-01T23:21:16.003Z | 217 |
| celebrity | weekly | no | missing | missing | 0 |
| princess | weekly | yes | 2026-07-01T23:21:16.023Z | 2026-07-01T23:21:57.177Z | 0 |
| holland-america | weekly | yes | 2026-07-01T23:21:57.358Z | 2026-07-01T23:22:32.059Z | 20 |
| msc | weekly | yes | 2026-07-01T23:21:57.368Z | missing | 0 |
| disney | weekly | no | missing | missing | 0 |
| virgin-voyages | weekly | yes | 2026-07-01T22:31:35.142Z | 2026-07-01T22:31:42.751Z | 34 |

## Blockers

- None

## Warnings

- None

## Info

- info: royal-caribbean-coverage - Weekly source has no public sailings in the production bundle.
- info: celebrity-importer - Weekly source is on the watchlist but has no automated importer yet.
- info: celebrity-coverage - Weekly source has no public sailings in the production bundle.
- info: princess-coverage - Weekly source has no public sailings in the production bundle.
- info: msc-coverage - Weekly source has no public sailings in the production bundle.
- info: disney-importer - Weekly source is on the watchlist but has no automated importer yet.
- info: disney-coverage - Weekly source has no public sailings in the production bundle.

## Required Action

If blockers are present, do not broaden in-app review prompts yet. Review the
latest staging import and staging review reports, approve exact source-backed
seed changes, rebuild bundles, and rerun this report before publishing.
