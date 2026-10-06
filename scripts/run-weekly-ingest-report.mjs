#!/usr/bin/env node
/**
 * Runs cruise-line ingest and staging-review jobs for scheduled automation.
 *
 * These jobs may write raw/staging/report files in the working tree, but this
 * script never promotes or publishes records. Individual provider/review
 * failures are collected as warnings so a single blocked supplier does not
 * hide the rest of the weekly signal.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { recheck } from "./run-fare-recheck.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const policy = JSON.parse(await readFile(resolve(repoRoot, "data/fare-verification-policy.json"), "utf8"));
function stopOwnedChild(child, signal) {
  try {
    if (process.platform !== "win32" && child.pid) process.kill(-child.pid, signal);
    else child.kill(signal);
  } catch { /* The owned process group already exited. */ }
}
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
const reviews = [
  { provider: "azamara", command: "data:review:azamara" },
  { provider: "carnival", command: "data:review:carnival" },
  { provider: "holland-america", command: "data:review:holland-america" },
  { provider: "norwegian", command: "data:review:norwegian" },
  { provider: "princess", command: "data:review:princess" },
  { provider: "virgin-voyages", command: "data:review:virgin-voyages" },
];

function runProvider(provider) {
  const access = policy.providers[provider];
  if (access?.access !== "approved" || !access.contractVersion) {
    return Promise.resolve({ provider, startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), exitCode: null, ok: false, status: "access-review-required", reason: access?.reason ?? "No approved source contract", stdoutTail: "", stderrTail: "" });
  }
  return new Promise((resolveRun) => {
    const startedAt = new Date().toISOString();
    const child = spawn("pnpm", ["run", `data:ingest:${provider}`], {
      cwd: repoRoot,
      detached: process.platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        CRUISEKIT_REPORT_ONLY: "1",
      },
    });

    let stdout = "";
    let stderr = "";
    const deadline = setTimeout(() => stopOwnedChild(child, "SIGTERM"), 120000);
    const forceDeadline = setTimeout(() => stopOwnedChild(child, "SIGKILL"), 125000);
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout = (stdout + text).slice(-12000);
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr = (stderr + text).slice(-12000);
      process.stderr.write(text);
    });
    child.on("close", (code) => {
      clearTimeout(deadline); clearTimeout(forceDeadline);
      stopOwnedChild(child, "SIGKILL");
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
    child.on("error", (error) => { clearTimeout(deadline); clearTimeout(forceDeadline); resolveRun({ provider, startedAt, finishedAt: new Date().toISOString(), exitCode: null, ok: false, stderrTail: error.message }); });
  });
}

function runReview(review) {
  return new Promise((resolveRun) => {
    const startedAt = new Date().toISOString();
    const child = spawn("pnpm", ["run", review.command], {
      cwd: repoRoot,
      detached: process.platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        CRUISEKIT_REPORT_ONLY: "1",
      },
    });

    let stdout = "";
    let stderr = "";
    const deadline = setTimeout(() => stopOwnedChild(child, "SIGTERM"), 30000);
    const forceDeadline = setTimeout(() => stopOwnedChild(child, "SIGKILL"), 35000);
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout = (stdout + text).slice(-12000);
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr = (stderr + text).slice(-12000);
      process.stderr.write(text);
    });
    child.on("close", (code) => {
      clearTimeout(deadline); clearTimeout(forceDeadline);
      stopOwnedChild(child, "SIGKILL");
      resolveRun({
        provider: review.provider,
        command: review.command,
        startedAt,
        finishedAt: new Date().toISOString(),
        exitCode: code,
        ok: code === 0,
        stdoutTail: stdout.split("\n").slice(-40).join("\n"),
        stderrTail: stderr.split("\n").slice(-40).join("\n"),
      });
    });
    child.on("error", (error) => { clearTimeout(deadline); clearTimeout(forceDeadline); resolveRun({ provider: review.provider, startedAt, finishedAt: new Date().toISOString(), exitCode: null, ok: false, stderrTail: error.message }); });
  });
}

async function main() {
  const runStartedAt = new Date().toISOString();
  const results = [];
  for (const provider of providers) {
    console.log(`\n=== Weekly ingest: ${provider} ===`);
    results.push(await runProvider(provider));
  }

  const reviewResults = [];
  for (const review of reviews) {
    console.log(`\n=== Weekly staging review: ${review.provider} ===`);
    const imported = results.find(r => r.provider === review.provider);
    reviewResults.push(imported?.ok ? await runReview(review) : { provider: review.provider, ok: false, exitCode: null, status: "skipped", reason: "This run has no successful approved import; old staging is not reused." });
  }

  // Re-read the public rules weekly; this never attempts a denied quote path
  // and never treats a rules check as a successful fare observation.
  const verification = await recheck({ startedAt: runStartedAt, latest: true, probeProvider: "norwegian" });

  const failed = results.filter((result) => !result.ok);
  const failedReviews = reviewResults.filter((result) => !result.ok);
  const report = {
    generatedAt: new Date().toISOString(),
    mode: "weekly-ingest-and-review-report-only",
    providers,
    reviews: reviews.map((review) => review.provider),
    ok: failed.length === 0 && failedReviews.length === 0 && verification.ready,
    runStartedAt,
    fareVerification: { generatedAt: verification.generatedAt, counts: verification.counts, ready: verification.ready, publicationEnabled: false },
    failedProviders: failed.map((result) => result.provider),
    failedReviews: failedReviews.map((result) => result.provider),
    results,
    reviewResults,
  };

  const markdown = `# CruiseKit Weekly Ingest Report

Generated: ${report.generatedAt}

Mode: report-only. No staged records were promoted or published by this job.

## Ingest Summary

| Provider | Status | Exit |
| --- | --- | ---: |
${results.map((result) => `| ${result.provider} | ${result.ok ? "ok" : "warning"} | ${result.exitCode} |`).join("\n")}

## Staging Review Summary

| Provider | Status | Exit |
| --- | --- | ---: |
${reviewResults.map((result) => `| ${result.provider} | ${result.ok ? "ok" : "warning"} | ${result.exitCode} |`).join("\n")}

## Failed Or Blocked Providers

${failed.length === 0 ? "- None\n" : failed.map((result) => `- ${result.provider}`).join("\n") + "\n"}
## Failed Or Blocked Reviews

${failedReviews.length === 0 ? "- None\n" : failedReviews.map((result) => `- ${result.provider}`).join("\n") + "\n"}
`;

  await mkdir(reportDir, { recursive: true });
  const normalizedMarkdown = markdown.replace(/\n+$/, "\n");
  await Promise.all([
    writeFile(resolve(reportDir, "latest-weekly-ingest.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-weekly-ingest.md"), normalizedMarkdown),
  ]);

  console.log(`Weekly ingest report: ${failed.length} provider warning(s), ${failedReviews.length} review warning(s).`);
  console.log("Report written to data/reports/latest-weekly-ingest.md");
  // A completed report is not a successful price verification.
  if (!report.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
