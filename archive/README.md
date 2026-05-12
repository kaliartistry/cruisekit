# `/archive/` — historical, non-shipped artifacts

Files here are **not part of the build** and **are not imported** by any shipped code. They are retained on disk for historical reference and as a head-start for future legitimate re-imports.

## What's in here

- `scraped-sailings-2026-04/scraped/` — per-cruise-line JSON files captured between March 28–29, 2026 from cruise-line public booking APIs (and one set of intercepted GraphQL responses). Pricing in these files is stale and itinerary structures may have changed. Do not reuse pricing or deep links without re-verifying against the cruise line's current public page.
- `scripts/` — the scraping scripts that produced the JSON files above. They are kept as evidence of provenance but should not be re-run; the project moved away from scraping in favor of canonical hand-curated seeds and (eventually) affiliate-network feeds.

## Why archived rather than deleted

1. **Provenance.** If a partner asks "where did this data come from", we can show the input that originally seeded our knowledge of cruise-line itinerary structure.
2. **Promotion path.** A future migration could read these files to bootstrap new canonical `Sailing` records — but each one would need a human to re-verify against the cruise line's current page before it could be promoted out of `confidence: "internal_do_not_publish"`. There is no automated path from this archive to production data.
3. **Self-discipline.** Keeping the scrapers visible (rather than silently deleted) is a reminder that the project deliberately chose not to depend on them.

## What is NOT in here

The shipping codebase intentionally has zero references to anything in this directory. The Next.js build does not touch it. If you find an `import` from `archive/...` anywhere in `apps/web/`, `packages/`, `data/`, `shared/`, or `scripts/`, that's a regression.
