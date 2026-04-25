# Claude Code — CruiseKit polish pass

You are working in the `Cruise Travel Agent/` monorepo, which contains two apps:

- `apps/web/` — Next.js 15 website (TypeScript, Tailwind, shadcn-style components)
- `CruiseKit-Mobile/` — Flutter app

A human-led UX audit found that most of the original critique was already resolved in source. What remains is a surgical polish pass: **7 small tasks, ~200 LOC total, no new features**.

---

## Step 0 — Read context (serial, do this first)

Before changing anything, read these files in order:

1. `CruiseKit Handoff/FINDINGS.md` — why each fix matters
2. `CruiseKit Handoff/ACCEPTANCE.md` — per-task acceptance criteria
3. `apps/web/app/hero-section.tsx`
4. `apps/web/app/pillar-cards.tsx`
5. `apps/web/app/compare/compare-content.tsx`
6. `apps/web/components/shared/app-handoff.tsx`
7. `apps/web/app/globals.css` (confirm the `teal` / `teal-dark` tokens)
8. `apps/web/components/layout/footer.tsx` (to match link styling)
9. List `CruiseKit-Mobile/lib/features/onboarding/` and `CruiseKit-Mobile/lib/features/mycrew/` to locate the widgets named in M2 and M3
10. `CruiseKit-Mobile/lib/` for any existing URL constants to consolidate

Do **not** edit yet.

---

## Step 1 — Fan out team A (web polish)

Spawn **four parallel sub-agents**, one per task. These touch disjoint files and are safe to run concurrently.

### A1 — Hero CTA to teal

Edit `apps/web/app/hero-section.tsx`:

- Replace the hardcoded `bg-[#FF6B4A] hover:bg-[#E85A3A]` on the submit button with `bg-teal hover:bg-teal-dark` (Tailwind tokens already defined in `globals.css`).
- Leave every other class, the arrow glyph, and the event handler untouched.

### A2 — Hero methodology footnote

Same file (`hero-section.tsx`) but a separate change from A1 — the sub-agent for A2 must **wait for A1 to commit first** to avoid a merge conflict inside one file. Claude Code: serialize A1 → A2 on this one file.

Under the `<motion.p>` that contains *"Cruises look cheap on the sticker and expensive on the folio…"*, add a new small line:

```tsx
<Link
  href="/methodology"
  className="mt-3 inline-block text-xs text-white/60 hover:text-white/90 underline underline-offset-2 transition-colors"
>
  See how we calculate this →
</Link>
```

Keep the existing animation timing.

### A3 — "How we know" source links

Two files, independent:

**`apps/web/app/pillar-cards.tsx`** — in the "hidden costs" section (the one whose heading is *"The costs cruise lines don't show you"*), directly *after* the grid closing `</motion.div>`, add:

```tsx
<div className="mt-8 text-right">
  <Link
    href="/methodology"
    className="text-xs text-gray-400 hover:text-teal underline underline-offset-2 transition-colors"
  >
    Sources & methodology →
  </Link>
</div>
```

(Add the `Link` import from `next/link` if not already imported in this file.)

**`apps/web/app/compare/compare-content.tsx`** — find the caption line *"Click any column header to sort. Green = best value, coral = highest cost."* Append (as a new line/element inside the same caption block):

```tsx
{" · "}
<Link
  href="/methodology"
  className="text-xs text-gray-400 hover:text-teal underline underline-offset-2 transition-colors"
>
  Sources & methodology →
</Link>
```

### A4 — App-store URL config (web side)

Create `apps/web/lib/config/app-store-urls.ts`:

```ts
/**
 * Launch-day toggle. While both URLs are null, the web AppHandoff
 * component renders the disabled "Coming soon" store badges. Set either
 * string to the real store URL to enable a real link. No other code changes
 * should be required at launch.
 */
export const APP_STORE_URL: string | null = null;
export const PLAY_STORE_URL: string | null = null;
```

Edit `apps/web/components/shared/app-handoff.tsx`:

