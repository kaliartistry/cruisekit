# CruiseKit Web

Next.js 16 static-export site for `cruisekit.app`.

## Common Commands

```bash
pnpm --filter web dev
pnpm --filter web lint
pnpm --filter web build
```

The web build runs the data bundle pipeline first:

```text
scripts/build-data-bundles.mjs
scripts/publish-data-bundles.mjs
```

GitHub Pages deploys `apps/web/out` from `.github/workflows/deploy.yml`.

## Internal Tools

`/internal/deal-workbench` is disabled by default. Build with
`NEXT_PUBLIC_ENABLE_INTERNAL_TOOLS=true` only when generating an internal ops
preview.
