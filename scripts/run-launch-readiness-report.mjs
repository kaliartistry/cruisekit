#!/usr/bin/env node
/**
 * Checks live website launch/SEO basics without mutating production.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const baseUrl = (process.env.CRUISEKIT_LIVE_BASE_URL ?? "https://cruisekit.app").replace(/\/+$/, "");

const requiredPaths = [
  "/",
  "/cruises/",
  "/calculator/",
  "/ports/",
  "/guides/",
  "/blog/",
  "/privacy/",
  "/terms/",
  "/contact/",
  "/affiliate-disclosure/",
  "/sitemap.xml",
  "/robots.txt",
  "/data/bundles/manifest.json",
];

const metadataPages = [
  { path: "/", mustContain: ["CruiseKit", "cruise planning"] },
  { path: "/cruises/", mustContain: ["Cruise Deals", "hand-verified"] },
  { path: "/privacy/", mustContain: ["Privacy"] },
  { path: "/affiliate-disclosure/", mustContain: ["Affiliate"] },
];

function add(list, severity, id, message, url = null) {
  list.push({ severity, id, message, url });
}

async function fetchText(path) {
  const url = `${baseUrl}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "CruiseKitLaunchReadiness/1.0 (+https://cruisekit.app)",
      },
    });
    const text = await response.text();
    return { url, status: response.status, ok: response.status >= 200 && response.status < 400, text };
  } catch (error) {
    return { url, status: null, ok: false, text: "", error: error?.message ?? String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

function titleFor(html) {
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? null;
}

function descriptionFor(html) {
  return html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]?.trim() ?? null;
}

function markdownList(findings) {
  if (findings.length === 0) return "- None\n";
  return findings
    .map((finding) => {
      const url = finding.url ? ` (${finding.url})` : "";
      return `- ${finding.severity}: ${finding.id} - ${finding.message}${url}`;
    })
    .join("\n") + "\n";
}

function manifestCounts(manifest) {
  return {
    publicSailings: manifest?.counts?.publicSailings ?? manifest?.bundles?.canonicalSailings?.records ?? null,
    mobileSailings: manifest?.bundles?.mobileSailings?.records ?? null,
    mobileDeals: manifest?.bundles?.mobileDeals?.records ?? null,
  };
}

function manifestBundleSignature(manifest) {
  const bundles = manifest?.bundles ?? {};
  return {
    counts: manifestCounts(manifest),
    hashes: {
      canonicalSailings: bundles.canonicalSailings?.sha256 ?? null,
      canonicalDeals: bundles.canonicalDeals?.sha256 ?? null,
      mobileSailings: bundles.mobileSailings?.sha256 ?? null,
      mobileDeals: bundles.mobileDeals?.sha256 ?? null,
    },
  };
}

async function loadLocalJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

async function main() {
  const blockers = [];
  const warnings = [];
  const pages = [];

  for (const path of requiredPaths) {
    const result = await fetchText(path);
    pages.push({
      path,
      url: result.url,
      status: result.status,
      ok: result.ok,
      bytes: result.text.length,
    });
    if (!result.ok) {
      add(blockers, "blocker", path, `Required public URL failed: ${result.status ?? result.error}`, result.url);
    }
  }

  for (const page of metadataPages) {
    const result = await fetchText(page.path);
    if (!result.ok) continue;
    const title = titleFor(result.text);
    const description = descriptionFor(result.text);
    if (!title) add(warnings, "warning", page.path, "Missing HTML title.", result.url);
    if (!description) add(warnings, "warning", page.path, "Missing meta description.", result.url);
    for (const phrase of page.mustContain) {
      if (!result.text.toLowerCase().includes(phrase.toLowerCase())) {
        add(warnings, "warning", page.path, `Expected page text not found: ${phrase}`, result.url);
      }
    }
  }

  const [robots, sitemap, liveManifest, localManifest] = await Promise.all([
    fetchText("/robots.txt"),
    fetchText("/sitemap.xml"),
    fetchText("/data/bundles/manifest.json"),
    loadLocalJson("apps/web/public/data/bundles/manifest.json").catch(() => null),
  ]);

  if (robots.ok && !/sitemap:\s*https:\/\/cruisekit\.app\/sitemap\.xml/i.test(robots.text)) {
    add(warnings, "warning", "robots.txt", "Robots file does not advertise the CruiseKit sitemap.", robots.url);
  }
  if (sitemap.ok) {
    for (const required of ["/cruises", "/privacy", "/terms", "/contact", "/affiliate-disclosure"]) {
      if (!sitemap.text.includes(`${baseUrl}${required}`)) {
        add(warnings, "warning", "sitemap.xml", `Missing expected sitemap URL: ${required}`, sitemap.url);
      }
    }
  }

  let liveManifestJson = null;
  if (liveManifest.ok) {
    try {
      liveManifestJson = JSON.parse(liveManifest.text);
    } catch {
      add(blockers, "blocker", "manifest", "Live data manifest is not valid JSON.", liveManifest.url);
    }
  }

  const liveCounts = manifestCounts(liveManifestJson);
  if ((liveCounts.mobileSailings ?? 0) < 100) {
    add(warnings, "warning", "manifest", "Live mobile sailing count is lower than expected.", liveManifest.url);
  }
  if ((liveCounts.mobileDeals ?? 0) < 100) {
    add(warnings, "warning", "manifest", "Live mobile deal count is lower than expected.", liveManifest.url);
  }

  const localGeneratedAt = localManifest?.generatedAt ?? null;
  const liveGeneratedAt = liveManifestJson?.generatedAt ?? null;
  const localSignature = localManifest ? manifestBundleSignature(localManifest) : null;
  const liveSignature = liveManifestJson ? manifestBundleSignature(liveManifestJson) : null;
  if (localSignature && liveSignature && JSON.stringify(localSignature) !== JSON.stringify(liveSignature)) {
    add(
      warnings,
      "warning",
      "manifest",
      "Live manifest bundle counts or hashes differ from the local public manifest.",
      liveManifest.url,
    );
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    ok: blockers.length === 0,
    pages,
    counts: {
      checkedUrls: pages.length,
      liveMobileSailings: liveCounts.mobileSailings,
      liveMobileDeals: liveCounts.mobileDeals,
      livePublicSailings: liveCounts.publicSailings,
    },
    liveManifestGeneratedAt: liveGeneratedAt,
    localManifestGeneratedAt: localGeneratedAt,
    liveManifestSignature: liveSignature,
    localManifestSignature: localSignature,
    blockers,
    warnings,
  };

  const markdown = `# CruiseKit Launch Readiness Report

Generated: ${report.generatedAt}

Base URL: ${baseUrl}

## Summary

| Metric | Count |
| --- | ---: |
| Checked URLs | ${report.counts.checkedUrls} |
| Live public sailings | ${report.counts.livePublicSailings ?? "unknown"} |
| Live mobile sailings | ${report.counts.liveMobileSailings ?? "unknown"} |
| Live mobile deals | ${report.counts.liveMobileDeals ?? "unknown"} |
| Blockers | ${blockers.length} |
| Warnings | ${warnings.length} |

## Public URLs

| Path | Status | Bytes |
| --- | ---: | ---: |
${pages.map((page) => `| ${page.path} | ${page.status ?? "error"} | ${page.bytes} |`).join("\n")}

## Blockers

${markdownList(blockers)}
## Warnings

${markdownList(warnings)}
`;
  const normalizedMarkdown = markdown.replace(/\n+$/, "\n");

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-launch-readiness.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-launch-readiness.md"), normalizedMarkdown),
  ]);

  console.log(`Launch readiness: ${blockers.length} blocker(s), ${warnings.length} warning(s).`);
  console.log("Report written to data/reports/latest-launch-readiness.md");
  if (blockers.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
