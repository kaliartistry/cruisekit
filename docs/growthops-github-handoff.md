# CruiseKit GrowthOps GitHub Handoff

Generated: 2026-06-22

## Repository

- GitHub repo URL: https://github.com/kaliartistry/cruisekit
- Clone URL: https://github.com/kaliartistry/cruisekit.git
- Default branch: `main`
- Visibility observed during setup: public
- Local safety branch: `backup/pre-growthops-2026-06-22`

## Stack

- Repo type: pnpm/Turbo monorepo
- Package manager: `pnpm@10.33.0`
- Web framework: Next.js `16.2.1` static export in `apps/web`
- UI/runtime: React `19.2.4`, Tailwind CSS `4`
- Backend services: Firebase Auth, Firestore, Firebase functions
- Deployment target: GitHub Pages

## Commands

- Install: `pnpm install --frozen-lockfile`
- Root dev: `pnpm dev`
- Web dev only: `pnpm --filter web dev`
- Root build: `pnpm build`
- Web build used by deploy workflow: `pnpm --filter web build`
- Root lint: `pnpm lint`
- Web lint only: `pnpm --filter web lint`
- Functions lint: `pnpm --filter cruisekit-functions lint`
- Firestore rules test: `pnpm run test:rules`

## Deploy Notes

- CruiseKit deploys to GitHub Pages from `.github/workflows/deploy.yml`.
- The deploy workflow runs on pushes to `main`, manual `workflow_dispatch`, and a daily schedule.
- `apps/web/next.config.ts` uses `output: "export"` and `trailingSlash: true`.
- The deploy artifact is `apps/web/out`.
- Firebase is not the static host; it is used for auth, Firestore, functions, and rules.
- Do not add Firebase Hosting unless Kali explicitly approves a hosting migration.

## Existing Pages And Routes Summary

- Core: `/`, `/app`, `/about`, `/contact`, `/faq`, `/help`
- Planning tools: `/calculator`, `/calculator/[cruise-line]`, `/compare`, `/cruise-costs`, `/track`, `/myday`, `/my-trips`
- Cruise discovery: `/cruises`, `/ports`, `/ports/[port-slug]`, `/guides`, `/guides/[guide-slug]`
- Feature pages: `/features/cruise-itinerary-planner`, `/features/cruise-port-guides`, `/features/cruise-route-map`, `/features/explore-map`
- Content: `/blog`, `/blog/[slug]`
- Trust/legal: `/privacy`, `/terms`, `/methodology`, `/affiliate-disclosure`, `/how-we-make-money`
- Community and loyalty: `/groups`, `/loyalty`
- Internal tools: `/internal/deal-workbench`, `/internal/leads`
- AI metadata endpoint page: `/ai/cruisekit-summary`

Before adding any new GrowthOps page, check `apps/web/app`, `apps/web/lib/data/blog-posts.ts`, and existing docs under `docs/growth` and `docs/seo`.

## Known Risks

- The worktree had pre-existing uncommitted changes before this setup task started. Do not assume they are safe to stage.
- `apps/web/.env.local` exists locally and is ignored. Do not stage or copy it into GitHub.
- The repo contains generated data bundle files; build commands can refresh bundle outputs. Avoid running a build in a dirty worktree unless Kali approves preserving or replacing those generated changes.
- The GitHub Pages deploy workflow runs on every push to `main`.
- Branch protection should require pull requests for future `main` changes. If GitHub settings block that configuration, create a `needs-kali` issue and document the blocker.

## Automation Laptop Instructions

1. Clone the repo:

   ```sh
   git clone https://github.com/kaliartistry/cruisekit.git
   cd cruisekit
   ```

2. Install dependencies:

   ```sh
   pnpm install --frozen-lockfile
   ```

3. Create a working branch before changes:

   ```sh
   git switch -c codex/growthops-task-name
   ```

4. Run preflight checks before editing:

   ```sh
   git status --short --branch
   git remote -v
   ```

5. Never commit secrets, `.env` files, local signing files, or paid-tool credentials.
6. Use GitHub issues with the `needs-kali` label whenever approval is required.
