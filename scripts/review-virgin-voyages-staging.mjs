#!/usr/bin/env node
/**
 * Compares latest Virgin Voyages staging import with canonical seed records.
 * Review only; does not modify data/seed/*.json.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const maxRecommendations = Number.parseInt(process.env.VIRGIN_REVIEW_LIMIT ?? "24", 10);

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function normalize(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function keyFor(record) {
  return `${record.cruiseLine}:${normalize(record.shipName)}:${record.departureDate}`;
}

function shortRecord(record) {
  return {
    id: record.id,
    shipName: record.shipName,
    sailingName: record.sailingName,
    departureDate: record.departureDate,
    returnDate: record.returnDate,
    nights: record.nights,
    departurePort: record.departurePort,
    destinationRegion: record.destinationRegion,
    itineraryPorts: record.itineraryPorts,
    startingPrice: record.startingPrice,
    directLink: record.directLink,
    confidence: record.confidence,
  };
}

function dollar(value) {
  if (!Number.isFinite(value)) return "n/a";
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function candidateScore(record) {
  let score = 0;
  if (record.destinationRegion === "caribbean" || record.destinationRegion === "bahamas") score += 3;
  if (record.destinationRegion === "mediterranean") score += 2;
  if (record.nights >= 4 && record.nights <= 8) score += 2;
  if (record.startingPrice != null && record.startingPrice <= 2600) score += 3;
  if (record.departureDate >= "2026-06-01") score += 1;
  return score;
}

function markdownTable(rows) {
  if (rows.length === 0) return "- None\n";
  return [
    "| Ship | Date | Nights | Price | Region | Link |",
    "| --- | --- | ---: | ---: | --- | --- |",
    ...rows.map((row) => `| ${row.shipName} | ${row.departureDate} | ${row.nights} | ${dollar(row.startingPrice)} | ${row.destinationRegion} | [source](${row.directLink}) |`),
  ].join("\n") + "\n";
}

async function main() {
  const [seed, importReport] = await Promise.all([
    loadJson("data/seed/sailings.json"),
    loadJson("data/reports/latest-virgin-voyages-staging-import.json"),
  ]);
  const staged = JSON.parse(await readFile(resolve(repoRoot, importReport.paths.staging, "sailings.json"), "utf8"));
  const seedVirgin = seed.filter((record) => record.cruiseLine === "virgin-voyages");
  const seedByKey = new Map(seedVirgin.map((record) => [keyFor(record), record]));

  const exactMatches = [];
  const newCandidates = [];
  for (const stagedRecord of staged) {
    const seedRecord = seedByKey.get(keyFor(stagedRecord));
    if (seedRecord) exactMatches.push({ seed: shortRecord(seedRecord), staged: shortRecord(stagedRecord) });
    else newCandidates.push(stagedRecord);
  }

  const recommendedNew = newCandidates
    .filter((record) => record.directLink && record.startingPrice != null)
    .map((record) => ({ ...record, score: candidateScore(record) }))
    .sort((a, b) => b.score - a.score || a.startingPrice - b.startingPrice)
    .slice(0, maxRecommendations);

  const report = {
    generatedAt: new Date().toISOString(),
    provider: "virgin-voyages",
    sourceRunId: importReport.runId,
    mode: "review-only",
    matchKey: "cruiseLine + normalized shipName + departureDate",
    thresholds: { maxRecommendations },
    counts: {
      seedVirgin: seedVirgin.length,
      stagedVirgin: staged.length,
      exactMatches: exactMatches.length,
      newCandidates: newCandidates.length,
      recommendedNew: recommendedNew.length,
    },
    recommendedNew: recommendedNew.map(shortRecord),
    exactMatches,
  };

  const markdown = `# Virgin Voyages Staging Review

Generated: ${report.generatedAt}

Mode: ${report.mode}

Source run: ${report.sourceRunId}

## Counts

| Metric | Count |
| --- | ---: |
| Seed Virgin records | ${report.counts.seedVirgin} |
| Staged Virgin records | ${report.counts.stagedVirgin} |
| Exact matches | ${report.counts.exactMatches} |
| New candidates | ${report.counts.newCandidates} |
| Recommended new | ${report.counts.recommendedNew} |

## Recommended New Candidates

${markdownTable(recommendedNew.map(shortRecord))}
## Promotion Rules

- Do not bulk-promote all staged records.
- Open the source link and verify exact ship, date, duration, itinerary, cabin category, price basis, promotional terms, and taxes/fees language.
- Keep promoted Virgin records at \`itinerary_verified_price_check_required\` unless the price is manually verified at publish time.
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-virgin-voyages-staging-review.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-virgin-voyages-staging-review.md"), markdown),
  ]);
  console.log(`Virgin Voyages staging review: ${newCandidates.length} new candidate(s), ${exactMatches.length} exact match(es).`);
  console.log("Report written to data/reports/latest-virgin-voyages-staging-review.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
