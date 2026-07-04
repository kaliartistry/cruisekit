# Drink Package Worth-It SEO and Growth Brief

Date: 2026-07-04

## Executive Direction

CruiseKit should treat "is the cruise drink package worth it?" as a primary acquisition wedge. It is a high-anxiety planning question, it maps directly to CruiseKit's calculator and mobile Spend tracker, and it lets the app deliver value before and during the cruise without depending on booking or broad cruise search.

The positioning must stay responsible:

- Use "covered value," "break-even math," and "paying off" language.
- Frame the decision around what a traveler would already buy.
- Avoid "drink more," "catch up," "you need X drinks," or pressure-based wording.
- Include non-alcoholic value where relevant: specialty coffee, bottled water, soda, mocktails, smoothies, and premium juice.

## Evidence

Local Search Console and Keyword Planner exports already show the opportunity:

- `/guides/drink-package-guide/` has 270 impressions, 1 click, 0.37% CTR, and average position 17.91.
- `how many drinks break even?` has 33 impressions, 0 clicks, and average position 9.42.
- `is cruise drink package worth it 2026` has 2 impressions, 0 clicks, and average position 16.5.
- Keyword Planner shows monthly volume for `cruise drink package calculator` at 260, `is the drink package worth it` at 50, `carnival drink package calculator` at 390, and `is drink package worth it on royal caribbean` at 590.
- The SERP review found that competitors answer drink-only math, while CruiseKit can connect the decision to full trip cost and onboard tracking.

Source files:

- `docs/seo/search-console-opportunities-2026-06-14.csv`
- `docs/seo/source-data/keyword-planner/keyword-planner-batch-1-2026-06-14.csv`
- `docs/seo/serp-review-2026-06-14.md`

## Funnel

1. Search intent: "is the drink package worth it," "how many drinks break even," line-specific calculator searches.
2. Web entry: `/cruise-drink-package-calculator/` for transactional calculator intent and `/guides/drink-package-guide/` for education.
3. App handoff: "Track drink package value in the app" sends users to `/app`, with screenshots emphasizing Spend and covered drink value.
4. Product retention: user adds a cruise, sets package details, logs covered drinks, and sees covered value without adding covered drinks to trip spend.
5. Share loop: calculator result and app tracker screenshots become creator/social/community proof points.

## Page And Content Actions

Implemented in this pass:

- Update `/cruise-drink-package-calculator/` title and H1 to lead with "Is it worth it?"
- Add FAQ schema for "Is a cruise drink package worth it?"
- Add no-pressure language to the hero and explainer copy.
- Add an app CTA focused on tracking drink package value during the trip.

Next content cluster:

- Publish or refresh `Is a Cruise Drink Package Worth It? Use This Calculator First`.
- Publish line-specific support pages for Carnival CHEERS, Royal Caribbean Deluxe, NCL Free at Sea, Princess Plus/Premier, Celebrity Classic/Premium, MSC Premium Extra, Holland America, and Virgin Bar Tab.
- Add internal links from `/guides/drink-package-guide/`, line calculator pages, FAQ, homepage teaser, and app landing page to `/cruise-drink-package-calculator/`.
- Add a shareable result block for calculator output that uses "covered value" and "estimated remaining gap" wording.

## GrowthOps Actions

- Owned short-form: show the calculator and app tracker side by side with hooks like "The drink package is not a yes/no question. It is a value question."
- Creator demos: ask creators to run a real sailing scenario, then show how the app tracks covered value onboard.
- Community responses: answer the question directly without links unless community rules allow it. Disclose affiliation if CruiseKit is mentioned.
- Screenshot set: capture calculator, app Spend tracker, drink package setup, covered drink quick add, and value-progress state.
- App Store/Play Store copy: emphasize "track drink package value" and "see whether prepaid drinks are paying off" without overclaiming savings.

## Measurement

SEO:

- Clicks, impressions, CTR, and average position for `cruise drink package calculator`, `is the drink package worth it`, `how many drinks break even`, `carnival drink package calculator`, and Royal Caribbean worth-it variants.
- Page performance for `/cruise-drink-package-calculator/` and `/guides/drink-package-guide/`.

Web product:

- `drink_package_calculator_started`
- `drink_package_calculator_completed`
- `drink_package_result_shared`
- `app_store_click_from_drink_package`

Mobile product:

- `drink_package_setup_started`
- `drink_package_setup_completed`
- `covered_drink_added`
- `drink_package_value_threshold_reached`

Use "value threshold reached" in analytics and product copy instead of "drink more" or "break-even challenge."

## Guardrails

- Do not use official, partnered, certified, or "#1" claims.
- Do not imply CruiseKit's estimates replace the cruise line's current booking portal price.
- Do not hardcode dynamic cruise-line package prices unless sourced and dated.
- Do not encourage drinking volume. The product should help people evaluate prepaid value and avoid surprise spend.
