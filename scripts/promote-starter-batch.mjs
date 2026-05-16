#!/usr/bin/env node
/**
 * Promotes a conservative starter batch from reviewed, priced staging records.
 *
 * This is the operational action layer behind the workbench: it builds an
 * auditable selection plan, then delegates writes to the provider-specific
 * promotion scripts so all existing validation/reporting stays in one place.
 */
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const providerConfig = {
  carnival: {
    reviewPath: "data/reports/latest-carnival-staging-review.json",
    promoteScript: "data:promote:carnival",
    defaultLimit: 6,
  },
  norwegian: {
    reviewPath: "data/reports/latest-norwegian-staging-review.json",
    promoteScript: "data:promote:norwegian",
    defaultLimit: 4,
  },
};

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function parseArgs(argv) {
  const args = {
    apply: false,
    providers: ["carnival", "norwegian"],
    limits: {},
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    else if (arg === "--apply") args.apply = true;
    else if (arg === "--dry-run") args.apply = false;
    else if (arg === "--providers") args.providers = parseList(argv[++index] ?? "");
    else if (arg.startsWith("--providers=")) args.providers = parseList(arg.slice("--providers=".length));
    else if (arg === "--carnival-limit") args.limits.carnival = parseLimit(argv[++index], "carnival");
    else if (arg.startsWith("--carnival-limit=")) args.limits.carnival = parseLimit(arg.slice("--carnival-limit=".length), "carnival");
    else if (arg === "--norwegian-limit") args.limits.norwegian = parseLimit(argv[++index], "norwegian");
    else if (arg.startsWith("--norwegian-limit=")) args.limits.norwegian = parseLimit(arg.slice("--norwegian-limit=".length), "norwegian");
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  for (const provider of args.providers) {
    if (!providerConfig[provider]) throw new Error(`Unsupported provider: ${provider}`);
  }
  return args;
}

function parseList(value) {
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

function parseLimit(value, provider) {
  const limit = Number.parseInt(value ?? "", 10);
  if (!Number.isInteger(limit) || limit < 0) throw new Error(`--${provider}-limit must be zero or a positive integer.`);
  return limit;
}

function printHelp() {
  console.log(`Usage:
  pnpm run data:promote:starter-batch -- --dry-run
  pnpm run data:promote:starter-batch -- --apply

Options:
  --apply                    Write seed data through provider promotion scripts.
  --dry-run                  Generate reports only. Default.
  --providers <csv>          Providers to include. Default: carnival,norwegian.
  --carnival-limit <n>       Carnival starter records. Default: ${providerConfig.carnival.defaultLimit}.
  --norwegian-limit <n>      Norwegian starter records. Default: ${providerConfig.norwegian.defaultLimit}.
`);
}

function candidateScore(record) {
  let score = 0;
  const port = String(record.departurePort ?? "").toLowerCase();
  if (record.destinationRegion === "caribbean" || record.destinationRegion === "bahamas") score += 5;
  if (record.destinationRegion === "mexico") score += 3;
  if (record.nights >= 5 && record.nights <= 8) score += 3;
  if (record.nights === 4) score += 1;
  if (record.startingPrice != null && record.startingPrice <= 700) score += 3;
  if (record.startingPrice != null && record.startingPrice <= 900) score += 2;
  if (port.includes("miami") || port.includes("port canaveral") || port.includes("fort lauderdale")) score += 2;
  if (port.includes("tampa") || port.includes("new orleans") || port.includes("galveston")) score += 1;
  if (record.departureDate >= "2026-07-01" && record.departureDate <= "2027-12-31") score += 1;
  return score;
}

function chooseCandidates(report, limit) {
  return (report.recommendedNew ?? [])
    .filter((record) => record.startingPrice != null)
    .map((record) => ({ ...record, score: candidateScore(record) }))
    .sort((a, b) => b.score - a.score || a.startingPrice - b.startingPrice || a.departureDate.localeCompare(b.departureDate))
    .slice(0, limit);
}

function markdownPlan(plan) {
  const sections = plan.providers.map((provider) => {
    const rows = provider.selected.length === 0
      ? "- None\n"
      : [
          "| Ship | Date | Nights | Price | Departure | ID |",
          "| --- | --- | ---: | ---: | --- | --- |",
          ...provider.selected.map(
            (record) =>
              `| ${record.shipName} | ${record.departureDate} | ${record.nights} | $${Math.round(record.startingPrice).toLocaleString("en-US")} | ${record.departurePort} | \`${record.id}\` |`,
          ),
        ].join("\n") + "\n";
    return `## ${provider.label}

Command:

\`\`\`bash
${provider.command}
\`\`\`

${rows}`;
  });

  return `# Starter Batch Promotion Plan

Generated: ${plan.generatedAt}

Mode: ${plan.mode}

## Counts

| Provider | Selected |
| --- | ---: |
${plan.providers.map((provider) => `| ${provider.label} | ${provider.selected.length} |`).join("\n")}

${sections.join("\n")}
## Rules

- Only records with observed staging prices are eligible.
- Promoted records remain \`itinerary_verified_price_check_required\`.
- Run \`pnpm run data:publish\` after applying to refresh web/mobile bundles.
`;
}

async function runPromotion(provider, ids, apply) {
  const config = providerConfig[provider];
  const args = ["run", config.promoteScript, "--", apply ? "--apply" : "--dry-run", `--ids=${ids.join(",")}`];
  const { stdout, stderr } = await execFileAsync("pnpm", args, { cwd: repoRoot, maxBuffer: 1024 * 1024 * 4 });
  return { command: `pnpm ${args.join(" ")}`, stdout, stderr };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const generatedAt = new Date().toISOString();
  const providers = [];

  for (const provider of args.providers) {
    const config = providerConfig[provider];
    const review = await loadJson(config.reviewPath);
    const limit = args.limits[provider] ?? config.defaultLimit;
    const selected = chooseCandidates(review, limit);
    const result = selected.length > 0
      ? await runPromotion(provider, selected.map((record) => record.id), args.apply)
      : { command: `pnpm run ${config.promoteScript} -- ${args.apply ? "--apply" : "--dry-run"} --ids=`, stdout: "", stderr: "" };
    providers.push({
      provider,
      label: provider === "norwegian" ? "Norwegian" : "Carnival",
      selected,
      command: result.command,
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim(),
    });
  }

  const plan = {
    generatedAt,
    mode: args.apply ? "apply" : "dry-run",
    options: args,
    providers,
  };

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-starter-batch-promotion.json"), `${JSON.stringify(plan, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-starter-batch-promotion.md"), markdownPlan(plan)),
  ]);

  console.log(`Starter batch promotion ${plan.mode}: ${providers.reduce((sum, provider) => sum + provider.selected.length, 0)} selected.`);
  console.log("Report written to data/reports/latest-starter-batch-promotion.md");
  for (const provider of providers) {
    if (provider.stdout) console.log(provider.stdout);
    if (provider.stderr) console.error(provider.stderr);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
