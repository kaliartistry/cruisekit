#!/usr/bin/env node
/**
 * Norwegian Cruise Line official-source staging importer.
 *
 * Fetches NCL's public vacation search endpoint, then expands each itinerary
 * through NCL's date-specific sailings endpoint. This script writes raw
 * snapshots, canonical-shaped staging sailings, and a review-ready report. It
 * never edits data/seed/*.json.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const provider = "norwegian";
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const rawDir = resolve(repoRoot, `data/ingest/raw/${provider}/${runId}`);
const stagingDir = resolve(repoRoot, `data/ingest/staging/${provider}/${runId}`);
const reportsDir = resolve(repoRoot, `data/ingest/reports/${provider}`);
const latestReportDir = resolve(repoRoot, "data/reports");
const searchEndpoint = "https://www.ncl.com/api/v2/vacations/search";

const maxItineraries = Number.parseInt(process.env.NCL_MAX_ITINERARIES ?? "30", 10);
const pageSize = Number.parseInt(process.env.NCL_PAGE_SIZE ?? "50", 10);
const maxSailingsPerItinerary = Number.parseInt(process.env.NCL_MAX_SAILINGS_PER_ITINERARY ?? "8", 10);
const destination = process.env.NCL_DESTINATION ?? "CARIBBEAN";
const destinations = (process.env.NCL_DESTINATIONS ?? destination)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function isoDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
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

function normalizeRegion(value, sourceDestination = "") {
  const destinationCode = String(sourceDestination ?? "").toUpperCase();
  if (destinationCode === "MEDITERRANEAN" || destinationCode === "GREEK_ISLES") return "mediterranean";
  if (destinationCode === "NORTHERN_EUROPE") return "northern-europe";
  if (destinationCode === "ASIA") return "asia";
  if (destinationCode === "SOUTH_AMERICA") return "south-america";
  if (destinationCode === "PANAMA_CANAL") return "panama-canal";
  if (destinationCode === "CANADA_NEW_ENGL") return "canada-new-england";
  if (destinationCode === "AUSTRALIA") return "australia-new-zealand";
  if (destinationCode === "SOUTH_PACIFIC") return "south-pacific";
  if (destinationCode === "TRANSATLANTIC") return "transatlantic";

  const region = String(value ?? "").toLowerCase();
  if (region.includes("antarctica")) return "antarctica";
  if (region.includes("south america") || region.includes("buenos aires") || region.includes("brazil") || region.includes("uruguay")) return "south-america";
  if (region.includes("panama canal")) return "panama-canal";
  if (region.includes("canada") && region.includes("england")) return "canada-new-england";
  if (region.includes("australia") || region.includes("new zealand")) return "australia-new-zealand";
  if (region.includes("south pacific") || region.includes("tahiti")) return "south-pacific";
  if (region.includes("asia") || region.includes("japan") || region.includes("tokyo") || region.includes("yokohama")) return "asia";
  if (region.includes("mediterranean") || region.includes("greek isles") || region.includes("adriatic")) return "mediterranean";
  if (region.includes("bahamas")) return "bahamas";
  if (region.includes("caribbean")) return "caribbean";
  if (region.includes("mexico")) return "mexico";
  if (region.includes("alaska")) return "alaska";
  if (region.includes("hawaii")) return "hawaii";
  if (region.includes("europe")) return "northern-europe";
  return "other";
}

function absoluteNclUrl(pathOrUrl) {
  if (!pathOrUrl) return "https://www.ncl.com/vacations";
  return String(pathOrUrl).startsWith("http") ? String(pathOrUrl) : `https://www.ncl.com${pathOrUrl}`;
}

function itineraryUrl(code, packageId) {
  const params = new URLSearchParams({
    itineraryCode: code,
    guests: "2",
    gateway: "NONE",
  });
  if (packageId) params.set("packageId", packageId);
  return `https://www.ncl.com/vacation-builder/planning/cruiseItinerary?${params}`;
}

function lowestAvailablePrice(pricing) {
  const prices = (pricing ?? [])
    .filter((room) => room.status === "AVAILABLE")
    .map((room) => room.combinedPrice)
    .filter((price) => Number.isFinite(price) && price > 0);
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

function cabinPrices(pricing) {
  return (pricing ?? []).map((room) => ({
    code: room.code,
    title: room.title,
    status: room.status,
    combinedPrice: Number.isFinite(room.combinedPrice) ? room.combinedPrice : null,
    basePrice: Number.isFinite(room.basePrice) ? room.basePrice : null,
  }));
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      referer: "https://www.ncl.com/",
      "user-agent": "CruiseKitImporter/0.1 (+https://cruisekit.app)",
    },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`NCL request failed ${response.status}: ${text.slice(0, 160)}`);
  return JSON.parse(text);
}

async function fetchSearchPage(destinationCode, offset) {
  const params = new URLSearchParams({
    destinations: destinationCode,
    numberOfGuests: "2",
    filterConfig: "search-filters-configuration",
    limit: String(pageSize),
    offset: String(offset),
  });
  const url = `${searchEndpoint}?${params}`;
  return { url, json: await fetchJson(url) };
}

async function fetchSailings(itineraryCode) {
  const url = `https://www.ncl.com/vacation-builder/api/v2/itinerary/${encodeURIComponent(itineraryCode)}/sailings?numberOfGuests=2`;
  return { url, json: await fetchJson(url) };
}

function toCanonicalSailing(itinerary, result, importedAt, sourceDestination) {
  const sailing = result.sailing ?? {};
  const departureDate = isoDate(sailing.sailStartDate ?? sailing.vacationStartDate);
  const returnDate = isoDate(sailing.sailEndDate ?? sailing.vacationEndDate);
  if (!departureDate || !returnDate) return null;
  const nights = Number(itinerary.duration?.days ?? 0);
  const directLink = itineraryUrl(itinerary.code, sailing.packageId);
  const price = lowestAvailablePrice(result.stateroomTypesPricing);
  const id = `norwegian-${slugify(itinerary.ship?.title ?? "ship")}-${departureDate.replaceAll("-", "")}-${sailing.sailingId ?? sailing.packageId}`;

  return {
    id,
    cruiseLine: "norwegian",
    shipName: itinerary.ship?.title ?? "Norwegian ship",
    sailingName: itinerary.title ?? `${nights}-day Norwegian sailing`,
    departureDate,
    returnDate,
    nights,
    departurePort: itinerary.embarkationPort?.title ?? itinerary.startingLocation ?? "Unknown",
    returnPort: itinerary.disembarkationPort?.title ?? itinerary.embarkationPort?.title ?? itinerary.startingLocation ?? "Unknown",
    destinationRegion: normalizeRegion(
      [itinerary.title, ...(itinerary.destinations ?? []).map((item) => item.title)].filter(Boolean).join(" "),
      sourceDestination,
    ),
    itineraryPorts: (itinerary.portsOfCall ?? []).map((port) => port.title).filter(Boolean),
    portCoordinates: [],
    startingPrice: Number.isFinite(price) ? Math.round(price) : null,
    currency: itinerary.currencyCode ?? "USD",
    priceBasis: "per-person-double-occupancy",
    taxesAndFeesIncluded: false,
    directLink,
    affiliateLink: null,
    source: {
      provider: "ncl.com",
      sourceType: "cruise-line-website",
      sourceUrl: directLink,
      affiliateNetwork: null,
      advertiserName: null,
      lastImported: importedAt,
      lastVerified: importedAt.slice(0, 10),
      confidence: "itinerary_verified_price_check_required",
      termsNotes:
        `Staged from NCL public vacation search and date-specific sailings JSON for ${sourceDestination}. Review price basis, taxes/fees, package inclusions, and booking link before promotion.`,
    },
    sourceUrl: directLink,
    lastVerified: importedAt.slice(0, 10),
    confidence: "itinerary_verified_price_check_required",
    createdAt: importedAt,
    updatedAt: importedAt,
    observedCabinPrices: cabinPrices(result.stateroomTypesPricing),
    observedSailingId: sailing.sailingId ?? null,
    observedPackageId: sailing.packageId ?? null,
  };
}

function validateStaging(records, schema) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const errors = [];
  const sanitized = records.map(({ observedCabinPrices, observedSailingId, observedPackageId, ...record }) => record);
  for (const record of sanitized) {
    if (validate(record)) continue;
    errors.push({
      id: record.id,
      errors: validate.errors?.map((error) => `${error.instancePath || "/"} ${error.message}`) ?? [],
    });
  }
  return { sanitized, errors };
}

async function main() {
  const importedAt = new Date().toISOString();
  const schema = await loadJson("data/schema/sailing.schema.json");
  await Promise.all([mkdir(rawDir, { recursive: true }), mkdir(stagingDir, { recursive: true }), mkdir(reportsDir, { recursive: true }), mkdir(latestReportDir, { recursive: true })]);

  const searchPages = [];
  const itineraries = [];
  for (const destinationCode of destinations) {
    const destinationItineraries = [];
    for (let offset = 0; destinationItineraries.length < maxItineraries; offset += pageSize) {
      const page = await fetchSearchPage(destinationCode, offset);
      searchPages.push({ destination: destinationCode, offset, url: page.url, count: page.json.itineraries?.length ?? 0 });
      await writeFile(resolve(rawDir, `search-${slugify(destinationCode)}-${offset}.json`), `${JSON.stringify(page.json, null, 2)}\n`);
      const pageItineraries = page.json.itineraries ?? [];
      destinationItineraries.push(...pageItineraries.map((itinerary) => ({ destinationCode, itinerary })));
      if (pageItineraries.length < pageSize) break;
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 750));
    }
    itineraries.push(...destinationItineraries.slice(0, maxItineraries));
  }

  const stagingRecords = [];
  const observed = [];
  const selectedItineraries = itineraries;
  for (const { destinationCode, itinerary } of selectedItineraries) {
    const sailings = await fetchSailings(itinerary.code);
    await writeFile(resolve(rawDir, `sailings-${slugify(destinationCode)}-${slugify(itinerary.code)}.json`), `${JSON.stringify(sailings.json, null, 2)}\n`);
    for (const result of (sailings.json.results ?? []).slice(0, maxSailingsPerItinerary)) {
      const record = toCanonicalSailing(itinerary, result, importedAt, destinationCode);
      if (!record) continue;
      observed.push({
        id: record.id,
        directLink: record.directLink,
        observedCabinPrices: record.observedCabinPrices,
        observedSailingId: record.observedSailingId,
        observedPackageId: record.observedPackageId,
      });
      stagingRecords.push(record);
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
  }

  const seen = new Set();
  const deduped = stagingRecords.filter((record) => {
    if (seen.has(record.id)) return false;
    seen.add(record.id);
    return true;
  });
  const { sanitized, errors } = validateStaging(deduped, schema);
  await writeFile(resolve(stagingDir, "sailings.json"), `${JSON.stringify(sanitized, null, 2)}\n`);
  await writeFile(resolve(stagingDir, "deals.json"), "[]\n");
  await writeFile(resolve(stagingDir, "observed-prices.json"), `${JSON.stringify(observed, null, 2)}\n`);

  const byShip = {};
  const prices = sanitized.map((record) => record.startingPrice).filter((price) => Number.isFinite(price));
  for (const record of sanitized) byShip[record.shipName] = (byShip[record.shipName] ?? 0) + 1;

  const report = {
    generatedAt: importedAt,
    provider,
    runId,
    mode: "staging-only",
    source: searchEndpoint,
    destinations,
    maxItineraries,
    maxSailingsPerItinerary,
    searchPages,
    staging: {
      sailings: sanitized.length,
      deals: 0,
      schemaErrors: errors.length,
      byShip: Object.fromEntries(Object.entries(byShip).sort(([a], [b]) => a.localeCompare(b))),
      minPrice: prices.length ? Math.min(...prices) : null,
      maxPrice: prices.length ? Math.max(...prices) : null,
    },
    blockers: errors,
    warnings: [
      "Staging records are not production records.",
      "NCL combinedPrice may include package-specific offer assumptions; review before promotion.",
      "Review exact booking URL, price basis, taxes/fees, and terms before promotion.",
    ],
    paths: {
      raw: `data/ingest/raw/${provider}/${runId}`,
      staging: `data/ingest/staging/${provider}/${runId}`,
      report: `data/ingest/reports/${provider}/${runId}.json`,
    },
  };

  const markdown = `# Norwegian Staging Import Report

Generated: ${report.generatedAt}

Mode: ${report.mode}

## Counts

| Metric | Count |
| --- | ---: |
| Search pages | ${report.searchPages.length} |
| Source itineraries sampled | ${selectedItineraries.length} |
| Staged sailings | ${report.staging.sailings} |
| Schema errors | ${report.staging.schemaErrors} |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | ${report.staging.minPrice ?? "n/a"} |
| Max observed starting price | ${report.staging.maxPrice ?? "n/a"} |

## By Ship

${Object.entries(report.staging.byShip).map(([ship, count]) => `- ${ship}: ${count}`).join("\n") || "- None"}

## Promotion Rules

- Do not auto-promote prices into production.
- Verify exact ship/date/itinerary/link on NCL before editing seed data.
- Keep promoted Norwegian records at \`itinerary_verified_price_check_required\` unless a human verifies the price.
- Keep uncertain records hidden with \`internal_do_not_publish\`.

## Blockers

${errors.length === 0 ? "- None\n" : errors.map((error) => `- ${error.id}: ${error.errors.join("; ")}`).join("\n") + "\n"}`;

  await Promise.all([
    writeFile(resolve(reportsDir, `${runId}.json`), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(latestReportDir, "latest-norwegian-staging-import.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(latestReportDir, "latest-norwegian-staging-import.md"), markdown),
  ]);

  console.log(`Norwegian staging import: ${sanitized.length} sailing(s), ${errors.length} schema error(s).`);
  console.log("Report written to data/reports/latest-norwegian-staging-import.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
