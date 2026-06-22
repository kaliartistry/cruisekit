#!/usr/bin/env node
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const title = "CruiseKit GrowthOps approvals needed";
const label = "needs-kali";

function run(cmd, args) {
  try {
    return { ok: true, output: execFileSync(cmd, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim() };
  } catch (error) {
    return { ok: false, output: [error.stdout, error.stderr, error.message].filter(Boolean).join("\n").trim() };
  }
}

const queueFile = path.join(root, "ops", "tasks", "approval_queue.yml");
const queue = fs.existsSync(queueFile) ? fs.readFileSync(queueFile, "utf8") : "No approval queue file found.";
const body = [
  "GrowthOps approval items for Kali:",
  "",
  "```yaml",
  queue.trim(),
  "```",
  "",
  "Bootstrap blockers found tonight:",
  "",
  "- OneDrive placeholder folder could not be renamed because Windows reported it was in use; automation will use `C:\\Users\\ilak_\\Projects\\cruisekit` only.",
  "- Local Java is missing, so Firestore emulator rules tests cannot run on this machine yet.",
  "- Email notifications are not configured; GitHub issues labeled `needs-kali` are the fallback.",
].join("\n");

run("gh", ["label", "create", label, "--description", "Needs Kali approval or decision", "--color", "B60205"]);
const existing = run("gh", ["issue", "list", "--state", "open", "--search", `${title} in:title`, "--json", "number,title"]);
let number = null;
if (existing.ok) {
  try {
    const issues = JSON.parse(existing.output || "[]");
    const match = issues.find((issue) => issue.title === title);
    number = match && match.number;
  } catch {}
}

if (number) {
  const result = run("gh", ["issue", "edit", String(number), "--body", body, "--add-label", label]);
  if (!result.ok) {
    console.error(result.output);
    process.exit(1);
  }
  console.log(`Updated issue #${number}`);
} else {
  const result = run("gh", ["issue", "create", "--title", title, "--body", body, "--label", label]);
  if (!result.ok) {
    console.error(result.output);
    process.exit(1);
  }
  console.log(result.output);
}
