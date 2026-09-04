import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve("apps/web/out");

function outputFileForRoute(route) {
  if (route === "/") return path.join(outputRoot, "index.html");
  return path.join(outputRoot, route.replace(/^\//, ""), "index.html");
}

async function readRoute(route) {
  return readFile(outputFileForRoute(route), "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const selfCanonicalRoutes = [
  "/",
  "/calculator/",
  "/cruises/",
  "/compare/",
  "/groups/",
  "/blog/",
  "/about/",
  "/contact/",
  "/affiliate-disclosure/",
  "/help/",
  "/how-we-make-money/",
  "/terms/",
  "/loyalty/",
  "/myday/",
  "/methodology/",
];

for (const route of selfCanonicalRoutes) {
  const html = await readRoute(route);
  const canonical = `https://cruisekit.app${route}`;
  assert.match(
    html,
    new RegExp(
      `<link[^>]+rel=["']canonical["'][^>]+href=["']${escapeRegExp(canonical)}["']`
    ),
    `${route} must have self-referencing canonical ${canonical}`
  );
}

const calculatorHtml = await readRoute("/calculator/");
assert.doesNotMatch(
  calculatorHtml,
  /<meta[^>]+name=["']robots["'][^>]+noindex/i,
  "calculator hub canonical must not noindex measured parameter URLs"
);

const sitemapXml = await readFile(path.join(outputRoot, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1]
);
assert.ok(sitemapUrls.length > 100, "sitemap must include the public catalog");
assert.ok(
  sitemapUrls.every((url) => url.endsWith("/")),
  "every sitemap URL must use the final trailing-slash form"
);
assert.equal(
  new Set(sitemapUrls).size,
  sitemapUrls.length,
  "sitemap URLs must be unique"
);
assert.ok(
  sitemapUrls.every((url) => !url.includes("?")),
  "shared calculator URLs must not enter the sitemap"
);
await Promise.all(
  sitemapUrls.map(async (url) => {
    const route = new URL(url).pathname;
    await readRoute(route);
  })
);

const shipTimeHtml = await readRoute("/ship-time-vs-port-time/");
assert.match(
  shipTimeHtml,
  /<title>Ship Time vs Port Time: Which Clock Do You Obey\?<\/title>/
);
assert.match(shipTimeHtml, /<h1[^>]*>Ship Time vs Port Time<\/h1>/);
assert.match(shipTimeHtml, /The one-sentence answer/);

const pilotRoutes = [
  "/ports/half-moon-cay/",
  "/ports/falmouth/",
  "/ports/aruba/",
  "/ports/curacao/",
  "/ports/celebration-key/",
];
for (const route of pilotRoutes) {
  const html = await readRoute(route);
  assert.match(html, /Direct answer/);
  assert.match(html, /Last verified:\s*(?:<!-- -->)?September 4, 2026/);
  assert.match(html, /ship-time and port-time guide/);
}

const legacyShipTimeHtml = await readRoute(
  "/blog/cruise-ship-time-vs-local-time/"
);
assert.match(
  legacyShipTimeHtml,
  /http-equiv=["']refresh["'][^>]+ship-time-vs-port-time\//i
);
assert.doesNotMatch(
  sitemapXml,
  /blog\/cruise-ship-time-vs-local-time\//,
  "merged legacy article must not remain in the sitemap"
);

console.log(
  `Static SEO verification passed: ${sitemapUrls.length} canonical sitemap URLs, ${selfCanonicalRoutes.length} repaired canonicals, ${pilotRoutes.length} pilot ports.`
);
