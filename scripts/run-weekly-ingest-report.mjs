#!/usr/bin/env node
/**
 * Runs cruise-line ingest jobs in report-only mode for scheduled automation.
 *
 * These jobs may write raw/staging/report files in the working tree, but this
 * script never promotes or publishes records. Individual provider failures are
 * collected as warnings so a single blocked supplier does not hide the rest of
 * the weekly signal.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const providers = [
  "azamara",
  "carnival",
  "holland-america",
  "msc",
  "norwegian",
  "princess",
  "royal-caribbean",
  "viking",
  "virgin-voyages",
];

function runProvider(provider) {
  return new Promise((resolveRun) => {
    const startedAt = new Date().toISOString();
    const child = spawn("pnpm", ["run", `data:ingest:${provider}`], {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        CRUISEKIT_REPORT_ONLY: "1",
      },
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
        provider,
        startedAt,
        finishedAt: new Date().toISOString(),
        exitCode: code,
        ok: code === 0,
        stdoutTail: stdout.split("\n").slice(-40).join("\n"),
        stderrTail: stderr.split("\n").slice(-40).join("\n"),
      });
    });
  });
}

async function main() {
  const results = [];
  for (const provider of providers) {
    console.log(`\n=== Weekly ingest: ${provider} ===`);
    results.push(await runProvider(provider));
  }

  const failed = results.filter((result) => !result.ok);
  const report = {
    generatedAt: new Date().toISOString(),
    mode: "weekly-ingest-report-only",
    providers,
    ok: failed.length === 0,
    failedProviders: failed.map((result) => result.provider),
    results,
  };

  const markdown = `# CruiseKit Weekly Ingest Report

Generated: ${report.generatedAt}

Mode: report-only. No staged records were promoted or published by this job.

## Summary

| Provider | Status | Exit |
| --- | --- | ---: |
${results.map((result) => `| ${result.provider} | ${result.ok ? "ok" : "warning"} | ${result.exitCode} |`).join("\n")}

## Failed Or Blocked Providers

${failed.length === 0 ? "- None\n" : failed.map((result) => `- ${result.provider}`).join("\n") + "\n"}
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-weekly-ingest.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-weekly-ingest.md"), markdown),
  ]);

  console.log(`Weekly ingest report: ${failed.length} provider warning(s).`);
  console.log("Report written to data/reports/latest-weekly-ingest.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
