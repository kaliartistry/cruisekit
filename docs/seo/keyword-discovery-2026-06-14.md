# CruiseKit Keyword Discovery Gate

Date: 2026-06-14  
Status: Ready for review, with authenticated data blockers noted.  
Implementation gate: Do not change SEO titles, metadata, sitemap, landing pages, or page copy until this keyword map is reviewed.

## Source Access Log

| Source | Status | Notes |
| --- | --- | --- |
| Google Search Console | Blocked | Local `gcloud` account exists, but Search Console API returned `PERMISSION_DENIED` for insufficient OAuth scopes. No GSC exports were found in the repo. |
| Google Keyword Planner | Blocked | Requires Google Ads account/API or dashboard export. No local export found. |
| Google Trends | Blocked | Public Trends endpoint returned HTTP 429 during collection. |
| Google autocomplete | Collected | Used the public Google suggestion endpoint for US English query phrasing. |
| Existing CruiseKit analytics | Blocked | No GA4 export or analytics API credentials found. `.env.local` contains Viator keys only. |
| App Store Connect / Play Console | Blocked | No acquisition exports or console credentials found locally. |
| Reddit public search/discussions | Partially collected | Used public web/search snippets and subreddit rule checks. No posting, DMs, private data, or private scraping. |
| Facebook public group patterns | Limited | Public search snippets only. Private group content and logged-in group data were not accessed. |
| Competitor SERP review | Collected | Reviewed public SERP snippets for priority cost, budget, drink package, gratuity, WiFi, and line-specific queries. |
| Existing CruiseKit pages | Collected | Mapped current calculator, cruise-cost hub, blog, guide, FAQ, and line-calculator pages. |

## Public Keyword Signals

Google autocomplete confirmed demand around these exact patterns:

- `cruise cost calculator`
- `cruise budget calculator`
- `how much does a cruise really cost`
- `how much does a cruise actually cost`
- `how much spending money for a cruise`
- `how much spending money for a 7 day cruise`
- `hidden cruise costs`
- `royal caribbean cruise hidden costs`
- `carnival cruise hidden costs`
- `cruise gratuity calculator`
- `carnival cruise gratuities calculator`
- `royal caribbean cruise gratuity calculator`
- `cruise drink package calculator`
- `cruise beverage package calculator`
- `carnival cruise drink package calculator`
- `royal caribbean drink package worth it calculator`
- `is the drink package worth it on a cruise`
- `is the drink package worth it on royal caribbean`
- `is the drink package worth it on carnival`
- `cruise wifi cost`
- `cruise wifi cost carnival`
- `how much cash to bring on cruise`
- `how much cash to bring on cruise for tips`
- `ncl free at sea cost`
- `ncl free at sea plus cost`
- `is ncl free at sea really free`
- `royal caribbean cruise cost calculator`
- `carnival cruise cost calculator`
- `disney cruise cost calculator`
- `msc cruise cost per person`

## Keyword Scoring Model

Each target is scored 1-100:

- Search intent fit: 0-25
- CruiseKit feature fit: 0-25
- Existing ranking opportunity: 0-20
- Search demand: 0-15
- Monetization or affiliate potential: 0-10
- Competition difficulty: 0-5, where higher means easier

Because Keyword Planner and Search Console were blocked, demand scores are provisional and based on autocomplete presence, SERP competitiveness, and visible community discussion patterns. Replace those scores after GSC and Keyword Planner exports are available.

## Required Deliverables

### 1. Top 20 Fastest SEO Wins From Search Console

Blocked until a Search Console export is available. Required files:

- Last 3 months query/page/country/device export
- Last 6 months query/page/country/device export
- Last 12 months query/page/country/device export

Once provided, filter for:

- High impressions with weak CTR
- Average position 8-30
- Average position 30-70
- Wrong page matches
- CruiseKit page cannibalization
- Calculator or commercial intent

Do not substitute public SERP data for this deliverable.

