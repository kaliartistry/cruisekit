# Celebration Key Image Fix - 2026-06-22

## Scope

Fix issue #13: `apps/web/public/assets/ports/celebration-key.jpg` was HTML saved with a `.jpg` extension.

## Fix

- Replaced `apps/web/public/assets/ports/celebration-key.jpg` with the existing valid local JPEG from `apps/web/public/images/ports/celebration-key.jpg`.
- Hardened `scripts/audit-bundle-images.mjs` so referenced `.jpg`, `.jpeg`, `.png`, and `.webp` bundle assets must have matching image bytes, not just matching filenames.

## Verification

- Confirmed the repaired `assets/ports/celebration-key.jpg` starts with a JPEG header.
- `corepack pnpm run data:audit:images`
- `corepack pnpm --filter web lint`
- `corepack pnpm --filter web build`

## Result

- Image audit reports 0 blockers and 0 warnings.
- The Celebration Key bundle image reference now resolves to a valid local JPEG.