- Import `APP_STORE_URL` and `PLAY_STORE_URL` from `@/lib/config/app-store-urls`.
- Add a `href: string | null` prop to `StoreBadge`.
- When `href` is non-null, render `<a href={href} target="_blank" rel="noopener noreferrer">` with the same visual styling minus `disabled` / `cursor-not-allowed` / `opacity-80`.
- When `href` is null, keep the current disabled `<button>` look.
- In the parent component, pass `href={APP_STORE_URL}` to the App Store badge and `href={PLAY_STORE_URL}` to the Google Play badge.

Today's visual output must be unchanged (both URLs null).

---

## Step 2 — Fan out team B (mobile polish)

Spawn **three parallel sub-agents**, one per task. These touch disjoint Dart files.

### M1 — Shared URL config

Create `CruiseKit-Mobile/lib/config/external_urls.dart`:

```dart
/// Launch-day toggle. While both store URLs are null, any widget that
/// invokes them should render a disabled / "coming soon" affordance.
/// Set either string to the real store URL to enable a real link.
const String? kAppStoreUrl = null;
const String? kPlayStoreUrl = null;

/// Centralize the web-app URL here so the mobile app has one place to
/// change if the domain ever moves.
const String kWebAppUrl = 'https://cruisekit.app';
```

Grep `lib/` for any `cruisekit.app` string literals, any `apps.apple.com/...cruisekit` literals, and any `play.google.com/...cruisekit` literals. Replace each with an import of the corresponding constant from this file. If the existing code uses a different domain (e.g. staging), keep its value but add it to the constants file — do not change behavior.

### M2 — MyCrew sea-day empty state

Locate the widget in `CruiseKit-Mobile/lib/features/mycrew/` that renders the empty / pre-port state on a sea day. Rework the copy so it leads with what the user *can* do right now, and demotes the location-sharing note:

- Primary line (large): something like **"Plan tomorrow's port together."**
- Secondary body: two or three actionable affordances — group chat, shared wishlist, dinner plans — each one a tappable row that already exists in MyCrew.
- Tertiary footnote (small, muted, at the bottom): *"Location sharing resumes when you reach port."*

Do not add new functionality; only re-order and reword. If the existing rows live elsewhere in the feature, link to them with the existing navigation pattern.

### M3 — Onboarding spend-tracker copy

Find the onboarding card that introduces the spend tracker. Replace its headline + body with copy that acknowledges the user is about to board (or just boarded) and frames setting a budget as pre-empting mid-cruise anxiety.

Suggested direction (rewrite in your own voice, don't copy verbatim):

- Headline: *"Set your ceiling now, not on day 3."*
- Body: One short sentence. Something like *"Every drink, excursion, and specialty dinner lands in one running total. You'll know where you stand without opening the folio app."*

Reject AI-generic phrasings. Don't use "empower", "supercharge", "elevate", "effortlessly", "seamlessly", or em-dashes in marketing voice.

---

## Step 3 — Verify (serial)

After both teams report complete:

1. Run `pnpm --filter web lint` from the repo root. Fix any warnings introduced.
2. Run `pnpm --filter web typecheck` (or `pnpm --filter web tsc --noEmit` if no dedicated script). Must exit 0.
3. `cd CruiseKit-Mobile && flutter analyze`. Must exit 0.
4. Re-read `CruiseKit Handoff/ACCEPTANCE.md` and tick each box mentally. Anything unticked → fix in place.
5. Scope audit: run `git diff --stat main..HEAD`. Confirm no files changed outside those listed in FINDINGS.md. If any did, revert them unless the change was strictly required by lint/typecheck.

---

## Step 4 — Commit strategy

Four commits, in this order (each commit must pass lint + typecheck on its own):

1. `A1/A2: hero CTA to teal + methodology footnote`
2. `A3: "Sources & methodology" links on pillar-cards and compare`
3. `A4/M1: centralize app-store URLs (web + mobile)`
4. `M2/M3: mobile copy passes (MyCrew sea-day + onboarding spend)`

End with a one-paragraph summary in your final message listing:

- Files changed (grouped by commit)
- Anything that didn't match the expected structure (e.g. if a file named in FINDINGS.md didn't exist and you had to find its real home)
- Any acceptance criterion that you interpreted liberally, and why

Do not open PRs, do not push, do not run the app. Stop after commits are in the local branch.
