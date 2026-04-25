# Findings the fixes are based on

Audit read both `apps/web/` (Next.js) and `CruiseKit-Mobile/lib/` (Flutter) against ~44 screenshots. After source-reading, most findings were already fixed in code. These are the ones that survived.

---

## F1 — Web hero CTA is off-palette

**File:** `apps/web/app/hero-section.tsx:160`

The hero's primary CTA hard-codes coral:

```tsx
className="w-full bg-[#FF6B4A] hover:bg-[#E85A3A] text-white ..."
```

Everywhere else in the app, **teal is the interaction color** and **coral is reserved for warmth / highlights** (wishlist hearts, price callouts, "highest cost" cells in the compare matrix). Using coral for the primary CTA teaches the user the wrong rule; every teal button downstream then feels secondary.

The concern from the original critique ("looks like an affiliate ad") is *gone* now that the CTA lives inside a white card instead of on top of the ship photo — but the color semantics are still inconsistent.

**Fix:** Swap to teal (`bg-teal hover:bg-teal-dark`) using the existing Tailwind tokens. Keep the shadow and size.

---

## F2 — The "40–140%" claim has no source

Original audit called out `"40-140% more than advertised"` as the single best claim in the category. Grep across `apps/web` for `40.*140|real cost|sticker|hidden` returns **zero matches**. It either never shipped or got pulled.

**Two paths:**

- **Path A (preferred):** If the number is real and defensible, put it back on the home page *with a footnote* linking to `/methodology`. The methodology page is already excellent — it just isn't surfaced at the moment of claim.
- **Path B:** If the number was aspirational, leave it out. Don't fake it.

This prompt executes **Path A scaffolding only**: adds a small `<SourceFootnote/>` component under the hero subhead with a link to `/methodology#summary`. The actual copy stays a TODO for the product owner. This is intentional — I'm not going to invent a statistic.

---

## F3 — No "How we know" links next to big numbers

The compare matrix, port pages, and pillar cards all show concrete dollar amounts (`$70-$110 per person/day`, `$16.00/day gratuity`, etc.) with no inline way to check the source. The `methodology` page exists and is genuinely good. It's just not linked at the moments of claim.

**Fix:** Add a small, text-only "How we know" link under:
- The "hidden costs" grid in `pillar-cards.tsx`
- The cost comparison matrix caption in `compare-content.tsx`

One line each. Links to `/methodology`.

---

## F4 — "Coming soon" store badges are correct-but-abandoned-feeling

**File:** `apps/web/components/shared/app-handoff.tsx`

The `<AppHandoff/>` component has disabled store badges that say "iOS — coming soon" / "Android — coming soon". This is honest but reads like the project is stalled. Once the app ships you need to swap two `href`s in one place.

**Fix:** Introduce `lib/config/app-store-urls.ts` with `APP_STORE_URL` and `PLAY_STORE_URL` constants (set to `null` until launch). Have `AppHandoff` read these — when `null`, keep the current disabled-button look; when set, become real `<a>` tags. No visual change today; a one-line launch toggle later.

---

## F5 — Mobile: "Get the app" deep-link URLs hard-coded in two places

**Files:**
- `CruiseKit-Mobile/lib/features/onboarding/` (invite flow — if present)
- `CruiseKit-Mobile/lib/features/mycrew/` (share sheet)

Same pattern as F4 — centralize any app-store / web-app URLs into one config file so launch is a one-file edit.

---

## F6 — MyCrew sea-day empty-state copy

From the source re-read, MyCrew's sea-day state is *structurally* fine (no GPS contradiction — GPS is only invoked on port days, which matches the spec). But the empty-state copy on a sea day still says something like *"Waiting for port day to enable location sharing"* which over-emphasizes the absence of a feature instead of the presence of the sea-day value.

**Fix:** Rewrite the sea-day empty state to lead with what the user *can* do right now (group chat, shared wishlist, dinner plans), with "Location sharing resumes in port" as a subtle secondary line.

---

## F7 — Mobile onboarding: no "why now" on the first spend-tracker screen

Onboarding *exists* (confirmed in source), but the spend-tracker intro card reads like a generic tutorial. On a cruise, users are thinking about money the day they board. The card should acknowledge that — something like *"Set a budget now so day-3 you doesn't have to."*

**Fix:** Copy-only change. One string in the onboarding feature.

---

## Explicit non-goals for this pass

- No MyDay redesign. Current implementation is good.
- No deal-card visual changes. Current implementation is good.
- No new components beyond the two tiny ones listed (`SourceFootnote`, `app-store-urls` config).
- No dependency changes.