### 2. Top 30 Calculator-Intent Keywords

| Priority | Keyword | Target URL | Action |
| --- | --- | --- | --- |
| 1 | cruise cost calculator | `/calculator` | A, B, D, E |
| 2 | cruise budget calculator | `/calculator` | A, B, D |
| 3 | cruise vacation cost calculator | `/calculator` | B, C |
| 4 | how much does a cruise really cost | `/blog/how-much-does-a-cruise-really-cost-2026` | A, B, C, D |
| 5 | how much does a cruise actually cost | `/blog/how-much-does-a-cruise-really-cost-2026` | B, C, D |
| 6 | how much does a 7 day cruise cost per person | `/blog/how-much-does-a-cruise-really-cost-2026` | B, C |
| 7 | what is the average cost of a 7 day cruise | `/blog/how-much-does-a-cruise-really-cost-2026` | B |
| 8 | how much does a cruise cost for a family of 4 | `/calculator` | B, D |
| 9 | cruise hidden fees calculator | `/calculator` | B, D |
| 10 | hidden cruise costs | `/blog/hidden-cruise-costs` | A, B, C, D |
| 11 | cruise gratuity calculator | `/guides/cruise-tipping-guide` | A, B, C |
| 12 | cruise ship gratuities calculator | `/guides/cruise-tipping-guide` | B, C |
| 13 | cruise gratuities per day | `/guides/cruise-tipping-guide` | B |
| 14 | cruise drink package calculator | `/guides/drink-package-guide` | A, B, C, D |
| 15 | cruise beverage package calculator | `/guides/drink-package-guide` | B, C |
| 16 | is the drink package worth it on a cruise | `/guides/drink-package-guide` | A, B, C, D |
| 17 | average cost of cruise excursions | `/guides/port-day-tips` | B, C |
| 18 | how much are cruise excursions | `/guides/port-day-tips` | B, C |
| 19 | cruise wifi cost | `/calculator` | B, D |
| 20 | cruise internet cost | `/calculator` | B |
| 21 | how much cash to bring on cruise | `/guides/port-day-tips` | A, B, C |
| 22 | how much money to bring on cruise | `/guides/port-day-tips` | B |
| 23 | how much spending money for a cruise | `/calculator` | B, D |
| 24 | how much spending money for a 7 day cruise | `/calculator` | B, D |
| 25 | cruise taxes and fees | `/blog/hidden-cruise-costs` | B, C |
| 26 | cruise taxes and port fees | `/blog/hidden-cruise-costs` | B |
| 27 | cruise extras cost | `/blog/hidden-cruise-costs` | B |
| 28 | cruise onboard expenses | `/calculator` | B, D |
| 29 | cruise fare vs total cost | `/calculator` | B, D, E |
| 30 | real cruise cost calculator | `/calculator` | A, B, D, E |

### 3. Top 30 Blog/Guide Keywords

