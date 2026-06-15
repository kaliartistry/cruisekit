# Keyword Planner Export Notes - 2026-06-14

## Access And Export

Google Keyword Planner was accessible through Google Ads account Kali Artistry 613-089-5249. No campaign, ad, billing, or account settings were changed. Keyword Planner limited seed entry to 10 terms per run, so the requested seeds were exported in three batches.

Settings observed during export:

- Location: United States
- Language: English
- Network: Google
- Date range: June 2025 through May 2026
- Export files: UTF-16LE tab-separated files saved with .csv extension under `docs/seo/source-data/keyword-planner/`

## Seed Batches

Batch 1: cruise cost calculator; cruise budget calculator; how much does a cruise really cost; hidden cruise costs; cruise gratuity calculator; cruise drink package calculator; is the drink package worth it; Royal Caribbean drink package worth it; Carnival cruise cost calculator; Royal Caribbean cruise cost calculator.

Batch 2: Norwegian cruise cost calculator; Disney cruise budget; MSC cruise cost; cruise WiFi cost; cruise excursion budget; how much cash to bring on cruise; NCL Free at Sea cost; carnival cheers drink package worth it; royal caribbean gratuities per day; cruise taxes and port fees.

Batch 3: how much spending money for a 7 day cruise.

## Highest-Value Findings

| Keyword | Avg monthly searches | Competition | Mapping implication |
| --- | --- | --- | --- |
| royal caribbean wifi cost | 1600 | Low | Large line-specific add-on demand; map to /calculator/royal-caribbean. |
| msc drinks package prices | 1900 | Low | Largest exported package term; map to /calculator/msc, not a generic drink page. |
| disney cruise wifi cost | 1000 | Low | Family/Disney WiFi add-on demand; map to /calculator/disney. |
| carnival cruise wifi cost | 720 | Low | Carnival WiFi add-on demand; map to /calculator/carnival. |
| msc cruise cost | 720 | Medium | Strong total-cost line term; map to /blog/msc-cruise-cost with calculator link. |
| is royal caribbean drink package worth it | 590 | Low | High-value break-even intent; map to /calculator/royal-caribbean. |
| how much cash should i bring on a cruise | 590 | Low | Port-spending/cash guide should be upgraded. |
| how much cash to bring on cruise | 480 | Low | Requested seed validated at meaningful demand. |
| carnival drink package calculator | 390 | Low | Drink calculator demand exists, but current fallback can be CHEERS post plus calculator CTA. |
| cruise wifi cost | 320 | Low | Generic WiFi cost can be calculator helper text plus line links. |
| royal caribbean gratuities per day | 320 | Low | Line calculator/tipping FAQ opportunity. |
| cruise drink package calculator | 260 | Low | Strong calculator intent with low competition; do not create new page until reviewed. |
| royal caribbean gratuity calculator | 210 | Low | Line-specific gratuity calculator opportunity. |
| hidden cruise costs | 70 | Medium | Smaller volume but strong strategic fit. |
| ncl free at sea cost | 50 | Low | Lower volume, but +600% YoY and strong confusion intent. |
| how much does a cruise really cost | 20 | Low | Low volume but high fit and existing content alignment. |

## Interpretation

The V2 data shifts priority toward line-specific add-on questions. CruiseKit should still use the full-cost calculator as the hub, but the fastest demand expansion is likely through WiFi, gratuity, drink-package, cash, and Free at Sea sections that route users into a saved calculator result.

Several requested seed terms returned no reported volume or unknown competition, including Carnival/Royal/Norwegian cruise cost calculator seeds and cruise excursion budget. That does not mean the intent is worthless; it means they should not drive new pages without Search Console or post-implementation evidence.
