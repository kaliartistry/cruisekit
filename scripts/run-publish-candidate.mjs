#!/usr/bin/env node
/**
 * Prepares a guarded CruiseKit data publish candidate.
 *
 * This script intentionally does not commit, push, or deploy. It builds data
 * bundles, runs the publish safety gates, copies publish-ready bundles into the
 * web public directory only when there are zero blockers and zero warnings, and
 * writes a review report for manual approval.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");

const gateReports = [
  { key: "dataHealth", label: "Data health", path: "data/reports/latest-data-health.json" },
  { key: "linkAudit", label: "Link audit", path: "data/reports/latest-link-audit.json" },
  { key: "imageAudit", label: "Image audit", path: "data/reports/latest-image-audit.json" },
];

function runCommand(name, command, args, extraEnv = {}) {
  return new Promise((resolveRun) => {
    console.log(`\n=== Publish candidate: ${name} ===`);
    const child = spawn(command, args, {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, ...extraEnv },
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(text);
    });
    child.on("close", (code) => {
      resolveRun({
        name,
        command: [command, ...args].join(" "),
        exitCode: code,
        ok: code === 0,
        stdoutTail: stdout.split("\n").slice(-30).join("\n"),
        stderrTail: stderr.split("\n").slice(-30).join("\n"),
      });
    });
  });
}

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function findingsSummary(report) {
  const blockers = Array.isArray(report?.blockers) ? report.blockers : [];
  const warnings = Array.isArray(report?.warnings) ? report.warnings : [];
  return { blockers, warnings };
}

function markdownFindings(label, findings) {
  if (findings.length === 0) return `- ${label}: none\n`;
  return findings
    .map((finding) => `- ${label}: ${finding.id ?? "unknown"} - ${finding.message ?? JSON.stringify(finding)}`)
    .join("\n") + "\n";
}

function manifestCounts(manifest) {
  return {
    publicSailings: manifest?.counts?.publicSailings ?? manifest?.bundles?.canonicalSailings?.records ?? null,
    mobileSailings: manifest?.bundles?.mobileSailings?.records ?? null,
    mobileDeals: manifest?.bundles?.mobileDeals?.records ?? null,
  };
}

async function gitStatus() {
  const result = await runCommand("git status", "git", ["status", "--short"]);
  return result.stdoutTail
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean);
}

async function main() {
  const steps = [];
  steps.push(await runCommand("build data bundles", "pnpm", ["run", "data:build"]));
  steps.push(await runCommand("data health", "node", ["scripts/data-quality-report.mjs"]));
  steps.push(await runCommand("link audit", "pnpm", ["run", "data:audit:links"]));
  steps.push(await runCommand("image audit", "pnpm", ["run", "data:audit:images"]));

  const loadedReports = {};
  const gateSummaries = {};
  for (const gate of gateReports) {
    try {
      loadedReports[gate.key] = await loadJson(gate.path);
      gateSummaries[gate.key] = findingsSummary(loadedReports[gate.key]);
    } catch (error) {
      gateSummaries[gate.key] = {
        blockers: [{ id: gate.path, message: `Could not read report: ${error.message}` }],
        warnings: [],
      };
    }
  }

  const blockerCount = Object.values(gateSummaries).reduce((sum, gate) => sum + gate.blockers.length, 0);
  const warningCount = Object.values(gateSummaries).reduce((sum, gate) => sum + gate.warnings.length, 0);
  const prePublishStepsOk = steps.every((step) => step.ok);
  const gatesClean = prePublishStepsOk && blockerCount === 0 && warningCount === 0;

  let publishedAssets = false;
  if (gatesClean) {
    const publishStep = await runCommand("prepare public data bundles", "node", [
      "scripts/publish-data-bundles.mjs",
    ]);
    steps.push(publishStep);
    publishedAssets = publishStep.ok;
  }

  const manifest = await loadJson("apps/web/public/data/bundles/manifest.json").catch(() => null);
  const counts = manifestCounts(manifest);
  const statusLines = await gitStatus();
  const ready = gatesClean && publishedAssets;
  const report = {
    generatedAt: new Date().toISOString(),
    mode: "guarded-publish-candidate",
    ready,
    publishedAssets,
    blockerCount,
    warningCount,
    counts,
    steps,
    gates: gateSummaries,
    gitStatus: statusLines,
    guardrails: [
      "No commit was created.",
      "No push was performed.",
      "No GitHub Pages deploy was triggered by this script.",
      "New cruise-line records, affiliate links, and source promotions still require human review.",
    ],
  };

  const markdown = `# CruiseKit Publish Candidate

Generated: ${report.generatedAt}

Status: ${ready ? "READY FOR MANUAL REVIEW" : "BLOCKED"}

This is a guarded publish candidate. It never commits, pushes, or deploys.

## Summary

| Metric | Value |
| --- | ---: |
| Public sailings | ${report.counts.publicSailings ?? "unknown"} |
| Mobile sailings | ${report.counts.mobileSailings ?? "unknown"} |
| Mobile deals | ${report.counts.mobileDeals ?? "unknown"} |
| Blockers | ${blockerCount} |
| Warnings | ${warningCount} |
| Public bundles prepared | ${publishedAssets ? "yes" : "no"} |

## Steps

| Step | Status | Exit |
| --- | --- | ---: |
${steps.map((step) => `| ${step.name} | ${step.ok ? "ok" : "blocked"} | ${step.exitCode} |`).join("\n")}

## Findings

${gateReports
  .map((gate) => {
    const summary = gateSummaries[gate.key];
    return `### ${gate.label}\n\n${markdownFindings("blocker", summary.blockers)}${markdownFindings("warning", summary.warnings)}`;
  })
  .join("\n")}
## Pending Git Changes

${statusLines.length === 0 ? "- None\n" : statusLines.map((line) => `- \`${line}\``).join("\n") + "\n"}
## Manual Next Step

${ready
  ? "Review the pending diff. If it only contains expected data bundle/report changes, commit and push to `main` to trigger GitHub Pages."
  : "Fix the blockers or warnings above, then rerun `pnpm run data:publish:candidate`."}
`;
  const normalizedMarkdown = markdown.replace(/\n+$/, "\n");

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-publish-candidate.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-publish-candidate.md"), normalizedMarkdown),
  ]);

  console.log(`Publish candidate: ${ready ? "ready" : "blocked"}.`);
  console.log("Report written to data/reports/latest-publish-candidate.md");
  if (!ready) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
