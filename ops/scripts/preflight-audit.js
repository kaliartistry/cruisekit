#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = process.cwd();
const today = new Date().toISOString().slice(0, 10);

function run(cmd, args, options = {}) {
  try {
    return {
      ok: true,
      output: execFileSync(cmd, args, {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        ...options,
      }).trim(),
    };
  } catch (error) {
    return {
      ok: false,
      output: [error.stdout, error.stderr, error.message].filter(Boolean).join("\n").trim(),
    };
  }
}

function walk(dir, predicate, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, files);
    else if (!predicate || predicate(full)) files.push(full);
  }
  return files;
}

function routeFromPage(file) {
  const rel = path.relative(path.join(root, "apps", "web", "app"), file).replace(/\\/g, "/");
  let route = rel.replace(/\/page\.tsx$/, "").replace(/^page\.tsx$/, "");
  route = route
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/\[(.+?)\]/g, ":$1"))
    .join("/");
  return `/${route}`;
}

function sourceIncludes(file, patterns) {
  const text = fs.readFileSync(file, "utf8");
  return patterns.some((pattern) => pattern.test(text));
}

function collectRoutes() {
  const pages = walk(path.join(root, "apps", "web", "app"), (file) => file.endsWith("page.tsx"));
  return pages.map((file) => ({
    route: routeFromPage(file),
    file: path.relative(root, file).replace(/\\/g, "/"),
    hasMetadata: sourceIncludes(file, [/metadata\s*:/, /generateMetadata/, /export const metadata/]),
    hasSchema: sourceIncludes(file, [/application\/ld\+json/, /"@context":\s*"https:\/\/schema\.org"/]),
    internal: file.includes(`${path.sep}internal${path.sep}`),
  })).sort((a, b) => a.route.localeCompare(b.route));
}

function collectContentPages() {
  const content = [];
  const blogFile = path.join(root, "apps", "web", "lib", "data", "blog-posts.ts");
  if (fs.existsSync(blogFile)) {
    const text = fs.readFileSync(blogFile, "utf8");
    const slugs = Array.from(text.matchAll(/slug:\s*"([^"]+)"/g)).map((match) => match[1]);
    const titles = Array.from(text.matchAll(/title:\s*"([^"]+)"/g)).map((match) => match[1]);
    slugs.forEach((slug, index) => {
      content.push({
        type: "blog",
        route: `/blog/${slug}`,
        title: titles[index] || null,
        source: "apps/web/lib/data/blog-posts.ts",
      });
    });
  }
  const guidesFile = path.join(root, "apps", "web", "lib", "data", "guides.ts");
  if (fs.existsSync(guidesFile)) {
    const text = fs.readFileSync(guidesFile, "utf8");
    const slugs = Array.from(text.matchAll(/slug:\s*"([^"]+)"/g)).map((match) => match[1]);
    slugs.forEach((slug) => {
      content.push({ type: "guide", route: `/guides/${slug}`, title: null, source: "apps/web/lib/data/guides.ts" });
    });
  }
  return content.sort((a, b) => a.route.localeCompare(b.route));
}

function collectSchema(routes) {
  return routes
    .filter((route) => route.hasSchema)
    .map((route) => ({ route: route.route, file: route.file, schemaDetected: true }));
}

