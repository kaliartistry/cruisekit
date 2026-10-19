# Initial GrowthOps Inventory - 2026-06-29

Public-safe bootstrap inventory for CruiseKit GrowthOps.

## Repo

- Path: C:\Users\ilak_\Projects\cruisekit
- Remote: origin	https://github.com/kaliartistry/cruisekit.git (fetch)
origin	https://github.com/kaliartistry/cruisekit.git (push)
- Branch: codex/growthops-2026-06-29
- Status: ## codex/growthops-2026-06-29
 M apps/web/lib/data/blog-posts.ts
 M ops/inventory/content_pages.json
 M ops/inventory/routes.json
 M ops/inventory/schema.json
?? ops/reports/audits/initial-inventory-2026-06-29.md
?? ops/reports/audits/postflight-2026-06-29.json
?? ops/reports/audits/preflight-2026-06-29.json
?? ops/reports/daily/2026-06-29.md

## Current Routes And Pages

- `/` (apps/web/app/page.tsx) metadata: yes, schema: no
- `/about` (apps/web/app/about/page.tsx) metadata: yes, schema: no
- `/affiliate-disclosure` (apps/web/app/affiliate-disclosure/page.tsx) metadata: yes, schema: no
- `/ai/cruisekit-summary` (apps/web/app/ai/cruisekit-summary/page.tsx) metadata: yes, schema: no
- `/app` (apps/web/app/app/page.tsx) metadata: yes, schema: no
- `/blog` (apps/web/app/blog/page.tsx) metadata: no, schema: no
- `/blog/:slug` (apps/web/app/blog/[slug]/page.tsx) metadata: yes, schema: yes
- `/calculator` (apps/web/app/calculator/page.tsx) metadata: yes, schema: yes
- `/calculator/:cruise-line` (apps/web/app/calculator/[cruise-line]/page.tsx) metadata: yes, schema: yes
- `/compare` (apps/web/app/compare/page.tsx) metadata: yes, schema: no
- `/contact` (apps/web/app/contact/page.tsx) metadata: yes, schema: no
- `/cruise-costs` (apps/web/app/cruise-costs/page.tsx) metadata: yes, schema: no
- `/cruise-drink-package-calculator` (apps/web/app/cruise-drink-package-calculator/page.tsx) metadata: yes, schema: yes
- `/cruise-group-check-in-app` (apps/web/app/cruise-group-check-in-app/page.tsx) metadata: yes, schema: yes
- `/cruisekit-facts` (apps/web/app/cruisekit-facts/page.tsx) metadata: yes, schema: yes
- `/cruisekit-public-information` (apps/web/app/cruisekit-public-information/page.tsx) metadata: yes, schema: yes
- `/cruises` (apps/web/app/cruises/page.tsx) metadata: yes, schema: no
- `/faq` (apps/web/app/faq/page.tsx) metadata: yes, schema: yes
- `/features/cruise-itinerary-planner` (apps/web/app/features/cruise-itinerary-planner/page.tsx) metadata: yes, schema: no
- `/features/cruise-port-guides` (apps/web/app/features/cruise-port-guides/page.tsx) metadata: yes, schema: no
- `/features/cruise-route-map` (apps/web/app/features/cruise-route-map/page.tsx) metadata: yes, schema: no
- `/features/explore-map` (apps/web/app/features/explore-map/page.tsx) metadata: yes, schema: no
- `/groups` (apps/web/app/groups/page.tsx) metadata: yes, schema: no
- `/guides` (apps/web/app/guides/page.tsx) metadata: yes, schema: yes
- `/guides/:guide-slug` (apps/web/app/guides/[guide-slug]/page.tsx) metadata: yes, schema: yes
- `/help` (apps/web/app/help/page.tsx) metadata: yes, schema: no
- `/how-we-make-money` (apps/web/app/how-we-make-money/page.tsx) metadata: yes, schema: no
- `/internal/deal-workbench` (apps/web/app/internal/deal-workbench/page.tsx) metadata: yes, schema: no
- `/internal/leads` (apps/web/app/internal/leads/page.tsx) metadata: yes, schema: no
- `/loyalty` (apps/web/app/loyalty/page.tsx) metadata: yes, schema: no
- `/methodology` (apps/web/app/methodology/page.tsx) metadata: yes, schema: no
- `/my-trips` (apps/web/app/my-trips/page.tsx) metadata: no, schema: no
- `/myday` (apps/web/app/myday/page.tsx) metadata: yes, schema: no
- `/ports` (apps/web/app/ports/page.tsx) metadata: yes, schema: yes
- `/ports/:port-slug` (apps/web/app/ports/[port-slug]/page.tsx) metadata: yes, schema: yes
- `/privacy` (apps/web/app/privacy/page.tsx) metadata: yes, schema: no
- `/ship-time-vs-port-time` (apps/web/app/ship-time-vs-port-time/page.tsx) metadata: yes, schema: yes
- `/terms` (apps/web/app/terms/page.tsx) metadata: yes, schema: no
- `/track` (apps/web/app/track/page.tsx) metadata: no, schema: no
- `/what-is-cruisekit` (apps/web/app/what-is-cruisekit/page.tsx) metadata: yes, schema: yes

## Existing Blog/Content System

- Blog source: `apps/web/lib/data/blog-posts.ts`; detected 27 blog routes.
- Guide source: `apps/web/lib/data/guides.ts`; detected 6 guide routes.

## SEO Metadata

- Routes with metadata/generateMetadata: 37/40.
- Global metadata is in `apps/web/app/layout.tsx`.

## Structured Data

- Routes/components with detected JSON-LD: 14.

## Sitemap And Robots

- Sitemap file exists: yes.
- Robots file exists: yes.

## Comparisons, Calculators, Press, Legal

- Comparison route exists: yes, /compare.
- Calculator routes exist: /calculator, /calculator/:cruise-line.
- Press/media route exists: no.
- Legal/trust routes: /affiliate-disclosure, /how-we-make-money, /methodology, /privacy, /terms.

## App Store Links, Analytics, Deploy

- App store URL config exists: yes.
- Analytics helper exists: yes.
- GitHub Pages deploy workflow exists: yes.

## Duplicate/Stale Page Risk

- No duplicate App Router page routes detected.

## Existing Images/Screenshots

- App screenshots exist under `apps/web/public/assets/app-screenshots`.
- Cruise line, port, and ship images exist under `apps/web/public/images` and `apps/web/public/assets`.

## Public-Safe Notes

- Repo appears public from the handoff document; private strategy and sensitive ops notes should not be committed here until Kali approves the visibility model.
- Firestore rules tests require Java locally; Java was not available during bootstrap.
