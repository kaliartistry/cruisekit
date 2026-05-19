#!/usr/bin/env node
/**
 * Holland America official-source staging importer.
 *
 * Browser-reads the public cruise search results cards. The page exposes
 * dated sailings, ship, embark/debark ports, public starting fares, and taxes
 * language. This writes staging only and never edits data/seed/*.json.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { chromium } from "playwright";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const provider = "holland-america";
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const rawDir = resolve(repoRoot, `data/ingest/raw/${provider}/${runId}`);
const stagingDir = resolve(repoRoot, `data/ingest/staging/${provider}/${runId}`);
const reportsDir = resolve(repoRoot, `data/ingest/reports/${provider}`);
const latestReportDir = resolve(repoRoot, "data/reports");
const sourceUrl = process.env.HOLLAND_AMERICA_SOURCE_URL ?? "https://www.hollandamerica.com/en/us/find-a-cruise";
const maxPages = Number.parseInt(process.env.HOLLAND_AMERICA_MAX_PAGES ?? "8", 10);

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function stringifyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function addDays(dateValue, days) {
  const date = new Date(`${dateValue}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function normalizeRegion(value) {
  const text = String(value ?? "").toLowerCase();
  if (text.includes("alaska")) return "alaska";
  if (text.includes("bahamas")) return "bahamas";
  if (text.includes("caribbean")) return "caribbean";
  if (text.includes("hawaii")) return "hawaii";
  if (text.includes("mexico")) return "mexico";
  if (text.includes("mediterranean") || text.includes("italy") || text.includes("spain")) return "mediterranean";
  if (text.includes("europe") || text.includes("norway") || text.includes("iceland")) return "northern-europe";
  if (text.includes("transatlantic")) return "transatlantic";
  if (text.includes("pacific") || text.includes("australia")) return "south-pacific";
  return "other";
}

function parseNights(title) {
  const match = String(title ?? "").match(/^(\d+)-Day/i);
  if (!match) return null;
  return Math.max(Number(match[1]), 1);
}

function parseDate(monthDay, year) {
  const parsed = new Date(`${monthDay} ${year} 12:00:00 UTC`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function parsePrice(lines) {
  const callIndex = lines.findIndex((line) => line === "Call For Price");
  if (callIndex >= 0) return null;
  const priceLine = lines.find((line) => /^\$[\d,]+$/.test(line));
  if (!priceLine) return null;
  const price = Number(priceLine.replace(/[$,]/g, ""));
  return Number.isFinite(price) ? price : null;
}

function parseCardText(text) {
  const lines = String(text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const shipIndex = lines.indexOf("Ship");
  const departIndex = lines.indexOf("Depart");
  const arriveIndex = lines.indexOf("Arrive");
  if (shipIndex < 1 || departIndex < 0 || arriveIndex < 0) return null;

  const title = lines[0];
  const shipName = lines[shipIndex + 1];
  const departurePort = lines[departIndex + 1];
  const returnPort = lines[arriveIndex + 1];
  const dateLine = lines[arriveIndex + 2];
  const yearLine = lines.slice(arriveIndex + 3).find((line) => /^20\d{2}$/.test(line));
  const nights = parseNights(title);
  const departureDate = parseDate(dateLine, yearLine);
  if (!title || !shipName || !departurePort || !returnPort || !nights || !departureDate) return null;

  return {
    title,
    shipName,
    departurePort,
    returnPort,
    departureDate,
    returnDate: addDays(departureDate, nights),
    nights,
    startingPrice: parsePrice(lines),
    taxesAndFeesIncluded: /All taxes and fees included/i.test(text),
  };
}

function toCanonicalSailing(card, importedAt) {
  const confidence = "itinerary_verified_price_check_required";
  const directLink = `${sourceUrl}?departDate:${encodeURIComponent(`[${card.departureDate}T00:00:00Z TO ${card.departureDate}T00:00:00Z]`)}&ships:${encodeURIComponent(`(${card.shipName})`)}`;
  const id = `holland-america-${slugify(card.shipName)}-${card.departureDate.replaceAll("-", "")}-${slugify(card.title)}`;
  return {
    id,
    cruiseLine: "holland-america",
    shipName: card.shipName,
    sailingName: card.title,
    departureDate: card.departureDate,
    returnDate: card.returnDate,
    nights: card.nights,
    departurePort: card.departurePort,
    returnPort: card.returnPort,
    destinationRegion: normalizeRegion(card.title),
    itineraryPorts: [],
    portCoordinates: [],
    startingPrice: card.startingPrice,
    currency: "USD",
    priceBasis: "per-person-double-occupancy",
    taxesAndFeesIncluded: card.taxesAndFeesIncluded,
    directLink,
    affiliateLink: null,
    source: {
      provider: "hollandamerica.com",
      sourceType: "cruise-line-website",
      sourceUrl: directLink,
      affiliateNetwork: null,
      advertiserName: null,
      lastImported: importedAt,
      lastVerified: importedAt.slice(0, 10),
      confidence,
      termsNotes:
        "Browser-captured from Holland America's official cruise search cards. Review itinerary ports, current availability, fare basis, and booking link before promotion.",
    },
    sourceUrl: directLink,
    lastVerified: importedAt.slice(0, 10),
    confidence,
    createdAt: importedAt,
    updatedAt: importedAt,
  };
}

function validateStaging(records, schema) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const errors = [];
  for (const record of records) {
    if (validate(record)) continue;
    errors.push({
      id: record.id,
      errors: validate.errors?.map((error) => `${error.instancePath || "/"} ${error.message}`) ?? [],
    });
  }
  return errors;
}

async function captureCards() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
  });
  await page.goto(sourceUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(12000);

  const cardTexts = [];
  for (let pageNumber = 0; pageNumber < maxPages; pageNumber += 1) {
    const texts = await page
      .locator(".cruise-molecule-search-result-card--horizontal")
      .evaluateAll((cards) => cards.map((card) => card.innerText));
    cardTexts.push(...texts);

    const next = page.getByRole("button", { name: /next button/i });
    const count = await next.count();
    if (!count) break;
    const className = await next.first().getAttribute("class");
    if (className?.includes("disabled")) break;
    await next.first().evaluate((button) => button.click());
    await page.waitForTimeout(2500);
  }

  const bodyText = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
  await browser.close();
  return { cardTexts, bodyText };
}

async function main() {
  const importedAt = new Date().toISOString();
  const schema = await loadJson("data/schema/sailing.schema.json");
  await Promise.all([
    mkdir(rawDir, { recursive: true }),
    mkdir(stagingDir, { recursive: true }),
    mkdir(reportsDir, { recursive: true }),
    mkdir(latestReportDir, { recursive: true }),
  ]);

  const capture = await captureCards();
  await writeFile(resolve(rawDir, "cards.json"), stringifyJson(capture.cardTexts));
  await writeFile(resolve(rawDir, "page-text.txt"), `${capture.bodyText}\n`);

  const records = capture.cardTexts
    .map(parseCardText)
    .filter(Boolean)
    .map((card) => toCanonicalSailing(card, importedAt));
  const seen = new Set();
  const deduped = records.filter((record) => {
    if (seen.has(record.id)) return false;
    seen.add(record.id);
    return true;
  });

  const errors = validateStaging(deduped, schema);
  await writeFile(resolve(stagingDir, "sailings.json"), stringifyJson(deduped));
  await writeFile(resolve(stagingDir, "deals.json"), "[]\n");

  const byShip = {};
  const prices = deduped.map((record) => record.startingPrice).filter((price) => Number.isFinite(price));
  for (const record of deduped) byShip[record.shipName] = (byShip[record.shipName] ?? 0) + 1;
  const report = {
    generatedAt: importedAt,
    provider,
    runId,
    mode: "staging-only",
    sourceUrl,
    maxPages,
    staging: {
      sailings: deduped.length,
      deals: 0,
      schemaErrors: errors.length,
      byShip,
      priceRange: prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null,
    },
    schemaErrors: errors,
    paths: {
      raw: rawDir,
      staging: stagingDir,
      report: reportsDir,
    },
  };

  const markdown = `# Holland America Staging Import

Generated: ${report.generatedAt}

Mode: ${report.mode}

Source: ${sourceUrl}

## Counts

| Metric | Count |
| --- | ---: |
| Staged sailings | ${report.staging.sailings} |
| Schema errors | ${report.staging.schemaErrors} |

## Notes

- Browser-captured from official Holland America search result cards.
- Review itinerary ports and current fare details before promotion.
`;

  await Promise.all([
    writeFile(resolve(reportsDir, `${runId}.json`), stringifyJson(report)),
    writeFile(resolve(latestReportDir, "latest-holland-america-staging-import.json"), stringifyJson(report)),
    writeFile(resolve(latestReportDir, "latest-holland-america-staging-import.md"), markdown),
  ]);

  console.log(`Holland America staging import: ${deduped.length} sailing(s), ${errors.length} schema error(s).`);
  console.log("Report written to data/reports/latest-holland-america-staging-import.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
