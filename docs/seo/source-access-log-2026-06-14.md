# SEO Source Access Log

Date: 2026-06-14

## Authenticated Sources

| Source | Attempt | Result | Follow-up Needed |
| --- | --- | --- | --- |
| Google Search Console API | Used local `gcloud` OAuth account and called `https://www.googleapis.com/webmasters/v3/sites`. | Blocked: `PERMISSION_DENIED`, insufficient authentication scopes. | Re-auth with Search Console read-only scope or provide CSV exports for 3, 6, and 12 months. |
| Local Search Console exports | Searched repo for Search Console, GSC, query, analytics, keyword, app-store, and play-console export files. | No usable exports found. | Add exports under `docs/seo/source-data/` or another agreed location. |
| Google Keyword Planner | Checked local repo for exports and credentials. | No export/API access found. | Export keyword ideas from Google Ads Keyword Planner using the seed list in the discovery report. |
| Google Trends | Tried public Trends API endpoint for requested comparisons. | Blocked by HTTP 429. | Retry manually in browser or provide Trends screenshots/CSV. |
| Existing analytics | Checked environment keys and repo exports. | No GA4 credential/export found; web `.env.local` only exposes Viator key names. | Provide GA4 export or service account/client access. |
| App Store Connect / Play Console | Checked local repo for exports. | No acquisition exports found. | Provide App Store Connect and Play Console acquisition CSVs if available. |

## Public Sources Used

- Google autocomplete public suggestion endpoint for exact keyword phrasing.
- Public web SERP snippets for priority keywords.
- Public Reddit search/web snippets and subreddit rule pages.
- Public Facebook search snippets only; no private or logged-in group content.
- Existing CruiseKit repo pages and live site inventory.

## Compliance Boundaries Observed

- No private group scraping.
- No auto-posting.
- No DMs.
- No personal data collection.
- No affiliate-link posting.
- Reddit/Facebook patterns are used only for keyword and question mining.

