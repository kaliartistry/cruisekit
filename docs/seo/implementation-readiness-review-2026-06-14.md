# Implementation Readiness Review - 2026-06-14

## Decision

Keyword mapping is ready for human review. SEO implementation is not yet approved. No title, metadata, H1, sitemap, content, tracking, or app-code changes were made in this pass.

## Approval Checklist

Approve or revise these before implementation starts:

- One primary URL per keyword cluster in `keyword-map-2026-06-14-v2-authenticated.csv`.
- Whether `/calculator` or the homepage should own `cruise calculator` and `cruise cost calculator` language. V2 recommends `/calculator` as the primary URL.
- Whether drink-package calculator intent should stay on `/guides/drink-package-guide` for now. V2 recommends improving the existing guide first.
- Whether gratuity calculator intent should stay on `/guides/cruise-tipping-guide` for now. V2 recommends improving the existing guide first.
- Whether line-specific WiFi and gratuity terms should be handled on line calculator pages. V2 recommends yes.
- Whether any new page candidate should be promoted now. V2 recommends no immediate new pages.

## Implementation Readiness By Action

| Action | Status | Notes |
| --- | --- | --- |
| A. Rewrite title/meta only | Ready after approval | Top candidates are listed in the discovery doc and map. |
| B. Add FAQ/H2 section | Ready after approval | Use exact query language from GSC/KP/community hooks. |
| C. Add internal links | Ready after approval | Link from impression pages to mapped target URL only. |
| D. Improve calculator CTA | Ready after approval | Prioritize calculator, drink-package guide, tipping guide, port-day guide, and line pages. |
| E. Create shareable calculator result | Ready for product scoping | This is likely a high-conversion improvement, but it is product work, not metadata-only SEO. |
| F. Create new landing page | Not recommended yet | Candidate list exists, but existing pages should be improved first. |
| G. Use only for social/video | Ready after review | Use public question hooks without posting automation or private data collection. |
| H. Ignore because intent is too broad or low-value | Ready | Wrong-intent GSC queries include cruise ship construction cost, trackers, and some loyalty terms. |

## Main Risks

- Search Console data is young: all 3-, 6-, and 12-month exports only show 2026-05-26 through 2026-06-12.
- GA4 CruiseKit property access is missing, so web conversion baselines are incomplete.
- App Store analytics are unavailable, so iOS acquisition cannot be tied to SEO yet.
- Keyword Planner can overrepresent informational add-on terms that may not convert unless the calculator CTA is strong.
- Creating too many new pages now would risk cannibalization and thin pages.

## Recommended Approval Outcome

Approve a narrow first implementation batch:

1. `/guides/drink-package-guide`: exact break-even FAQ/H2, CTA, internal links.
2. `/calculator`: title/meta/H1 review for cost calculator ownership and all-in add-on language.
3. `/calculator/royal-caribbean`: Royal drink package, WiFi, gratuity, and cost FAQ/H2 additions.
4. `/guides/cruise-tipping-guide`: gratuity calculator language and line calculator links.
5. `/guides/port-day-tips`: cash-to-bring and excursion budget sections.
6. `/blog/hidden-cruise-costs`: taxes, port fees, and not-included-cost FAQ language.
7. Tracking normalization and share-result scoping after content approvals.

Do not approve new pages until the first batch has been shipped and at least one follow-up Search Console read shows whether existing mapped pages can move.