| Priority | Keyword | Target URL | Action |
| --- | --- | --- | --- |
| 1 | hidden cruise costs | `/blog/hidden-cruise-costs` | A, B, C, D |
| 2 | hidden cruise costs nobody tells you | `/blog/hidden-cruise-costs` | A |
| 3 | how much does a cruise really cost | `/blog/how-much-does-a-cruise-really-cost-2026` | A, B, C |
| 4 | how much does a caribbean cruise cost | `/blog/how-much-does-caribbean-cruise-cost-2026` | A, B |
| 5 | cruise tipping guide | `/guides/cruise-tipping-guide` | A, B |
| 6 | cruise gratuities per day | `/guides/cruise-tipping-guide` | B |
| 7 | average gratuity for cruises | `/guides/cruise-tipping-guide` | B |
| 8 | is the drink package worth it on a cruise | `/guides/drink-package-guide` | A, B |
| 9 | cruise drink package calculator | `/guides/drink-package-guide` | B, C, D |
| 10 | cruise beverage package calculator | `/guides/drink-package-guide` | B |
| 11 | carnival cheers drink package worth it | `/blog/carnival-cheers-drink-package-worth-it` | A, B, C |
| 12 | carnival drink package worth it | `/blog/carnival-cheers-drink-package-worth-it` | B |
| 13 | norwegian free at sea cost | `/blog/norwegian-free-at-sea-explained` | A, B, C |
| 14 | is ncl free at sea really free | `/blog/norwegian-free-at-sea-explained` | B |
| 15 | ncl free at sea plus cost | `/blog/norwegian-free-at-sea-explained` | B |
| 16 | royal caribbean vs carnival cost | `/blog/royal-caribbean-vs-carnival-cost-comparison` | A, B, C |
| 17 | carnival vs royal caribbean cost | `/blog/royal-caribbean-vs-carnival-cost-comparison` | B |
| 18 | disney cruise vs royal caribbean families | `/blog/disney-cruise-vs-royal-caribbean-families` | B |
| 19 | disney cruise budget | `/blog/disney-cruise-cost` | B, C |
| 20 | cruise packing list | `/guides/cruise-packing-list` | C |
| 21 | first time cruise guide | `/guides/first-time-cruise-guide` | C, D |
| 22 | first cruise budget | `/guides/first-time-cruise-guide` | B, C, D |
| 23 | cruise port tips | `/guides/port-day-tips` | B |
| 24 | cruise port spending | `/guides/port-day-tips` | B |
| 25 | average cost of cruise excursions | `/guides/port-day-tips` | B |
| 26 | cruise insurance cost | `/guides/cruise-insurance-explained` | B, C |
| 27 | cruise insurance worth it | `/guides/cruise-insurance-explained` | B |
| 28 | cruise ship time vs local time | `/blog/cruise-ship-time-vs-local-time` | C |
| 29 | best caribbean cruise ports first timers | `/blog/best-caribbean-cruise-ports-first-timers` | C |
| 30 | cruise budget planner | `/calculator` | C, D |

### 4. Top 20 Cruise-Line-Specific Keywords

| Priority | Keyword | Target URL | Action |
| --- | --- | --- | --- |
| 1 | royal caribbean cruise cost calculator | `/calculator/royal-caribbean` | A, B, C |
| 2 | carnival cruise cost calculator | `/calculator/carnival` | A, B, C |
| 3 | disney cruise cost calculator | `/calculator/disney` | A, B, C |
| 4 | norwegian cruise cost calculator | `/calculator/norwegian` | A, B, C |
| 5 | msc cruise cost calculator | `/calculator/msc` | A, B, C |
| 6 | royal caribbean cruise hidden costs | `/blog/royal-caribbean-cruise-cost` | B, C |
| 7 | carnival cruise hidden costs | `/blog/carnival-cruise-cost` | B, C |
| 8 | norwegian cruise hidden costs | `/blog/norwegian-cruise-cost` | B, C |
| 9 | disney cruise hidden costs | `/blog/disney-cruise-cost` | B, C |
| 10 | msc cruise hidden costs | `/blog/msc-cruise-cost` | B, C |
| 11 | royal caribbean drink package worth it calculator | `/calculator/royal-caribbean` | B, C, D |
| 12 | carnival cruise drink package calculator | `/blog/carnival-cheers-drink-package-worth-it` | B, C |
| 13 | royal caribbean gratuities per day | `/guides/cruise-tipping-guide` | B, C |
| 14 | carnival cruise gratuities per day | `/guides/cruise-tipping-guide` | B, C |
| 15 | norwegian cruise gratuities per day | `/guides/cruise-tipping-guide` | B, C |
| 16 | carnival cruise wifi cost | `/calculator/carnival` | B |
| 17 | norwegian cruise wifi cost | `/calculator/norwegian` | B |
| 18 | msc cruise wifi cost | `/calculator/msc` | B |
| 19 | royal caribbean cruise price per person | `/blog/royal-caribbean-cruise-cost` | B |
| 20 | how much is a royal caribbean cruise for a family of 4 | `/calculator/royal-caribbean` | B, D |

