#!/usr/bin/env node
/**
 * Royal Caribbean official-source staging importer.
 *
 * Royal Caribbean currently blocks basic headless access from some
 * environments. This importer still follows the same raw -> staging -> report
 * contract as Carnival: it captures official search responses when reachable,
 * validates canonical-shaped staging records, and writes an explicit blocker
 * report when the source denies automated access.
 *
 * Do not add bot-mitigation bypasses here. Royal Caribbean data must come from
 * reachable official responses, approved affiliate feeds, licensed inventory
 * providers, or B2B/partner exports.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const provider = "royal-caribbean";
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const rawDir = resolve(repoRoot, `data/ingest/raw/${provider}/${runId}`);
const stagingDir = resolve(repoRoot, `data/ingest/staging/${provider}/${runId}`);
const reportsDir = resolve(repoRoot, `data/ingest/reports/${provider}`);
const latestReportDir = resolve(repoRoot, "data/reports");
const searchUrl = process.env.ROYAL_CARIBBEAN_SEARCH_URL ?? "https://www.royalcaribbean.com/cruises?destinationIds=CARIB";
const maxScrolls = Number.parseInt(process.env.ROYAL_CARIBBEAN_MAX_SCROLLS ?? "16", 10);

const shipCodes = {
  AD: "Adventure of the Seas",
  AL: "Allure of the Seas",
  AN: "Anthem of the Seas",
  BR: "Brilliance of the Seas",
  EN: "Enchantment of the Seas",
  EX: "Explorer of the Seas",
  FR: "Freedom of the Seas",
  GR: "Grandeur of the Seas",
  HM: "Harmony of the Seas",
  IC: "Icon of the Seas",
  IN: "Independence of the Seas",
  JW: "Jewel of the Seas",
  LB: "Liberty of the Seas",
  MR: "Mariner of the Seas",
  NV: "Navigator of the Seas",
  OA: "Oasis of the Seas",
  OV: "Ovation of the Seas",
  QN: "Quantum of the Seas",
  RD: "Radiance of the Seas",
  RH: "Rhapsody of the Seas",
  SR: "Serenade of the Seas",
  ST: "Star of the Seas",
  SY: "Symphony of the Seas",
  UT: "Utopia of the Seas",
  VI: "Vision of the Seas",
  VY: "Voyager of the Seas",
  WN: "Wonder of the Seas",
};

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function isoDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function addDays(isoDateValue, days) {
  const date = new Date(`${isoDateValue}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeRegion(value) {
  const region = String(value ?? "").toLowerCase();
  if (region.includes("bahamas")) return "bahamas";
  if (region.includes("carib")) return "caribbean";
  if (region.includes("mexico")) return "mexico";
  if (region.includes("alaska")) return "alaska";
  if (region.includes("europe")) return "northern-europe";
  if (region.includes("mediterranean")) return "mediterranean";
  return "other";
}

function absoluteRoyalUrl(pathOrUrl) {
  if (!pathOrUrl) return "https://www.royalcaribbean.com/cruises";
  return String(pathOrUrl).startsWith("http")
    ? String(pathOrUrl)
    : `https://www.royalcaribbean.com${pathOrUrl}`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function toCanonicalSailing(cruise, importedAt) {
  const master = cruise?.masterSailing;
  const itinerary = master?.itinerary;
  const lowest = cruise?.lowestPriceSailing;
  const departureDate = isoDate(lowest?.sailDate ?? master?.sailDate);
  if (!departureDate || !itinerary) return null;

  const days = itinerary.days ?? [];
  const nights = Math.max(days.length - 1, Number(cruise?.nights ?? 0), 1);
  const shipCode = itinerary.code?.slice(0, 2) ?? cruise?.shipCode ?? "";
  const shipName = itinerary.ship?.name ?? shipCodes[shipCode] ?? cruise?.shipName ?? "Royal Caribbean ship";
  const departurePort = days[0]?.ports?.[0]?.port?.name ?? cruise?.departurePort ?? "Unknown";
  const returnPort = days.at(-1)?.ports?.[0]?.port?.name ?? departurePort;
  const ports = unique(
    days
      .filter((day) => day.type === "PORT")
      .flatMap((day) => day.ports?.map((port) => port.port?.name) ?? [])
      .filter((port) => port !== departurePort && port !== returnPort),
  );
  const price = lowest?.lowestStateroomClassPrice?.price?.value ?? lowest?.price?.value ?? cruise?.lowestPrice ?? null;
  const sourceUrl = absoluteRoyalUrl(lowest?.bookingLink ?? cruise?.bookingLink ?? cruise?.url);
  const id = `royal-caribbean-${slugify(shipName)}-${departureDate.replaceAll("-", "")}-${slugify(lowest?.id ?? cruise?.id ?? itinerary.code ?? "sailing")}`;

  return {
    id,
    cruiseLine: "royal-caribbean",
    shipName,
    sailingName: itinerary.name ?? cruise?.name ?? `${nights}-night Royal Caribbean sailing`,
    departureDate,
    returnDate: addDays(departureDate, nights),
    nights,
    departurePort,
    returnPort,
    destinationRegion: normalizeRegion(itinerary.destination?.name ?? itinerary.name ?? searchUrl),
    itineraryPorts: ports,
    portCoordinates: [],
    startingPrice: Number.isFinite(price) && price > 0 ? Math.round(price) : null,
    currency: lowest?.lowestStateroomClassPrice?.price?.currency ?? lowest?.price?.currency ?? "USD",
    priceBasis: "per-person-double-occupancy",
    taxesAndFeesIncluded: false,
    directLink: sourceUrl,
    affiliateLink: null,
    source: {
      provider: "royalcaribbean.com",
      sourceType: "cruise-line-website",
      sourceUrl,
      affiliateNetwork: null,
      advertiserName: null,
      lastImported: importedAt,
      lastVerified: importedAt.slice(0, 10),
      confidence: "itinerary_verified_price_check_required",
      termsNotes:
        "Staged from Royal Caribbean official search responses when reachable. Review price basis, taxes/fees, and booking link before promotion.",
    },
    sourceUrl,
    lastVerified: importedAt.slice(0, 10),
    confidence: "itinerary_verified_price_check_required",
    createdAt: importedAt,
    updatedAt: importedAt,
  };
}

function collectCruisesFromGraphQL(body) {
  const direct = body?.data?.cruiseSearch?.results?.cruises;
  if (Array.isArray(direct)) return direct;
  const found = [];
  const stack = [body];
  while (stack.length > 0) {
    const value = stack.pop();
    if (!value || typeof value !== "object") continue;
    if (Array.isArray(value)) {
      if (value.some((item) => item?.masterSailing || item?.lowestPriceSailing)) found.push(...value);
      else stack.push(...value);
    } else {
      stack.push(...Object.values(value));
    }
  }
  return found;
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

async function writeReport(report) {
  const markdown = `# Royal Caribbean Staging Import Report

Generated: ${report.generatedAt}

Mode: ${report.mode}

Source: ${report.source}

## Counts

| Metric | Count |
| --- | ---: |
| Raw responses | ${report.rawResponses} |
| Staged sailings | ${report.staging.sailings} |
| Schema errors | ${report.staging.schemaErrors} |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | ${report.staging.minPrice ?? "n/a"} |
| Max observed starting price | ${report.staging.maxPrice ?? "n/a"} |

## Blockers

${report.blockers.length === 0 ? "- None\n" : report.blockers.map((blocker) => `- ${blocker}`).join("\n") + "\n"}
## Notes

- This importer never edits \`data/seed/*.json\`.
- Promote only reviewed records after source links and current prices are verified.
- If Royal Caribbean blocks automated access, use this report as the source-status record and pursue affiliate, aggregator, or authorized B2B access instead of adding bypass logic.
`;

  await mkdir(reportsDir, { recursive: true });
  await mkdir(latestReportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportsDir, `${runId}.json`), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(latestReportDir, "latest-royal-caribbean-staging-import.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(latestReportDir, "latest-royal-caribbean-staging-import.md"), markdown),
  ]);
}

async function main() {
  const importedAt = new Date().toISOString();
  const schema = await loadJson("data/schema/sailing.schema.json");
  await Promise.all([mkdir(rawDir, { recursive: true }), mkdir(stagingDir, { recursive: true })]);

  const rawResponses = [];
  const blockers = [];
  let blockedText = "";

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
  });
  const page = await context.newPage();
  page.on("response", async (response) => {
    const contentType = response.headers()["content-type"] ?? "";
    if (response.status() !== 200 || !contentType.includes("json")) return;
    try {
      const body = await response.json();
      const cruises = collectCruisesFromGraphQL(body);
      if (cruises.length === 0) return;
      const index = rawResponses.length + 1;
      rawResponses.push({ url: response.url(), cruises });
      await writeFile(resolve(rawDir, `response-${index}.json`), `${JSON.stringify(body, null, 2)}\n`);
    } catch {
      // Ignore non-JSON or streaming payloads that advertise JSON incorrectly.
    }
  });

  try {
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForTimeout(8_000);
    blockedText = await page.evaluate(() => document.body.innerText.slice(0, 500)).catch(() => "");
    for (let index = 0; index < maxScrolls; index += 1) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1_250);
    }
  } finally {
    await writeFile(resolve(rawDir, "page-text.txt"), blockedText);
    await browser.close();
  }

  if (blockedText.includes("OOPS... LOOKS LIKE ROYALCARIBBEAN.COM IS ON VACATION")) {
    blockers.push("Royal Caribbean returned its automated-access block page for the search URL.");
  }

  const staged = [];
  const seen = new Set();
  for (const response of rawResponses) {
    for (const cruise of response.cruises) {
      const record = toCanonicalSailing(cruise, importedAt);
      if (!record || seen.has(record.id)) continue;
      seen.add(record.id);
      staged.push(record);
    }
  }

  const schemaErrors = validateStaging(staged, schema);
  const prices = staged.map((record) => record.startingPrice).filter((price) => Number.isFinite(price));
  await writeFile(resolve(stagingDir, "sailings.json"), `${JSON.stringify(staged, null, 2)}\n`);
  await writeFile(resolve(stagingDir, "deals.json"), "[]\n");

  const report = {
    generatedAt: importedAt,
    provider,
    runId,
    mode: "staging-only",
    source: searchUrl,
    rawResponses: rawResponses.length,
    staging: {
      sailings: staged.length,
      deals: 0,
      schemaErrors: schemaErrors.length,
      minPrice: prices.length ? Math.min(...prices) : null,
      maxPrice: prices.length ? Math.max(...prices) : null,
    },
    blockers: [...blockers, ...schemaErrors.map((error) => `${error.id}: ${error.errors.join("; ")}`)],
    warnings: [
      "Royal Caribbean may block automated browser sessions from some environments.",
      "Staged records are not production records.",
      "Review exact booking URL, price basis, taxes/fees, and terms before promotion.",
    ],
    paths: {
      raw: `data/ingest/raw/${provider}/${runId}`,
      staging: `data/ingest/staging/${provider}/${runId}`,
      report: `data/ingest/reports/${provider}/${runId}.json`,
    },
  };

  await writeReport(report);
  console.log(
    `Royal Caribbean staging import: ${staged.length} sailing(s), ${schemaErrors.length} schema error(s), ${report.blockers.length} blocker(s).`,
  );
  console.log("Report written to data/reports/latest-royal-caribbean-staging-import.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
