# Source Access Log V2 - 2026-06-14

## Authenticated Sources

| Source | Status | Result | Files / evidence | Blocker or caveat |
| --- | --- | --- | --- | --- |
| Google Search Console domain property `sc-domain:cruisekit.app` | Blocked | Chrome returned "Oops, you don't have access to this property". | None | Used URL-prefix property instead. |
| Google Search Console URL-prefix property `https://cruisekit.app/` | Accessible | Exported 3-month, 6-month, and 12-month performance data plus page-filtered priority URLs. | `docs/seo/source-data/search-console/` | Effective data window was only 2026-05-26 to 2026-06-12 in all exports. |
| Google Keyword Planner | Accessible | Exported three seed batches with monthly search volume, competition, bid ranges, and monthly history. | `docs/seo/source-data/keyword-planner/` and `keyword-planner-export-notes-2026-06-14.md` | Keyword Planner accepted 10 seeds per run; some seeds returned no reported volume. |
| Google Trends | Accessible | Captured three comparison groups for cost/budget/hidden, drink package, and NCL/gratuities/WiFi terms. | `docs/seo/source-evidence/google-trends/` | Some low-volume exact terms had insufficient related-query data. |
| GA4 | Authenticated but CruiseKit unavailable | Visible properties did not include CruiseKit; active property was EventSync, so no CruiseKit data used. | `analytics-baseline-2026-06-14.md` | Need correct GA4 property access or manual export. |
| App Store Connect | Authenticated but analytics unavailable | CruiseKit app visible, but App Analytics unavailable for current access/app status. | `analytics-baseline-2026-06-14.md` | Requires admin/analytics access or app eligibility. |
| Google Play Console | Accessible | CruiseKit Android acquisition baseline captured. | `analytics-baseline-2026-06-14.md` | Search terms had no data for the selected configuration. |

## Public Sources

| Source | Status | Use | Caveat |
| --- | --- | --- | --- |
| Google autocomplete / related searches / SERP review | Used from V1 plus V2 validation | Seeded query phrasing, competitor page types, and new-page candidates. | Public SERP should be refreshed before final implementation if more than 7 days pass. |
| Reddit public discussions | Used from V1 public web/search review only | Question mining and FAQ/hook language. | No posting, DMs, automation, private scraping, or personal data collection. |
| Facebook public patterns | Limited to public-visible snippets from V1 | Question mining only. | No private group access or scraping. |
| Existing CruiseKit pages | Reviewed | Mapped keywords to existing calculator, guide, blog, and line-cost URLs before recommending new pages. | No SEO implementation edits were made. |

## Raw Export Inventory

- `docs/seo/source-data/search-console/gsc-performance-3-months-2026-06-14.zip`
- `docs/seo/source-data/search-console/gsc-performance-6-months-2026-06-14.zip`
- `docs/seo/source-data/search-console/gsc-performance-12-months-2026-06-14.zip`
- `docs/seo/source-data/search-console/page-filters/`
- `docs/seo/source-data/keyword-planner/keyword-planner-batch-1-2026-06-14.csv`
- `docs/seo/source-data/keyword-planner/keyword-planner-batch-2-2026-06-14.csv`
- `docs/seo/source-data/keyword-planner/keyword-planner-batch-3-2026-06-14.csv`
- `docs/seo/source-evidence/google-trends/`
