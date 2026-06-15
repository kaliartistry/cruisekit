# CruiseKit SEO Implementation Batch 1 Report

Date: 2026-06-14

## Gate Status

This implementation batch started after the keyword discovery and keyword map gate was completed and reviewed. Source artifacts used for this batch:

- `docs/seo/keyword-discovery-2026-06-14-v2-authenticated.md`
- `docs/seo/keyword-map-2026-06-14-v2-authenticated.csv`
- `docs/seo/search-console-opportunities-2026-06-14.csv`
- `docs/seo/implementation-readiness-review-2026-06-14.md`

No new landing pages were created in this batch.

## Implemented Pages

### `/calculator`

- Rewrote metadata for "cruise cost calculator" and "cruise budget calculator" intent.
- Added page-specific Open Graph metadata.
- Updated the hero support copy to the approved "real cruise cost before you book" positioning.
- Added crawlable FAQ/H2 content for real total, taxes, port fees, gratuities, spending money, drinks, WiFi, excursions, and port spending.
- Added internal links to drink package, gratuity, port spending, hidden costs, and cruise costs hub pages.

### `/calculator/royal-caribbean`

- Rewrote Royal Caribbean metadata for "Royal Caribbean cruise cost calculator" intent.
- Added page-specific Open Graph metadata.
- Added Royal Caribbean FAQs for WiFi cost, gratuities, drink package worth-it math, real total after add-ons, and budgeting.
- Added mapped internal links to calculator, drink package guide, tipping guide, Royal Caribbean cost guide, and hidden costs article.
- Preserved the existing no-scraping/legal positioning around Royal Caribbean prices.

### `/guides/drink-package-guide`

- Retitled the guide to target "cruise drink package calculator" and "is it worth it" intent.
- Added exact FAQ/H2 language around drink package break-even math, daily drink counts, gratuity inclusion, and calculator use.
- Added calculator CTA and line-specific internal links for Royal Caribbean, Carnival, Norwegian, and MSC.

### `/guides/cruise-tipping-guide`

- Retitled the guide to target "cruise gratuity calculator" and tipping intent.
- Added FAQ/H2 language around per-day gratuities, whether gratuities are mandatory, prepaying vs onboard payment, and real-cost impact.
- Added calculator CTA and line-specific internal links for Royal Caribbean, Carnival, Norwegian, Disney, and MSC.

### `/guides/port-day-tips`

- Retitled the guide to target "how much cash to bring on a cruise" intent.
- Added a new cash, port spending, and excursion budget section.
- Added FAQ language around cash needs, onboard vs port cash, excursion budgets, port-day expenses, and 7-day cruise spending money.
- Added calculator CTA and supporting internal links to ports, tipping, and hidden costs.

### `/blog/hidden-cruise-costs`

- Retitled the post to target "hidden cruise costs" and "fees to budget before booking."
- Updated the excerpt and tags for hidden costs / cruise fees intent.
- Added query-matched H2 sections for costs not included in cruise fares, taxes/fees/gratuities/drinks/WiFi/excursions inclusion, and real-total impact.
- Added above-fold calculator CTA and supporting internal links to cruise costs hub, drink package guide, tipping guide, and port cash guide.
- Removed the weak global blog metadata suffix pattern: `(Blog)`.

## Sitemap

Added existing line calculator URLs with mapped demand:

- `/calculator/royal-caribbean`
- `/calculator/carnival`
- `/calculator/norwegian`
- `/calculator/msc`
- `/calculator/disney`
- `/calculator/celebrity`
- `/calculator/princess`
- `/calculator/holland-america`

Did not add `/calculator/virgin-voyages` in this batch because it was not in the approved mapped sitemap set.

## Tracking

Added or normalized these events:

- `app_store_click`
- `google_play_click`
- `result_shared`
- `blog_cta_click`
- `outbound_affiliate_click`
- `port_page_affiliate_click`
- `save_trip_clicked`
- `utm_landing_visit`

Existing events preserved:

- `calculator_started`
- `calculator_completed`

Implementation notes:

- `result_shared` fires for native share and clipboard share from calculator results.
- `blog_cta_click` fires on tracked blog conversion CTAs.
- `port_page_affiliate_click` fires only for actual port-page affiliate sources.
- `utm_landing_visit` fires only when UTM parameters are present and is deduped per session/path/query.
- Store badge clicks now split iOS and Android into the requested event names.

## Validation

Passed:

- `git diff --check`
- `pnpm --filter web lint`
- `pnpm --filter web exec tsc --noEmit`
- `pnpm --filter web build`

Sitemap verification after build:

- Confirmed the eight approved line calculator URLs are present in `apps/web/.next/server/app/sitemap.xml.body`.
- Confirmed `/calculator/virgin-voyages` is not present in the generated sitemap.

Build warning:

- `pnpm` reported an existing engine warning for the `functions` package: it wants Node 22 and this shell is using Node 25.9.0.

Tests:

- `apps/web/package.json` has no dedicated test script. The root `test:rules` script is for Firestore rules and was not run because this batch only touched the web app.

## Deferred Or Out Of Scope

- No new landing pages.
- No homepage rewrite in this batch.
- No app store or Google Play listing updates.
- No community posting, automation, scraping, or private-group data use.
- No dashboard build because GA4/Search Console property wiring was not part of this approved code batch.
- No changes to unrelated dirty files or `$CODEX_HOME/`.
