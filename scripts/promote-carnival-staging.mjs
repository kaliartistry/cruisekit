#!/usr/bin/env node
/**
 * Promotes reviewed Carnival staging records into canonical seed data.
 *
 * This is the controlled "Move to Live" step. It only promotes records that
 * appeared in the latest review recommendation set unless explicit IDs are
 * supplied. Prices stay marked as check-required.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const defaultLimit = 40;

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function stringifyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function parseArgs(argv) {
  const args = {
    apply: false,
    limit: defaultLimit,
    ids: [],
    includePriceChanges: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    else if (arg === "--apply") args.apply = true;
    else if (arg === "--dry-run") args.apply = false;
    else if (arg === "--include-price-changes") args.includePriceChanges = true;
    else if (arg === "--limit") args.limit = Number.parseInt(argv[++index] ?? "", 10);
    else if (arg.startsWith("--limit=")) args.limit = Number.parseInt(arg.slice("--limit=".length), 10);
    else if (arg === "--ids") args.ids = parseIds(argv[++index] ?? "");
    else if (arg.startsWith("--ids=")) args.ids = parseIds(arg.slice("--ids=".length));
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isInteger(args.limit) || args.limit < 1) {
    throw new Error("--limit must be a positive integer.");
  }
  return args;
}

function parseIds(value) {
  return String(value)
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function printHelp() {
  console.log(`Usage:
  pnpm run data:promote:carnival -- --apply [--limit 40]
  pnpm run data:promote:carnival -- --apply --ids carnival-id-1,carnival-id-2

Options:
  --apply                  Write data/seed/sailings.json and promotion reports.
  --dry-run                Preview only. This is the default.
  --limit <n>              Promote top reviewed new candidates. Default: ${defaultLimit}.
  --ids <csv>              Promote specific staging IDs from latest review recommendations.
  --include-price-changes  Update matching seed records for flagged price changes.
`);
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

function portKey(value) {
  return normalize(value).replace(/\bfl\b|\btx\b|\bla\b|\bny\b|\bnj\b|\bca\b|\bwa\b|\bmd\b|\bva\b|\bal\b|\bsc\b|\bma\b|\bpr\b/g, "").trim();
}

function sanitizeItineraryPorts(record) {
  const departure = portKey(record.departurePort);
  const returning = portKey(record.returnPort);
  return (record.itineraryPorts ?? []).filter((port) => {
    const key = portKey(port);
    return key && key !== departure && key !== returning;
  });
}

function normalizePromotedRecord(record, promotedAt) {
  const confidence = "itinerary_verified_price_check_required";
  return {
    ...record,
    itineraryPorts: sanitizeItineraryPorts(record),
    confidence,
    source: {
      ...record.source,
      confidence,
      lastVerified: promotedAt.slice(0, 10),
      termsNotes:
        "Promoted from Carnival public cruise search staging. Price remains check-required; verify fare basis, taxes/fees, and availability near booking.",
    },
    lastVerified: promotedAt.slice(0, 10),
    createdAt: record.createdAt ?? promotedAt,
    updatedAt: promotedAt,
  };
}

function validateRecords(records, schema) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const errors = [];
  for (const record of records) {
    if (validate(record)) continue;
    errors.push({
      id: record.id,
      errors: validate.errors?.map((error) => `${error.instancePath || "/"} ${error.message}`) ?? [],
    });
  }
  return errors;
}

function buildSelection(args, review, stagedById) {
  const recommendedIds = new Set((review.recommendedNew ?? []).map((record) => record.id));
  const selectedIds = args.ids.length > 0 ? args.ids : [...recommendedIds].slice(0, args.limit);
  const missing = selectedIds.filter((id) => !stagedById.has(id));
  const notRecommended = selectedIds.filter((id) => !recommendedIds.has(id));

  if (missing.length > 0) {
    throw new Error(`Selected ID(s) were not found in latest staging: ${missing.join(", ")}`);
  }
  if (notRecommended.length > 0) {
    throw new Error(
      `Selected ID(s) are not in latest recommendedNew review set: ${notRecommended.join(", ")}. Re-run review or promote from recommended records only.`,
    );
  }

  return selectedIds.map((id) => stagedById.get(id));
}

function updatePriceChanges(seedRecords, review, stagedById, promotedAt) {
  const updates = [];
  const byKey = new Map(seedRecords.map((record, index) => [keyFor(record), { record, index }]));

  for (const change of review.priceChanges ?? []) {
    const staged = stagedById.get(change.staged.id);
    const match = staged ? byKey.get(keyFor(staged)) : null;
    if (!staged || !match) continue;
    const next = normalizePromotedRecord({ ...match.record, ...staged, id: match.record.id, createdAt: match.record.createdAt }, promotedAt);
    seedRecords[match.index] = next;
    updates.push({
      id: next.id,
      shipName: next.shipName,
      departureDate: next.departureDate,
      previousPrice: match.record.startingPrice,
      nextPrice: next.startingPrice,
    });
  }

  return updates;
}

function markdownReport(report) {
  const promotedRows =
    report.promoted.length === 0
      ? "- None\n"
      : [
          "| Ship | Date | Nights | Price | ID |",
          "| --- | --- | ---: | ---: | --- |",
          ...report.promoted.map(
            (record) =>
              `| ${record.shipName} | ${record.departureDate} | ${record.nights} | $${Math.round(record.startingPrice).toLocaleString("en-US")} | \`${record.id}\` |`,
          ),
        ].join("\n") + "\n";

  const updateRows =
    report.priceUpdates.length === 0
      ? "- None\n"
      : [
          "| Ship | Date | Previous | Next | ID |",
          "| --- | --- | ---: | ---: | --- |",
          ...report.priceUpdates.map(
            (record) =>
              `| ${record.shipName} | ${record.departureDate} | $${Math.round(record.previousPrice).toLocaleString("en-US")} | $${Math.round(record.nextPrice).toLocaleString("en-US")} | \`${record.id}\` |`,
          ),
        ].join("\n") + "\n";

  const alreadyLiveRows =
    report.skippedExisting.length === 0
      ? "- None\n"
      : [
          "| Ship | Date | Nights | Price | ID |",
          "| --- | --- | ---: | ---: | --- |",
          ...report.skippedExisting.map(
            (record) =>
              `| ${record.shipName} | ${record.departureDate} | ${record.nights ?? "n/a"} | $${Math.round(record.startingPrice).toLocaleString("en-US")} | \`${record.id}\` |`,
          ),
        ].join("\n") + "\n";

  return `# Carnival Promotion Report

Generated: ${report.generatedAt}

Mode: ${report.mode}

Source review: ${report.sourceReviewGeneratedAt}

## Counts

| Metric | Count |
| --- | ---: |
| Seed records before | ${report.counts.seedBefore} |
| Seed records after | ${report.counts.seedAfter} |
| Selected records already live | ${report.counts.skippedExisting} |
| Promoted new records | ${report.counts.promotedNew} |
| Price updates | ${report.counts.priceUpdates} |

## Promoted New Records

${promotedRows}
## Selected Records Already Live

${alreadyLiveRows}
## Price Updates

${updateRows}
## Notes

- Promoted records are live but remain \`itinerary_verified_price_check_required\`.
- Verify source links and current prices before featuring any deal in editorial placements.
- Run \`pnpm run data:publish\` after promotion to refresh web and mobile bundles.
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const promotedAt = new Date().toISOString();
  const [schema, seedRecords, importReport, review] = await Promise.all([
    loadJson("data/schema/sailing.schema.json"),
    loadJson("data/seed/sailings.json"),
    loadJson("data/reports/latest-carnival-staging-import.json"),
    loadJson("data/reports/latest-carnival-staging-review.json"),
  ]);
  const stagedRecords = JSON.parse(await readFile(resolve(repoRoot, importReport.paths.staging, "sailings.json"), "utf8"));
  const stagedById = new Map(stagedRecords.map((record) => [record.id, record]));
  const selectedRecords = buildSelection(args, review, stagedById);
  const existingIds = new Set(seedRecords.map((record) => record.id));
  const existingKeys = new Set(seedRecords.map(keyFor));
  const promoted = [];
  const skippedExisting = [];

  for (const record of selectedRecords) {
    const next = normalizePromotedRecord(record, promotedAt);
    if (existingIds.has(next.id) || existingKeys.has(keyFor(next))) {
      skippedExisting.push(next);
      continue;
    }
    promoted.push(next);
  }

  const nextSeed = [...seedRecords, ...promoted].sort((a, b) => {
    const lineCompare = a.cruiseLine.localeCompare(b.cruiseLine);
    if (lineCompare) return lineCompare;
    const dateCompare = a.departureDate.localeCompare(b.departureDate);
    if (dateCompare) return dateCompare;
    return a.shipName.localeCompare(b.shipName);
  });

  const priceUpdates = args.includePriceChanges ? updatePriceChanges(nextSeed, review, stagedById, promotedAt) : [];
  const validationErrors = validateRecords(nextSeed, schema);
  if (validationErrors.length > 0) {
    console.error(JSON.stringify(validationErrors, null, 2));
    throw new Error(`Promotion blocked by ${validationErrors.length} schema error(s).`);
  }

  const report = {
    generatedAt: promotedAt,
    provider: "carnival",
    mode: args.apply ? "apply" : "dry-run",
    sourceRunId: importReport.runId,
    sourceReviewGeneratedAt: review.generatedAt,
    options: args,
    counts: {
      seedBefore: seedRecords.length,
      seedAfter: nextSeed.length,
      promotedNew: promoted.length,
      skippedExisting: skippedExisting.length,
      priceUpdates: priceUpdates.length,
    },
    promoted: promoted.map((record) => ({
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
    })),
    skippedExisting: skippedExisting.map((record) => ({
      id: record.id,
      shipName: record.shipName,
      nights: record.nights,
      departureDate: record.departureDate,
      startingPrice: record.startingPrice,
    })),
    priceUpdates,
  };

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-carnival-promotion.json"), stringifyJson(report)),
    writeFile(resolve(reportDir, "latest-carnival-promotion.md"), markdownReport(report)),
  ]);

  if (args.apply) {
    await writeFile(resolve(repoRoot, "data/seed/sailings.json"), stringifyJson(nextSeed));
  }

  console.log(
    `Carnival promotion ${report.mode}: ${promoted.length} promoted, ${skippedExisting.length} skipped existing, ${priceUpdates.length} price update(s).`,
  );
  console.log("Report written to data/reports/latest-carnival-promotion.md");
  if (!args.apply) console.log("Dry run only. Re-run with --apply to update data/seed/sailings.json.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
