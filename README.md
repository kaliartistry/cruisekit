# CruiseKit

Cruise planning toolkit. Web app at [cruisekit.app](https://cruisekit.app).

## Workspace layout

- [`apps/web`](apps/web) — Next.js 15 + TypeScript site
- [`packages`](packages) — shared workspace packages
- [`scripts`](scripts), [`tools`](tools) — data export and utility scripts

## Common commands

```bash
pnpm dev          # turbo dev across the workspace
pnpm build        # turbo build
pnpm lint         # turbo lint
pnpm test:rules   # run Firestore security-rules tests against the emulator
```

## Firestore Security Model

Firestore access is governed by [`firestore.rules`](firestore.rules) at the repo root. The ruleset is default-deny: every match block ends with `allow read, write: if false`, and only explicitly-modeled collections are accessible.

For the collection inventory, ruleset rationale, deploy procedure, and how to add a new collection, see [`docs/firestore-audit.md`](docs/firestore-audit.md).

Rule changes must:
1. Be reflected in the audit doc.
2. Be covered by tests in [`firestore.rules.test.ts`](firestore.rules.test.ts).
3. Pass `pnpm test:rules` before merge.

The Flutter mobile app shares the same Firebase project (`cruisekit-app`). Any rule change must account for both apps — see the audit doc's deploy gate.
