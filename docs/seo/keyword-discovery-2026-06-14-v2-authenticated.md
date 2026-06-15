# CruiseKit Keyword Discovery V2 - Authenticated Validation

Date: 2026-06-14

Status: keyword mapping gate complete for review. No SEO implementation changes were made.

## Executive Summary

The authenticated pass validates the overall V1 direction but changes the order of work. CruiseKit's strategic hook remains the real total cruise cost calculator, but the strongest validated search demand is in line-specific add-on questions: WiFi cost, drink-package worth-it math, gratuity calculators, cash to bring, and NCL Free at Sea costs.

Search Console data is useful but sparse: the URL-prefix property has only 18 days of visible data, from 2026-05-26 through 2026-06-12. Keyword Planner provides the stronger demand signal for now. That means the next implementation sprint should focus on existing pages, exact FAQ/H2 language, internal links, and calculator CTAs rather than creating many new landing pages.

## V1 Review

What V1 got right:

- The calculator is still the best acquisition hub.
- Existing pages cover most high-value clusters, so new pages should be a last resort.
- Drink packages, gratuities, WiFi, cash, hidden costs, and line-specific cost questions are the right topic families.
- Public community wording is useful for FAQs and short-form hooks, not for automated posting.

What V2 corrected:

- Search Console is accessible only for the URL-prefix property, not the domain property.
- Search Console demand is much younger and thinner than V1 assumed.
- Keyword Planner shows larger demand for line-specific WiFi and gratuity terms than for generic `cruise cost calculator`.
- GA4 CruiseKit analytics are not visible in the current account, so no GA4 baseline should be used yet.
- App Store Connect analytics are unavailable for CruiseKit in the current access state.
- Google Play Console provides a small but real acquisition baseline.

## Source Summary

- Search Console: accessible via `https://cruisekit.app/`; 8 clicks, 827 impressions, 1.0% CTR, 37.1 average position.
- Keyword Planner: accessible; three exports saved; strongest validated terms include Royal Caribbean WiFi cost, MSC drink package prices, Disney WiFi cost, Carnival WiFi cost, cash-to-bring terms, and drink-package calculator terms.
- Google Trends: accessible; cost-calculator interest was stronger than budget/hidden-cost comparisons, while Royal Caribbean/Carnival drink package terms were much larger than exact drink-package-calculator terms.
- GA4: authenticated but no CruiseKit property visible.
- App Store Connect: app visible but analytics unavailable.
- Google Play Console: accessible; last 28 days show 16 device acquisitions, 10 first opens, 13 MAU.

## Top 20 Fastest SEO Wins From Search Console

