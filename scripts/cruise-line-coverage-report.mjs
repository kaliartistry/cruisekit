#!/usr/bin/env node
/**
 * Reports cruise-line coverage across seed, public, and mobile bundles.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");

const priorityLines = [
  "carnival",
  "royal-caribbean",
  "norwegian",
  "msc",
  "princess",
  "holland-america",
  "virgin-voyages",
  "azamara",
  "viking",
  "celebrity",
  "disney",
];

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function countByLine(records) {
  const counts = {};
  for (const record of records) {
    const line = record.cruiseLine ?? record.cruiseLineId ?? "unknown";
    counts[line] = (counts[line] ?? 0) + 1;
  }
  return counts;
}

function rowFor(line, seedCounts, publicCounts, mobileCounts) {
  return {
    cruiseLine: line,
    seed: seedCounts[line] ?? 0,
    public: publicCounts[line] ?? 0,
    mobile: mobileCounts[line] ?? 0,
    status:
      (publicCounts[line] ?? 0) > 0
        ? "public"
        : (seedCounts[line] ?? 0) > 0
          ? "seed-only"
          : "missing",
  };
}

async function main() {
  const [seedSailings, publicSailings, mobileSailings] = await Promise.all([
    loadJson("data/seed/sailings.json"),
    loadJson("data/bundles/canonical/sailings.json"),
    loadJson("data/bundles/mobile/sailings.json"),
  ]);

  const seedCounts = countByLine(seedSailings);
  const publicCounts = countByLine(publicSailings);
  const mobileCounts = countByLine(mobileSailings);
  const allLines = Array.from(
    new Set([
      ...priorityLines,
      ...Object.keys(seedCounts),
      ...Object.keys(publicCounts),
      ...Object.keys(mobileCounts),
    ]),
  ).sort((a, b) => {
    const ai = priorityLines.indexOf(a);
    const bi = priorityLines.indexOf(b);
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    return a.localeCompare(b);
  });

  const rows = allLines.map((line) => rowFor(line, seedCounts, publicCounts, mobileCounts));
  const missingPriority = rows.filter(
    (row) => priorityLines.includes(row.cruiseLine) && row.status === "missing",
  );
  const seedOnlyPriority = rows.filter(
    (row) => priorityLines.includes(row.cruiseLine) && row.status === "seed-only",
  );

  const report = {
    generatedAt: new Date().toISOString(),
    counts: {
      seedSailings: seedSailings.length,
      publicSailings: publicSailings.length,
      mobileSailings: mobileSailings.length,
      priorityLines: priorityLines.length,
      missingPriority: missingPriority.length,
      seedOnlyPriority: seedOnlyPriority.length,
    },
    rows,
    missingPriority,
    seedOnlyPriority,
  };

  const markdown = `# CruiseKit Cruise-Line Coverage Report

Generated: ${report.generatedAt}

## Summary

| Metric | Count |
| --- | ---: |
| Seed sailings | ${report.counts.seedSailings} |
| Public sailings | ${report.counts.publicSailings} |
| Mobile sailings | ${report.counts.mobileSailings} |
| Priority lines | ${report.counts.priorityLines} |
| Missing priority lines | ${report.counts.missingPriority} |
| Seed-only priority lines | ${report.counts.seedOnlyPriority} |

## Priority Gaps

${missingPriority.length === 0 ? "- None\n" : missingPriority.map((row) => `- Missing: ${row.cruiseLine}`).join("\n") + "\n"}
${seedOnlyPriority.length === 0 ? "" : seedOnlyPriority.map((row) => `- Seed-only: ${row.cruiseLine}`).join("\n") + "\n"}
## Coverage

| Cruise line | Seed | Public | Mobile | Status |
| --- | ---: | ---: | ---: | --- |
${rows.map((row) => `| ${row.cruiseLine} | ${row.seed} | ${row.public} | ${row.mobile} | ${row.status} |`).join("\n")}
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-cruise-line-coverage.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-cruise-line-coverage.md"), markdown),
  ]);

  console.log(
    `Coverage report: ${missingPriority.length} missing priority line(s), ${seedOnlyPriority.length} seed-only priority line(s).`,
  );
  console.log("Report written to data/reports/latest-cruise-line-coverage.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
