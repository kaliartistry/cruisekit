#!/usr/bin/env node
/**
 * Generates a report-only data health summary for scheduled automation.
 *
 * This script assumes `pnpm run data:build` has already generated bundles. It
 * does not fetch external sources or publish anything.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { currentUtcDateOnly, dateOnly, daysBetween, formatDateOnly } from "./lib/date.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const today = currentUtcDateOnly();

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function countBy(records, keyFn) {
  const counts = {};
  for (const record of records) {
    const key = keyFn(record) ?? "unknown";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function addFinding(list, severity, id, message) {
  list.push({ severity, id, message });
}

function formatFindings(findings) {
  if (findings.length === 0) return "- None\n";
  return findings
    .map((finding) => `- ${finding.severity}: ${finding.id} - ${finding.message}`)
    .join("\n") + "\n";
}

async function main() {
  const [seedSailings, seedDeals, publicSailings, canonicalDeals, mobileSailings, mobileDeals, manifest] =
    await Promise.all([
      loadJson("data/seed/sailings.json"),
      loadJson("data/seed/deals.json"),
      loadJson("data/bundles/canonical/sailings.json"),
      loadJson("data/bundles/canonical/deals.json"),
      loadJson("data/bundles/mobile/sailings.json"),
      loadJson("data/bundles/mobile/deals.json"),
      loadJson("data/bundles/manifest.json"),
    ]);

  const blockers = [];
  const warnings = [];
  const info = [];
  const publicIds = new Set(publicSailings.map((s) => s.id));
  const mobileIds = new Set(mobileSailings.map((s) => s.id));
  const seedIds = new Set();

  for (const sailing of seedSailings) {
    if (seedIds.has(sailing.id)) {
      addFinding(blockers, "blocker", sailing.id, "Duplicate sailing id in seed data.");
    }
    seedIds.add(sailing.id);

    const departureDate = dateOnly(sailing.departureDate);
    if (
      sailing.confidence !== "internal_do_not_publish" &&
      departureDate &&
      departureDate < today &&
      !publicIds.has(sailing.id)
    ) {
      addFinding(info, "info", sailing.id, `Expired seed sailing filtered from public bundles for ${formatDateOnly(today)}.`);
    }
  }

  for (const sailing of publicSailings) {
    const departureDate = dateOnly(sailing.departureDate);
    const returnDate = dateOnly(sailing.returnDate);
    const verifiedDate = dateOnly(sailing.lastVerified);

    if (!mobileIds.has(sailing.id)) {
      addFinding(blockers, "blocker", sailing.id, "Missing from mobile sailing bundle.");
    }
    if (!sailing.directLink && !sailing.affiliateLink) {
      addFinding(blockers, "blocker", sailing.id, "Public sailing has no directLink or affiliateLink.");
    }
    if (departureDate && departureDate < today) {
      addFinding(blockers, "blocker", sailing.id, `Departure date ${sailing.departureDate} is in the past.`);
    }
    if (departureDate && returnDate && returnDate <= departureDate) {
      addFinding(blockers, "blocker", sailing.id, "Return date is not after departure date.");
    }
    if (departureDate && returnDate && daysBetween(departureDate, returnDate) !== sailing.nights) {
      addFinding(
        warnings,
        "warning",
        sailing.id,
        `nights=${sailing.nights} does not match ${sailing.departureDate} to ${sailing.returnDate}.`,
      );
    }
    if (verifiedDate && daysBetween(verifiedDate, today) > 90) {
      addFinding(warnings, "warning", sailing.id, `lastVerified=${sailing.lastVerified} is older than 90 days.`);
    }
    if (sailing.sourceUrl !== sailing.source?.sourceUrl) {
      addFinding(warnings, "warning", sailing.id, "Top-level sourceUrl does not match source.sourceUrl.");
    }
    if (sailing.lastVerified !== sailing.source?.lastVerified) {
      addFinding(warnings, "warning", sailing.id, "Top-level lastVerified does not match source.lastVerified.");
    }
    if (sailing.startingPrice == null) {
      addFinding(warnings, "warning", sailing.id, "Public sailing has no startingPrice.");
    }
    if (sailing.priceBasis === "unspecified") {
      addFinding(warnings, "warning", sailing.id, "Public sailing has unspecified priceBasis.");
    }
  }

  for (const sailing of mobileSailings) {
    if (!publicIds.has(sailing.id)) {
      addFinding(blockers, "blocker", sailing.id, "Mobile sailing is not present in canonical public bundle.");
    }
  }

  for (const deal of canonicalDeals) {
    if (deal.confidence === "internal_do_not_publish") {
      addFinding(blockers, "blocker", deal.id, "Internal deal leaked into public canonical deal bundle.");
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    manifestGeneratedAt: manifest.generatedAt,
    counts: {
      seedSailings: seedSailings.length,
      publicSailings: publicSailings.length,
      seedDeals: seedDeals.length,
      publicDeals: canonicalDeals.length,
      mobileSailings: mobileSailings.length,
      mobileDeals: mobileDeals.length,
      filteredExpiredSeedSailings: info.length,
    },
    byCruiseLine: countBy(seedSailings, (s) => s.cruiseLine),
    byConfidence: countBy(seedSailings, (s) => s.confidence),
    currentDate: formatDateOnly(today),
    blockers,
    warnings,
    info,
  };

  const markdown = `# CruiseKit Data Health Report

Generated: ${summary.generatedAt}

## Counts

| Metric | Count |
| --- | ---: |
| Seed sailings | ${summary.counts.seedSailings} |
| Public sailings | ${summary.counts.publicSailings} |
| Seed deals | ${summary.counts.seedDeals} |
| Public deals | ${summary.counts.publicDeals} |
| Mobile sailings | ${summary.counts.mobileSailings} |
| Mobile deals | ${summary.counts.mobileDeals} |
| Filtered expired seed sailings | ${summary.counts.filteredExpiredSeedSailings} |

## Seed Sailings By Cruise Line

${Object.entries(summary.byCruiseLine)
  .map(([line, count]) => `- ${line}: ${count}`)
  .join("\n")}

## Seed Sailings By Confidence

${Object.entries(summary.byConfidence)
  .map(([confidence, count]) => `- ${confidence}: ${count}`)
  .join("\n")}

## Blockers

${formatFindings(blockers)}
## Warnings

${formatFindings(warnings)}
## Info

${formatFindings(info)}
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-data-health.json"), `${JSON.stringify(summary, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-data-health.md"), markdown),
  ]);

  console.log(`Data health: ${blockers.length} blocker(s), ${warnings.length} warning(s).`);
  console.log("Report written to data/reports/latest-data-health.md");

  if (blockers.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
