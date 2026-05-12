# Deploy

CruiseKit deploys to **GitHub Pages**, not Firebase Hosting.

## Production host

- **Static host:** GitHub Pages
- **Domain:** [cruisekit.app](https://cruisekit.app) (Squarespace DNS → GitHub Pages)
- **Build:** `next build` with `output: "export"` and `trailingSlash: true` (see [apps/web/next.config.ts](../apps/web/next.config.ts))
- **Workflow:** [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) — fires on push to `main` and on manual `workflow_dispatch`

The deploy pipeline:

1. Checkout
2. `pnpm install --frozen-lockfile`
3. `cd apps/web && npx next build` (produces `apps/web/out/`)
4. `actions/upload-pages-artifact@v3` with `path: apps/web/out`
5. `actions/deploy-pages@v4`

## Firebase scope

Firebase is intentionally **not** used for hosting. It is used only for:

- **Auth** — Firebase Authentication for Google sign-in
- **Firestore** — saved deals (`users/{uid}/savedDeals`), MyCrew groups (`groups/{groupId}`)
- **Security rules** — see [firestore.rules](../firestore.rules) and [docs/firestore-audit.md](firestore-audit.md)

[firebase.json](../firebase.json) intentionally has no `hosting` block. Do not add one — GitHub Pages owns serving the static site. The Firebase project (`cruisekit-app`) is the auth/data backend only.

## Why GitHub Pages and not Firebase Hosting

- The site is a fully static Next.js export — no server-side rendering, no API routes, no SSR caching to manage
- GitHub Pages is free for public repos and integrates naturally with the existing CI workflow
- Routing rewrites (trailing-slash semantics) are handled by Next's static export, no host-level rewrite rules required
- Firebase Auth and Firestore work cross-origin from any host, so the backend split is fine

## Adding a redirect or custom 404

GitHub Pages serves `out/404.html` automatically. For path-level redirects, the right place is `apps/web/public/` (static file) or `next.config.ts` `redirects()` if the redirect can be expressed at build time. Do not add redirects to `firebase.json` — it isn't read at runtime.

## DNS / domain

The `cruisekit.app` apex points to GitHub Pages via Squarespace DNS. If the domain is migrated, both:

1. The Squarespace DNS records, and
2. The `CNAME` file in `apps/web/public/` (if/when added)

must be updated together.
