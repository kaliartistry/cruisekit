# Visual and Human Page Standard - 2026-06-22

## Scope

Kali requested that public GrowthOps pages should not only be technically useful for search and AI platforms, but also look visually appealing and read like a human wrote them.

## Standard added

- Future public pages should include relevant visual assets, not just text.
- Prefer existing local CruiseKit assets under `apps/web/public/assets`.
- Use generated visuals or clearly licensed/attributed external images only when local assets are not enough.
- Do not hotlink random images or use competitor screenshots/logos without permission.
- Write in a natural, helpful human voice and avoid keyword-stuffed filler.

## Pages retrofitted

- `/what-is-cruisekit`
- `/cruisekit-facts`
- `/ship-time-vs-port-time`

## Assets used

- Local app screenshots from `apps/web/public/assets/app-screenshots`
- Local port photos from `apps/web/public/assets/ports`
- Local ship photos from `apps/web/public/assets/ships`

## Verification

- `corepack pnpm --filter web lint`
- `corepack pnpm --filter web build`
- Playwright render probe for `/what-is-cruisekit/`, `/cruisekit-facts/`, and `/ship-time-vs-port-time/` on desktop and mobile.
- Each page has at least one loaded image in the first viewport on desktop and mobile.
- No horizontal overflow detected on the checked desktop or mobile viewports.
- Above-fold page visuals use eager loading and high fetch priority.
