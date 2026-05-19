#!/usr/bin/env node
/**
 * Viking official-source itinerary/deal-candidate importer.
 *
 * Viking's public search page renders itinerary-level cards in the browser.
 * Those cards do not contain dated sailing records, so this importer writes a
 * review queue instead of canonical sailings. It does not edit data/seed/*.json.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const provider = "viking";
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const rawDir = resolve(repoRoot, `data/ingest/raw/${provider}/${runId}`);
const stagingDir = resolve(repoRoot, `data/ingest/staging/${provider}/${runId}`);
const reportsDir = resolve(repoRoot, `data/ingest/reports/${provider}`);
const latestReportDir = resolve(repoRoot, "data/reports");

const sourceUrl = process.env.VIKING_SOURCE_URL ?? "https://www.vikingcruises.com/oceans/search-cruises/index.html";
const maxCandidates = Number.parseInt(process.env.VIKING_MAX_CANDIDATES ?? "30", 10);

function stringifyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function parsePrice(value) {
  const amount = Number(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount) : null;
}

function looksLikeMarketingLine(value) {
  return /^[A-Z0-9 &|*$'.,-]+$/.test(value) && value.length > 8;
}

function parseCandidates(bodyText) {
  const startIndex = bodyText.indexOf("We Found");
  if (startIndex < 0) return [];

  const lines = bodyText
    .slice(startIndex)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^compare .+ collapsed, select up to 3 cruises to compare$/i.test(line));

  const candidates = [];
  for (let index = 1; index < lines.length && candidates.length < maxCandidates; index += 1) {
    if (!/^\d+$/.test(lines[index]) || lines[index + 1] !== "DAYS") continue;

    const descriptor = [];
    for (let lookback = index - 1; lookback >= 1 && descriptor.length < 4; lookback -= 1) {
      const value = lines[lookback];
      if (/^(COMPARE|FROM|LEARN MORE|PRICE & BUILD)$/i.test(value)) break;
      descriptor.unshift(value);
    }

    if (descriptor.length < 2) continue;
    const titleIndex = looksLikeMarketingLine(descriptor[0]) && descriptor.length > 2 ? 1 : 0;
    const title = descriptor[titleIndex];
    const route = descriptor[titleIndex + 1] ?? "";
    const offerText = descriptor.slice(titleIndex + 2).join(" ");
    const priceLine = lines.slice(index + 2, index + 9).find((line) => /^\$/.test(line));

    candidates.push({
      cruiseLine: "viking",
      title,
      route,
      days: Number(lines[index]),
      nights: Math.max(Number(lines[index]) - 1, 1),
      fromPrice: parsePrice(priceLine),
      currency: "USD",
      offerText,
      sourceUrl,
      confidence: "itinerary_level_price_check_required",
    });
  }
  return candidates;
}

async function captureVikingSearch() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
  });
  await page.goto(sourceUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(10000);
  const title = await page.title();
  const bodyText = await page.locator("body").innerText({ timeout: 5000 });
  await browser.close();
  return { title, bodyText };
}

async function main() {
  const generatedAt = new Date().toISOString();
  await Promise.all([
    mkdir(rawDir, { recursive: true }),
    mkdir(stagingDir, { recursive: true }),
    mkdir(reportsDir, { recursive: true }),
    mkdir(latestReportDir, { recursive: true }),
  ]);

  const capture = await captureVikingSearch();
  await writeFile(resolve(rawDir, "page-text.txt"), `${capture.bodyText}\n`);

  const candidates = parseCandidates(capture.bodyText);
  await writeFile(resolve(stagingDir, "itinerary-candidates.json"), stringifyJson(candidates));
  await writeFile(resolve(stagingDir, "sailings.json"), "[]\n");
  await writeFile(resolve(stagingDir, "deals.json"), "[]\n");

  const prices = candidates.map((candidate) => candidate.fromPrice).filter((price) => Number.isFinite(price));
  const report = {
    generatedAt,
    provider,
    runId,
    mode: "itinerary-candidates-only",
    sourceUrl,
    pageTitle: capture.title,
    counts: {
      candidates: candidates.length,
      datedSailings: 0,
      canonicalDeals: 0,
    },
    priceRange: prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null,
    sampleCandidates: candidates.slice(0, 10),
    paths: {
      raw: rawDir,
      staging: stagingDir,
      report: reportsDir,
    },
    notes: [
      "Viking's search cards are official but itinerary-level; they do not include specific departure dates on the first search page.",
      "Use these candidates for manual/partner-feed follow-up before creating canonical sailings.",
    ],
  };

  const markdown = `# Viking Itinerary Candidate Import

Generated: ${generatedAt}

Mode: ${report.mode}

Source: ${sourceUrl}

## Counts

| Metric | Count |
| --- | ---: |
| Itinerary candidates | ${report.counts.candidates} |
| Dated canonical sailings | ${report.counts.datedSailings} |

## Next Step

Use these candidates to open Viking detail/booking pages or a partner feed, then create dated canonical sailing records only after exact dates and fare terms are verified.
`;

  await Promise.all([
    writeFile(resolve(reportsDir, `${runId}.json`), stringifyJson(report)),
    writeFile(resolve(latestReportDir, "latest-viking-staging-import.json"), stringifyJson(report)),
    writeFile(resolve(latestReportDir, "latest-viking-staging-import.md"), markdown),
  ]);

  console.log(`Viking candidate import: ${candidates.length} itinerary candidate(s).`);
  console.log("Report written to data/reports/latest-viking-staging-import.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