| Priority | Query | Impr. | Clicks | Pos. | Target | Action |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | how many drinks break even? | 33 | 0 | 9.42 | /guides/drink-package-guide | B. Add FAQ/H2 section; D. Improve calculator CTA; E. Create shareable calculator result |
| 2 | cruise cost calculator | 5 | 0 | 9.2 | /calculator | A. Rewrite title/meta only if approved; B. Add FAQ/H2; C. Add internal links |
| 3 | royal caribbean gratuity calculator | 1 | 0 | 35 | /calculator/royal-caribbean | B. Add Royal-specific gratuity FAQ/H2; C. Add internal links; D. Improve line calculator CTA |
| 4 | is cruise drink package worth it 2026 | 2 | 0 | 16.5 | /guides/drink-package-guide | B. Add FAQ/H2 section; D. Improve calculator CTA; E. Create shareable calculator result |
| 5 | 3 drinks per day | 1 | 0 | 8 | /guides/drink-package-guide | B. Add FAQ/H2 section; D. Improve calculator CTA; E. Create shareable calculator result |
| 6 | cruise calculator | 9 | 2 | 12.22 | /calculator | A. Rewrite title/meta only if approved; B. Add FAQ/H2; C. Add internal links |
| 7 | how much is a royal caribbean cruise | 4 | 0 | 20.75 | /calculator/royal-caribbean | B. Add line-specific FAQ/H2 section; C. Add internal links |
| 8 | what is the best way to estimate the true total cruise cost including  taxes, port fees, and daily gratuities? | 2 | 0 | 8.5 | /calculator | B. Add FAQ/H2 section; D. Improve calculator CTA; E. Create shareable calculator result |
| 9 | calculator+cruise | 2 | 0 | 9.5 | /calculator | A. Rewrite title/meta only if approved; B. Add FAQ/H2; C. Add internal links |
| 10 | cost of royal caribbean cruise | 2 | 0 | 19 | /calculator/royal-caribbean | B. Add line-specific FAQ/H2 section; C. Add internal links |
| 11 | how much is royal caribbean cruise | 1 | 0 | 21 | /calculator/royal-caribbean | B. Add line-specific FAQ/H2 section; C. Add internal links |
| 12 | cruise gratuity calculator | 2 | 0 | 61.5 | /guides/cruise-tipping-guide | B. Add FAQ/H2 section; C. Add internal links; D. Improve calculator CTA |
| 13 | cruise drink calculator | 1 | 0 | 71 | /guides/drink-package-guide | B. Add FAQ/H2 section; D. Improve calculator CTA; E. Create shareable calculator result |
| 14 | cruise drinks calculator | 1 | 0 | 76 | /guides/drink-package-guide | B. Add FAQ/H2 section; D. Improve calculator CTA; E. Create shareable calculator result |
| 15 | drink packages | 4 | 0 | 44.5 | /guides/drink-package-guide | B. Add FAQ/H2 section; D. Improve calculator CTA; E. Create shareable calculator result |
| 16 | drink package | 4 | 0 | 49.25 | /guides/drink-package-guide | B. Add FAQ/H2 section; D. Improve calculator CTA; E. Create shareable calculator result |
| 17 | how much is a cruise drink package | 3 | 0 | 60 | /guides/drink-package-guide | B. Add FAQ/H2 section; D. Improve calculator CTA; E. Create shareable calculator result |
| 18 | drinks package | 2 | 0 | 54.5 | /guides/drink-package-guide | B. Add FAQ/H2 section; D. Improve calculator CTA; E. Create shareable calculator result |
| 19 | how much are drinks on a cruise ship | 2 | 0 | 56 | /guides/drink-package-guide | B. Add FAQ/H2 section; D. Improve calculator CTA; E. Create shareable calculator result |
| 20 | how much is a drink package on a cruise | 2 | 0 | 59.5 | /guides/drink-package-guide | B. Add FAQ/H2 section; D. Improve calculator CTA; E. Create shareable calculator result |

## Top 30 Calculator-Intent Keywords

| Priority | Keyword | Volume | GSC | Score | Target | Action |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | disney cruise wifi cost | 1000 | Unavailable | 85 | /calculator/disney | B;C;D |
| 2 | how many drinks break even? | Unavailable | 33 | 85 | /guides/drink-package-guide | A;B;C;D;E |
| 3 | royal caribbean cruise wifi cost | 1600 | Unavailable | 85 | /calculator/royal-caribbean | B;C;D |
| 4 | royal caribbean wifi cost | 1600 | Unavailable | 85 | /calculator/royal-caribbean | B;C;D |
| 5 | cruise cost calculator | 10 | 5 | 84 | /calculator | A;B;C;D;E |
| 6 | msc drinks package prices | 1900 | Unavailable | 84 | /calculator/msc | B;C;D |
| 7 | royal caribbean gratuity calculator | 210 | 1 | 84 | /calculator/royal-caribbean | B;C;D |
| 8 | carnival cruise wifi cost | 720 | Unavailable | 83 | /calculator/carnival | B;C;D |
| 9 | carnival wifi cost | 720 | Unavailable | 83 | /calculator/carnival | B;C;D |
| 10 | is cruise drink package worth it 2026 | Unavailable | 2 | 83 | /guides/drink-package-guide | B;C;D |
| 11 | is drink package worth it on royal caribbean | 590 | Unavailable | 83 | /calculator/royal-caribbean | B;C;D;E |
| 12 | is royal caribbean drink package worth it | 590 | Unavailable | 83 | /calculator/royal-caribbean | B;C;D;E |
| 13 | princess wifi cost | 720 | Unavailable | 83 | /calculator/princess | B;C;D |
| 14 | cruise calculator | Unavailable | 9 | 82 | /calculator | A;B;C;D;E |
| 15 | how much cash should i bring on a cruise | 590 | Unavailable | 82 | /guides/port-day-tips | B;C;D |
| 16 | carnival drink package calculator | 390 | Unavailable | 81 | /blog/carnival-cheers-drink-package-worth-it | A;B;C;D;E |
| 17 | cruise drink package calculator | 260 | Unavailable | 81 | /guides/drink-package-guide | A;B;C;D;E |
| 18 | ncl wifi cost | 260 | Unavailable | 81 | /calculator/norwegian | B;C;D |
| 19 | norwegian cruise wifi cost | 260 | Unavailable | 81 | /calculator/norwegian | B;C;D |
| 20 | celebrity cruise wifi cost | 320 | Unavailable | 80 | /calculator/celebrity | B;C;D |
| 21 | cruise gratuity calculator | 10 | 2 | 80 | /guides/cruise-tipping-guide | A;B;C;D |
| 22 | cruise ship wifi cost | 320 | Unavailable | 80 | /calculator | B;C;D |
| 23 | cruise wifi cost | 320 | Unavailable | 80 | /calculator | B;C;D |
| 24 | how much cash to bring on cruise | 480 | Unavailable | 80 | /guides/port-day-tips | A;B;C;D |
| 25 | msc drink package cost | 480 | Unavailable | 80 | /calculator/msc | B;C;D |
| 26 | royal caribbean gratuities per day | 320 | Unavailable | 80 | /calculator/royal-caribbean | B;C;D |
| 27 | wifi cost on cruise | 320 | Unavailable | 80 | /calculator | B;C;D |
| 28 | holland america wifi cost | 210 | Unavailable | 79 | /calculator/holland-america | B;C;D |
| 29 | how much cash should you bring on a cruise | 320 | Unavailable | 79 | /guides/port-day-tips | B;C;D |
| 30 | msc cruise wifi cost | 210 | Unavailable | 79 | /calculator/msc | B;C;D |

