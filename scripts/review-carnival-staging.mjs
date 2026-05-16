#!/usr/bin/env node
/**
 * Compares the latest Carnival staging import with canonical seed records.
 *
 * This is a review tool only. It does not modify data/seed/*.json.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const priceDeltaThreshold = Number.parseFloat(process.env.PRICE_DELTA_THRESHOLD ?? "0.15");
const maxRecommendations = Number.parseInt(process.env.CARNIVAL_REVIEW_LIMIT ?? "40", 10);

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function keyFor(record) {
  return `${record.cruiseLine}:${normalize(record.shipName)}:${record.departureDate}`;
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function priceDelta(seedPrice, stagedPrice) {
  if (!Number.isFinite(seedPrice) || !Number.isFinite(stagedPrice) || seedPrice <= 0) return null;
  return (stagedPrice - seedPrice) / seedPrice;
}

function dollar(value) {
  if (!Number.isFinite(value)) return "n/a";
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function percent(value) {
  if (!Number.isFinite(value)) return "n/a";
  return `${value > 0 ? "+" : ""}${Math.round(value * 100)}%`;
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

function candidateScore(record) {
  let score = 0;
  if (record.destinationRegion === "caribbean") score += 3;
  if (record.nights >= 4 && record.nights <= 8) score += 2;
  if (record.startingPrice != null && record.startingPrice <= 600) score += 3;
  if (record.startingPrice != null && record.startingPrice <= 400) score += 2;
  if (record.departureDate >= "2026-07-01") score += 1;
  return score;
}

function markdownTable(rows) {
  if (rows.length === 0) return "- None\n";
  const lines = [
    "| Ship | Date | Nights | Price | Status | Link |",
    "| --- | --- | ---: | ---: | --- | --- |",
  ];
  for (const row of rows) {
    lines.push(
      `| ${row.shipName} | ${row.departureDate} | ${row.nights} | ${dollar(row.startingPrice)} | ${row.status} | [source](${row.directLink}) |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const [seed, importReport] = await Promise.all([
    loadJson("data/seed/sailings.json"),
    loadJson("data/reports/latest-carnival-staging-import.json"),
  ]);
  const staged = JSON.parse(await readFile(resolve(repoRoot, importReport.paths.staging, "sailings.json"), "utf8"));

  const seedCarnival = seed.filter((record) => record.cruiseLine === "carnival");
  const seedByKey = new Map(seedCarnival.map((record) => [keyFor(record), record]));
  const stagedByKey = new Map(staged.map((record) => [keyFor(record), record]));

  const exactMatches = [];
  const hiddenMatches = [];
  const priceChanges = [];
  const newCandidates = [];
  const missingFromStaging = [];

  for (const stagedRecord of staged) {
    const seedRecord = seedByKey.get(keyFor(stagedRecord));
    if (!seedRecord) {
      newCandidates.push(stagedRecord);
      continue;
    }

    const delta = priceDelta(seedRecord.startingPrice, stagedRecord.startingPrice);
    const match = {
      key: keyFor(stagedRecord),
      seed: shortRecord(seedRecord),
      staged: shortRecord(stagedRecord),
      priceDelta: delta,
    };
    exactMatches.push(match);
    if (seedRecord.confidence === "internal_do_not_publish") hiddenMatches.push(match);
    if (delta != null && Math.abs(delta) >= priceDeltaThreshold) priceChanges.push(match);
  }

  for (const seedRecord of seedCarnival) {
    if (!stagedByKey.has(keyFor(seedRecord))) missingFromStaging.push(seedRecord);
  }

  const recommendedNew = newCandidates
    .filter((record) => record.directLink && record.startingPrice != null)
    .map((record) => ({ ...record, score: candidateScore(record) }))
    .sort((a, b) => b.score - a.score || a.startingPrice - b.startingPrice)
    .slice(0, maxRecommendations);

  const reviewRows = recommendedNew.map((record) => ({
    ...shortRecord(record),
    status: "new candidate",
  }));

  const hiddenRows = hiddenMatches.slice(0, maxRecommendations).map((match) => ({
    ...match.staged,
    status: `hidden seed match, staged ${dollar(match.staged.startingPrice)}`,
  }));

  const priceRows = priceChanges.slice(0, maxRecommendations).map((match) => ({
    ...match.staged,
    status: `${dollar(match.seed.startingPrice)} -> ${dollar(match.staged.startingPrice)} (${percent(match.priceDelta)})`,
  }));

  const report = {
    generatedAt: new Date().toISOString(),
    provider: "carnival",
    sourceRunId: importReport.runId,
    mode: "review-only",
    matchKey: "cruiseLine + normalized shipName + departureDate",
    thresholds: {
      priceDeltaThreshold,
      maxRecommendations,
    },
    counts: {
      seedCarnival: seedCarnival.length,
      stagedCarnival: staged.length,
      exactMatches: exactMatches.length,
      hiddenMatches: hiddenMatches.length,
      priceChanges: priceChanges.length,
      newCandidates: newCandidates.length,
      missingFromStaging: missingFromStaging.length,
      recommendedNew: recommendedNew.length,
    },
    recommendedNew: recommendedNew.map(shortRecord),
    hiddenMatches: hiddenMatches.map((match) => ({
      seed: match.seed,
      staged: match.staged,
      priceDelta: match.priceDelta,
    })),
    priceChanges: priceChanges.map((match) => ({
      seed: match.seed,
      staged: match.staged,
      priceDelta: match.priceDelta,
    })),
    missingFromStaging: missingFromStaging.map(shortRecord),
  };

  const markdown = `# Carnival Staging Review

Generated: ${report.generatedAt}

Mode: ${report.mode}

Source run: ${report.sourceRunId}

Match key: ${report.matchKey}

## Counts

| Metric | Count |
| --- | ---: |
| Seed Carnival records | ${report.counts.seedCarnival} |
| Staged Carnival records | ${report.counts.stagedCarnival} |
| Exact matches | ${report.counts.exactMatches} |
| Hidden seed matches | ${report.counts.hiddenMatches} |
| Price changes above threshold | ${report.counts.priceChanges} |
| New candidates | ${report.counts.newCandidates} |
| Missing from staging | ${report.counts.missingFromStaging} |

## Recommended New Candidates

${markdownTable(reviewRows)}
## Hidden Seed Matches To Recheck

${markdownTable(hiddenRows)}
## Price Changes To Review

${markdownTable(priceRows)}
## Promotion Rules

- Do not bulk-promote all staged records.
- Open the source link and verify exact ship, date, duration, itinerary, price basis, and taxes/fees language.
- Promote only a curated subset likely to be useful for users.
- Keep promoted Carnival records at \`itinerary_verified_price_check_required\` unless the price is manually verified at publish time.
- Keep uncertain records hidden with \`internal_do_not_publish\`.
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-carnival-staging-review.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-carnival-staging-review.md"), markdown),
  ]);

  console.log(`Carnival staging review: ${newCandidates.length} new candidate(s), ${exactMatches.length} exact match(es), ${priceChanges.length} price change(s).`);
  console.log("Report written to data/reports/latest-carnival-staging-review.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
