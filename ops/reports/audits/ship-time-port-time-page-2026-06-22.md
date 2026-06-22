# Ship Time vs Port Time Page - 2026-06-22

## Scope

GrowthOps Day 6 moved forward early to publish another non-approval public authority asset.

## Route

- `/ship-time-vs-port-time`
- PR: https://github.com/kaliartistry/cruisekit/pull/11

## Discovery surfaces

- Added to `apps/web/app/sitemap.ts`
- Linked from the footer Resources column
- Added to `apps/web/public/llms.txt`

## Page controls

- Route-level metadata and canonical URL
- Open Graph metadata
- Article JSON-LD
- FAQPage JSON-LD
- BreadcrumbList JSON-LD
- Public-safe wording with explicit caveats that official cruise line, onboard, gangway, and crew instructions are the source of truth

## Search Console follow-up

After this page is deployed, request indexing in Google Search Console for:

- `https://cruisekit.app/ship-time-vs-port-time`
- `https://cruisekit.app/sitemap.xml`

## Verification

- `node ops/scripts/preflight-audit.js --write-inventory`
- `node ops/scripts/postflight-audit.js`
- `corepack pnpm --filter web lint`
- `corepack pnpm --filter web build`
- Local HTTP check returned `200` for `/ship-time-vs-port-time/`
- Chrome render check passed at desktop and mobile widths with no horizontal overflow