## Top 30 Blog/Guide Keywords

| Priority | Keyword | Volume | Score | Target | Action |
| --- | --- | --- | --- | --- | --- |
| 1 | how many drinks break even? | Unavailable | 85 | /guides/drink-package-guide | A;B;C;D;E |
| 2 | is cruise drink package worth it 2026 | Unavailable | 83 | /guides/drink-package-guide | B;C;D |
| 3 | how much cash should i bring on a cruise | 590 | 82 | /guides/port-day-tips | B;C;D |
| 4 | carnival drink package calculator | 390 | 81 | /blog/carnival-cheers-drink-package-worth-it | A;B;C;D;E |
| 5 | cruise drink package calculator | 260 | 81 | /guides/drink-package-guide | A;B;C;D;E |
| 6 | cruise gratuity calculator | 10 | 80 | /guides/cruise-tipping-guide | A;B;C;D |
| 7 | how much cash to bring on cruise | 480 | 80 | /guides/port-day-tips | A;B;C;D |
| 8 | msc cruise cost | 720 | 80 | /blog/msc-cruise-cost | A;B;C;D |
| 9 | how much cash should you bring on a cruise | 320 | 79 | /guides/port-day-tips | B;C;D |
| 10 | cruise drink calculator | 140 | 78 | /guides/drink-package-guide | B;C;D;E |
| 11 | cruise drinks calculator | 140 | 78 | /guides/drink-package-guide | B;C;D;E |
| 12 | how much are drinks on a cruise ship | Unavailable | 77 | /guides/drink-package-guide | B;C;D |
| 13 | how much is a cruise drink package | Unavailable | 77 | /guides/drink-package-guide | B;C;D |
| 14 | how much is a drink package on a cruise | Unavailable | 77 | /guides/drink-package-guide | B;C;D |
| 15 | is the drink package worth it | 50 | 77 | /guides/drink-package-guide | A;B;C;D |
| 16 | royal caribbean hidden costs | 140 | 77 | /blog/royal-caribbean-cruise-cost | B;C;D |
| 17 | which cruise line has the cheapest drink package | Unavailable | 77 | /guides/drink-package-guide | B;C;D |
| 18 | are cruise prices per person or room | Unavailable | 76 | /cruise-costs | B;C;D |
| 19 | cruise expenses | Unavailable | 76 | /cruise-costs | B;C;D |
| 20 | cruise gratuities calculator | Unavailable | 76 | /guides/cruise-tipping-guide | B;C;D |
| 21 | cruise taxes and port fees | 90 | 76 | /blog/hidden-cruise-costs | B;C;D |
| 22 | cruise tip calculator | Unavailable | 76 | /guides/cruise-tipping-guide | B;C;D |
| 23 | hidden cruise costs | 70 | 74 | /blog/hidden-cruise-costs | A;B;C;D |
| 24 | carnival cheers drink package worth it | No reported volume | 73 | /blog/carnival-cheers-drink-package-worth-it | A;B;C;D |
| 25 | cruise excursion budget | No reported volume | 73 | /guides/port-day-tips | B;C;D |
| 26 | disney cruise budget | 30 | 72 | /blog/disney-cruise-cost | A;B;C;D |
| 27 | how much does a cruise really cost | 20 | 72 | /blog/how-much-does-a-cruise-really-cost-2026 | A;B;C;D |
| 28 | average cost of cruise excursions | Unavailable | 71 | /guides/port-day-tips | B;C;D |
| 29 | carnival drink package worth it | Unavailable | 71 | /blog/carnival-cheers-drink-package-worth-it | B;C;D |
| 30 | how much does a cruise cost | Unavailable | 71 | /blog/how-much-does-a-cruise-really-cost-2026 | A;B;C;D |

