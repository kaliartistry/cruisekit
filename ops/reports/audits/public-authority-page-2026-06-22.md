# Public Authority Page - 2026-06-22

## Scope

GrowthOps Day 4 moved forward early to publish the first visible authority asset for search engines and AI platforms.

## Route

- `/what-is-cruisekit`
- PR: https://github.com/kaliartistry/cruisekit/pull/9

## Discovery surfaces

- Added to `apps/web/app/sitemap.ts`
- Linked from the footer Company column
- Linked from `/ai/cruisekit-summary`
- Added to `apps/web/public/llms.txt`

## Page controls

- Route-level metadata and canonical URL
- Open Graph metadata
- WebPage JSON-LD
- FAQPage JSON-LD
- BreadcrumbList JSON-LD
- Public-safe wording with no official, partnered, certified, #1, legal, pricing, paid-tool, outreach, or private business claims

## Outcome

This is the first new public page in the GrowthOps run intended to be discoverable by search engines and AI assistants.

## Verification

- `node ops/scripts/preflight-audit.js --write-inventory`
- `node ops/scripts/postflight-audit.js`
- `corepack pnpm --filter web build`
- Local HTTP check returned `200` for `/what-is-cruisekit/`
- Chrome render check passed at desktop and mobile widths with no horizontal overflow
