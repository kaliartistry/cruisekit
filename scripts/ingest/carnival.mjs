#!/usr/bin/env node
/**
 * Carnival official-source staging importer.
 *
 * Fetches Carnival's public cruise search JSON, saves raw snapshots, normalizes
 * candidate canonical Sailing records into data/ingest/staging, and writes a
 * human-readable report. This script never edits data/seed/*.json.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const provider = "carnival";
const endpoint = "https://www.carnival.com/cruisesearch/api/search";
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const rawDir = resolve(repoRoot, `data/ingest/raw/${provider}/${runId}`);
const stagingDir = resolve(repoRoot, `data/ingest/staging/${provider}/${runId}`);
const reportsDir = resolve(repoRoot, "data/ingest/reports/carnival");
const latestReportDir = resolve(repoRoot, "data/reports");

const maxPages = Number.parseInt(process.env.CARNIVAL_MAX_PAGES ?? "3", 10);
const pageSize = Number.parseInt(process.env.CARNIVAL_PAGE_SIZE ?? "50", 10);
const destination = process.env.CARNIVAL_DESTINATION ?? "C";

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
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeRegion(value) {
  const region = String(value ?? "").toLowerCase();
  if (region.includes("antarctica")) return "antarctica";
  if (region.includes("south america") || region.includes("buenos aires") || region.includes("brazil") || region.includes("uruguay")) return "south-america";
  if (region.includes("panama")) return "panama-canal";
  if (region.includes("canada") && region.includes("england")) return "canada-new-england";
  if (region.includes("australia") || region.includes("new zealand")) return "australia-new-zealand";
  if (region.includes("asia") || region.includes("japan")) return "asia";
  if (region.includes("bahamas")) return "bahamas";
  if (region.includes("caribbean")) return "caribbean";
  if (region.includes("mexico")) return "mexico";
  if (region.includes("alaska")) return "alaska";
  if (region.includes("hawaii")) return "hawaii";
  if (region.includes("europe")) return "northern-europe";
  if (region.includes("mediterranean")) return "mediterranean";
  return "other";
}

function isPortStop(stop) {
  const port = String(stop?.port ?? "").toLowerCase();
  return port && !port.includes("fun day") && !port.includes("sea day") && !port.includes("at sea");
}

function cabinPrices(sailing) {
  const rooms = sailing?.rooms ?? {};
  return Object.fromEntries(
    Object.entries(rooms).map(([key, room]) => [
      key,
      {
        price: Number.isFinite(room?.price) && room.price > 0 ? room.price : null,
        currency: room?.priceCurrency ?? null,
        soldOut: Boolean(room?.soldOut),
        categoryCode: room?.categoryCode ?? null,
        rateCode: room?.rateCode ?? null,
      },
    ]),
  );
}

function lowestAvailablePrice(sailing) {
  const prices = Object.values(sailing?.rooms ?? {})
    .map((room) => room?.price)
    .filter((price) => Number.isFinite(price) && price > 0);
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

function bookingUrl(sailing, fallbackPath) {
  const path = sailing?.sailingURL ?? fallbackPath;
  if (!path) return "https://www.carnival.com/cruise-search";
  return path.startsWith("http") ? path : `https://www.carnival.com${path}`;
}

function toCanonicalSailing(itinerary, sailing, importedAt) {
  const departureDate = isoDate(sailing.departureDate);
  const returnDate = isoDate(sailing.arrivalDate);
  if (!departureDate || !returnDate) return null;

  const schedule = itinerary.leadSailing?.schedule ?? [];
  const ports = schedule
    .filter(isPortStop)
    .map((stop) => stop.port)
    .filter(Boolean);
  const departurePort = itinerary.departurePortName ?? itinerary.leadSailing?.schedule?.[0]?.port ?? "Unknown";
  const returnPort = itinerary.roundtrip
    ? departurePort
    : schedule.filter(isPortStop).at(-1)?.port ?? departurePort;
  const price = lowestAvailablePrice(sailing) ?? itinerary.leadSailing?.fromPrice ?? null;
  const directLink = bookingUrl(sailing, itinerary.itineraryURLWithSailing ?? itinerary.itineraryURL);
  const sourceUrl = directLink;
  const shipSlug = slugify(itinerary.shipName);
  const id = `carnival-${shipSlug}-${departureDate.replaceAll("-", "")}-${sailing.sailingId ?? slugify(itinerary.code ?? itinerary.id)}`;

  return {
    id,
    cruiseLine: "carnival",
    shipName: itinerary.shipName,
    sailingName: itinerary.itineraryTitleFormatted ?? itinerary.itineraryTitle ?? `${itinerary.dur}-night Carnival sailing`,
    departureDate,
    returnDate,
    nights: Number(itinerary.dur),
    departurePort,
    returnPort,
    destinationRegion: normalizeRegion(itinerary.regionName),
    itineraryPorts: ports,
    portCoordinates: [],
    startingPrice: price,
    currency: sailing.rooms?.interior?.priceCurrency ?? itinerary.leadSailing?.fromPriceCurrency ?? "USD",
    priceBasis: "per-person-double-occupancy",
    taxesAndFeesIncluded: false,
    directLink,
    affiliateLink: null,
    source: {
      provider: "carnival.com",
      sourceType: "cruise-line-website",
      sourceUrl,
      affiliateNetwork: null,
      advertiserName: null,
      lastImported: importedAt,
      lastVerified: importedAt.slice(0, 10),
      confidence: "itinerary_verified_price_check_required",
      termsNotes:
        "Staged from Carnival public cruise search JSON. Review price basis, taxes/fees, and booking link before promotion.",
    },
    sourceUrl,
    lastVerified: importedAt.slice(0, 10),
    confidence: "itinerary_verified_price_check_required",
    createdAt: importedAt,
    updatedAt: importedAt,
    observedCabinPrices: cabinPrices(sailing),
    observedSailingId: sailing.sailingId ?? null,
  };
}

async function fetchPage(pageNumber) {
  const params = new URLSearchParams({
    dest: destination,
    numAdults: "2",
    pageNumber: String(pageNumber),
    pageSize: String(pageSize),
    showBest: "true",
    excludeResults: "false",
    currency: "USD",
    locality: "1",
  });
  const url = `${endpoint}?${params}`;
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      referer: "https://www.carnival.com/",
      "user-agent": "CruiseKitImporter/0.1 (+https://cruisekit.app)",
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Carnival page ${pageNumber} failed: HTTP ${response.status} ${text.slice(0, 160)}`);
  }
  return { url, json: JSON.parse(text) };
}

function validateStaging(records, schema) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const errors = [];
  const sanitized = records.map(({ observedCabinPrices, observedSailingId, ...record }) => record);
  for (const record of sanitized) {
    if (validate(record)) continue;
    errors.push({
      id: record.id,
      errors: validate.errors?.map((error) => `${error.instancePath || "/"} ${error.message}`) ?? [],
    });
  }
  return { errors, sanitized };
}

async function main() {
  const importedAt = new Date().toISOString();
  const schema = await loadJson("data/schema/sailing.schema.json");
  await Promise.all([mkdir(rawDir, { recursive: true }), mkdir(stagingDir, { recursive: true }), mkdir(reportsDir, { recursive: true }), mkdir(latestReportDir, { recursive: true })]);

  const rawPages = [];
  const stagingRecords = [];
  const observed = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const result = await fetchPage(page);
    rawPages.push({ page, url: result.url, totalResults: result.json.results?.totalResults ?? null });
    await writeFile(resolve(rawDir, `page-${page}.json`), `${JSON.stringify(result.json, null, 2)}\n`);

    const itineraries = result.json.results?.itineraries ?? [];
    for (const itinerary of itineraries) {
      for (const sailing of itinerary.sailings ?? []) {
        const record = toCanonicalSailing(itinerary, sailing, importedAt);
        if (!record) continue;
        observed.push({
          id: record.id,
          directLink: record.directLink,
          observedCabinPrices: record.observedCabinPrices,
          observedSailingId: record.observedSailingId,
        });
        stagingRecords.push(record);
      }
    }

    const lastPage = result.json.results?.lastPage ?? page;
    if (page >= lastPage) break;
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 750));
  }

  const seen = new Set();
  const deduped = stagingRecords.filter((record) => {
    if (seen.has(record.id)) return false;
    seen.add(record.id);
    return true;
  });
  const { errors, sanitized } = validateStaging(deduped, schema);

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
    source: endpoint,
    destination,
    maxPages,
    pageSize,
    rawPages,
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
      "Review exact booking URL, price basis, taxes/fees, and terms before promotion.",
      "Observed cabin prices are saved separately and are not part of the canonical public schema.",
    ],
    paths: {
      raw: `data/ingest/raw/${provider}/${runId}`,
      staging: `data/ingest/staging/${provider}/${runId}`,
      report: `data/ingest/reports/${provider}/${runId}.json`,
    },
  };

  const markdown = `# Carnival Staging Import Report

Generated: ${report.generatedAt}

Mode: ${report.mode}

## Counts

| Metric | Count |
| --- | ---: |
| Raw pages | ${rawPages.length} |
| Staged sailings | ${sanitized.length} |
| Schema errors | ${errors.length} |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | ${report.staging.minPrice ?? "n/a"} |
| Max observed starting price | ${report.staging.maxPrice ?? "n/a"} |

## By Ship

${Object.entries(report.staging.byShip)
  .map(([ship, count]) => `- ${ship}: ${count}`)
  .join("\n")}

## Promotion Rules

- Do not auto-promote prices into production.
- Verify exact ship/date/itinerary/link on Carnival before editing seed data.
- Keep promoted records at \`itinerary_verified_price_check_required\` unless a human verifies the price.
- Keep uncertain records hidden with \`internal_do_not_publish\`.

## Blockers

${errors.length === 0 ? "- None" : errors.map((error) => `- ${error.id}: ${error.errors.join("; ")}`).join("\n")}
`;

  await writeFile(resolve(reportsDir, `${runId}.json`), `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(resolve(reportsDir, `${runId}.md`), markdown);
  await writeFile(resolve(latestReportDir, "latest-carnival-staging-import.json"), `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(resolve(latestReportDir, "latest-carnival-staging-import.md"), markdown);

  console.log(`Carnival staging import: ${sanitized.length} sailing(s), ${errors.length} schema error(s).`);
  console.log(`Raw snapshots: ${report.paths.raw}`);
  console.log(`Staging: ${report.paths.staging}`);
  console.log("Report written to data/reports/latest-carnival-staging-import.md");

  if (errors.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
