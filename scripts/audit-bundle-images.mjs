#!/usr/bin/env node
/**
 * Verifies that public/mobile deal image references are present and resolvable
 * to bundled website assets. Also performs a trust pass so obvious image/data
 * mismatches get surfaced before bundles publish.
 */
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function add(list, severity, id, message) {
  list.push({ severity, id, message });
}

function markdownList(findings) {
  if (findings.length === 0) return "- None\n";
  return findings
    .map((finding) => `- ${finding.severity}: ${finding.id} - ${finding.message}`)
    .join("\n") + "\n";
}

async function fileExists(relPath) {
  try {
    await access(resolve(repoRoot, relPath));
    return true;
  } catch {
    return false;
  }
}

async function assetExistsFor(imageUrl) {
  if (!imageUrl || /^https?:\/\//.test(imageUrl)) return null;
  const normalized = imageUrl.replace(/^\/+/, "");
  const candidates = [`apps/web/public/${normalized}`];
  if (normalized.startsWith("assets/images/")) {
    candidates.push(`apps/web/public/${normalized.replace("assets/images/", "assets/")}`);
  }
  if (normalized.startsWith("assets/")) {
    candidates.push(`apps/web/public/assets/images/${normalized.replace("assets/", "")}`);
  }
  for (const candidate of candidates) {
    if (await fileExists(candidate)) return { ok: true, path: candidate };
  }
  return { ok: false, path: candidates[0] };
}

function imageSlugFor(imageUrl) {
  if (!imageUrl) return null;
  const clean = imageUrl.split(/[?#]/)[0].replace(/\\/g, "/");
  const filename = clean.split("/").pop() ?? "";
  const slug = filename.replace(/\.(jpg|jpeg|png|webp)$/i, "").trim();
  return slug || null;
}

const textImageRules = [
  [
    /cozumel|western caribbean|costa maya|progreso|mexico/i,
    ["cozumel", "costa-maya", "progreso"],
  ],
  [/nassau|bahamas/i, ["nassau", "bimini", "freeport"]],
  [/great stirrup/i, ["great-stirrup-cay"]],
  [/cococay|perfect day/i, ["cococay"]],
  [/half moon/i, ["half-moon-cay"]],
  [/celebration key/i, ["celebration-key"]],
  [/ocean cay/i, ["ocean-cay"]],
  [/princess cays/i, ["princess-cays"]],
  [
    /puerto plata|dominican|amber cove|la romana|samana/i,
    ["puerto-plata", "amber-cove", "la-romana", "samana"],
  ],
  [/grand cayman|george town/i, ["grand-cayman"]],
  [/roatan|honduras/i, ["roatan"]],
  [/grand turk/i, ["grand-turk"]],
  [/st\.? thomas|charlotte amalie|eastern caribbean/i, ["st-thomas", "nassau", "cococay"]],
  [/st\.? maarten|philipsburg/i, ["st-maarten"]],
  [/san juan|puerto rico/i, ["san-juan"]],
  [/curacao|willemstad|southern caribbean/i, ["curacao"]],
  [/aruba|oranjestad/i, ["aruba"]],
  [/bonaire|kralendijk/i, ["bonaire"]],
  [/antigua/i, ["antigua"]],
  [/st\.? lucia|saint lucia/i, ["st-lucia"]],
  [/st\.?\s*kitts|saint kitts/i, ["st-kitts"]],
  [/bermuda/i, ["bermuda"]],
  [/barcelona|mediterranean/i, ["barcelona"]],
  [/sicily|messina/i, ["sicily-messina"]],
  [
    /juneau|alaska/i,
    ["juneau", "ketchikan", "skagway", "sitka", "icy-strait-point", "seattle", "vancouver"],
  ],
  [/vancouver/i, ["vancouver"]],
  [/seattle/i, ["seattle"]],
  [/miami/i, ["miami"]],
  [/tampa/i, ["tampa"]],
];

const blockedImageSlugPatterns = [
  /airport/i,
  /airplane/i,
  /aircraft/i,
  /flight/i,
  /runway/i,
];

function expectedImageSlugsFor(deal) {
  const text = [
    deal.itineraryTitle,
    deal.departurePort,
    deal.region,
    deal.destinationRegion,
    ...(Array.isArray(deal.ports) ? deal.ports : []),
  ]
    .filter(Boolean)
    .join(" ");

  const slugs = new Set();
  for (const [pattern, matches] of textImageRules) {
    if (pattern.test(text)) {
      for (const match of matches) slugs.add(match);
    }
  }
  return slugs;
}

async function main() {
  const [canonicalDeals, mobileDeals] = await Promise.all([
    loadJson("data/bundles/canonical/deals.json"),
    loadJson("data/bundles/mobile/deals.json"),
  ]);

  const blockers = [];
  const warnings = [];
  const usage = {};
  const all = [
    ...canonicalDeals.map((deal) => ({ bundle: "canonical", deal })),
    ...mobileDeals.map((deal) => ({ bundle: "mobile", deal })),
  ];

  for (const { bundle, deal } of all) {
    const id = `${bundle}:${deal.id}`;
    if (!deal.imageUrl) {
      add(blockers, "blocker", id, "Missing imageUrl.");
      continue;
    }

    const asset = await assetExistsFor(deal.imageUrl);
    if (!asset) {
      add(warnings, "warning", id, `External or unknown image path: ${deal.imageUrl}`);
      continue;
    }

    if (!asset.ok) {
      add(blockers, "blocker", id, `Missing bundled image asset: ${asset.path}`);
      continue;
    }

    const imageSlug = imageSlugFor(deal.imageUrl);
    if (!imageSlug) continue;
    usage[imageSlug] = (usage[imageSlug] ?? 0) + 1;

    if (blockedImageSlugPatterns.some((pattern) => pattern.test(imageSlug))) {
      add(blockers, "blocker", id, `Image slug appears non-cruise-related: ${imageSlug}`);
      continue;
    }

    const expectedSlugs = expectedImageSlugsFor(deal);
    if (expectedSlugs.size > 0 && !expectedSlugs.has(imageSlug)) {
      add(
        warnings,
        "warning",
        id,
        `Image ${imageSlug} does not match expected destination image(s): ${[...expectedSlugs].sort().join(", ")}`,
      );
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    counts: {
      canonicalDeals: canonicalDeals.length,
      mobileDeals: mobileDeals.length,
      checkedImages: all.length,
    },
    imageUsage: Object.fromEntries(
      Object.entries(usage).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    ),
    blockers,
    warnings,
  };

  const markdown = `# CruiseKit Bundle Image Audit

Generated: ${report.generatedAt}

## Counts

| Metric | Count |
| --- | ---: |
| Canonical deals | ${report.counts.canonicalDeals} |
| Mobile deals | ${report.counts.mobileDeals} |
| Checked image references | ${report.counts.checkedImages} |

## Blockers

${markdownList(blockers)}
## Warnings

${markdownList(warnings)}

## Top Image Usage

${Object.entries(report.imageUsage)
  .slice(0, 20)
  .map(([slug, count]) => `- ${slug}: ${count}`)
  .join("\n") || "- None"}
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-image-audit.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-image-audit.md"), markdown),
  ]);

  console.log(`Image audit: ${blockers.length} blocker(s), ${warnings.length} warning(s).`);
  console.log("Report written to data/reports/latest-image-audit.md");
  if (blockers.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