### 5. Top 20 Reddit/Facebook Question Hooks

These are public-question patterns for content and FAQ usage, not permission to post links.

| Priority | Hook | Best Use |
| --- | --- | --- |
| 1 | How much should I actually budget for a 7-day cruise? | Calculator helper, short-form video |
| 2 | Is the drink package worth it if I only drink a few drinks a day? | Drink-package guide FAQ |
| 3 | How much cash should I bring for tips on a cruise? | Port-day/tipping guide FAQ |
| 4 | What hidden fees should first-time cruisers expect? | Hidden-costs blog H2 |
| 5 | Is NCL Free at Sea really free? | NCL blog intro and FAQ |
| 6 | How much are Royal Caribbean gratuities for a 7-night cruise? | Tipping guide FAQ |
| 7 | Is Carnival CHEERS worth it after gratuity? | Carnival drink-package blog |
| 8 | How much does cruise WiFi cost? | Calculator H2/helper text |
| 9 | How much should I budget for excursions? | Port-day guide H2 |
| 10 | Are taxes and port fees included in cruise prices? | Hidden-costs blog FAQ |
| 11 | How much spending money do I need for a cruise? | Calculator FAQ |
| 12 | What costs are not included on a cruise? | Cost hub FAQ |
| 13 | Is Royal Caribbean more expensive than Carnival after add-ons? | Comparison blog CTA |
| 14 | What does a Disney cruise cost for a family? | Disney cost blog |
| 15 | Are cruise gratuities mandatory? | Tipping guide FAQ |
| 16 | How much do cruise drink packages cost per day? | Drink-package guide H2 |
| 17 | Should I prepay gratuities or pay onboard? | Tipping guide FAQ |
| 18 | What is the cheapest cruise line after extras? | Comparison/cost hub H2 |
| 19 | How much does MSC really cost after fees? | MSC cost blog |
| 20 | What should I calculate before paying a cruise deposit? | Homepage/calculator CTA copy |

### 6. Top 10 New-Page Opportunities

New pages are not recommended until Search Console data confirms demand. These are candidates only.

| Priority | Candidate Page | Why It Might Be Needed | Current Fallback |
| --- | --- | --- | --- |
| 1 | `/calculator/drink-package` | Autocomplete shows explicit drink-package calculator demand across lines. | `/guides/drink-package-guide` |
| 2 | `/calculator/gratuities` | Gratuity calculator queries are distinct from full-cost calculator queries. | `/guides/cruise-tipping-guide` |
| 3 | `/calculator/family-cruise-cost` | Family-of-4 cost appears in autocomplete. | `/calculator` |
| 4 | `/calculator/7-day-cruise-cost` | 7-day cruise cost queries have clear calculator intent. | `/blog/how-much-does-a-cruise-really-cost-2026` |
| 5 | `/cruise-wifi-cost` | WiFi cost queries may deserve a focused guide. | `/calculator` |
| 6 | `/cruise-excursion-budget` | Excursion-budget queries are specific and practical. | `/guides/port-day-tips` |
| 7 | `/cruise-spending-money` | Cash/spending-money queries are frequent and FAQ-shaped. | `/guides/port-day-tips` |
| 8 | `/ncl-free-at-sea-cost` | NCL cost query family is distinct and commercial. | `/blog/norwegian-free-at-sea-explained` |
| 9 | `/royal-caribbean-drink-package-calculator` | Strong line + calculator phrase. | `/calculator/royal-caribbean` |
| 10 | `/carnival-drink-package-calculator` | Strong line + calculator phrase. | `/blog/carnival-cheers-drink-package-worth-it` |

### 7. Top 10 Title/Meta Rewrites

