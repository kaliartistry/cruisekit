#!/usr/bin/env node
/**
 * Checks whether published CruiseKit sailing data is fresh enough to use.
 *
 * This is intentionally separate from ingestion. Ingestion may discover new
 * source data, but production is only current when approved seed records have
 * been rebuilt into the public bundles.
 */
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { currentUtcDateOnly, daysBetween, formatDateOnly } from "./lib/date.mjs";
import { ledgerProblems } from "./lib/fare-verification.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const maxPublicAgeDays = Number.parseInt(process.env.CRUISEKIT_MAX_PUBLIC_DATA_AGE_DAYS ?? "7", 10);
const maxIngestAgeDays = Number.parseInt(process.env.CRUISEKIT_MAX_INGEST_AGE_DAYS ?? "7", 10);
const today = currentUtcDateOnly();

const reviewCommands = {
  azamara: "data:review:azamara",
  carnival: "data:review:carnival",
  "holland-america": "data:review:holland-america",
  norwegian: "data:review:norwegian",
  princess: "data:review:princess",
  "virgin-voyages": "data:review:virgin-voyages",
};

function addFinding(list, severity, id, message, extra = {}) {
  list.push({ severity, id, message, ...extra });
}

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

async function fileExists(relPath) {
  try {
    await access(resolve(repoRoot, relPath));
    return true;
  } catch {
    return false;
  }
}

