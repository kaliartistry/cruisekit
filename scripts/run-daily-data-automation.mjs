#!/usr/bin/env node
/**
 * Runs all daily CruiseKit data checks, even if one check finds blockers.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const steps = [
  { name: "build bundles", command: "pnpm", args: ["run", "data:build"] },
  { name: "data health", command: "node", args: ["scripts/data-quality-report.mjs"] },
  { name: "link audit", command: "pnpm", args: ["run", "data:audit:links"] },
  { name: "image audit", command: "pnpm", args: ["run", "data:audit:images"] },
  { name: "manual review queue", command: "pnpm", args: ["run", "data:review:manual"] },
];

function runStep(step) {
  return new Promise((resolveStep) => {
    console.log(`\n=== Daily automation: ${step.name} ===`);
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
    child.on("close", (code) => {
      resolveStep({
        name: step.name,
        exitCode: code,
        ok: code === 0,
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

  const failed = results.filter((result) => !result.ok);
  const report = {
    generatedAt: new Date().toISOString(),
    ok: failed.length === 0,
    failedSteps: failed.map((result) => result.name),
    results,
  };
  const markdown = `# CruiseKit Daily Automation Run

Generated: ${report.generatedAt}

## Summary

| Step | Status | Exit |
| --- | --- | ---: |
${results.map((result) => `| ${result.name} | ${result.ok ? "ok" : "blocked"} | ${result.exitCode} |`).join("\n")}

## Failed Steps

${failed.length === 0 ? "- None\n" : failed.map((result) => `- ${result.name}`).join("\n") + "\n"}
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-daily-automation.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-daily-automation.md"), markdown),
  ]);

  console.log(`Daily automation: ${failed.length} failed step(s).`);
  console.log("Report written to data/reports/latest-daily-automation.md");
  if (failed.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
