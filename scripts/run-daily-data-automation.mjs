#!/usr/bin/env node
/**
 * Runs all daily CruiseKit data checks, even if one check finds blockers.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const reportOnly = process.env.CRUISEKIT_REPORT_ONLY === "1";
const steps = [
  { name: "build bundles", command: "pnpm", args: ["run", "data:build"] },
  {
    name: "data health",
    command: "node",
    args: ["scripts/data-quality-report.mjs"],
    softFailure: true,
    reportPath: "data/reports/latest-data-health.json",
  },
  {
    name: "link audit",
    command: "pnpm",
    args: ["run", "data:audit:links"],
    softFailure: true,
    reportPath: "data/reports/latest-link-audit.json",
  },
  {
    name: "image audit",
    command: "pnpm",
    args: ["run", "data:audit:images"],
    softFailure: true,
    reportPath: "data/reports/latest-image-audit.json",
  },
  { name: "manual review queue", command: "pnpm", args: ["run", "data:review:manual"] },
];

async function hasFreshReport(relPath, startedAt) {
  if (!relPath) return false;
  try {
    const report = JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
    const generatedAt = Date.parse(report.generatedAt);
    return Number.isFinite(generatedAt) && generatedAt >= startedAt - 5000;
  } catch {
    return false;
  }
}

function runStep(step) {
  return new Promise((resolveStep) => {
    console.log(`\n=== Daily automation: ${step.name} ===`);
    const startedAt = Date.now();
    const child = spawn(step.command, step.args, {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
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
    child.on("close", async (code) => {
      const reportBlocked = code !== 0 && step.softFailure && (await hasFreshReport(step.reportPath, startedAt));
      const status = code === 0 ? "ok" : reportBlocked ? "blocked" : "failed";
      resolveStep({
        name: step.name,
        exitCode: code,
        ok: code === 0,
        status,
        stdoutTail: stdout.split("\n").slice(-30).join("\n"),
        stderrTail: stderr.split("\n").slice(-30).join("\n"),
      });
    });
  });
}

async function main() {
  const results = [];
  for (const step of steps) {
    results.push(await runStep(step));
  }

  const hardFailures = results.filter((result) => result.status === "failed");
  const blocked = results.filter((result) => result.status === "blocked");
  const report = {
    generatedAt: new Date().toISOString(),
    ok: hardFailures.length === 0 && blocked.length === 0,
    reportOnly,
    blockedSteps: blocked.map((result) => result.name),
    failedSteps: hardFailures.map((result) => result.name),
    results,
  };
  const markdown = `# CruiseKit Daily Automation Run

Generated: ${report.generatedAt}

## Summary

| Step | Status | Exit |
| --- | --- | ---: |
${results.map((result) => `| ${result.name} | ${result.status} | ${result.exitCode} |`).join("\n")}

## Blocked Steps

${blocked.length === 0 ? "- None\n" : blocked.map((result) => `- ${result.name}`).join("\n") + "\n"}
## Failed Steps

${hardFailures.length === 0 ? "- None\n" : hardFailures.map((result) => `- ${result.name}`).join("\n") + "\n"}
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-daily-automation.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-daily-automation.md"), markdown),
  ]);

  console.log(`Daily automation: ${blocked.length} blocked step(s), ${hardFailures.length} failed step(s).`);
  console.log("Report written to data/reports/latest-daily-automation.md");
  if (hardFailures.length > 0 || (!reportOnly && blocked.length > 0)) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
