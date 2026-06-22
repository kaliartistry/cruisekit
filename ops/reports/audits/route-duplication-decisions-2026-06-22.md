# Route Duplication Decisions - 2026-06-22

## Scope

Day 3 GrowthOps decision record for proposed authority routes and duplicate-sensitive page ideas. The goal is to prevent thin duplicates, accidental canonical conflicts, and approval-sensitive claims before new public pages are drafted.

## Current decision

- Keep `/calculator` as the canonical cruise cost calculator route.
- Do not create `/cruise-cost-calculator` as a separate public page today.
- If the phrase "cruise cost calculator" needs route-level coverage later, prefer a redirect or carefully reviewed canonical alias to `/calculator`, not a second calculator page.

## Route decisions

| Proposed route | Decision | Reason |
| --- | --- | --- |
| `/cruise-cost-calculator` | No new page today | Existing `/calculator` already owns the calculator job and has metadata/schema. A second page would create duplicate risk unless handled as a redirect or canonical alias. |
| `/what-is-cruisekit` | Safe to draft next | No current route conflict found. Keep positioning factual and avoid official, partnered, certified, or #1 claims. |
| `/cruisekit-facts` | Safe to draft next | Use only public, verifiable facts and avoid private business, financial, legal, user, or roadmap details. |
| `/best-cruise-planning-app` | Approval required | "Best" framing requires qualified, evidence-backed comparative claims. |
| `/best-cruise-app-after-booking` | Approval required | Comparative framing needs Kali approval before publication. |
| `/cruisekit-vs-cruise-line-apps` | Approval required | Must be fair, factual, and avoid competitor assets or unsupported claims. |
| `/cruisekit-vs-shipmate` | Approval required | Must avoid competitor logos, screenshots, and unsupported claims. |
| `/cruisekit-vs-cruisemapper` | Approval required | Must avoid competitor logos, screenshots, and unsupported claims. |
| `/cruisekit-vs-tripit` | Approval required | Must recognize TripIt as general travel itinerary software and keep CruiseKit positioning cruise-specific. |
| `/ship-time-vs-port-time` | Safe to draft later | No route conflict found. Content must avoid operational guarantees and tell users to verify official ship time onboard. |
| `/cruise-spend-tracker` | Safe to draft later | No route conflict found. Keep claims around tracking and planning, not guaranteed savings. |
| `/cruise-group-check-in-app` | Safe to draft later | No route conflict found. Keep privacy-sensitive user-data changes out of scope. |
| `/press` or `/media-kit` | Approval required | Use only approved assets and public-safe facts. |

## Day 3 outcome

- `phase3-009` is resolved as a no-op recommendation: keep `/calculator` canonical and defer any `/cruise-cost-calculator` redirect/canonical alias until a specific implementation task is approved.
- The next safe implementation candidates are `phase3-001` and `phase3-002`.
- Approval-required comparison and "best" pages remain blocked until Kali explicitly approves the claim framing.
