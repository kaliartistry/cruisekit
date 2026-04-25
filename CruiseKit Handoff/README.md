# CruiseKit — Handoff Package

Drop this folder into the root of your `Cruise Travel Agent/` monorepo (or anywhere — the prompt is self-contained). Then open a terminal in the repo root and run the prompt in `CLAUDE_CODE_PROMPT.md` through Claude Code.

## What's in this package

| File | Purpose |
| --- | --- |
| `CLAUDE_CODE_PROMPT.md` | **The single prompt.** Copy the whole thing into Claude Code in one shot. |
| `FINDINGS.md` | Context on what was found during the audit and why each fix matters. Claude Code will read this automatically. |
| `ACCEPTANCE.md` | Per-task acceptance criteria. Claude Code will check against these before finishing. |

## Why one prompt

Claude Code handles sub-agents ("agent teams") natively when a task lists independent parallel work. The prompt is structured as:

1. **Context pass** — read the two source files and this handoff folder.
2. **Parallel team A — web polish** (4 independent tasks, safe to fan out).
3. **Parallel team B — mobile polish** (3 independent tasks, safe to fan out).
4. **Serial gate** — one human-readable diff summary + run `pnpm lint` and `flutter analyze`.

Everything in each team touches different files, so sub-agents won't collide. The serial gate at the end guarantees nothing is left half-applied.

## Scope

Small, surgical. No new features, no re-architecture. Total target: ~200 LOC touched across both apps.

- Web: 4 edits (hero CTA color, methodology footnotes, "How we know" links, store URL swap prep)
- Mobile: 3 edits (onboarding polish pass, MyCrew sea-day copy, store URL swap prep)
- Shared: 1 edit (re-promote the "40–140%" claim with a real source, or remove it from internal talking points)

## How long

~20 minutes of Claude Code time on a well-warmed repo. Expect a single commit per task area so you can review incrementally.
