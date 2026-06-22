# Technical SEO Baseline - 2026-06-22

## Scope

Day 2 GrowthOps audit of public route coverage, sitemap/robots alignment, metadata coverage, and structured data coverage. This report is intentionally public-safe and does not include private strategy, secrets, sensitive financial notes, legal notes, user data, or paid-tool decisions.

## Checks run

- `node ops/scripts/preflight-audit.js --write-inventory`
- Reviewed `apps/web/app/sitemap.ts`
- Reviewed `apps/web/app/robots.ts`
- Reviewed generated route, content page, and schema inventories

## Current baseline

- App Router routes inventoried: 34
- Content pages inventoried: 32
- Routes with structured data detected: 6
- Duplicate route scan: no duplicate routes reported by preflight
- Robots policy allows public routes and disallows `/api/`, `/my-trips/`, and `/internal/`
- Sitemap includes static marketing, calculator, feature, guide, blog, and port pages plus dynamic calculator, guide, blog, and port routes

## Findings

1. `/groups` is a public route with route metadata and is not disallowed by robots, but it was missing from `sitemap.ts`.
2. `/my-trips` has no route-level metadata, but it is an account-oriented saved trips page and is intentionally disallowed by robots. No public SEO action is recommended without a product decision.
3. `/track` redirects to `/myday`, so it should not be treated as a standalone indexable route unless a future canonical landing page is intentionally created.
4. `/blog` and `/guides` do not export page-level metadata in their page files, but their route groups have layout metadata. The current inventory scanner reports page-file metadata only, so those rows should be read as scanner limitations rather than immediate defects.
5. Structured data is concentrated on the homepage, calculator, dynamic calculator, dynamic guide, ports, and dynamic port templates. This is a reasonable baseline; schema expansion should happen only on pages where it improves accuracy for humans and machines.

## Safe fix applied

- Added `/groups` to the static sitemap list because it is an existing public page with metadata and no robots exclusion.

## Follow-up candidates

- Add a scanner enhancement that recognizes metadata exported from nested `layout.tsx` files.
- Add an explicit redirect inventory for routes such as `/track`.
- Consider structured data for future authority pages after each page is approved and drafted.
