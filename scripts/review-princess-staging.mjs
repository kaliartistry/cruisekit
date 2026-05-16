#!/usr/bin/env node
/**
 * Compares the latest Princess staging import with canonical seed records.
 * Review only; does not modify data/seed/*.json.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const maxRecommendations = Number.parseInt(process.env.PRINCESS_REVIEW_LIMIT ?? "50", 10);

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
    startingPrice: record.startingPrice,
    directLink: record.directLink,
    confidence: record.confidence,
  };
}

function candidateScore(record) {
  let score = 0;
  if (record.destinationRegion === "caribbean" || record.destinationRegion === "bahamas") score += 3;
  if (record.destinationRegion === "mexico" || record.destinationRegion === "alaska") score += 2;
  if (record.nights >= 5 && record.nights <= 8) score += 2;
  if (record.departureDate >= "2026-07-01") score += 1;
  if (record.startingPrice == null) score -= 2;
  return score;
}

function dollar(value) {
  if (!Number.isFinite(value)) return "price check";
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function markdownTable(rows) {
  if (rows.length === 0) return "- None\n";
  return [
    "| Ship | Date | Nights | Port | Region | Price | Status | Link |",
    "| --- | --- | ---: | --- | --- | ---: | --- | --- |",
    ...rows.map(
      (row) =>
        `| ${row.shipName} | ${row.departureDate} | ${row.nights} | ${row.departurePort} | ${row.destinationRegion} | ${dollar(row.startingPrice)} | ${row.status} | [source](${row.directLink}) |`,
    ),
  ].join("\n") + "\n";
}

async function main() {
  const [seed, importReport] = await Promise.all([
    loadJson("data/seed/sailings.json"),
    loadJson("data/reports/latest-princess-staging-import.json"),
  ]);
  const staged = JSON.parse(await readFile(resolve(repoRoot, importReport.paths.staging, "sailings.json"), "utf8"));
  const seedPrincess = seed.filter((record) => record.cruiseLine === "princess");
  const seedByKey = new Map(seedPrincess.map((record) => [keyFor(record), record]));
  const stagedByKey = new Map(staged.map((record) => [keyFor(record), record]));

  const exactMatches = [];
  const hiddenMatches = [];
  const newCandidates = [];
  const missingFromStaging = [];

  for (const stagedRecord of staged) {
    const seedRecord = seedByKey.get(keyFor(stagedRecord));
    if (!seedRecord) {
      newCandidates.push(stagedRecord);
      continue;
    }
    const match = { key: keyFor(stagedRecord), seed: shortRecord(seedRecord), staged: shortRecord(stagedRecord) };
    exactMatches.push(match);
    if (seedRecord.confidence === "internal_do_not_publish") hiddenMatches.push(match);
  }

  for (const seedRecord of seedPrincess) {
    if (!stagedByKey.has(keyFor(seedRecord))) missingFromStaging.push(seedRecord);
  }

  const recommendedNew = newCandidates
    .map((record) => ({ ...record, score: candidateScore(record) }))
    .sort((a, b) => b.score - a.score || a.departureDate.localeCompare(b.departureDate))
    .slice(0, maxRecommendations);

  const report = {
    generatedAt: new Date().toISOString(),
    provider: "princess",
    sourceRunId: importReport.runId,
    mode: "review-only",
    matchKey: "cruiseLine + normalized shipName + departureDate",
    thresholds: { maxRecommendations },
    counts: {
      seedPrincess: seedPrincess.length,
      stagedPrincess: staged.length,
      exactMatches: exactMatches.length,
      hiddenMatches: hiddenMatches.length,
      newCandidates: newCandidates.length,
      missingFromStaging: missingFromStaging.length,
      recommendedNew: recommendedNew.length,
      priceCheckRequired: staged.filter((record) => record.startingPrice == null).length,
    },
    recommendedNew: recommendedNew.map(shortRecord),
    hiddenMatches: hiddenMatches.map((match) => ({ seed: match.seed, staged: match.staged })),
    missingFromStaging: missingFromStaging.map(shortRecord),
  };

  const markdown = `# Princess Staging Review

Generated: ${report.generatedAt}

Mode: ${report.mode}

Source run: ${report.sourceRunId}

## Counts

| Metric | Count |
| --- | ---: |
| Seed Princess records | ${report.counts.seedPrincess} |
| Staged Princess records | ${report.counts.stagedPrincess} |
| Exact matches | ${report.counts.exactMatches} |
| Hidden seed matches | ${report.counts.hiddenMatches} |
| New candidates | ${report.counts.newCandidates} |
| Missing from staging | ${report.counts.missingFromStaging} |
| Price check required | ${report.counts.priceCheckRequired} |

## Recommended Inventory Candidates

${markdownTable(recommendedNew.map((record) => ({ ...shortRecord(record), status: "price check required" })))}
## Promotion Rules

- Do not bulk-promote all staged records.
- Open the source link and verify exact ship, date, duration, itinerary, current fare, price basis, package inclusions, and taxes/fees language.
- Keep promoted Princess records at \`itinerary_verified_price_check_required\` unless the price is manually verified at publish time.
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-princess-staging-review.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-princess-staging-review.md"), markdown),
  ]);
  console.log(`Princess staging review: ${newCandidates.length} new candidate(s), ${exactMatches.length} exact match(es), ${report.counts.priceCheckRequired} price check(s).`);
  console.log("Report written to data/reports/latest-princess-staging-review.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
