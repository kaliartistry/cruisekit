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
import { fileURLToPath } from "node:url";

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
    "| Cruise line | Public sailings | Stale quotes | Unverified quotes | Oldest record review | Latest record review |",
    "| --- | ---: | ---: | ---: | --- | --- |",
    ...rows.map(
      (row) =>
        `| ${row.cruiseLine} | ${row.publicSailings} | ${row.stalePublicSailings} | ${row.unverifiedPublicFares ?? 0} | ${row.oldestLastVerified ?? "n/a"} | ${row.latestLastVerified ?? "n/a"} |`,
    ),
  ].join("\n");
}

async function ensureLabel(label) {
  await run("gh", ["label", "create", label, "--color", label === "needs-kali" ? "B60205" : "D93F0B"]);
}

export function freshnessIssueBody(report, verification = null, pilot = null) {
  const currentVerification = verification && verification.generatedAt?.slice(0, 10) === report.generatedAt?.slice(0, 10) ? verification : null;
  const currentPilot = pilot && pilot.generatedAt?.slice(0, 10) === report.generatedAt?.slice(0, 10) ? pilot : null;
  return `## Approval Type

Production cruise data freshness and price/source review.

${currentVerification ? `## Exact Quote Recheck\n\nRun: ${currentVerification.generatedAt}. Eligible candidates: ${currentVerification.counts.eligible}; retained fares: ${currentVerification.counts.retained}; quarantined unmatched observations: ${currentVerification.counts.quarantined}. Publication is disabled.\n\n${(currentVerification.sourceChecks ?? []).map(s => `- Actual rules attempt ${s.provider}: ${s.status}, ${s.checkedAt}, ${s.requests} request(s), ${s.fareRequests} fare requests.`).join("\n")}\n\n${currentVerification.providerReadiness.map(p => `- ${p.provider}: ${p.access}. ${p.reason} Policy rules checked: ${p.policyRulesCheckedAt ?? "pending"}.`).join("\n")}\n\nAudit/rollback files: ${currentVerification.paths.audit}. Job/scrape/build dates do not prove prices. Missing/sold-out/changed results do not prove cancellation.\n` : ""}

${currentPilot ? `## Scoped Virgin Pilot\n\nTarget: ${currentPilot.targetId}. Actual source check: ${currentPilot.access.status} at ${currentPilot.access.checkedAt}. Source: ${currentPilot.access.url}. Evidence SHA-256: ${currentPilot.access.evidenceSha256 ?? "unavailable"}.\n\n${currentPilot.requests} rules request(s), ${currentPilot.fareRequests} fare requests, ${currentPilot.completeQuotes} complete quotes. ${currentPilot.verification.coverage.outsideScope} public sailings outside this pilot; global freshness is not certified. Missing evidence: ${currentPilot.missingEvidence.join(", ")}. No source denial bypass or public write.\n` : ""}

## Why Automation Paused

The freshness gate found ${report.counts.blockers} blocker(s) and ${report.counts.warnings} warning(s), including ${report.counts.unverifiedPublicFares ?? 0} fares without confirmed exact-context price checks. Actual public fare observations must be ${report.thresholds.maxPublicAgeDays} days old or newer before treating the data as current. Weekly is a check cadence, not a guarantee of unchanged prices.

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

Public-source research, adapter implementation and local tests are authorized engineering. Respect actual source restrictions; internal review-required labels do not establish provider permission requirements. Prepare exact initial cabin/rate/package/occupancy/currency/tax baseline proposals with raw evidence, then review specific data candidates. Old staging or a successful scrape is insufficient. For an owner-approved candidate, run:

\`\`\`bash
pnpm run data:build
pnpm run data:freshness
pnpm run data:publish:candidate
\`\`\`

If the candidate is clean, merge the approved data PR into main so GitHub Pages and the mobile manifest refresh from the approved bundles.

## Risk Level

High for customer pricing trust if unmatched quote contexts or old snapshots are presented as current fares.

## Deadline If Any

Before treating unverified fares as current or enabling unattended production writes.
`;
}

async function main() {
  const report = await loadJson("data/reports/latest-data-freshness.json");
  const verification = await loadJson("data/reports/latest-fare-verification.json").catch(() => null);
  const pilot = await loadJson("data/reports/latest-virgin-fare-pilot.json").catch(() => null);
  const issueBody = freshnessIssueBody(report, verification, pilot);

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

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error) => {
  console.error(error);
  process.exit(1);
});
