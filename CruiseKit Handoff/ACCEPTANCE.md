# Acceptance criteria

Claude Code: check each of these before declaring done. If any fail, fix in place and re-check.

## Web (apps/web)

### A1. Hero CTA uses the system teal token
- [ ] `apps/web/app/hero-section.tsx` no longer contains the strings `#FF6B4A` or `#E85A3A`.
- [ ] The CTA button uses `bg-teal` and `hover:bg-teal-dark` (the Tailwind tokens already defined in `globals.css`).
- [ ] The button's shadow, padding, font weight, and right-arrow glyph are unchanged.
- [ ] Visual smoke test: the CTA text remains white on the teal background with ≥ 4.5:1 contrast.

### A2. Hero subhead links to methodology
- [ ] Under the hero subhead paragraph in `hero-section.tsx`, a small muted line reads **"See how we calculate this →"** and links to `/methodology`.
- [ ] Link color is `text-white/60 hover:text-white/90`, font-size `text-xs`.
- [ ] Does not replace any existing copy; is additive.

### A3. "How we know" source links on big-claim surfaces
- [ ] In `apps/web/app/pillar-cards.tsx`, under the "The costs cruise lines don't show you" grid, a small right-aligned line reads **"Sources & methodology →"** linking to `/methodology`.
- [ ] In `apps/web/app/compare/compare-content.tsx`, under the "Click any column header to sort…" caption line, the same link is added.
- [ ] Both links use the same styling (`text-xs text-gray-400 hover:text-teal underline underline-offset-2`).

### A4. App-store URL config exists
- [ ] New file: `apps/web/lib/config/app-store-urls.ts` exports `APP_STORE_URL: string | null = null;` and `PLAY_STORE_URL: string | null = null;` with a clear comment block explaining launch-day swap.
- [ ] `apps/web/components/shared/app-handoff.tsx` imports these constants.
- [ ] `StoreBadge` renders an `<a>` when the URL is non-null, otherwise the existing disabled `<button>`.
- [ ] Today's visual output is unchanged (both URLs still `null`).

## Mobile (CruiseKit-Mobile)

### M1. Shared URL config
- [ ] New file: `CruiseKit-Mobile/lib/config/external_urls.dart` with `const String? kAppStoreUrl = null;` and `const String? kPlayStoreUrl = null;` plus any existing web-app URL consolidated here.
- [ ] Any previously-hard-coded store URLs in onboarding/share flows now import from this file.
- [ ] `flutter analyze` passes with no new warnings.

### M2. MyCrew sea-day empty state reworded
- [ ] The widget in `CruiseKit-Mobile/lib/features/mycrew/` that renders the sea-day empty state leads with the actions available today (group chat, wishlist, dinner plans), not with what's unavailable.
- [ ] The location-sharing note is still present, but visually demoted (smaller, lower, muted).
- [ ] No logic changes — copy + layout order only.

### M3. Onboarding spend-tracker card copy
- [ ] The spend-tracker onboarding card's headline + body acknowledges the user is *about to board / just boarded* and frames the budget as pre-empting day-3 anxiety.
- [ ] Exact wording is left to Claude Code's judgement, but must be human-written, not AI-generic. Reject phrases like "empower you to" or "supercharge your experience."

## Cross-cutting

### X1. Lint + type-check pass
- [ ] `pnpm --filter web lint` exits 0.
- [ ] `pnpm --filter web typecheck` exits 0 (or the monorepo equivalent).
- [ ] `cd CruiseKit-Mobile && flutter analyze` exits 0.

### X2. One commit per task area
- [ ] Commit 1: web CTA + hero footnote (A1, A2)
- [ ] Commit 2: "How we know" links (A3)
- [ ] Commit 3: app-store config (A4 + M1)
- [ ] Commit 4: mobile copy passes (M2, M3)

Each commit message begins with the task ID, e.g. `A1/A2: hero CTA to teal + methodology footnote`.

### X3. No scope creep
- [ ] No files touched outside those named in FINDINGS.md.
- [ ] No new packages added to either `package.json` or `pubspec.yaml`.
- [ ] No changes to the `methodology/page.tsx` content (it's already good).
- [ ] No MyDay file changes.
- [ ] No cruise-line-logo changes.
