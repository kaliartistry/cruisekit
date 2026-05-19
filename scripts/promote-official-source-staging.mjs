#!/usr/bin/env node
/**
 * Generic controlled "Move to Live" step for reviewed official-source records.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const providerLabels = {
  azamara: "Azamara",
  "holland-america": "Holland America",
};

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function stringifyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function parseArgs(argv) {
  const args = { provider: "", apply: false, limit: 10, ids: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    if (arg === "--provider") args.provider = argv[++index] ?? "";
    else if (arg.startsWith("--provider=")) args.provider = arg.slice("--provider=".length);
    else if (arg === "--apply") args.apply = true;
    else if (arg === "--dry-run") args.apply = false;
    else if (arg === "--limit") args.limit = Number.parseInt(argv[++index] ?? "", 10);
    else if (arg.startsWith("--limit=")) args.limit = Number.parseInt(arg.slice("--limit=".length), 10);
    else if (arg === "--ids") args.ids = parseIds(argv[++index] ?? "");
    else if (arg.startsWith("--ids=")) args.ids = parseIds(arg.slice("--ids=".length));
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!providerLabels[args.provider]) throw new Error(`--provider must be one of: ${Object.keys(providerLabels).join(", ")}`);
  if (!Number.isInteger(args.limit) || args.limit < 1) throw new Error("--limit must be a positive integer.");
  return args;
}

function parseIds(value) {
  return String(value).split(",").map((id) => id.trim()).filter(Boolean);
}

function normalize(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function keyFor(record) {
  return `${record.cruiseLine}:${normalize(record.shipName)}:${record.departureDate}`;
}

function normalizePromotedRecord(record, promotedAt) {
  const confidence = "itinerary_verified_price_check_required";
  return {
    ...record,
    confidence,
    source: {
      ...record.source,
      confidence,
      lastVerified: promotedAt.slice(0, 10),
      termsNotes:
        "Promoted from official-source staging. Price remains check-required; verify fare basis, taxes/fees, source link, and availability near booking.",
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
    errors.push({ id: record.id, errors: validate.errors?.map((error) => `${error.instancePath || "/"} ${error.message}`) ?? [] });
  }
  return errors;
}

function markdownReport(report) {
  const promotedRows =
    report.promoted.length === 0
      ? "- None\n"
      : [
          "| Ship | Date | Nights | Region | Price | ID |",
          "| --- | --- | ---: | --- | ---: | --- |",
          ...report.promoted.map(
            (record) =>
              `| ${record.shipName} | ${record.departureDate} | ${record.nights} | ${record.destinationRegion} | $${Math.round(record.startingPrice).toLocaleString("en-US")} | \`${record.id}\` |`,
          ),
        ].join("\n") + "\n";
  const alreadyLive =
    report.skippedExisting.length === 0
      ? "- None\n"
      : report.skippedExisting.map((record) => `- ${record.shipName} ${record.departureDate} (${record.id})`).join("\n") + "\n";

  return `# ${report.label} Promotion Report

Generated: ${report.generatedAt}

Mode: ${report.mode}

Source review: ${report.sourceReviewGeneratedAt}

## Counts

| Metric | Count |
| --- | ---: |
| Seed records before | ${report.counts.seedBefore} |
| Seed records after | ${report.counts.seedAfter} |
| Promoted new records | ${report.counts.promotedNew} |
| Selected records already live | ${report.counts.skippedExisting} |

## Promoted New Records

${promotedRows}
## Selected Records Already Live

${alreadyLive}
## Notes

- Promoted records remain \`itinerary_verified_price_check_required\`.
- Run \`pnpm run data:publish\` after promotion to refresh web and mobile bundles.
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const promotedAt = new Date().toISOString();
  const [schema, seedRecords, importReport, review] = await Promise.all([
    loadJson("data/schema/sailing.schema.json"),
    loadJson("data/seed/sailings.json"),
    loadJson(`data/reports/latest-${args.provider}-staging-import.json`),
    loadJson(`data/reports/latest-${args.provider}-staging-review.json`),
  ]);
  const stagedRecords = JSON.parse(await readFile(resolve(repoRoot, importReport.paths.staging, "sailings.json"), "utf8"));
  const stagedById = new Map(stagedRecords.map((record) => [record.id, record]));
  const recommendedIds = new Set((review.recommendedNew ?? []).map((record) => record.id));
  const selectedIds = args.ids.length > 0 ? args.ids : [...recommendedIds].slice(0, args.limit);
  const missing = selectedIds.filter((id) => !stagedById.has(id));
  const notRecommended = selectedIds.filter((id) => !recommendedIds.has(id));
  if (missing.length > 0) throw new Error(`Selected ID(s) were not found in latest staging: ${missing.join(", ")}`);
  if (notRecommended.length > 0) throw new Error(`Selected ID(s) are not in latest recommendedNew review set: ${notRecommended.join(", ")}`);

  const existingIds = new Set(seedRecords.map((record) => record.id));
  const existingKeys = new Set(seedRecords.map(keyFor));
  const promoted = [];
  const skippedExisting = [];
  for (const id of selectedIds) {
    const next = normalizePromotedRecord(stagedById.get(id), promotedAt);
    if (existingIds.has(next.id) || existingKeys.has(keyFor(next))) skippedExisting.push(next);
    else promoted.push(next);
  }

  const nextSeed = [...seedRecords, ...promoted].sort((a, b) => {
    const line = a.cruiseLine.localeCompare(b.cruiseLine);
    if (line) return line;
    const date = a.departureDate.localeCompare(b.departureDate);
    if (date) return date;
    return a.shipName.localeCompare(b.shipName);
  });
  const validationErrors = validateRecords(nextSeed, schema);
  if (validationErrors.length > 0) {
    console.error(JSON.stringify(validationErrors, null, 2));
    throw new Error(`Promotion blocked by ${validationErrors.length} schema error(s).`);
  }

  const label = providerLabels[args.provider];
  const report = {
    generatedAt: promotedAt,
    provider: args.provider,
    label,
    mode: args.apply ? "apply" : "dry-run",
    sourceRunId: importReport.runId,
    sourceReviewGeneratedAt: review.generatedAt,
    options: args,
    counts: {
      seedBefore: seedRecords.length,
      seedAfter: nextSeed.length,
      promotedNew: promoted.length,
      skippedExisting: skippedExisting.length,
    },
    promoted: promoted.map((record) => ({
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
      directLink: record.directLink,
      confidence: record.confidence,
    })),
    skippedExisting: skippedExisting.map((record) => ({
      id: record.id,
      shipName: record.shipName,
      departureDate: record.departureDate,
      startingPrice: record.startingPrice,
    })),
  };

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, `latest-${args.provider}-promotion.json`), stringifyJson(report)),
    writeFile(resolve(reportDir, `latest-${args.provider}-promotion.md`), markdownReport(report)),
  ]);
  if (args.apply) await writeFile(resolve(repoRoot, "data/seed/sailings.json"), stringifyJson(nextSeed));

  console.log(`${label} promotion ${report.mode}: ${promoted.length} promoted, ${skippedExisting.length} skipped existing.`);
  console.log(`Report written to data/reports/latest-${args.provider}-promotion.md`);
  if (!args.apply) console.log("Dry run only. Re-run with --apply to update data/seed/sailings.json.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
