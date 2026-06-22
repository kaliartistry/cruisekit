#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = process.cwd();
const today = new Date().toISOString().slice(0, 10);
const reportPath = path.join(root, "ops", "reports", "daily", `${today}.md`);

function run(cmd, args) {
  try {
    return execFileSync(cmd, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    return [error.stdout, error.stderr, error.message].filter(Boolean).join("\n").trim();
  }
}

function readApprovalItems() {
  const file = path.join(root, "ops", "tasks", "approval_queue.yml");
  if (!fs.existsSync(file)) return "- None recorded.";
  const text = fs.readFileSync(file, "utf8");
  const titles = Array.from(text.matchAll(/title:\s*(.+)/g)).map((match) => `- ${match[1].trim()}`);
  return titles.length ? titles.join("\n") : "- None recorded.";
}

const status = run("git", ["status", "--short", "--branch"]);
const prs = run("gh", ["pr", "list", "--limit", "10", "--json", "number,title,url,state"]);
const lines = [
  `# CruiseKit GrowthOps Daily Report - ${today}`,
  "",
  "## What was completed yesterday",
  "",
  "- Not yet recorded by this automation worker.",
  "",
  "## What changed in the product/site",
  "",
  `- Current git status: \`${status.replace(/\r?\n/g, " | ")}\``,
  "",
  "## What was tested",
  "",
  "- Fill from today's preflight/postflight output.",
  "",
  "## What failed",
  "",
  "- Fill from today's preflight/postflight output.",
  "",
  "## What was fixed",
  "",
  "- Fill after the daily task PR is created.",
  "",
  "## Open PRs",
  "",
  prs && prs.startsWith("[") ? `\`\`\`json\n${prs}\n\`\`\`` : `- ${prs || "Unavailable."}`,
  "",
  "## Approval items for Kali",
  "",
  readApprovalItems(),
  "",
  "## Risks/blockers",
  "",
  "- Local Firestore emulator rules tests require Java.",
  "- Repo is public; keep ops reports public-safe until Kali approves the visibility model.",
  "",
  "## Today's planned work",
  "",
  "- Run preflight, update inventory if needed, select one safe foundation task, create a branch, open a PR, then stop.",
  "",
  "## Recommended focus",
  "",
  "- Start with foundation and technical SEO inventory work before drafting major public pages.",
  "",
];

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${lines.join("\n")}\n`);
console.log(reportPath);
