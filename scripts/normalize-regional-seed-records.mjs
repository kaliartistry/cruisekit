#!/usr/bin/env node
/**
 * Reclassifies seed sailings currently parked in `other` when the itinerary
 * title, ports, or endpoints clearly map to a supported region bucket.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");

function stringifyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function parseArgs(argv) {
  const args = { apply: false };
  for (const arg of argv) {
    if (arg === "--") continue;
    if (arg === "--apply") args.apply = true;
    else if (arg === "--dry-run") args.apply = false;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function haystackFor(record) {
  return [
    record.sailingName,
    record.departurePort,
    record.returnPort,
    ...(record.itineraryPorts ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function inferRegion(record) {
  if (record.destinationRegion !== "other") return null;
  const text = haystackFor(record);

  if (/\bbermuda\b/.test(text)) {
    return { region: "bermuda", reason: "Bermuda appears in itinerary title or port list." };
  }
  if (/panama canal/.test(text)) {
    return { region: "panama-canal", reason: "Panama Canal appears in itinerary title or port list." };
  }
  if (/canada\s*&\s*new england|canada and new england|new brunswick/.test(text)) {
    return { region: "canada-new-england", reason: "Canada/New England appears in itinerary title or port list." };
  }
  if (/mexican riviera|sea of cortez/.test(text)) {
    return { region: "mexican-riviera", reason: "Mexican Riviera or Sea of Cortez appears in itinerary title." };
  }
  if (/california coast|pacific coastal|catalina island|santa barbara/.test(text)) {
    return { region: "california-coast", reason: "California coastal ports or itinerary title are present." };
  }
  if (/adriatic|croatia|greek isles|istanbul|piraeus|athens|trieste|venice/.test(text)) {
    return { region: "mediterranean", reason: "Mediterranean/Adriatic itinerary terms are present." };
  }
  if (/british isles|norwegian fjords|north cape|arctic crossing|brugge|falmouth|dover|rotterdam|amsterdam/.test(text)) {
    return { region: text.includes("fort lauderdale") ? "transatlantic" : "northern-europe", reason: "Northern Europe or transatlantic crossing terms are present." };
  }
  if (/whittier,\s*alaska|\balaska\b|glacier discovery/.test(text)) {
    return { region: "alaska", reason: "Alaska endpoint or Glacier Discovery itinerary is present." };
  }

  return null;
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
  const rows =
    report.changes.length === 0
      ? "- None\n"
      : [
          "| ID | Sailing | From | To | Reason |",
          "| --- | --- | --- | --- | --- |",
          ...report.changes.map((change) => `| \`${change.id}\` | ${change.sailingName} | ${change.from} | ${change.to} | ${change.reason} |`),
        ].join("\n") + "\n";
  const skipped =
    report.skippedOther.length === 0
      ? "- None\n"
      : report.skippedOther.map((record) => `- \`${record.id}\` - ${record.sailingName}`).join("\n") + "\n";

  return `# Regional Seed Normalization

Generated: ${report.generatedAt}

Mode: ${report.mode}

## Counts

| Metric | Count |
| --- | ---: |
| Seed records before | ${report.counts.seedRecords} |
| Records changed | ${report.counts.changed} |
| Remaining other records | ${report.counts.remainingOther} |

## Changes

${rows}
## Other Records Left Unchanged

${skipped}
## Notes

- Only records already marked \`other\` are eligible.
- Ambiguous records are left unchanged for Kali/manual review.
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const generatedAt = new Date().toISOString();
  const [schema, seedRecords] = await Promise.all([
    loadJson("data/schema/sailing.schema.json"),
    loadJson("data/seed/sailings.json"),
  ]);

  const changes = [];
  const nextRecords = seedRecords.map((record) => {
    const inferred = inferRegion(record);
    if (!inferred) return record;
    changes.push({
      id: record.id,
      sailingName: record.sailingName,
      from: record.destinationRegion,
      to: inferred.region,
      reason: inferred.reason,
    });
    return {
      ...record,
      destinationRegion: inferred.region,
      updatedAt: generatedAt,
    };
  });

  const validationErrors = validateRecords(nextRecords, schema);
  if (validationErrors.length > 0) {
    console.error(JSON.stringify(validationErrors, null, 2));
    throw new Error(`Regional normalization blocked by ${validationErrors.length} schema error(s).`);
  }

  const skippedOther = nextRecords
    .filter((record) => record.destinationRegion === "other")
    .map((record) => ({
      id: record.id,
      sailingName: record.sailingName,
      cruiseLine: record.cruiseLine,
      shipName: record.shipName,
      departureDate: record.departureDate,
    }));

  const report = {
    generatedAt,
    mode: args.apply ? "apply" : "dry-run",
    counts: {
      seedRecords: seedRecords.length,
      changed: changes.length,
      remainingOther: skippedOther.length,
    },
    changes,
    skippedOther,
  };

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-regional-normalization.json"), stringifyJson(report)),
    writeFile(resolve(reportDir, "latest-regional-normalization.md"), markdownReport(report)),
  ]);

  if (args.apply) {
    await writeFile(resolve(repoRoot, "data/seed/sailings.json"), stringifyJson(nextRecords));
  }

  console.log(`Regional normalization ${report.mode}: ${changes.length} changed, ${skippedOther.length} remaining other.`);
  console.log("Report written to data/reports/latest-regional-normalization.md");
  if (!args.apply) console.log("Dry run only. Re-run with --apply to update data/seed/sailings.json.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