## Top 20 Cruise-Line-Specific Keywords

| Priority | Keyword | Volume | GSC | Score | Target |
| --- | --- | --- | --- | --- | --- |
| 1 | disney cruise wifi cost | 1000 | Unavailable | 85 | /calculator/disney |
| 2 | royal caribbean cruise wifi cost | 1600 | Unavailable | 85 | /calculator/royal-caribbean |
| 3 | royal caribbean wifi cost | 1600 | Unavailable | 85 | /calculator/royal-caribbean |
| 4 | msc drinks package prices | 1900 | Unavailable | 84 | /calculator/msc |
| 5 | royal caribbean gratuity calculator | 210 | 1 | 84 | /calculator/royal-caribbean |
| 6 | carnival cruise wifi cost | 720 | Unavailable | 83 | /calculator/carnival |
| 7 | carnival wifi cost | 720 | Unavailable | 83 | /calculator/carnival |
| 8 | is drink package worth it on royal caribbean | 590 | Unavailable | 83 | /calculator/royal-caribbean |
| 9 | is royal caribbean drink package worth it | 590 | Unavailable | 83 | /calculator/royal-caribbean |
| 10 | princess wifi cost | 720 | Unavailable | 83 | /calculator/princess |
| 11 | cost of royal caribbean cruise | Unavailable | 2 | 82 | /calculator/royal-caribbean |
| 12 | how much is a royal caribbean cruise | Unavailable | 4 | 82 | /calculator/royal-caribbean |
| 13 | carnival drink package calculator | 390 | Unavailable | 81 | /blog/carnival-cheers-drink-package-worth-it |
| 14 | ncl wifi cost | 260 | Unavailable | 81 | /calculator/norwegian |
| 15 | norwegian cruise wifi cost | 260 | Unavailable | 81 | /calculator/norwegian |
| 16 | celebrity cruise wifi cost | 320 | Unavailable | 80 | /calculator/celebrity |
| 17 | msc cruise cost | 720 | Unavailable | 80 | /blog/msc-cruise-cost |
| 18 | msc drink package cost | 480 | Unavailable | 80 | /calculator/msc |
| 19 | royal caribbean gratuities per day | 320 | Unavailable | 80 | /calculator/royal-caribbean |
| 20 | holland america wifi cost | 210 | Unavailable | 79 | /calculator/holland-america |

## Top 20 Reddit/Facebook Question Hooks

These are for FAQ, H2, helper text, short-form hooks, and creator prompts. They are not permission to post links or automate community activity.

