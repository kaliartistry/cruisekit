# Public Facts Page - 2026-06-22

## Scope

GrowthOps Day 5 moved forward early to publish a second non-approval public authority asset.

## Route

- `/cruisekit-facts`
- PR: https://github.com/kaliartistry/cruisekit/pull/10

## Discovery surfaces

- Added to `apps/web/app/sitemap.ts`
- Linked from the footer Company column
- Linked from `/what-is-cruisekit`
- Linked from `/ai/cruisekit-summary`
- Added to `apps/web/public/llms.txt`

## Page controls

- Route-level metadata and canonical URL
- Open Graph metadata
- AboutPage JSON-LD
- FAQPage JSON-LD
- BreadcrumbList JSON-LD
- Public-safe wording with no official, partnered, certified, #1, legal, private business, sensitive financial, user-data, roadmap, paid-tool, or outreach claims

## Search Console follow-up

After this page is deployed, request indexing in Google Search Console for:

- `https://cruisekit.app/what-is-cruisekit`
- `https://cruisekit.app/cruisekit-facts`
- `https://cruisekit.app/sitemap.xml`

Indexing cannot be guaranteed by the site code alone. The site now exposes the pages through sitemap, footer navigation, public internal links, and `llms.txt`; Search Console can request recrawl/indexing after the production deploy is live.

## Verification

- `node ops/scripts/preflight-audit.js --write-inventory`
- `node ops/scripts/postflight-audit.js`
- `corepack pnpm --filter web build`
- Local HTTP check returned `200` for `/cruisekit-facts/`
- Chrome render check passed at desktop and mobile widths with no horizontal overflow
