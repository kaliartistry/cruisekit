# Search Console Post-Batch-1 Plan - 2026-06-14

## Status

Completed after deployment.

- Deployment commit: `9a5e98a`
- GitHub Pages workflow run: `27516588884`
- Deployment result: success
- Search Console property used: URL-prefix property `https://cruisekit.app/`
- Sitemap submitted: yes, `/sitemap.xml`
- Sitemap status: success
- Discovered pages reported by Search Console after submission: 131

## URL Inspection Results

| URL | Search Console status | Indexing request |
| --- | --- | --- |
| `https://cruisekit.app/calculator/` | URL is on Google | Requested |
| `https://cruisekit.app/calculator/royal-caribbean/` | URL is on Google | Requested |
| `https://cruisekit.app/calculator/carnival/` | URL is not on Google | Requested |
| `https://cruisekit.app/calculator/norwegian/` | URL is on Google | Requested |
| `https://cruisekit.app/calculator/msc/` | URL is not on Google | Requested |
| `https://cruisekit.app/calculator/disney/` | URL is not on Google | Requested |
| `https://cruisekit.app/cruise-costs/` | URL is on Google | Requested |
| `https://cruisekit.app/blog/hidden-cruise-costs/` | URL is not on Google | Requested |

## Inspection Checklist

For each URL:

- Confirm URL is indexed or available to Google: completed.
- Confirm canonical URL is the intended CruiseKit URL: live metadata/sitemap checked before Search Console pass.
- Confirm page fetch succeeds: completed from live `cruisekit.app` pages.
- Request indexing once where appropriate: completed.
- Save screenshot/notes under `docs/growth/search-console-evidence/`: completed.

## Sitemap Checklist

- Inspected `https://cruisekit.app/sitemap.xml`: HTTP 200, `application/xml`.
- Submitted `sitemap.xml` in Search Console because no sitemap was listed for the property.
- Search Console returned `Sitemap submitted successfully`.
- Search Console table reported `/sitemap.xml`, status `Success`, 131 discovered pages.
- Confirmed only approved line calculator URLs are included.

## Access Note

Chrome access was available for `kalimccarthy@gmail.com` on the URL-prefix property. The Search Console API remained blocked by insufficient OAuth scopes, so browser automation was used.

## Evidence Files

- `docs/growth/search-console-evidence/gsc-calculator-indexing-requested-2026-06-14.png`
- `docs/growth/search-console-evidence/gsc-calculator-royal-caribbean-2026-06-14.png`
- `docs/growth/search-console-evidence/gsc-calculator-carnival-2026-06-14.png`
- `docs/growth/search-console-evidence/gsc-calculator-norwegian-2026-06-14.png`
- `docs/growth/search-console-evidence/gsc-calculator-msc-2026-06-14.png`
- `docs/growth/search-console-evidence/gsc-calculator-disney-2026-06-14.png`
- `docs/growth/search-console-evidence/gsc-cruise-costs-2026-06-14.png`
- `docs/growth/search-console-evidence/gsc-blog-hidden-cruise-costs-2026-06-14.png`
- `docs/growth/search-console-evidence/gsc-sitemaps-2026-06-14.png`
- `docs/growth/search-console-evidence/gsc-sitemap-submitted-2026-06-14.png`
- `docs/growth/search-console-evidence/gsc-sitemap-submit-retry-2026-06-14.png`
- `docs/growth/search-console-evidence/gsc-sitemap-coordinate-submit-2026-06-14.png`
