# CruiseKit Polish Pass - Implementation And Rollback Log

Date: 2026-04-25

This note records what was changed, where the actual mobile project lives, and how to walk the polish pass back without disturbing unrelated work.

## Repositories Involved

### Web

Path: `/Users/kaliartistry-mac/Cruise Travel Agent`

Branch at documentation time: `main`

Important note: the web repo now has two Firestore commits above the polish commits:

```text
693dfbb docs: record initial Firestore rules deployment
5d36532 feat: Firestore security rules - replace Test Mode with default-deny
00c24e9 A4: centralize web app-store URLs
f9760ff A3: Sources & methodology links on pillar-cards and compare
bcafa28 A1/A2: hero CTA to teal + methodology footnote
```

Do not use `git reset --hard` on `main` to remove the polish pass unless you also intend to discard the later Firestore work.

### Mobile

Path: `/Users/kaliartistry-mac/CruiseKit-Mobile`

Branch at documentation time: `master`

Important note: this is a separate sibling Git repo, not a folder inside the web monorepo.

Recent mobile polish commits:

```text
0a29950 M3: onboarding spend tracker copy
ff32dcd M2: MyCrew sea-day copy pass
83cc567 A4/M1: centralize app-store URLs
```

The mobile worktree had broad pre-existing dirty changes before this pass. Several tracked files still show unstaged edits after the commits, including:

```text
lib/features/myday/crew_screen.dart
lib/features/myday/spend_screen.dart
lib/features/plan/calculator/steps/results_step.dart
lib/features/home/first_launch_sheet.dart (untracked)
```

Do not reset or checkout these files casually; that could discard unrelated work that predates this polish pass.

## What Was Done

### Commit `bcafa28` - A1/A2 Web Hero

Files:

```text
apps/web/app/hero-section.tsx
```

Changes:

- Replaced the coral hero CTA classes with `bg-teal hover:bg-teal-dark`.
- Added the small methodology link: `See how we calculate this ->`.

### Commit `f9760ff` - A3 Methodology Links

Files:

```text
apps/web/app/pillar-cards.tsx
apps/web/app/compare/compare-content.tsx
```

Changes:

- Added `Sources & methodology ->` under the hidden-costs grid.
- Added `Sources & methodology ->` in the compare matrix caption.
- Removed existing unused imports/state in those touched files so the touched web files lint cleanly.

### Commit `00c24e9` - A4 Web Store URL Config

Files:

```text
apps/web/lib/config/app-store-urls.ts
apps/web/components/shared/app-handoff.tsx
```

Changes:

- Added nullable `APP_STORE_URL` and `PLAY_STORE_URL` launch toggles.
- Updated `AppHandoff` store badges to render disabled buttons while URLs are `null`, and real external links when set.

### Commit `83cc567` - M1 Mobile URL Config

Files:

```text
lib/config/external_urls.dart
lib/features/plan/calculator/steps/results_step.dart
lib/widgets/shared/remote_image.dart
```

Changes:

- Added nullable mobile store URL constants and centralized `kWebAppUrl` / `kWebAssetBaseUrl`.
- Replaced hard-coded `cruisekit.app` usage in share text and remote image base URL.

### Commit `ff32dcd` - M2 MyCrew Sea-Day Copy

Files:

```text
lib/features/myday/crew_screen.dart
```

Changes:

- Reworded the sea-day state so it leads with what the user can do now.
- Demoted the location-sharing note to a muted footnote.

### Commit `0a29950` - M3 Spend Tracker Copy

Files:

```text
lib/features/myday/spend_screen.dart
```

Changes:

- Added spend tracker budget copy: `Set your ceiling before day 3.`
- Added supporting copy about drinks, excursions, and specialty dinners rolling into one total.

This was intentionally staged as a narrow cached patch against the tracked baseline because the current working tree contains a larger uncommitted Spend redesign.

## Structure Mismatches From The Prompt

The prompt expected mobile paths that do not exist in the actual project on disk:

```text
CruiseKit-Mobile/lib/features/onboarding/
CruiseKit-Mobile/lib/features/mycrew/
```

Hard-drive search found no alternate clean CruiseKit Flutter checkout with those paths. The real mobile app structure is:

```text
lib/features/home/first_launch_sheet.dart
lib/features/home/onboard_home_screen.dart
lib/features/myday/crew_screen.dart
lib/features/myday/spend_screen.dart
```

Best interpretation used:

- M2 mapped to `lib/features/myday/crew_screen.dart`.
- M3 mapped to `lib/features/myday/spend_screen.dart`.

## Verification Performed

Web:

```text
pnpm --filter web exec tsc --noEmit
```

Result: passed.

Touched web files were also linted directly with ESLint and passed. Repo-wide `pnpm --filter web lint` still had pre-existing failures outside the polish files.

Mobile:

```text
flutter analyze lib/config/external_urls.dart lib/features/plan/calculator/steps/results_step.dart lib/widgets/shared/remote_image.dart lib/features/myday/crew_screen.dart lib/features/myday/spend_screen.dart
```

Result: passed.

Repo-wide `flutter analyze` had pre-existing issues outside the touched files.

## Safe Rollback Commands

These commands create revert commits instead of rewriting history. Use them from a clean worktree when possible.

### Roll Back Web Polish Only

From `/Users/kaliartistry-mac/Cruise Travel Agent`:

```sh
git switch main
git status --short
git revert --no-commit 00c24e9 f9760ff bcafa28
pnpm --filter web exec tsc --noEmit
git commit -m "revert: CruiseKit web polish pass"
```

Why this order: it reverts newest polish commit first while leaving the later Firestore commits intact.

### Roll Back Mobile Polish Only

From `/Users/kaliartistry-mac/CruiseKit-Mobile`:

```sh
git switch master
git status --short
git diff > /tmp/cruisekit-mobile-pre-polish-rollback.patch
git revert --no-commit 0a29950 ff32dcd 83cc567
flutter analyze lib/config/external_urls.dart lib/features/plan/calculator/steps/results_step.dart lib/widgets/shared/remote_image.dart lib/features/myday/crew_screen.dart lib/features/myday/spend_screen.dart
git commit -m "revert: CruiseKit mobile polish pass"
```

Because the mobile worktree is dirty, preserve a patch first. If `git revert` reports local-change conflicts, either commit/stash the unrelated dirty work first or apply the revert on a fresh branch from `HEAD`.

### Emergency Full Mobile Reset

Only use this if you intentionally want to throw away all uncommitted mobile work and all three mobile polish commits:

```sh
cd /Users/kaliartistry-mac/CruiseKit-Mobile
git diff > /tmp/cruisekit-mobile-before-reset.patch
git reset --hard 9a4ac03
```

This is not the recommended rollback path because it discards unrelated uncommitted work.

## Recommended Next Review Step

Review the two repos separately:

1. Web: inspect commits `bcafa28..00c24e9` while remembering `5d36532` and `693dfbb` are later Firestore work.
2. Mobile: inspect commits `83cc567..0a29950`, then separately inspect the remaining unstaged mobile worktree before deciding what belongs in future commits.