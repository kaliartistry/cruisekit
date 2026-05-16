#!/usr/bin/env node
/**
 * Builds a no-API manual review queue from official source watchlist entries
 * and canonical seed state.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function countBy(records, field) {
  const counts = {};
  for (const record of records) {
    const key = record[field] ?? "unknown";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function daysSince(dateValue) {
  const date = new Date(`${dateValue}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - date.getTime()) / 86_400_000);
}

function priorityFor(entry, sailings) {
  const publicSailings = sailings.filter(
    (s) => s.cruiseLine === entry.cruiseLine && s.confidence !== "internal_do_not_publish",
  );
  const hiddenSailings = sailings.filter(
    (s) => s.cruiseLine === entry.cruiseLine && s.confidence === "internal_do_not_publish",
  );
  const stalePublic = publicSailings.filter((s) => {
    const age = daysSince(s.lastVerified);
    return age != null && age > 30;
  });

  if (publicSailings.length === 0) return "high";
  if (stalePublic.length > 0) return "high";
  if (hiddenSailings.length > publicSailings.length) return "medium";
  return "normal";
}

async function main() {
  const [watchlist, sailings] = await Promise.all([
    loadJson("data/source-watchlist.json"),
    loadJson("data/seed/sailings.json"),
  ]);

  const byLine = countBy(sailings, "cruiseLine");
  const byConfidence = countBy(sailings, "confidence");
  const tasks = watchlist.map((entry) => {
    const lineSailings = sailings.filter((s) => s.cruiseLine === entry.cruiseLine);
    const publicSailings = lineSailings.filter((s) => s.confidence !== "internal_do_not_publish");
    const hiddenSailings = lineSailings.filter((s) => s.confidence === "internal_do_not_publish");
    return {
      ...entry,
      priority: priorityFor(entry, sailings),
      currentSeedSailings: lineSailings.length,
      currentPublicSailings: publicSailings.length,
      currentHiddenSailings: hiddenSailings.length,
      existingIds: lineSailings.map((s) => s.id).sort(),
    };
  });

  tasks.sort((a, b) => {
    const order = { high: 0, medium: 1, normal: 2 };
    return order[a.priority] - order[b.priority] || a.cruiseLine.localeCompare(b.cruiseLine);
  });

  const report = {
    generatedAt: new Date().toISOString(),
    mode: "manual-review-no-api",
    counts: {
      watchlistEntries: watchlist.length,
      seedSailings: sailings.length,
      byLine,
      byConfidence,
    },
    tasks,
  };

  const markdown = `# CruiseKit Manual Review Queue

Generated: ${report.generatedAt}

This is the temporary no-API workflow. Use browser/manual verification against
official cruise-line sources, then update canonical seed records only when the
source page can be cited.

## Counts

| Metric | Count |
| --- | ---: |
| Watchlist entries | ${report.counts.watchlistEntries} |
| Seed sailings | ${report.counts.seedSailings} |

## Tasks

${tasks
  .map(
    (task, index) => `### ${index + 1}. ${task.label}

- Priority: ${task.priority}
- Cruise line: ${task.cruiseLine}
- Source: ${task.url}
- Current seed sailings: ${task.currentSeedSailings}
- Current public sailings: ${task.currentPublicSailings}
- Current hidden sailings: ${task.currentHiddenSailings}
- Review fields: ${task.reviewFields.join(", ")}
- Required action: verify exact sailing/date/link on the official source before promoting or editing public records.
`,
  )
  .join("\n")}
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-manual-review-queue.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-manual-review-queue.md"), markdown),
  ]);

  console.log(`Manual review queue: ${tasks.length} official source(s).`);
  console.log("Report written to data/reports/latest-manual-review-queue.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