These should wait for review because authenticated query data is missing.

| Priority | Page | Recommended Title |
| --- | --- | --- |
| 1 | `/calculator` | Free Cruise Cost Calculator: Estimate Fare, Fees, Drinks, WiFi & Excursions |
| 2 | `/` | Free Cruise Cost Calculator: See the Real Total Before You Book |
| 3 | `/cruise-costs` | Cruise Cost Calculator + Hidden Cruise Costs Guide |
| 4 | `/blog/how-much-does-a-cruise-really-cost-2026` | How Much Does a Cruise Really Cost in 2026? Real Fare + Fees |
| 5 | `/blog/hidden-cruise-costs` | Hidden Cruise Costs: 15 Fees to Budget Before You Book |
| 6 | `/guides/drink-package-guide` | Cruise Drink Package Calculator: Is It Worth It? |
| 7 | `/guides/cruise-tipping-guide` | Cruise Gratuity Calculator + Tipping Guide |
| 8 | `/calculator/royal-caribbean` | Royal Caribbean Cruise Cost Calculator: Estimate Your Real Total |
| 9 | `/calculator/carnival` | Carnival Cruise Cost Calculator: Estimate Your Real Total |
| 10 | `/faq` | Cruise Cost Calculator FAQ: Fees, Gratuities, Drinks & WiFi |

### 8. Top 10 Pages To Improve First

| Priority | Page | Why |
| --- | --- | --- |
| 1 | `/calculator` | Highest feature fit and broadest calculator intent. |
| 2 | `/` | First-viewport positioning can send more users into calculator. |
| 3 | `/blog/how-much-does-a-cruise-really-cost-2026` | Matches exact "really/actually cost" query family. |
| 4 | `/blog/hidden-cruise-costs` | Matches high-intent hidden-fee queries. |
| 5 | `/guides/drink-package-guide` | Strong drink-package calculator/worth-it demand. |
| 6 | `/guides/cruise-tipping-guide` | Gratuity calculator queries need stronger targeting. |
| 7 | `/cruise-costs` | Should become the hub for cost clusters and internal links. |
| 8 | `/calculator/royal-caribbean` | Strong line-specific autocomplete and commercial intent. |
| 9 | `/calculator/carnival` | Strong line-specific autocomplete and commercial intent. |
| 10 | `/guides/port-day-tips` | Captures cash, excursions, and port spending questions. |

### 9. 30-Day Implementation Order

Days 1-2:
- Review this keyword map.
- Provide GSC and Keyword Planner exports if available.
- Approve target URL mapping and action classifications.

Days 3-5:
- Re-score keywords with GSC and Keyword Planner data if provided.
- Finalize the top 20 Search Console fastest wins.
- Lock top 10 page priorities.

Days 6-10:
- Implement approved title/meta/H1/FAQ/internal-link changes for `/calculator`, `/`, `/cruise-costs`, and the two highest-priority blog posts.

Days 11-15:
- Improve drink-package, tipping, and port-day guide targeting.
- Add line-calculator sitemap entries only after mapping approval.

Days 16-20:
- Add calculator result-sharing and analytics events.
- Add UTM tracking notes to the mapped CTAs.

Days 21-25:
- Convert public question hooks into 30 short-form concepts.
- Start creator outreach examples based on mapped calculators and guides.

Days 26-30:
- Review Search Console movement, CTR, calculator completion rate, store clicks, and share events.
- Decide whether any new page opportunity has enough evidence to build.

## Policy Sources

- Reddit: https://redditinc.com/policies/reddit-rules
- Reddit spam guidance: https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam
- Reddit self-promotion guidance: https://www.reddit.com/r/reddit.com/wiki/selfpromotion/
- Meta spam: https://transparency.meta.com/policies/community-standards/spam/
- Meta inauthentic behavior: https://transparency.meta.com/policies/community-standards/inauthentic-behavior/
- FTC endorsement guides: https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking

