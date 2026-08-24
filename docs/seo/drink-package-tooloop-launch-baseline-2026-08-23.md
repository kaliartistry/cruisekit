# Cruise Drink Package Calculator ToolLoop Launch Baseline

## Scope

- Canonical page: `https://cruisekit.app/cruise-drink-package-calculator/`
- Baseline source: authenticated Google Search Console URL-prefix property
- Search Console data available through: 2026-08-21
- Baseline captured by the predecessor task before implementation; these are
  preserved historical values, not a fresh pull by this release branch.

## Canonical page baseline

| Window | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| 2026-07-25 through 2026-08-21 (28 days) | 28 | 763 | 3.7% | 7.1 |
| Three months ending 2026-08-21 | 35 | 1,011 | 3.5% | 10.0 |

## Pre-registered query set

The following queries were visible for the canonical page in the 28-day
baseline and are fixed before launch for the six-week comparison.

| Query | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| celebrity cruise drink package calculator | 2 | 2 | 100% | 11.5 |
| cruise drink calculator | 1 | 11 | 9.1% | 18.6 |
| carnival cheers calculator | 1 | 10 | 10% | 6.4 |
| drink package calculator | 1 | 6 | 16.7% | 11.8 |
| royal caribbean drink calculator | 1 | 6 | 16.7% | 13.0 |
| carnival drink package calculator | 0 | 12 | 0% | 6.7 |
| cruise drink package calculator | 0 | 12 | 0% | 14.8 |

## Six-week measurement plan

Six weeks after the verified production deployment date:

1. Re-run the same canonical-page and query filters in Search Console.
2. Compare clicks, impressions, CTR, and average position against the saved
   windows above; do not mix URL variants or broader `/calculator/` pages.
3. Compare consented calculator completion using only the bounded analytics
   dimensions: cruise line, party-size range, sailing-length range, result
   bucket, and completion. Exact prices, spend, savings, itinerary details,
   and personal identifiers are prohibited from calculator analytics.
4. Record crawl/indexing anomalies separately from product-performance changes.

## Canonical and duplicate-route audit

Repository routes and history were reviewed before implementation. The only
dedicated drink-package calculator route is
`/cruise-drink-package-calculator/`. `/calculator/` and its cruise-line child
routes are full-cruise-cost calculators, not older duplicates. The drink
package guide is editorial content, and the MSC price tracker is unrelated.
No verified duplicate drink-package route exists, so no redirect is added.
GitHub Pages cannot truthfully turn an unverified phantom route into a 301;
future redirects require a confirmed legacy URL and host-level 301 support.

## Accuracy maintenance

The package record is maintained in
`apps/web/lib/data/drink-package-data.json`. CruiseKit's web data owner reviews
the cited official pages at least every 30 days and before known price or policy
changes. Dynamic sailing prices remain user-entered even when the surrounding
policy was recently verified.