function countBy(records, keyFn) {
  const counts = {};
  for (const record of records) {
    const key = keyFn(record) ?? "unknown";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function generatedAgeDays(isoValue) {
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setUTCHours(0, 0, 0, 0);
  return daysBetween(parsed, today);
}

function latestDate(values) {
  return values.filter(Boolean).sort().at(-1) ?? null;
}

function oldestDate(values) {
  return values.filter(Boolean).sort().at(0) ?? null;
}

function formatFindings(findings) {
  if (findings.length === 0) return "- None\n";
  return findings
    .map((finding) => `- ${finding.severity}: ${finding.id} - ${finding.message}`)
    .join("\n") + "\n";
}

function markdownCruiseLineRows(rows) {
  if (rows.length === 0) return "- None\n";
  return [
    "| Cruise line | Public sailings | Stale quotes | Unverified quotes | Oldest record review | Latest record review | Latest price check |",
    "| --- | ---: | ---: | ---: | --- | --- | --- |",
    ...rows.map(
      (row) =>
        `| ${row.cruiseLine} | ${row.publicSailings} | ${row.stalePublicSailings} | ${row.unverifiedPublicFares} | ${row.oldestLastVerified ?? "n/a"} | ${row.latestLastVerified ?? "n/a"} | ${row.latestPriceCheck ?? "unverified"} |`,
    ),
  ].join("\n") + "\n";
}

function markdownWatchlistRows(rows) {
  if (rows.length === 0) return "- None\n";
  return [
    "| Cruise line | Cadence | Importer | Last import | Last review | Public sailings |",
    "| --- | --- | --- | --- | --- | ---: |",
    ...rows.map(
      (row) =>
        `| ${row.cruiseLine} | ${row.cadence} | ${row.hasImporter ? "yes" : "no"} | ${row.latestImportGeneratedAt ?? "missing"} | ${row.latestReviewGeneratedAt ?? "missing"} | ${row.publicSailings} |`,
    ),
  ].join("\n") + "\n";
}

async function loadOptionalReport(relPath) {
  try {
    return await loadJson(relPath);
  } catch {
    return null;
  }
}

async function main() {
  if (maxPublicAgeDays !== 7) throw new Error("The approved public fare freshness policy is exactly seven days; an environment override cannot weaken it.");
  if (!Number.isFinite(maxPublicAgeDays) || maxPublicAgeDays < 1) {
    throw new Error("CRUISEKIT_MAX_PUBLIC_DATA_AGE_DAYS must be a positive integer.");
  }
  if (!Number.isFinite(maxIngestAgeDays) || maxIngestAgeDays < 1) {
    throw new Error("CRUISEKIT_MAX_INGEST_AGE_DAYS must be a positive integer.");
  }

  const [manifest, publicSailings, watchlist, fareLedger, farePolicy, seedSailings] = await Promise.all([
    loadJson("data/bundles/manifest.json"),
    loadJson("data/bundles/canonical/sailings.json"),
    loadJson("data/source-watchlist.json"),
    loadJson("data/seed/fare-verifications.json"),
    loadJson("data/fare-verification-policy.json"),
    loadJson("data/seed/sailings.json"),
  ]);

  const blockers = [];
  const warnings = [];
  const info = [];
  const provenanceErrors = ledgerProblems(seedSailings, fareLedger, farePolicy);
  for (const error of provenanceErrors) addFinding(blockers, "blocker", "fare-provenance", error);
  const lineCounts = countBy(publicSailings, (sailing) => sailing.cruiseLine);
  const sailingsByLine = new Map();

  for (const sailing of publicSailings) {
    const line = sailing.cruiseLine ?? "unknown";
    const records = sailingsByLine.get(line) ?? [];
    records.push(sailing);
    sailingsByLine.set(line, records);

    const checked = provenanceErrors.length ? null : fareLedger.entries[sailing.id]?.lastSuccessfulVerification;
    const age = checked ? (Date.now() - Date.parse(checked)) / 86400000 : null;
    if (age == null) {
      addFinding(blockers, "blocker", sailing.id ?? "unknown", `No confirmed exact-context price observation. Legacy record review ${sailing.lastVerified} is not a verified fare check.`, { cruiseLine: line, unverifiedFare: true });
      continue;
    }
    if (age > maxPublicAgeDays) {
      addFinding(
        blockers,
        "blocker",
        sailing.id,
        `Price checked ${checked} is ${age.toFixed(2)} days old; max allowed is ${maxPublicAgeDays} days.`,
        { cruiseLine: line, ageDays: age },
      );
    }
  }

  const byCruiseLine = [...sailingsByLine.entries()]
    .map(([cruiseLine, records]) => {
      const ages = records.map(record => { const checked = fareLedger.entries[record.id]?.lastSuccessfulVerification; return checked ? (Date.now() - Date.parse(checked)) / 86400000 : null; });
      return {
        cruiseLine,
        publicSailings: records.length,
        stalePublicSailings: ages.filter((age) => age != null && age > maxPublicAgeDays).length,
        unverifiedPublicFares: ages.filter(age => age == null).length,
        latestPriceCheck: latestDate(records.map(r => fareLedger.entries[r.id]?.lastSuccessfulVerification)),
        oldestLastVerified: oldestDate(records.map((record) => record.lastVerified)),
        latestLastVerified: latestDate(records.map((record) => record.lastVerified)),
      };
    })
    .sort((a, b) => b.stalePublicSailings - a.stalePublicSailings || a.cruiseLine.localeCompare(b.cruiseLine));

  const weeklyReport = await loadOptionalReport("data/reports/latest-weekly-ingest.json");
  const weeklyReportAge = generatedAgeDays(weeklyReport?.generatedAt);
  if (weeklyReportAge == null) {
    addFinding(warnings, "warning", "weekly-ingest-report", "No readable latest weekly ingest report was found.");
  } else if (weeklyReportAge > maxIngestAgeDays) {
    addFinding(
      warnings,
      "warning",
      "weekly-ingest-report",
      `latest-weekly-ingest.json is ${weeklyReportAge} days old; max expected is ${maxIngestAgeDays} days.`,
    );
  }

  const watchlistRows = [];
  for (const entry of watchlist) {
    if (entry.cadence !== "weekly") continue;
    const provider = entry.cruiseLine;
    const importReport = await loadOptionalReport(`data/reports/latest-${provider}-staging-import.json`);
    const reviewReport = await loadOptionalReport(`data/reports/latest-${provider}-staging-review.json`);
    const ingestAge = generatedAgeDays(importReport?.generatedAt);
    const reviewAge = generatedAgeDays(reviewReport?.generatedAt);
    const hasImporter = await fileExists(`scripts/ingest/${provider}.mjs`);
    const hasReviewCommand = Boolean(reviewCommands[provider]);
    const publicCount = lineCounts[provider] ?? 0;

    watchlistRows.push({
      cruiseLine: provider,
      cadence: entry.cadence,
      hasImporter,
      hasReviewCommand,
      latestImportGeneratedAt: importReport?.generatedAt ?? null,
      latestReviewGeneratedAt: reviewReport?.generatedAt ?? null,
      publicSailings: publicCount,
    });

    if (!hasImporter) {
      addFinding(info, "info", `${provider}-importer`, "Weekly source is on the watchlist but has no automated importer yet.");
    } else if (ingestAge == null) {
      addFinding(warnings, "warning", `${provider}-import-report`, "No readable latest staging import report was found.");
    } else if (ingestAge > maxIngestAgeDays) {
      addFinding(warnings, "warning", `${provider}-import-report`, `Latest staging import is ${ingestAge} days old.`);
    }

    if (hasReviewCommand && reviewAge == null) {
      addFinding(warnings, "warning", `${provider}-review-report`, "No readable latest staging review report was found.");
    } else if (hasReviewCommand && reviewAge > maxIngestAgeDays) {
      addFinding(warnings, "warning", `${provider}-review-report`, `Latest staging review is ${reviewAge} days old.`);
    }

    if (publicCount === 0) {
      addFinding(info, "info", `${provider}-coverage`, "Weekly source has no public sailings in the production bundle.");
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    currentDate: formatDateOnly(today),
    mode: "production-data-freshness",
    thresholds: {
      maxPublicAgeDays,
      maxIngestAgeDays,
    },
    manifestGeneratedAt: manifest.generatedAt,
    counts: {
      publicSailings: publicSailings.length,
      stalePublicSailings: blockers.filter((finding) => finding.ageDays != null).length,
      unverifiedPublicFares: blockers.filter(finding => finding.unverifiedFare).length,
      weeklyWatchlistSources: watchlistRows.length,
      blockers: blockers.length,
      warnings: warnings.length,
      info: info.length,
    },
    byCruiseLine,
    watchlist: watchlistRows,
    blockers,
    warnings,
    info,
  };

  const markdown = `# CruiseKit Data Freshness Report

Generated: ${report.generatedAt}

Current date: ${report.currentDate}

Production freshness threshold: ${maxPublicAgeDays} days.

## Summary

| Metric | Count |
| --- | ---: |
| Public sailings | ${report.counts.publicSailings} |
| Stale public sailings | ${report.counts.stalePublicSailings} |
| Unverified public fares | ${report.counts.unverifiedPublicFares} |
| Weekly watchlist sources | ${report.counts.weeklyWatchlistSources} |
| Blockers | ${report.counts.blockers} |
| Warnings | ${report.counts.warnings} |
| Info | ${report.counts.info} |

## Public Bundle By Cruise Line

${markdownCruiseLineRows(byCruiseLine)}
## Weekly Source Watchlist

${markdownWatchlistRows(watchlistRows)}
## Blockers

${formatFindings(blockers)}
## Warnings

${formatFindings(warnings)}
## Info

${formatFindings(info)}
## Required Action

If blockers are present, do not broaden in-app review prompts yet. Review the
latest exact-quote audit and source access review. Approve complete cabin/rate,
occupancy, currency, taxes and sailing context with raw evidence before adopting
seed and fare-ledger candidates. Rebuild and rerun the gate before publishing.
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-data-freshness.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-data-freshness.md"), markdown),
  ]);

  console.log(`Data freshness: ${blockers.length} blocker(s), ${warnings.length} warning(s).`);
  console.log("Report written to data/reports/latest-data-freshness.md");
  if (blockers.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
