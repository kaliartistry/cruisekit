#!/usr/bin/env node
/**
 * Azamara official-source staging importer.
 *
 * Browser-reads official Azamara cruise-search cards for target regions. The
 * listing exposes dated sailings, ship, destination, public USD fares, and
 * detail links. Departure/return ports and full itinerary ports still require
 * detail-page/manual review before promotion.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { chromium } from "playwright";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const provider = "azamara";
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const rawDir = resolve(repoRoot, `data/ingest/raw/${provider}/${runId}`);
const stagingDir = resolve(repoRoot, `data/ingest/staging/${provider}/${runId}`);
const reportsDir = resolve(repoRoot, `data/ingest/reports/${provider}`);
const latestReportDir = resolve(repoRoot, "data/reports");
const sourceUrl = process.env.AZAMARA_SOURCE_URL ?? "https://www.azamara.com/cruises?destinations=CARIBBEAN,ALASKA";
const maxLoadMore = Number.parseInt(process.env.AZAMARA_MAX_LOAD_MORE ?? "4", 10);
const enrichDetails = process.env.AZAMARA_ENRICH_DETAILS !== "0";
const detailConcurrency = Number.parseInt(process.env.AZAMARA_DETAIL_CONCURRENCY ?? "4", 10);

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

function parseDate(value) {
  const parsed = new Date(`${value} 12:00:00 UTC`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function parseNights(duration) {
  const match = String(duration ?? "").match(/(\d+)-night/i);
  if (!match) return null;
  return Math.max(Number(match[1]), 1);
}

function normalizeRegion(value) {
  const text = String(value ?? "").toLowerCase();
  if (text.includes("alaska")) return "alaska";
  if (text.includes("bahamas")) return "bahamas";
  if (text.includes("caribbean")) return "caribbean";
  if (text.includes("mexico")) return "mexico";
  if (text.includes("mediterranean")) return "mediterranean";
  if (text.includes("europe")) return "northern-europe";
  if (text.includes("panama")) return "other";
  return "other";
}

function parseTitlePorts(title) {
  const afterColon = String(title ?? "").split(":").slice(1).join(":");
  if (!afterColon) return [];
  return afterColon
    .replace(/\s+\+\s+.*/g, "")
    .split(/,|&/)
    .map((port) => port.trim())
    .filter((port) => port.length > 2)
    .slice(0, 8);
}