| Priority | Question hook | Best use | Evidence |
| --- | --- | --- | --- |
| 1 | How many drinks break even on a cruise drink package? | FAQ, H2, calculator helper, short-form hook | GSC exact query: 33 impressions, pos 9.42 |
| 2 | Is the Royal Caribbean drink package worth it? | Royal calculator FAQ and short-form script | KP variants up to 590/mo |
| 3 | How much cash should I bring on a cruise? | Port-day FAQ and video hook | KP variants 590/480/320/mo |
| 4 | How much does cruise WiFi cost? | Calculator helper and FAQ | KP generic 320/mo; line-specific terms higher |
| 5 | Is NCL Free at Sea really free? | NCL blog intro and FAQ | KP exact cost 50/mo; Trends Free at Sea Plus rising |
| 6 | Are cruise gratuities mandatory? | Tipping guide FAQ | Public community pattern; GSC gratuity variants |
| 7 | What costs are not included on a cruise? | Hidden-costs FAQ/social hook | Public question pattern and GSC fee queries |
| 8 | How much should I budget for excursions? | Port-day H2 and helper text | SERP/forum-heavy pattern |
| 9 | How much does a cruise really cost after fees? | Real-cost blog intro | KP exact 20/mo; GSC broader variants |
| 10 | Is Carnival CHEERS worth it after gratuity? | Carnival drink-package blog | KP seed no volume but related Carnival calculator 390/mo |
| 11 | How much are Royal Caribbean gratuities per day? | Royal calculator FAQ | KP 320/mo |
| 12 | Do I need cash on the ship or only in port? | Port-day/tipping FAQ | Existing guide content fit |
| 13 | Are taxes and port fees included in cruise prices? | Hidden-costs FAQ | KP 90/mo |
| 14 | How much is a 7-day cruise per person? | Real-cost blog H2 | GSC broad cost variants |
| 15 | Which cruise line has the cheapest drink package? | Drink-package comparison section | GSC exact low-impression query |
| 16 | How much is Carnival WiFi? | Carnival calculator FAQ | KP 720/mo |
| 17 | How much is Royal Caribbean WiFi? | Royal calculator FAQ | KP 1600/mo |
| 18 | How much does MSC really cost after fees? | MSC cost blog/calculator handoff | KP `msc cruise cost` 720/mo |
| 19 | Should I prepay gratuities or pay onboard? | Tipping guide FAQ | Public community pattern |
| 20 | What should I calculate before paying a cruise deposit? | Calculator CTA and video hook | Positioning default |

## Top 10 New-Page Opportunities

No new page is recommended for immediate implementation before review. The existing calculator, line calculator, guide, and blog pages can absorb the validated demand first. These are candidates only if approved after the mapped-page improvements are reviewed or if post-implementation data shows the existing page cannot satisfy the intent.

| Priority | Candidate page | When it becomes truly needed |
| --- | --- | --- |
| 1 | /calculator/drink-package | Only if the approved scope includes a true interactive drink-package calculator. KP: `cruise drink package calculator` 260/mo; `carnival drink package calculator` 390/mo. Current fallback: /guides/drink-package-guide. |
| 2 | /calculator/gratuities | Only if tipping guide cannot satisfy calculator UX. KP: Royal/Disney gratuity calculator 210/mo each; GSC has gratuity variants. Current fallback: /guides/cruise-tipping-guide. |
| 3 | /cruise-wifi-cost | Only if WiFi terms keep growing after line calculator updates. KP: generic 320/mo; Royal 1600/mo; Carnival 720/mo; Disney 1000/mo. Current fallback: /calculator and line calculator pages. |
| 4 | /cruise-spending-money | Only if cash terms cannot be satisfied inside port-day guide. KP: cash variants 590/480/320/mo. Current fallback: /guides/port-day-tips. |
| 5 | /ncl-free-at-sea-cost | Only if the blog slug underperforms or needs a cleaner exact-match URL. Current fallback: /blog/norwegian-free-at-sea-explained. |
| 6 | /royal-caribbean-drink-package-calculator | Only if Royal drink-package terms outperform the broader Royal calculator. Current fallback: /calculator/royal-caribbean. |
| 7 | /carnival-drink-package-calculator | Only if Carnival drink-package calculator intent cannot be captured by the existing CHEERS post. Current fallback: /blog/carnival-cheers-drink-package-worth-it. |
| 8 | /msc-drink-package-cost | Only if MSC drink package terms remain high after MSC calculator updates. Current fallback: /calculator/msc. |
| 9 | /disney-cruise-wifi-cost | Only if Disney WiFi terms need a family-specific guide. Current fallback: /calculator/disney. |
| 10 | /cruise-taxes-and-port-fees | Only if hidden-costs page cannot rank for this distinct fee intent. Current fallback: /blog/hidden-cruise-costs. |

## Top 10 Title/Meta Rewrites

These are recommendations for review only. Do not implement until the keyword map is approved.

