# CruiseKit Agent Operating Rules

## Product Positioning

CruiseKit is the free independent cruise command center for true cruise cost, MyDay scheduling, ship-time and port-time planning, onboard spend tracking, port days, and MyCrew coordination.

## Source Of Truth

- Use GitHub as the source of truth for CruiseKit.
- Read `docs/agent-handoff.md` before starting work. Update it whenever a release, deployment, store status, material architecture decision, or cross-repository dependency changes.
- `AGENTS.md` is the Codex entry point and root `CLAUDE.md` is the Claude Code entry point. Both must direct agents to the same handoff document.
- Work in branches, not directly on `main`, except for explicitly approved one-time repository setup or emergency repair.
- Before creating a page, route, tool, component, doc, campaign, or automation, check the repo for existing equivalents to avoid duplicates.
- Preserve existing work. Do not delete or overwrite files unless Kali explicitly approves the exact change.

## Preflight

- Run a preflight audit before changes: `git status`, current branch, remotes, target files, duplicate route/tool checks, and relevant secret checks.
- Check `.env`, `.env.local`, API keys, private keys, service-role keys, tokens, passwords, signing files, Firebase/Supabase/Stripe/Resend/Gmail credentials, and other local-only material before staging.
- Do not commit `.env` files or secrets.

## Approval Gates

- Never make pricing, legal, government, tax, IRS, banking, app store pricing, subscription, paid-tool, payment, or money-related changes without Kali approval.
- Never claim "#1", "official", "partnered", "certified", or equivalent authority claims unless verified and approved.
- Pause and create a `needs-kali` approval issue when automation cannot safely proceed.

## Postflight

- Run a postflight audit after changes: `git status`, staged-file review, secret review, relevant tests/builds, and route/page duplication checks.
- Document skipped checks with the reason.
- Push branches to GitHub and keep handoff notes current for the automation laptop.
