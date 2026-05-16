# CruiseKit Ingestion Staging

Provider importers write here before any data reaches canonical seed records or
public bundles.

## Directory contract

```text
data/ingest/
  raw/<provider>/<run-id>/...
  staging/<provider>/<run-id>/sailings.json
  staging/<provider>/<run-id>/deals.json
  reports/<provider>/<run-id>.json
```

## Promotion rules

- Importers may write raw and staging files.
- Importers must not edit `data/seed/*.json` directly.
- Promotion from staging to seed requires schema validation, data quality
  checks, source metadata, and a human-readable diff report.
- Prices, promos, taxes/fees, and sold-out status stay review-gated until the
  provider has multiple clean report-only runs.

## Source priority

1. Affiliate feeds or direct partner APIs.
2. Official cruise-line structured endpoints.
3. Browser automation only when no structured source exists.
4. Manual editorial verification.

Archived scripts under `archive/scripts/` are reference material only. New
production importers should live under `scripts/ingest/`.
