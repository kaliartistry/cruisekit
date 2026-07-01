#!/usr/bin/env node
/**
 * Creates or updates the owner-approval issue for stale production data.
 *
 * This is used by weekly automation when cruise fare data needs human review
 * before refreshed prices or source links can be promoted.
 */
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const repoRoot = process.cwd();
const title = "[needs-kali] CruiseKit data freshness review";
const labels = ["needs-kali", "pricing-review"];

async function run(command, args, options = {}) {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 10,
      ...options,
    });
    return { ok: true, output: stdout.trim(), stderr: stderr.trim() };
  } catch (error) {
    return {
      ok: false,
      output: [error.stdout, error.stderr, error.message].filter(Boolean).join("\n").trim(),
    };
  }
}

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function briefFindingList(findings, limit = 12) {
  if (!Array.isArray(findings) || findings.length === 0) return "- None";
  const rows = findings
    .slice(0, limit)
    .map((finding) => `- ${finding.id}: ${finding.message}`);
  if (findings.length > limit) rows.push(`- Plus ${findings.length - limit} more in data/reports/latest-data-freshness.md`);
  return rows.join("\n");
}

function table(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return "- None";
  return [
    "| Cruise line | Public sailings | Stale | Oldest check | Latest check |",
    "| --- | ---: | ---: | --- | --- |",
    ...rows.map(
      (row) =>
        `| ${row.cruiseLine} | ${row.publicSailings} | ${row.stalePublicSailings} | ${row.oldestLastVerified ?? "n/a"} | ${row.latestLastVerified ?? "n/a"} |`,
    ),
  ].join("\n");
}

async function ensureLabel(label) {
  await run("gh", ["label", "create", label, "--color", label === "needs-kali" ? "B60205" : "D93F0B"]);
}

async function main() {
  const report = await loadJson("data/reports/latest-data-freshness.json");
  const issueBody = `## Approval Type

Production cruise data freshness and price/source review.

## Why Automation Paused

The weekly freshness gate found ${report.counts.blockers} blocker(s) and ${report.counts.warnings} warning(s). Public sailing fare checks must be ${report.thresholds.maxPublicAgeDays} days old or newer before CruiseKit broadens review prompts or treats the cruise-search data as current.

## Evidence

Generated: ${report.generatedAt}

Current date: ${report.currentDate}

${table(report.byCruiseLine)}

## Blockers

${briefFindingList(report.blockers)}

## Files/PR Involved

- data/reports/latest-data-freshness.md
- data/reports/latest-weekly-ingest.md
- data/reports/latest-*-staging-review.md

## Recommended Action

Review the latest staging import and staging review reports, approve exact source-backed seed updates for sailing dates, links, prices, price basis, and taxes/fees language, then run:

\`\`\`bash
pnpm run data:build
pnpm run data:freshness
pnpm run data:publish:candidate
\`\`\`

If the candidate is clean, merge the approved data PR into main so GitHub Pages and the mobile manifest refresh from the approved bundles.

## Risk Level

High for review-prompt timing. Asking for public ratings while production fare data is stale can create avoidable trust risk.

## Deadline If Any

Before broadening in-app review prompts.
`;

  for (const label of labels) await ensureLabel(label);

  const existing = await run("gh", [
    "issue",
    "list",
    "--state",
    "open",
    "--search",
    `${title} in:title`,
    "--json",
    "number,title",
  ]);
  if (!existing.ok) {
    console.error(existing.output);
    process.exit(1);
  }

  let number = null;
  try {
    const issues = JSON.parse(existing.output || "[]");
    number = issues.find((issue) => issue.title === title)?.number ?? null;
  } catch {}

  if (number) {
    const result = await run("gh", [
      "issue",
      "edit",
      String(number),
      "--body",
      issueBody,
      "--add-label",
      labels.join(","),
    ]);
    if (!result.ok) {
      console.error(result.output);
      process.exit(1);
    }
    console.log(`Updated issue #${number}`);
    return;
  }

  const result = await run("gh", [
    "issue",
    "create",
    "--title",
    title,
    "--body",
    issueBody,
    "--label",
    labels.join(","),
  ]);
  if (!result.ok) {
    console.error(result.output);
    process.exit(1);
  }
  console.log(result.output);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