| Priority | Page | Recommended title | Query evidence |
| --- | --- | --- | --- |
| 1 | /guides/drink-package-guide | Cruise Drink Package Calculator: Is It Worth It? | GSC: `how many drinks break even?` at 33 impressions, pos 9.42; KP: `cruise drink package calculator` 260/mo. |
| 2 | /calculator | Free Cruise Cost Calculator: Estimate Fare, Fees, Drinks, WiFi & Excursions | GSC: `cruise cost calculator` pos 9.2 and `cruise calculator` 2 clicks/9 impressions. |
| 3 | /calculator/royal-caribbean | Royal Caribbean Cruise Cost Calculator: Estimate Your Real Total | GSC Royal terms at positions 19-42; KP Royal drink/gratuity/WiFi terms are strong. |
| 4 | /guides/cruise-tipping-guide | Cruise Gratuity Calculator + Tipping Guide | GSC gratuity/tip calculator variants; KP Royal/Disney gratuity calculator 210/mo each. |
| 5 | /guides/port-day-tips | How Much Cash to Bring on a Cruise: Tips, Ports & Excursions | KP cash variants 590/480/320/mo. |
| 6 | /blog/hidden-cruise-costs | Hidden Cruise Costs: 15 Fees to Budget Before You Book | KP `hidden cruise costs` 70/mo; strong feature fit. |
| 7 | /blog/how-much-does-a-cruise-really-cost-2026 | How Much Does a Cruise Really Cost in 2026? Real Fare + Fees | KP exact 20/mo; GSC broader cost queries exist but low ranking. |
| 8 | /calculator/carnival | Carnival Cruise Cost Calculator: Estimate Your Real Total | KP Carnival WiFi/drink package demand supports line calculator improvements. |
| 9 | /calculator/msc | MSC Cruise Cost Calculator: Drinks, WiFi, Tips & Real Total | KP `msc cruise cost` 720/mo and drink package terms 1900/mo. |
| 10 | /blog/norwegian-free-at-sea-explained | NCL Free at Sea Cost: What Is Actually Included? | KP exact 50/mo with +600% YoY; Trends shows Free at Sea Plus rising. |

## Top 10 Pages To Improve First

| Priority | Page | Why first |
| --- | --- | --- |
| 1 | /guides/drink-package-guide | Fastest near-ranking win: `how many drinks break even?` has 33 impressions at position 9.42 and no clicks. |
| 2 | /calculator | Core product page. GSC sees calculator and all-in cost queries; KP supports cost/budget calculator seeds. |
| 3 | /calculator/royal-caribbean | Line page already has GSC impressions and large KP support for WiFi, gratuity, and drink-package terms. |
| 4 | /guides/port-day-tips | KP cash-to-bring terms are much larger than expected; current page can absorb cash/excursion budgets. |
| 5 | /guides/cruise-tipping-guide | Gratuity calculator intent appears in GSC and KP; current guide should become the tip-calculator hub. |
| 6 | /blog/hidden-cruise-costs | Hidden-fee query has KP support and strong calculator handoff potential. |
| 7 | /blog/how-much-does-a-cruise-really-cost-2026 | Broad cost queries exist in GSC but rank poorly; needs examples and internal links after approval. |
| 8 | /calculator/carnival | KP supports Carnival WiFi and drink-package calculator terms even though GSC has no page-filter rows yet. |
| 9 | /calculator/msc | KP shows high MSC drink/WiFi/cost demand; existing calculator data supports it. |
| 10 | /blog/norwegian-free-at-sea-explained | NCL Free at Sea has validated KP/Trends interest and clear confusion intent. |

## 30-Day Implementation Order After Approval

Days 1-5 are now complete as a research phase, subject to review. Day 6 should be an approval checkpoint for the keyword map, target URLs, and action classifications.

Days 7-9: implement only approved title/meta, H1, and FAQ/H2 changes for the top pages: drink-package guide, calculator, Royal Caribbean calculator, tipping guide, port-day guide.

Days 10-12: add approved internal links and calculator CTAs from pages already receiving impressions. Keep one primary URL per cluster.

Days 13-17: implement tracking normalization, share-result improvements, UTM landing tracking, and a basic weekly dashboard.

Days 18-23: convert approved mapped questions into short-form hooks, calculator helper text, and creator outreach examples.

Days 24-30: review GSC movement, CTR changes, calculator starts/completions, store clicks, Play acquisitions, and decide whether any candidate new page is justified.

## Files Produced

- `docs/seo/keyword-map-2026-06-14-v2-authenticated.csv`
- `docs/seo/search-console-opportunities-2026-06-14.csv`
- `docs/seo/keyword-planner-export-notes-2026-06-14.md`
- `docs/seo/analytics-baseline-2026-06-14.md`
- `docs/seo/source-access-log-2026-06-14-v2.md`
- `docs/seo/implementation-readiness-review-2026-06-14.md`
