#!/usr/bin/env node
/**
 * MSC Cruises official-source staging importer.
 *
 * MSC USA is currently guarded by a waiting-room flow, but the public MSC
 * search experience is readable in a normal browser session on other MSC
 * markets. This importer loads the official search page with Playwright,
 * captures MSC's own search/graphql responses, and writes review-only staging
 * records. It does not edit data/seed/*.json.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { chromium } from "playwright";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const provider = "msc";
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const rawDir = resolve(repoRoot, `data/ingest/raw/${provider}/${runId}`);
const stagingDir = resolve(repoRoot, `data/ingest/staging/${provider}/${runId}`);
const reportsDir = resolve(repoRoot, `data/ingest/reports/${provider}`);
const latestReportDir = resolve(repoRoot, "data/reports");

const sourceUrl = process.env.MSC_SOURCE_URL ?? "https://www.msccruises.fi/search-result?ships=AM";
const sourceMarket = process.env.MSC_SOURCE_MARKET ?? "FI";
const currency = process.env.MSC_CURRENCY ?? "EUR";
const maxRecords = Number.parseInt(process.env.MSC_MAX_RECORDS ?? "40", 10);

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function stringifyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function addDays(dateValue, days) {
  const date = new Date(`${dateValue}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
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

function normalizeRegion(value) {
  const region = String(value ?? "").toLowerCase();
  if (region === "car" || region.includes("caribbean")) return "caribbean";
  if (region.includes("bahamas")) return "bahamas";
  if (region.includes("mexico")) return "mexico";
  if (region.includes("alaska")) return "alaska";
  if (region.includes("hawaii")) return "hawaii";
  if (region.includes("med")) return "mediterranean";
  if (region.includes("nor") || region.includes("europe")) return "northern-europe";
  if (region.includes("asia")) return "asia";
  return "other";
}

function cleanPortName(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function visiblePorts(days, departurePort, returnPort) {
  return (days ?? [])
    .map((day) => cleanPortName(day.name))
    .filter((name) => name && name.toUpperCase() !== "SEADAY")
    .filter((name, index, list) => {
      if (index === 0 && name === departurePort) return false;
      if (index === list.length - 1 && name === returnPort) return false;
      return true;
    });
}

function lowestPrice(prices) {
  const usable = (prices ?? [])
    .filter((price) => !price.hasFlight)
    .map((price) => Number(price.lowestPrice ?? price.fullPrice))
    .filter((price) => Number.isFinite(price) && price > 0);
  if (usable.length > 0) return Math.round(Math.min(...usable));
  return null;
}

function sourceLink(cruiseId) {
  const url = new URL(sourceUrl);
  if (cruiseId) url.searchParams.set("cids", cruiseId);
  return url.toString();
}

function toCanonicalSailing(item, importedAt) {
  const itinerary = item.itinerary ?? {};
  const cruise = item.cruise ?? {};
  const departureDate = cruise.departureDate ?? itinerary.startDate;
  const nights = Number(cruise.numberOfNights ?? itinerary.numNights ?? 0);
  if (!departureDate || !Number.isInteger(nights) || nights < 1) return null;

  const departurePort = cleanPortName(itinerary.days?.[0]?.name) || itinerary.embkPort || "Unknown";
  const returnPort = cleanPortName(itinerary.days?.at(-1)?.name) || itinerary.disembkPort || departurePort;
  const recordSourceUrl = sourceLink(cruise.cruiseId);
  const itineraryPrice = Number(itinerary.minimalPrice);
  const cruiseOnlyPrice = lowestPrice(cruise.prices);
  const startingPrice = cruiseOnlyPrice ?? (Number.isFinite(itineraryPrice) && itineraryPrice > 0 ? Math.round(itineraryPrice) : null);
  const confidence = "itinerary_verified_price_check_required";
  const region = normalizeRegion(itinerary.mainArea ?? itinerary.areas?.[0]);
  const id = `msc-${slugify(itinerary.shipName ?? itinerary.shipCode ?? "ship")}-${departureDate.replaceAll("-", "")}-${slugify(cruise.cruiseId ?? itinerary.itineraryCode ?? "sailing")}`;

  return {
    id,
    cruiseLine: "msc",
    shipName: itinerary.shipName ?? "MSC ship",
    sailingName: itinerary.itineraryName || `${nights}-night MSC sailing from ${departurePort}`,
    departureDate,
    returnDate: addDays(departureDate, nights),
    nights,
    departurePort,
    returnPort,
    destinationRegion: region,
    itineraryPorts: visiblePorts(itinerary.days, departurePort, returnPort),
    portCoordinates: [],
    startingPrice,
    currency,
    priceBasis: "per-person-double-occupancy",
    taxesAndFeesIncluded: false,
    directLink: recordSourceUrl,
    affiliateLink: null,
    source: {
      provider: "msccruises.com",
      sourceType: "cruise-line-website",
      sourceUrl: recordSourceUrl,
      affiliateNetwork: null,
      advertiserName: null,
      lastImported: importedAt,
      lastVerified: importedAt.slice(0, 10),
      confidence,
      termsNotes:
        `Browser-captured from MSC ${sourceMarket} official search GraphQL. Review market, currency, fare basis, taxes/fees, package inclusions, and booking link before promotion.`,
    },
    sourceUrl: recordSourceUrl,
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

async function captureMscSearch() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
  });
  const responses = [];

  page.on("response", async (response) => {
    if (!response.url().includes("/search/graphql") || response.status() !== 200) return;
    try {
      const json = await response.json();
      responses.push(json);
    } catch {
      // Ignore non-JSON or already-consumed responses.
    }
  });

  await page.goto(sourceUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(12000);
  await page.mouse.wheel(0, 2600);
  await page.waitForTimeout(8000);
  const bodyText = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
  await browser.close();

  return { responses, bodyText };
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

  const capture = await captureMscSearch();
  await writeFile(resolve(rawDir, "search-graphql-responses.json"), stringifyJson(capture.responses));
  await writeFile(resolve(rawDir, "page-text.txt"), `${capture.bodyText}\n`);

  const detailedResults = capture.responses.flatMap((response) => response.data?.searchResults?.content?.detailedResults ?? []);
  const stagingRecords = [];
  for (const item of detailedResults) {
    for (const cruise of item.cruises ?? []) {
      const record = toCanonicalSailing({ itinerary: item.itinerary, cruise }, importedAt);
      if (record) stagingRecords.push(record);
    }
  }

  const seen = new Set();
  const deduped = stagingRecords
    .filter((record) => {
      if (seen.has(record.id)) return false;
      seen.add(record.id);
      return true;
    })
    .sort((a, b) => a.departureDate.localeCompare(b.departureDate) || a.startingPrice - b.startingPrice)
    .slice(0, maxRecords);

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
    sourceMarket,
    currency,
    capturedGraphqlResponses: capture.responses.length,
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
    notes: [
      "MSC USA currently routes automated/headless sessions into a waiting-room or service-unavailable flow.",
      "These records are captured from MSC's official search GraphQL through an accessible MSC market page and must be market/currency reviewed before promotion.",
    ],
  };

  const markdown = `# MSC Staging Import

Generated: ${report.generatedAt}

Mode: ${report.mode}

Source: ${sourceUrl}

## Counts

| Metric | Count |
| --- | ---: |
| Captured GraphQL responses | ${report.capturedGraphqlResponses} |
| Staged sailings | ${report.staging.sailings} |
| Schema errors | ${report.staging.schemaErrors} |

## Review Notes

- Source market: ${sourceMarket}
- Currency: ${currency}
- Promotion is blocked until market, fare basis, taxes/fees, and booking-link behavior are reviewed.
`;

  await Promise.all([
    writeFile(resolve(reportsDir, `${runId}.json`), stringifyJson(report)),
    writeFile(resolve(latestReportDir, "latest-msc-staging-import.json"), stringifyJson(report)),
    writeFile(resolve(latestReportDir, "latest-msc-staging-import.md"), markdown),
  ]);

  console.log(`MSC staging import: ${deduped.length} sailing(s), ${errors.length} schema error(s).`);
  console.log("Report written to data/reports/latest-msc-staging-import.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