function cleanPortName(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function toCanonicalSailing(card, importedAt) {
  const nights = parseNights(card.duration);
  const departureDate = parseDate(card.sailingDate);
  if (!card.id || !card.shipName || !card.cruiseName || !nights || !departureDate) return null;

  const sourceUrlForRecord = card.detailLink || sourceUrl;
  const id = `azamara-${slugify(card.shipName)}-${departureDate.replaceAll("-", "")}-${slugify(card.packageCode || card.id)}`;
  const confidence = "itinerary_verified_price_check_required";

  return {
    id,
    cruiseLine: "azamara",
    shipName: card.shipName,
    sailingName: card.cruiseName,
    departureDate,
    returnDate: addDays(departureDate, nights),
    nights,
    departurePort: card.departurePort || "Review required",
    returnPort: card.returnPort || "Review required",
    destinationRegion: normalizeRegion(`${card.destination} ${card.cruiseName}`),
    itineraryPorts: card.itineraryPorts?.length ? card.itineraryPorts : parseTitlePorts(card.cruiseName),
    portCoordinates: [],
    startingPrice: Number.isFinite(card.startingPrice) ? card.startingPrice : null,
    currency: card.currency || "USD",
    priceBasis: "per-person-double-occupancy",
    taxesAndFeesIncluded: card.taxesAndFeesIncluded,
    directLink: sourceUrlForRecord,
    affiliateLink: null,
    source: {
      provider: "azamara.com",
      sourceType: "cruise-line-website",
      sourceUrl: sourceUrlForRecord,
      affiliateNetwork: null,
      advertiserName: null,
      lastImported: importedAt,
      lastVerified: importedAt.slice(0, 10),
      confidence,
      termsNotes:
        "Browser-captured from Azamara's official cruise search cards and detail pages when reachable. The source labels fares as USD Avg Per Person; review fare basis, taxes/fees language, and booking link before promotion.",
    },
    sourceUrl: sourceUrlForRecord,
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
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
  });
  const page = await context.newPage();
  await page.goto(sourceUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(6000);

  for (let index = 0; index < maxLoadMore; index += 1) {
    const loadMore = page.getByRole("button", { name: /^load more$/i });
    if ((await loadMore.count()) === 0) break;
    const before = await page.locator(".cruise.card").count();
    await loadMore.first().evaluate((button) => button.click()).catch(() => {});
    await page.waitForTimeout(2500);
    const after = await page.locator(".cruise.card").count();
    if (after <= before) break;
  }

  const cards = await page.locator(".cruise.card").evaluateAll((elements) =>
    elements.map((card) => {
      const attrs = card.attributes;
      const read = (name) => attrs.getNamedItem(name)?.value ?? "";
      const detailLink = card.querySelector("a.view-details-button")?.href ?? "";
      const text = card.innerText ?? "";
      return {
        id: read("data-gtm-item-id"),
        destination: read("data-gtm-destination"),
        duration: read("data-gtm-duration"),
        shipName: read("data-gtm-ship-name"),
        cruiseName: read("data-gtm-cruise-name"),
        sailingDate: read("data-gtm-sailing-date"),
        startingPrice: Number(read("data-gtm-prices-starting-from")) || null,
        currency: read("data-gtm-price-currency"),
        countries: Number(read("data-gtm-cruise-countries")) || null,
        ports: Number(read("data-gtm-cruise-ports")) || null,
        overnights: Number(read("data-gtm-cruise-overnights")) || null,
        packageCode: read("data-gtm-package-code"),
        detailLink,
        taxesAndFeesIncluded: /taxes, fees and local charges are included/i.test(card.innerHTML + text),
        text,
      };
    }),
  );
  const bodyText = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
  const enrichedCards = enrichDetails ? await enrichCardsWithDetails(context, cards) : cards;
  await browser.close();
  return { cards: enrichedCards, bodyText };
}

async function enrichCardsWithDetails(context, cards) {
  const queue = [...cards];
  const enriched = [];
  const workerCount = Math.max(Math.min(detailConcurrency, cards.length), 1);

  async function worker() {
    const page = await context.newPage();
    while (queue.length > 0) {
      const card = queue.shift();
      if (!card?.detailLink) {
        enriched.push(card);
        continue;
      }
      try {
        await page.goto(card.detailLink, { waitUntil: "domcontentloaded", timeout: 45000 });
        await page.waitForTimeout(2500);
        const detail = await page.evaluate(() => {
          const ports = [...document.querySelectorAll(".cruise-itinerary .port-days")]
            .map((button) => {
              const day = button.querySelector(".day-desc")?.textContent?.trim() ?? "";
              const fullName = button.querySelector(".port-name")?.textContent?.trim() ?? "";
              const shortName = button.querySelector(".port-name-small")?.textContent?.trim() ?? "";
              return { day, fullName, shortName };
            })
            .filter((port) => port.fullName || port.shortName);
          const bodyText = document.body.innerText;
          return {
            ports,
            taxesAndFeesIncluded: /All taxes, fees and local charges are included/i.test(bodyText),
          };
        });
        const portNames = detail.ports.map((port) => cleanPortName(port.fullName || port.shortName));
        const departurePort = portNames[0] || "";
        const returnPort = portNames.at(-1) || departurePort;
        const itineraryPorts = unique(portNames.slice(1, -1).filter((port) => !/^at sea$/i.test(port)));
        enriched.push({
          ...card,
          departurePort,
          returnPort,
          itineraryPorts,
          taxesAndFeesIncluded: card.taxesAndFeesIncluded || detail.taxesAndFeesIncluded,
        });
      } catch (error) {
        enriched.push({
          ...card,
          detailError: error.message,
        });
      }
    }
    await page.close();
  }

  await Promise.all(Array.from({ length: workerCount }, worker));
  const byId = new Map(enriched.map((card) => [card.id, card]));
  return cards.map((card) => byId.get(card.id) ?? card);
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
  await writeFile(resolve(rawDir, "cards.json"), stringifyJson(capture.cards));
  await writeFile(resolve(rawDir, "page-text.txt"), `${capture.bodyText}\n`);

  const records = capture.cards.map((card) => toCanonicalSailing(card, importedAt)).filter(Boolean);
  const seen = new Set();
  const deduped = records.filter((record) => {
    if (seen.has(record.id)) return false;
    seen.add(record.id);
    return true;
  });

  const errors = validateStaging(deduped, schema);
  await writeFile(resolve(stagingDir, "sailings.json"), stringifyJson(deduped));
  await writeFile(resolve(stagingDir, "deals.json"), "[]\n");

  const byRegion = {};
  const byShip = {};
  const prices = deduped.map((record) => record.startingPrice).filter((price) => Number.isFinite(price));
  for (const record of deduped) {
    byRegion[record.destinationRegion] = (byRegion[record.destinationRegion] ?? 0) + 1;
    byShip[record.shipName] = (byShip[record.shipName] ?? 0) + 1;
  }

  const report = {
    generatedAt: importedAt,
    provider,
    runId,
    mode: "staging-only",
    sourceUrl,
    enrichDetails,
    staging: {
      sailings: deduped.length,
      deals: 0,
      schemaErrors: errors.length,
      byRegion,
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

  const markdown = `# Azamara Staging Import

Generated: ${report.generatedAt}

Mode: ${report.mode}

Source: ${sourceUrl}

## Counts

| Metric | Count |
| --- | ---: |
| Staged sailings | ${report.staging.sailings} |
| Schema errors | ${report.staging.schemaErrors} |

## Notes

- Browser-captured from official Azamara search result cards.
- Records are review-only because embark/debark ports and full itinerary details must be verified on detail pages before promotion.
`;

  await Promise.all([
    writeFile(resolve(reportsDir, `${runId}.json`), stringifyJson(report)),
    writeFile(resolve(latestReportDir, "latest-azamara-staging-import.json"), stringifyJson(report)),
    writeFile(resolve(latestReportDir, "latest-azamara-staging-import.md"), markdown),
  ]);

  console.log(`Azamara staging import: ${deduped.length} sailing(s), ${errors.length} schema error(s).`);
  console.log("Report written to data/reports/latest-azamara-staging-import.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
