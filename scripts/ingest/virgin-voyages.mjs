#!/usr/bin/env node
/**
 * Virgin Voyages official-source staging importer.
 *
 * Virgin's voyage planner currently renders useful listing data in the page,
 * while the direct BFF APIs require request context that is not stable enough
 * for a lightweight importer. This uses Playwright against the official public
 * page and writes review-only staging records. It never edits seed data.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const provider = "virgin-voyages";
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const rawDir = resolve(repoRoot, `data/ingest/raw/${provider}/${runId}`);
const stagingDir = resolve(repoRoot, `data/ingest/staging/${provider}/${runId}`);
const reportsDir = resolve(repoRoot, `data/ingest/reports/${provider}`);
const latestReportDir = resolve(repoRoot, "data/reports");
const sourceUrl = "https://www.virginvoyages.com/book/voyage-planner/find-a-voyage?currencyCode=USD&priceType=perCabin";
const maxCards = Number.parseInt(process.env.VIRGIN_MAX_CARDS ?? "24", 10);
const maxScrolls = Number.parseInt(process.env.VIRGIN_MAX_SCROLLS ?? "8", 10);

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
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

function isoDate(value, fallbackYear) {
  const cleaned = String(value ?? "").replace(/^[^\w]+/, "").trim();
  const parsed = new Date(`${cleaned}, ${fallbackYear}`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function normalizeRegion(title, ports) {
  const haystack = `${title} ${(ports ?? []).join(" ")}`.toLowerCase();
  if (haystack.includes("antarctica")) return "antarctica";
  if (haystack.includes("south america") || haystack.includes("buenos aires") || haystack.includes("brazil") || haystack.includes("uruguay")) return "south-america";
  if (haystack.includes("panama")) return "panama-canal";
  if (haystack.includes("canada") && haystack.includes("new england")) return "canada-new-england";
  if (haystack.includes("australia") || haystack.includes("new zealand")) return "australia-new-zealand";
  if (haystack.includes("asia") || haystack.includes("japan")) return "asia";
  if (haystack.includes("alaska")) return "alaska";
  if (haystack.includes("bimini") || haystack.includes("bahamas")) return "bahamas";
  if (haystack.includes("caribbean") || haystack.includes("dominican") || haystack.includes("puerto plata")) return "caribbean";
  if (haystack.includes("mexico") || haystack.includes("cozumel")) return "mexico";
  if (haystack.includes("mediterranean") || haystack.includes("greek") || haystack.includes("adriatic")) return "mediterranean";
  if (haystack.includes("barcelona") || haystack.includes("rome") || haystack.includes("athens")) return "mediterranean";
  if (haystack.includes("transatlantic")) return "transatlantic";
  return "other";
}

function shipFromVoyageId(voyageId, fallback) {
  const prefix = String(voyageId ?? "").slice(0, 2).toUpperCase();
  const byPrefix = {
    BR: "Brilliant Lady",
    SC: "Scarlet Lady",
    RS: "Resilient Lady",
    VL: "Valiant Lady",
  };
  return byPrefix[prefix] ?? String(fallback ?? "Virgin Voyages ship").split(",")[0].trim();
}

function priceNumber(value) {
  const match = String(value ?? "").match(/\$?([\d,]+)/);
  return match ? Number.parseInt(match[1].replaceAll(",", ""), 10) : null;
}

function validateRecords(records, schema) {
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

async function scrapeCards() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: "CruiseKitImporter/0.1 (+https://cruisekit.app)",
    viewport: { width: 1280, height: 1100 },
  });

  await page.goto(sourceUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("text=BOOK NOW", { timeout: 45000 });

  for (let index = 0; index < maxScrolls; index += 1) {
    const count = await page.locator(".PackageCard:not(.PackageCard__Skeleton)").count();
    if (count >= maxCards) break;
    await page.mouse.wheel(0, 1400);
    await page.waitForTimeout(900);
  }

  const cards = await page.locator(".PackageCard:not(.PackageCard__Skeleton)").evaluateAll((elements, limit) =>
    elements.slice(0, limit).map((card) => {
      const text = (selector) => card.querySelector(selector)?.textContent?.trim() ?? "";
      const packageCode = card.getAttribute("data-id") ?? "";
      const title = text(".packageName");
      const ports = [...card.querySelectorAll(".ports li")].map((item) => item.textContent?.trim()).filter(Boolean);
      const nights = Number.parseInt(text(".durationNumber").match(/\d+/)?.[0] ?? "", 10);
      const shipName = text(".shipName");
      const price = text(".PackagePrice .amount");
      const priceBasis = text(".PackagePrice .priceFootNote");
      const sailings = [...card.querySelectorAll(".SailingCard")].slice(0, 3).map((sailing) => ({
        voyageId: sailing.getAttribute("data-id") ?? "",
        href: sailing.getAttribute("href") ?? "",
        year: sailing.querySelector(".iconYear")?.textContent?.trim().match(/\d{4}/)?.[0] ?? "",
        start: sailing.querySelector(".startDate")?.textContent?.trim() ?? "",
        end: sailing.querySelector(".endDate")?.textContent?.replace("-", "").trim() ?? "",
        price: sailing.querySelector(".amount")?.textContent?.trim() ?? "",
      }));
      return { packageCode, title, ports, nights, shipName, price, priceBasis, sailings };
    }),
    maxCards,
  );

  await browser.close();
  return cards;
}

function toRecords(cards, importedAt) {
  const records = [];
  for (const card of cards) {
    if (!card.title || !Number.isFinite(card.nights) || card.ports.length < 2) continue;
    for (const sailing of card.sailings ?? []) {
      const departureDate = isoDate(sailing.start, sailing.year);
      const returnDate = isoDate(sailing.end, sailing.year);
      const startingPrice = priceNumber(sailing.price || card.price);
      if (!departureDate || !returnDate || !startingPrice || !sailing.voyageId) continue;
      const shipName = shipFromVoyageId(sailing.voyageId, card.shipName);
      const directLink = `https://www.virginvoyages.com${sailing.href || `/book/voyage-planner/find-a-voyage?currencyCode=USD&priceType=perCabin&packageCode=${card.packageCode}&voyageId=${sailing.voyageId}`}`;
      records.push({
        id: `virgin-voyages-${slugify(shipName)}-${departureDate.replaceAll("-", "")}-${slugify(card.packageCode)}`,
        cruiseLine: "virgin-voyages",
        shipName,
        sailingName: card.title,
        departureDate,
        returnDate,
        nights: card.nights,
        departurePort: card.ports[0],
        returnPort: card.ports.at(-1),
        destinationRegion: normalizeRegion(card.title, card.ports),
        itineraryPorts: card.ports,
        portCoordinates: [],
        startingPrice,
        currency: "USD",
        priceBasis: "per-cabin",
        taxesAndFeesIncluded: false,
        directLink,
        affiliateLink: null,
        source: {
          provider: "virginvoyages.com",
          sourceType: "cruise-line-website",
          sourceUrl: directLink,
          affiliateNetwork: null,
          advertiserName: null,
          lastImported: importedAt,
          lastVerified: importedAt.slice(0, 10),
          confidence: "itinerary_verified_price_check_required",
          termsNotes:
            "Staged from the public Virgin Voyages voyage planner with priceType=perCabin. Review cabin category, taxes/fees, promotional terms, ship/date, and availability before promotion.",
        },
        sourceUrl: directLink,
        lastVerified: importedAt.slice(0, 10),
        confidence: "itinerary_verified_price_check_required",
        createdAt: importedAt,
        updatedAt: importedAt,
      });
    }
  }
  const seen = new Set();
  return records.filter((record) => {
    if (seen.has(record.id)) return false;
    seen.add(record.id);
    return true;
  });
}

function markdownReport(report) {
  return `# Virgin Voyages Staging Import Report

Generated: ${report.generatedAt}

Mode: ${report.mode}

## Counts

| Metric | Count |
| --- | ---: |
| Source package cards sampled | ${report.source.cards} |
| Staged sailings | ${report.staging.sailings} |
| Schema errors | ${report.staging.schemaErrors} |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed cabin price | ${report.staging.minPrice ?? "n/a"} |
| Max observed cabin price | ${report.staging.maxPrice ?? "n/a"} |

## Warnings

${report.warnings.map((warning) => `- ${warning}`).join("\n")}

## Blockers

${report.blockers.length === 0 ? "- None\n" : report.blockers.map((error) => `- ${error.id}: ${error.errors.join("; ")}`).join("\n") + "\n"}`;
}

async function main() {
  const importedAt = new Date().toISOString();
  const schema = await loadJson("data/schema/sailing.schema.json");
  await Promise.all([mkdir(rawDir, { recursive: true }), mkdir(stagingDir, { recursive: true }), mkdir(reportsDir, { recursive: true }), mkdir(latestReportDir, { recursive: true })]);

  const cards = await scrapeCards();
  await writeFile(resolve(rawDir, "cards.json"), `${JSON.stringify(cards, null, 2)}\n`);

  const records = toRecords(cards, importedAt);
  const errors = validateRecords(records, schema);
  await writeFile(resolve(stagingDir, "sailings.json"), `${JSON.stringify(records, null, 2)}\n`);
  await writeFile(resolve(stagingDir, "deals.json"), "[]\n");

  const prices = records.map((record) => record.startingPrice).filter((price) => Number.isFinite(price));
  const report = {
    generatedAt: importedAt,
    provider,
    runId,
    mode: "staging-only",
    source: { url: sourceUrl, cards: cards.length },
    options: { maxCards, maxScrolls },
    staging: {
      sailings: records.length,
      deals: 0,
      schemaErrors: errors.length,
      minPrice: prices.length ? Math.min(...prices) : null,
      maxPrice: prices.length ? Math.max(...prices) : null,
    },
    blockers: errors,
    warnings: [
      "Staging records are not production records.",
      "Virgin prices are captured as per-cabin advertised fares with taxes/fees still check-required.",
      "Review exact booking URL, cabin category, promotional terms, price basis, taxes/fees, and availability before promotion.",
    ],
    paths: {
      raw: `data/ingest/raw/${provider}/${runId}`,
      staging: `data/ingest/staging/${provider}/${runId}`,
      report: `data/ingest/reports/${provider}/${runId}.json`,
    },
  };

  await Promise.all([
    writeFile(resolve(reportsDir, `${runId}.json`), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(latestReportDir, "latest-virgin-voyages-staging-import.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(latestReportDir, "latest-virgin-voyages-staging-import.md"), markdownReport(report)),
  ]);

  console.log(`Virgin Voyages staging import: ${records.length} sailing(s), ${errors.length} schema error(s).`);
  console.log("Report written to data/reports/latest-virgin-voyages-staging-import.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
