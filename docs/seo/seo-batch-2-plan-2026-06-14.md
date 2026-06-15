# SEO Batch 2 Plan - 2026-06-14

## Source Of Truth

Use `docs/seo/keyword-map-2026-06-14-v2-authenticated.csv`.

Rules:

- One primary URL per keyword cluster.
- Improve existing pages first.
- Do not create new public URLs in this batch.
- Do not reposition the homepage hero without explicit approval.

## Allowed Edits

- Title, description, keywords, and Open Graph metadata.
- FAQ/H2 additions using exact or close-to-exact mapped question language.
- Internal links to the mapped calculator or guide.
- Calculator CTA/add-on copy.
- Cruise-line-specific cost copy for Carnival, MSC, Norwegian, and Disney.

## Deferred Until Approval

- Homepage hero H1/subhead repositioning.
- New landing pages.
- Deployment, merge, staging, commit, or push.

## Target URL Map

| URL | Keyword cluster | Action |
| --- | --- | --- |
| `/cruise-costs` | cruise costs, cruise expenses, are cruise prices per person or room, how cruise pricing works | Update metadata, add FAQ section, add internal links. |
| `/faq` | hidden fees, real cruise total, taxes/port fees/gratuities, cash, drink package | Update metadata, add cost-first FAQ language, add calculator/hub links. |
| `/blog/how-much-does-a-cruise-really-cost-2026` | how much does a cruise cost, how much is a cruise, 7-day cruise cost | Update title/excerpt, add mapped H2s. |
| `/calculator/carnival` | Carnival cost calculator, Carnival WiFi, Carnival gratuities, CHEERS worth it | Add metadata keywords, line-specific FAQ, internal links. |
| `/calculator/msc` | MSC cost calculator, MSC drinks package prices, MSC WiFi cost | Add metadata keywords, line-specific FAQ, internal links. |
| `/calculator/norwegian` | Norwegian cost calculator, NCL WiFi, Free at Sea cost | Add metadata keywords, line-specific FAQ, internal links. |
| `/calculator/disney` | Disney cruise budget, Disney WiFi, Disney gratuity calculator | Add metadata keywords, line-specific FAQ, internal links. |
| `/blog/norwegian-free-at-sea-explained` | NCL Free at Sea cost, is Free at Sea really free, Free at Sea Plus cost | Update title/excerpt and add mapped H2s. |
| `/blog/carnival-cheers-drink-package-worth-it` | Carnival drink package calculator, Carnival CHEERS worth it | Update title/excerpt and add mapped H2s. |
| `/blog/msc-cruise-cost` | MSC cruise cost, MSC drink package cost, MSC WiFi cost | Update title/excerpt and add mapped H2s. |
| `/blog/disney-cruise-cost` | Disney cruise budget, Disney WiFi cost, Disney gratuities | Update title/excerpt and add mapped H2s. |

## Homepage

The keyword map supports a cost-first homepage message, but the requested plan says major homepage hero edits require explicit approval. This batch will not change the homepage hero.

## New Page Decision

No new pages are needed in Batch 2. The mapped keyword clusters have viable existing targets.

## Validation

After implementation, run:

- `git diff --check`
- `pnpm --filter web lint`
- `pnpm --filter web exec tsc --noEmit`
- `pnpm --filter web build`

Then verify:

- Sitemap still includes only approved calculator URLs.
- Build side effects are reverted if unrelated.
- Metadata and FAQ additions appear in generated output or local inspection.
