#!/usr/bin/env node
/**
 * Verifies that public/mobile deal image references are present and resolvable
 * to bundled website assets.
 */
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function add(list, severity, id, message) {
  list.push({ severity, id, message });
}

function markdownList(findings) {
  if (findings.length === 0) return "- None\n";
  return findings
    .map((finding) => `- ${finding.severity}: ${finding.id} - ${finding.message}`)
    .join("\n") + "\n";
}

async function fileExists(relPath) {
  try {
    await access(resolve(repoRoot, relPath));
    return true;
  } catch {
    return false;
  }
}

async function assetExistsFor(imageUrl) {
  if (!imageUrl || /^https?:\/\//.test(imageUrl)) return null;
  const normalized = imageUrl.replace(/^\/+/, "");
  const candidates = [`apps/web/public/${normalized}`];
  if (normalized.startsWith("assets/images/")) {
    candidates.push(`apps/web/public/${normalized.replace("assets/images/", "assets/")}`);
  }
  if (normalized.startsWith("assets/")) {
    candidates.push(`apps/web/public/assets/images/${normalized.replace("assets/", "")}`);
  }
  for (const candidate of candidates) {
    if (await fileExists(candidate)) return { ok: true, path: candidate };
  }
  return { ok: false, path: candidates[0] };
}

async function main() {
  const [canonicalDeals, mobileDeals] = await Promise.all([
    loadJson("data/bundles/canonical/deals.json"),
    loadJson("data/bundles/mobile/deals.json"),
  ]);

  const blockers = [];
  const warnings = [];
  const all = [
    ...canonicalDeals.map((deal) => ({ bundle: "canonical", deal })),
    ...mobileDeals.map((deal) => ({ bundle: "mobile", deal })),
  ];

  for (const { bundle, deal } of all) {
    const id = `${bundle}:${deal.id}`;
    if (!deal.imageUrl) {
      add(blockers, "blocker", id, "Missing imageUrl.");
      continue;
    }

    const asset = await assetExistsFor(deal.imageUrl);
    if (!asset) {
      add(warnings, "warning", id, `External or unknown image path: ${deal.imageUrl}`);
      continue;
    }

    if (!asset.ok) {
      add(blockers, "blocker", id, `Missing bundled image asset: ${asset.path}`);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    counts: {
      canonicalDeals: canonicalDeals.length,
      mobileDeals: mobileDeals.length,
      checkedImages: all.length,
    },
    blockers,
    warnings,
  };

  const markdown = `# CruiseKit Bundle Image Audit

Generated: ${report.generatedAt}

## Counts

| Metric | Count |
| --- | ---: |
| Canonical deals | ${report.counts.canonicalDeals} |
| Mobile deals | ${report.counts.mobileDeals} |
| Checked image references | ${report.counts.checkedImages} |

## Blockers

${markdownList(blockers)}
## Warnings

${markdownList(warnings)}
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-image-audit.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-image-audit.md"), markdown),
  ]);

  console.log(`Image audit: ${blockers.length} blocker(s), ${warnings.length} warning(s).`);
  console.log("Report written to data/reports/latest-image-audit.md");
  if (blockers.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
