#!/usr/bin/env node
/**
 * Generic review tool for official-source cruise-line staging records.
 *
 * This is review-only. It does not modify data/seed/*.json.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");

const providerConfig = {
  azamara: {
    label: "Azamara",
    envLimit: "AZAMARA_REVIEW_LIMIT",
    defaultLimit: 20,
    maxPrice: 3000,
    preferredRegions: new Set(["mediterranean", "asia", "south-america", "panama-canal", "caribbean", "alaska"]),
  },
  "holland-america": {
    label: "Holland America",
    envLimit: "HOLLAND_AMERICA_REVIEW_LIMIT",
    defaultLimit: 20,
    maxPrice: 1800,
    preferredRegions: new Set(["mediterranean", "canada-new-england", "panama-canal", "australia-new-zealand", "caribbean", "alaska", "mexico"]),
  },
};

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function parseArgs(argv) {
  const args = { provider: "" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    if (arg === "--provider") args.provider = argv[++index] ?? "";
    else if (arg.startsWith("--provider=")) args.provider = arg.slice("--provider=".length);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!providerConfig[args.provider]) {
    throw new Error(`--provider must be one of: ${Object.keys(providerConfig).join(", ")}`);
  }
  return args;
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
    returnPort: record.returnPort,
    destinationRegion: record.destinationRegion,
    itineraryPorts: record.itineraryPorts,
    startingPrice: record.startingPrice,
    currency: record.currency,
    priceBasis: record.priceBasis,
    taxesAndFeesIncluded: record.taxesAndFeesIncluded,
    directLink: record.directLink,
    confidence: record.confidence,
  };
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

function hasUsablePorts(record) {
  return (
    record.departurePort &&
    record.returnPort &&
    record.departurePort !== "Review required" &&
    record.returnPort !== "Review required"
  );
}

function candidateScore(record, config) {
  let score = 0;
  if (config.preferredRegions.has(record.destinationRegion)) score += 4;
  if (record.destinationRegion === "caribbean" || record.destinationRegion === "bahamas") score += 2;
  if (record.destinationRegion === "mediterranean" || record.destinationRegion === "asia") score += 2;
  if (record.destinationRegion === "south-america" || record.destinationRegion === "panama-canal") score += 2;
  if (record.nights >= 5 && record.nights <= 8) score += 2;
  if (record.nights >= 9 && record.nights <= 12) score += 1;
  if (Number.isFinite(record.startingPrice) && record.startingPrice <= config.maxPrice) score += 3;
  if (Number.isFinite(record.startingPrice) && record.startingPrice <= config.maxPrice * 0.75) score += 1;
  if (record.itineraryPorts?.length > 0) score += 1;
  if (record.taxesAndFeesIncluded === true) score += 1;
  return score;
}

function markdownTable(rows) {
  if (rows.length === 0) return "- None\n";
  return [
    "| Ship | Date | Nights | Region | Price | Status | Link |",
    "| --- | --- | ---: | --- | ---: | --- | --- |",
    ...rows.map(
      (row) =>
        `| ${row.shipName} | ${row.departureDate} | ${row.nights} | ${row.destinationRegion} | ${dollar(row.startingPrice)} | ${row.status} | [source](${row.directLink}) |`,
    ),
  ].join("\n") + "\n";
}

async function main() {
  const { provider } = parseArgs(process.argv.slice(2));
  const config = providerConfig[provider];
  const maxRecommendations = Number.parseInt(process.env[config.envLimit] ?? String(config.defaultLimit), 10);
  const priceDeltaThreshold = Number.parseFloat(process.env.PRICE_DELTA_THRESHOLD ?? "0.15");
  const [seed, importReport] = await Promise.all([
    loadJson("data/seed/sailings.json"),
    loadJson(`data/reports/latest-${provider}-staging-import.json`),
  ]);
  const staged = JSON.parse(await readFile(resolve(repoRoot, importReport.paths.staging, "sailings.json"), "utf8"));
  const seedLine = seed.filter((record) => record.cruiseLine === provider);
  const seedByKey = new Map(seedLine.map((record) => [keyFor(record), record]));
  const stagedByKey = new Map(staged.map((record) => [keyFor(record), record]));

  const exactMatches = [];
  const priceChanges = [];
  const newCandidates = [];
  const missingRequiredFields = [];
  const missingFromStaging = [];

  for (const stagedRecord of staged) {
    const stagedIssue =
      !stagedRecord.directLink || !Number.isFinite(stagedRecord.startingPrice) || stagedRecord.currency !== "USD" || !hasUsablePorts(stagedRecord);
    if (stagedIssue) missingRequiredFields.push(stagedRecord);

    const seedRecord = seedByKey.get(keyFor(stagedRecord));
    if (!seedRecord) {
      newCandidates.push(stagedRecord);
      continue;
    }
    const delta = priceDelta(seedRecord.startingPrice, stagedRecord.startingPrice);
    const match = { key: keyFor(stagedRecord), seed: shortRecord(seedRecord), staged: shortRecord(stagedRecord), priceDelta: delta };
    exactMatches.push(match);
    if (delta != null && Math.abs(delta) >= priceDeltaThreshold) priceChanges.push(match);
  }

  for (const seedRecord of seedLine) {
    if (!stagedByKey.has(keyFor(seedRecord))) missingFromStaging.push(seedRecord);
  }

  const recommendedNew = newCandidates
    .filter((record) => record.directLink && Number.isFinite(record.startingPrice) && record.currency === "USD" && hasUsablePorts(record))
    .map((record) => ({ ...record, score: candidateScore(record, config) }))
    .sort((a, b) => b.score - a.score || a.startingPrice - b.startingPrice)
    .slice(0, maxRecommendations);

  const report = {
    generatedAt: new Date().toISOString(),
    provider,
    sourceRunId: importReport.runId,
    mode: "review-only",
    matchKey: "cruiseLine + normalized shipName + departureDate",
    thresholds: { priceDeltaThreshold, maxRecommendations },
    counts: {
      seedRecords: seedLine.length,
      stagedRecords: staged.length,
      exactMatches: exactMatches.length,
      priceChanges: priceChanges.length,
      newCandidates: newCandidates.length,
      missingRequiredFields: missingRequiredFields.length,
      missingFromStaging: missingFromStaging.length,
      recommendedNew: recommendedNew.length,
    },
    recommendedNew: recommendedNew.map(shortRecord),
    missingRequiredFields: missingRequiredFields.map(shortRecord),
    priceChanges: priceChanges.map((match) => ({ seed: match.seed, staged: match.staged, priceDelta: match.priceDelta })),
    missingFromStaging: missingFromStaging.map(shortRecord),
  };

  const markdown = `# ${config.label} Staging Review

Generated: ${report.generatedAt}

Mode: ${report.mode}

Source run: ${report.sourceRunId}

## Counts

| Metric | Count |
| --- | ---: |
| Seed records | ${report.counts.seedRecords} |
| Staged records | ${report.counts.stagedRecords} |
| Exact matches | ${report.counts.exactMatches} |
| Price changes above threshold | ${report.counts.priceChanges} |
| New candidates | ${report.counts.newCandidates} |
| Missing required promotion fields | ${report.counts.missingRequiredFields} |
| Missing from staging | ${report.counts.missingFromStaging} |
| Recommended new | ${report.counts.recommendedNew} |

## Recommended New Candidates

${markdownTable(recommendedNew.map((record) => ({ ...shortRecord(record), status: "new candidate" })))}
## Records Excluded From Promotion

${markdownTable(missingRequiredFields.slice(0, maxRecommendations).map((record) => ({ ...shortRecord(record), status: "missing required fields" })))}
## Price Changes To Review

${markdownTable(priceChanges.slice(0, maxRecommendations).map((match) => ({ ...match.staged, status: `${dollar(match.seed.startingPrice)} -> ${dollar(match.staged.startingPrice)} (${percent(match.priceDelta)})` })))}
## Promotion Rules

- Do not bulk-promote all staged records.
- Promote only records with USD pricing, source links, and real embark/debark ports.
- Keep promoted records at \`itinerary_verified_price_check_required\`.
- Recheck source links and current prices before featuring in editorial placements.
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, `latest-${provider}-staging-review.json`), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, `latest-${provider}-staging-review.md`), markdown),
  ]);
  console.log(`${config.label} staging review: ${newCandidates.length} new candidate(s), ${recommendedNew.length} recommended.`);
  console.log(`Report written to data/reports/latest-${provider}-staging-review.md`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
