#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = process.cwd();
const today = new Date().toISOString().slice(0, 10);

if (process.platform === "win32") {
  try {
    const refreshedPath = execFileSync("powershell.exe", [
      "-NoProfile",
      "-Command",
      "[Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')",
    ], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (refreshedPath) {
      process.env.Path = refreshedPath;
      process.env.PATH = refreshedPath;
    }
  } catch {}
}

function compact(output, maxLength = 8000) {
  if (!output || output.length <= maxLength) return output || "";
  return `${output.slice(0, maxLength)}\n... truncated ${output.length - maxLength} characters ...`;
}

function run(name, cmd, args) {
  const useWindowsShell = process.platform === "win32" && cmd === "corepack";
  try {
    const output = useWindowsShell
      ? execFileSync("cmd.exe", ["/d", "/s", "/c", ["corepack", ...args].join(" ")], {
          cwd: root,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        }).trim()
      : execFileSync(cmd, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
    return {
      name,
      ok: true,
      output: compact(output),
    };
  } catch (error) {
    return {
      name,
      ok: false,
      output: compact([error.stdout, error.stderr, error.message].filter(Boolean).join("\n").trim()),
    };
  }
}

const branch = run("branch", "git", ["branch", "--show-current"]);
const checks = [
  { name: "path-not-onedrive", ok: !/OneDrive|Documents|Desktop/i.test(root), output: root },
  run("git-status", "git", ["status", "--short", "--branch"]),
  branch,
  { name: "branch-not-main", ok: !/^(main|master)$/.test(branch.output || ""), output: branch.output || "Unable to determine branch" },
  run("duplicate-routes", process.execPath, ["ops/scripts/duplicate-check.js"]),
  run("link-static-scan", process.execPath, ["ops/scripts/link-check.js"]),
  run("web-lint", "corepack", ["pnpm", "--filter", "web", "lint"]),
  run("functions-lint", "corepack", ["pnpm", "--filter", "cruisekit-functions", "lint"]),
  run("rules-test", "corepack", ["pnpm", "run", "test:rules"]),
  run("secret-scan", "git", ["grep", "-n", "-I", "-E", "(api[_-]?key|secret|private[_-]?key|password|token)\\s*[:=]\\s*['\\\"][A-Za-z0-9_./+=-]{16,}", "--", "."]),
];

const buildRequested = process.env.GROWTHOPS_RUN_BUILD === "true";
if (buildRequested) {
  checks.push(run("web-build", "corepack", ["pnpm", "--filter", "web", "build"]));
} else {
  checks.push({
    name: "web-build",
    ok: true,
    output: "Skipped unless GROWTHOPS_RUN_BUILD=true because the handoff warns local builds can refresh generated bundle outputs.",
  });
}

const blockedTerms = run("approval-claim-scan", "git", ["grep", "-n", "-I", "-E", "(#1|official|partnered|certified|pricing|subscription|IRS|tax|banking|payment processor|Terms of Service|Privacy Policy)", "--", "apps/web", "ops"]);
checks.push(blockedTerms);

const report = {
  generatedAt: new Date().toISOString(),
  branch: branch.output,
  checks,
  passed: checks.every((check) => check.ok || check.name === "rules-test" || check.name === "secret-scan" || check.name === "approval-claim-scan"),
  notes: [
    "rules-test may fail locally when Java is missing for the Firestore emulator.",
    "secret-scan and approval-claim-scan use broad patterns; review matches before treating them as findings.",
    "Do not commit from main.",
  ],
};

function isAllowedSoftFailure(check) {
  if (["secret-scan", "approval-claim-scan"].includes(check.name)) return true;
  if (check.name === "rules-test") {
    return /java|JDK|ECONNREFUSED|Firestore emulator/i.test(check.output || "");
  }
  return false;
}

const reportPath = path.join(root, "ops", "reports", "audits", `postflight-${today}.json`);
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify({ ...report, auditReport: reportPath }, null, 2)}\n`);
report.auditReport = reportPath;

console.log(JSON.stringify(report, null, 2));
if (/^(main|master)$/.test(branch.output || "")) process.exitCode = 1;
if (checks.some((check) => !check.ok && !isAllowedSoftFailure(check))) process.exitCode = 1;