function duplicateRoutes(routes) {
  const seen = new Map();
  const dupes = [];
  for (const route of routes) {
    if (seen.has(route.route)) dupes.push({ route: route.route, files: [seen.get(route.route), route.file] });
    seen.set(route.route, route.file);
  }
  return dupes;
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function writeInventory(routes, contentPages, schema, checks) {
  writeJson(path.join(root, "ops", "inventory", "routes.json"), {
    generatedAt: new Date().toISOString(),
    sourceRoot: "apps/web/app",
    routes,
  });
  writeJson(path.join(root, "ops", "inventory", "content_pages.json"), {
    generatedAt: new Date().toISOString(),
    contentPages,
  });
  writeJson(path.join(root, "ops", "inventory", "schema.json"), {
    generatedAt: new Date().toISOString(),
    schema,
  });

  const reportPath = path.join(root, "ops", "reports", "audits", `initial-inventory-${today}.md`);
  const lines = [
    `# Initial GrowthOps Inventory - ${today}`,
    "",
    "Public-safe bootstrap inventory for CruiseKit GrowthOps.",
    "",
    "## Repo",
    "",
    `- Path: ${root}`,
    `- Remote: ${checks.remote.output || "unavailable"}`,
    `- Branch: ${checks.branch.output || "unavailable"}`,
    `- Status: ${checks.status.output || "unavailable"}`,
    "",
    "## Current Routes And Pages",
    "",
    ...routes.map((route) => `- \`${route.route}\` (${route.file}) metadata: ${route.hasMetadata ? "yes" : "no"}, schema: ${route.hasSchema ? "yes" : "no"}`),
    "",
    "## Existing Blog/Content System",
    "",
    `- Blog source: \`apps/web/lib/data/blog-posts.ts\`; detected ${contentPages.filter((page) => page.type === "blog").length} blog routes.`,
    `- Guide source: \`apps/web/lib/data/guides.ts\`; detected ${contentPages.filter((page) => page.type === "guide").length} guide routes.`,
    "",
    "## SEO Metadata",
    "",
    `- Routes with metadata/generateMetadata: ${routes.filter((route) => route.hasMetadata).length}/${routes.length}.`,
    "- Global metadata is in `apps/web/app/layout.tsx`.",
    "",
    "## Structured Data",
    "",
    `- Routes/components with detected JSON-LD: ${schema.length}.`,
    "",
    "## Sitemap And Robots",
    "",
    `- Sitemap file exists: ${fs.existsSync(path.join(root, "apps", "web", "app", "sitemap.ts")) ? "yes" : "no"}.`,
    `- Robots file exists: ${fs.existsSync(path.join(root, "apps", "web", "app", "robots.ts")) ? "yes" : "no"}.`,
    "",
    "## Comparisons, Calculators, Press, Legal",
    "",
    `- Comparison route exists: ${routes.some((route) => route.route === "/compare") ? "yes, /compare" : "no"}.`,
    `- Calculator routes exist: ${routes.filter((route) => route.route.startsWith("/calculator")).map((route) => route.route).join(", ") || "no"}.`,
    `- Press/media route exists: ${routes.some((route) => route.route === "/press" || route.route === "/media-kit") ? "yes" : "no"}.`,
    `- Legal/trust routes: ${routes.filter((route) => ["/privacy", "/terms", "/affiliate-disclosure", "/how-we-make-money", "/methodology"].includes(route.route)).map((route) => route.route).join(", ") || "none detected"}.`,
    "",
    "## App Store Links, Analytics, Deploy",
    "",
    `- App store URL config exists: ${fs.existsSync(path.join(root, "apps", "web", "lib", "config", "app-store-urls.ts")) ? "yes" : "no"}.`,
    `- Analytics helper exists: ${fs.existsSync(path.join(root, "apps", "web", "lib", "analytics.ts")) ? "yes" : "no"}.`,
    `- GitHub Pages deploy workflow exists: ${fs.existsSync(path.join(root, ".github", "workflows", "deploy.yml")) ? "yes" : "no"}.`,
    "",
    "## Duplicate/Stale Page Risk",
    "",
    duplicateRoutes(routes).length ? duplicateRoutes(routes).map((dupe) => `- Duplicate route risk: ${dupe.route}`).join("\n") : "- No duplicate App Router page routes detected.",
    "",
    "## Existing Images/Screenshots",
    "",
    "- App screenshots exist under `apps/web/public/assets/app-screenshots`.",
    "- Cruise line, port, and ship images exist under `apps/web/public/images` and `apps/web/public/assets`.",
    "",
    "## Public-Safe Notes",
    "",
    "- Repo appears public from the handoff document; private strategy and sensitive ops notes should not be committed here until Kali approves the visibility model.",
    "- Firestore rules tests require Java locally; Java was not available during bootstrap.",
    "",
  ];
  fs.writeFileSync(reportPath, `${lines.join("\n")}\n`);
  return reportPath;
}

const checks = {
  path: { ok: !/OneDrive|Documents|Desktop/i.test(root), output: root },
  status: run("git", ["status", "--short", "--branch"]),
  remote: run("git", ["remote", "-v"]),
  fetch: run("git", ["fetch", "origin"]),
  branch: run("git", ["branch", "--show-current"]),
  ghPrs: run("gh", ["pr", "list", "--limit", "20", "--json", "number,title,headRefName,state,url"]),
  ghIssues: run("gh", ["issue", "list", "--label", "needs-kali", "--limit", "20", "--json", "number,title,state,url"]),
};

const routes = collectRoutes();
const contentPages = collectContentPages();
const schema = collectSchema(routes);
const dupes = duplicateRoutes(routes);

const report = {
  generatedAt: new Date().toISOString(),
  checks,
  duplicateRoutes: dupes,
  routeCount: routes.length,
  contentPageCount: contentPages.length,
  schemaCount: schema.length,
  approvalRequiredPatterns: [
    "pricing",
    "subscriptions",
    "paid tools",
    "API credits",
    "paid ads",
    "creator payments",
    "legal",
    "privacy",
    "affiliate agreements",
    "partnership contracts",
    "external outreach",
    "#1",
    "official",
    "partnered",
    "certified",
  ],
};

if (process.argv.includes("--write-inventory")) {
  report.inventoryReport = writeInventory(routes, contentPages, schema, checks);
}

console.log(JSON.stringify(report, null, 2));

if (!checks.path.ok || dupes.length > 0) {
  process.exitCode = 1;
}
