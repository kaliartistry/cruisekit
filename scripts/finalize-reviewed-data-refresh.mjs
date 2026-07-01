#!/usr/bin/env node
/**
 * Finalizes a reviewed source refresh after provider promotion scripts run.
 *
 * It only uses latest staging-review exact matches to refresh existing seed
 * records, then hides still-stale public records so production never treats old
 * fare checks as current.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { currentUtcDateOnly, dateOnly, daysBetween, formatDateOnly } from "./lib/date.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const providers = ["azamara", "carnival", "holland-america", "norwegian", "virgin-voyages"];

function parseArgs(argv) {
  const args = {
    apply: false,
    maxPublicAgeDays: Number.parseInt(process.env.CRUISEKIT_MAX_PUBLIC_DATA_AGE_DAYS ?? "7", 10),
    maxPriceDelta: Number.parseFloat(process.env.CRUISEKIT_MAX_EXACT_PRICE_DELTA ?? "0.5"),
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    if (arg === "--apply") args.apply = true;
    else if (arg === "--dry-run") args.apply = false;
    else if (arg === "--max-public-age-days") args.maxPublicAgeDays = Number.parseInt(argv[++index] ?? "", 10);
    else if (arg.startsWith("--max-public-age-days=")) {
      args.maxPublicAgeDays = Number.parseInt(arg.slice("--max-public-age-days=".length), 10);
    } else if (arg === "--max-price-delta") args.maxPriceDelta = Number.parseFloat(argv[++index] ?? "");
    else if (arg.startsWith("--max-price-delta=")) {
      args.maxPriceDelta = Number.parseFloat(arg.slice("--max-price-delta=".length));
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!Number.isInteger(args.maxPublicAgeDays) || args.maxPublicAgeDays < 1) {
    throw new Error("--max-public-age-days must be a positive integer.");
  }
  if (!Number.isFinite(args.maxPriceDelta) || args.maxPriceDelta <= 0) {
    throw new Error("--max-price-delta must be a positive number.");
  }
  return args;
}

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

async function loadOptionalJson(relPath) {
  try {
    return await loadJson(relPath);
  } catch {
    return null;
  }
}

function stringifyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function keyFor(record) {
  return `${record.cruiseLine}:${normalize(record.shipName)}:${record.departureDate}:${record.nights}`;
}

function publicAndFuture(record, today) {
  if (record.confidence === "internal_do_not_publish") return false;
  const departureDate = dateOnly(record.departureDate);
  return departureDate !== null && departureDate >= today;
}

function ageDays(record, today) {
  const verifiedDate = dateOnly(record.lastVerified);
  if (!verifiedDate) return null;
  return daysBetween(verifiedDate, today);
}

function refreshExistingRecord(existing, staged, refreshedAt) {
  const confidence = "itinerary_verified_price_check_required";
  const lastVerified = staged.lastVerified ?? formatDateOnly(refreshedAt);
  return {
    ...existing,
    ...staged,
    id: existing.id,
    confidence,
    source: {
      ...staged.source,
      confidence,
      lastVerified,
      termsNotes:
        staged.source?.termsNotes ??
        "Refreshed from current reviewed staging. Price remains check-required; verify fare basis, taxes/fees, source link, and availability near booking.",
    },
    lastVerified,
    createdAt: existing.createdAt ?? staged.createdAt,
    updatedAt: refreshedAt.toISOString(),
  };
}

function hideStaleRecord(record, refreshedAt, reason) {
  const hiddenDate = formatDateOnly(refreshedAt);
  return {
    ...record,
    confidence: "internal_do_not_publish",
    source: {
      ...record.source,
      confidence: "internal_do_not_publish",
      termsNotes: `Hidden ${hiddenDate}: ${reason}`,
    },
    updatedAt: refreshedAt.toISOString(),
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

function priceDelta(previousPrice, currentPrice) {
  if (!Number.isFinite(previousPrice) || !Number.isFinite(currentPrice) || previousPrice <= 0) return null;
  return (currentPrice - previousPrice) / previousPrice;
}

function markdownTable(rows, headers, rowFn) {
  if (rows.length === 0) return "- None\n";
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map(rowFn),
  ].join("\n") + "\n";
}

function markdownReport(report) {
  const refreshedRows = markdownTable(
    report.refreshed.slice(0, 80),
    ["Provider", "Ship", "Date", "Previous", "Current", "ID"],
    (record) =>
      `| ${record.provider} | ${record.shipName} | ${record.departureDate} | ${record.previousPrice ?? "n/a"} | ${record.currentPrice ?? "n/a"} | \`${record.id}\` |`,
  );
  const hiddenRows = markdownTable(
    report.hidden.slice(0, 80),
    ["Provider", "Ship", "Date", "Last check", "Reason", "ID"],
    (record) =>
      `| ${record.provider} | ${record.shipName} | ${record.departureDate} | ${record.lastVerified ?? "n/a"} | ${record.reason} | \`${record.id}\` |`,
  );
  return `# Reviewed Data Refresh Finalization

Generated: ${report.generatedAt}

Mode: ${report.mode}

Current date: ${report.currentDate}

## Counts

| Metric | Count |
| --- | ---: |
| Seed records before | ${report.counts.seedBefore} |
| Seed records after | ${report.counts.seedAfter} |
| Refreshed existing records | ${report.counts.refreshed} |
| Refreshed records with price changes | ${report.counts.priceChanges} |
| Hidden stale public records | ${report.counts.hidden} |
| Ambiguous exact matches skipped | ${report.counts.ambiguousMatches} |
| Missing review reports | ${report.counts.missingReviewReports} |

## Refreshed Existing Records

${refreshedRows}
## Hidden Stale Public Records

${hiddenRows}
## Ambiguous Exact Matches Skipped

${report.ambiguousMatches.length === 0 ? "- None\n" : report.ambiguousMatches.map((match) => `- ${match.provider}: ${match.id} - ${match.reason}`).join("\n") + "\n"}
## Missing Review Reports

${report.missingReviewReports.length === 0 ? "- None\n" : report.missingReviewReports.map((provider) => `- ${provider}`).join("\n") + "\n"}
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const refreshedAt = new Date();
  const today = currentUtcDateOnly();
  const [schema, seedRecords] = await Promise.all([
    loadJson("data/schema/sailing.schema.json"),
    loadJson("data/seed/sailings.json"),
  ]);
  const nextSeed = structuredClone(seedRecords);
  const seedByKey = new Map(nextSeed.map((record, index) => [keyFor(record), { record, index }]));
  const refreshed = [];
  const ambiguousMatches = [];
  const missingReviewReports = [];

  for (const provider of providers) {
    const [importReport, review] = await Promise.all([
      loadOptionalJson(`data/reports/latest-${provider}-staging-import.json`),
      loadOptionalJson(`data/reports/latest-${provider}-staging-review.json`),
    ]);
    if (!importReport || !review) {
      missingReviewReports.push(provider);
      continue;
    }
    if (!importReport.paths?.staging) continue;
    const stagedRecords = JSON.parse(await readFile(resolve(repoRoot, importReport.paths.staging, "sailings.json"), "utf8"));
    const stagedByKey = new Map();
    for (const record of stagedRecords) {
      const key = keyFor(record);
      const rows = stagedByKey.get(key) ?? [];
      rows.push(record);
      stagedByKey.set(key, rows);
    }

    for (const [key, seedMatch] of [...seedByKey.entries()]) {
      if (seedMatch.record.cruiseLine !== provider) continue;
      if (seedMatch.record.confidence === "internal_do_not_publish") continue;
      const stagedRows = stagedByKey.get(key) ?? [];
      if (stagedRows.length > 1) {
        ambiguousMatches.push({
          provider,
          id: seedMatch.record.id,
          reason: `multiple current staging records matched ${seedMatch.record.shipName} ${seedMatch.record.departureDate} (${seedMatch.record.nights} nights)`,
        });
        continue;
      }
      const staged = stagedRows[0];
      if (!staged) continue;
      const before = seedMatch.record;
      const delta = priceDelta(before.startingPrice, staged.startingPrice);
      if (delta != null && Math.abs(delta) > args.maxPriceDelta) {
        ambiguousMatches.push({
          provider,
          id: before.id,
          reason: `price delta ${Math.round(delta * 100)}% exceeds ${Math.round(args.maxPriceDelta * 100)}% review threshold`,
          previousPrice: before.startingPrice,
          currentPrice: staged.startingPrice,
        });
        continue;
      }
      const next = refreshExistingRecord(before, staged, refreshedAt);
      nextSeed[seedMatch.index] = next;
      seedByKey.set(keyFor(next), { record: next, index: seedMatch.index });
      refreshed.push({
        provider,
        id: next.id,
        shipName: next.shipName,
        departureDate: next.departureDate,
        previousPrice: before.startingPrice,
        currentPrice: next.startingPrice,
        priceChanged: before.startingPrice !== next.startingPrice,
      });
    }
  }

  const hidden = [];
  for (let index = 0; index < nextSeed.length; index += 1) {
    const record = nextSeed[index];
    if (!publicAndFuture(record, today)) continue;
    const age = ageDays(record, today);
    if (age != null && age <= args.maxPublicAgeDays) continue;
    const reason =
      age == null
        ? "missing valid lastVerified in current reviewed refresh"
        : `lastVerified=${record.lastVerified} is ${age} days old and was not confirmed in the current reviewed refresh`;
    nextSeed[index] = hideStaleRecord(record, refreshedAt, reason);
    hidden.push({
      provider: record.cruiseLine,
      id: record.id,
      shipName: record.shipName,
      departureDate: record.departureDate,
      lastVerified: record.lastVerified,
      reason,
    });
  }

  nextSeed.sort((a, b) => {
    const line = a.cruiseLine.localeCompare(b.cruiseLine);
    if (line) return line;
    const date = a.departureDate.localeCompare(b.departureDate);
    if (date) return date;
    return a.shipName.localeCompare(b.shipName);
  });

  const validationErrors = validateRecords(nextSeed, schema);
  if (validationErrors.length > 0) {
    console.error(JSON.stringify(validationErrors, null, 2));
    throw new Error(`Reviewed data refresh blocked by ${validationErrors.length} schema error(s).`);
  }

  const report = {
    generatedAt: refreshedAt.toISOString(),
    mode: args.apply ? "apply" : "dry-run",
    currentDate: formatDateOnly(today),
    thresholds: {
      maxPublicAgeDays: args.maxPublicAgeDays,
      maxPriceDelta: args.maxPriceDelta,
    },
    counts: {
      seedBefore: seedRecords.length,
      seedAfter: nextSeed.length,
      refreshed: refreshed.length,
      priceChanges: refreshed.filter((record) => record.priceChanged).length,
      hidden: hidden.length,
      ambiguousMatches: ambiguousMatches.length,
      missingReviewReports: missingReviewReports.length,
    },
    refreshed,
    hidden,
    ambiguousMatches,
    missingReviewReports,
  };

  await mkdir(reportDir, { recursive: true });
  const normalizedMarkdown = markdownReport(report).replace(/\n+$/, "\n");
  await Promise.all([
    writeFile(resolve(reportDir, "latest-reviewed-data-refresh.json"), stringifyJson(report)),
    writeFile(resolve(reportDir, "latest-reviewed-data-refresh.md"), normalizedMarkdown),
  ]);
  if (args.apply) {
    await writeFile(resolve(repoRoot, "data/seed/sailings.json"), stringifyJson(nextSeed));
  }

  console.log(
    `Reviewed data refresh ${report.mode}: ${refreshed.length} refreshed, ${hidden.length} hidden, ${report.counts.priceChanges} price change(s).`,
  );
  console.log("Report written to data/reports/latest-reviewed-data-refresh.md");
  if (!args.apply) console.log("Dry run only. Re-run with --apply to update data/seed/sailings.json.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
