#!/usr/bin/env node
/**
 * Princess Cruises official-source staging importer.
 *
 * Captures Princess public cruise-search JSON, normalizes product/ship/sail
 * dates into canonical staging records, and writes review reports. The light
 * search feed does not publish trustworthy fare details, so prices remain null
 * until a human verifies a detail/booking page.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const provider = "princess";
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const rawDir = resolve(repoRoot, `data/ingest/raw/${provider}/${runId}`);
const stagingDir = resolve(repoRoot, `data/ingest/staging/${provider}/${runId}`);
const reportsDir = resolve(repoRoot, `data/ingest/reports/${provider}`);
const latestReportDir = resolve(repoRoot, "data/reports");
const apiBase = "https://gw.api.princess.com/pcl-web/internal/resdb/p1.0";
const searchPageUrl = "https://www.princess.com/cruise-search/?trade=all&resType=C";
const productsUrl = `${apiBase}/products?agencyCountry=US&cruiseType=C&voyageStatus=A&webDisplay=Y&promoFilter=all&light=true`;
const maxProducts = Number.parseInt(process.env.PRINCESS_MAX_PRODUCTS ?? "0", 10);
const clientId = process.env.PRINCESS_CLIENT_ID ?? "32e7224ac6cc41302f673c5f5d27b4ba";

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

function princessDateToIso(value) {
  const text = String(value ?? "");
  if (!/^\d{8}$/.test(text)) return null;
  return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`;
}

function addDays(isoDateValue, days) {
  const date = new Date(`${isoDateValue}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function normalizeRegion(tradeName) {
  const region = String(tradeName ?? "").toLowerCase();
  if (region.includes("caribbean")) return "caribbean";
  if (region.includes("bahamas")) return "bahamas";
  if (region.includes("mexico")) return "mexico";
  if (region.includes("alaska")) return "alaska";
  if (region.includes("europe")) return "mediterranean";
  if (region.includes("transatlantic")) return "transatlantic";
  if (region.includes("asia") || region.includes("japan")) return "asia";
  if (region.includes("hawaii")) return "hawaii";
  if (region.includes("california")) return "california-coast";
  if (region.includes("pacific") || region.includes("australia") || region.includes("new zealand") || region.includes("tahiti")) {
    return "south-pacific";
  }
  return "other";
}

function regionLabel(record) {
  return record?.name ?? record?.id ?? "Princess";
}

function headers() {
  return {
    accept: "application/json, text/plain, */*",
    appid: JSON.stringify({
      agencyId: "DIRPB",
      cruiseLineCode: "PCL",
      sessionId: `cruisekit-${runId}`,
      systemId: "PB",
      gdsCookie: "CO=US",
    }),
    bookingcompany: "PC",
    "pcl-client-id": clientId,
    productcompany: "PC",
    referer: "https://www.princess.com/",
    reqsrc: "W",
    "user-agent": "CruiseKitImporter/0.1 (+https://cruisekit.app)",
  };
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: headers() });
  const text = await response.text();
  if (!response.ok) throw new Error(`Princess request failed ${response.status}: ${text.slice(0, 180)}`);
  return JSON.parse(text);
}

function directLink(productId, shipId, sailDate) {
  const params = new URLSearchParams({
    productId,
    shipId,
    sailDate,
    resType: "C",
  });
  return `https://www.princess.com/cruise-search/?${params}`;
}

function toCanonicalSailing({ product, ship, sailDate, shipsById, tradesById, portsById, importedAt }) {
  const departureDate = princessDateToIso(sailDate);
  const nights = Number(product.cruiseDuration);
  if (!departureDate || !Number.isInteger(nights) || nights <= 0) return null;

  const shipName = shipsById.get(ship.id)?.name ?? "Princess ship";
  const trade = tradesById.get(product.trades?.[0]?.id);
  const departurePort = portsById.get(product.embkDbkPortIds?.[0])?.name ?? "Unknown";
  const returnPort = portsById.get(product.embkDbkPortIds?.[1])?.name ?? departurePort;
  const link = directLink(product.id, ship.id, sailDate);
  const id = `princess-${slugify(shipName)}-${departureDate.replaceAll("-", "")}-${slugify(product.id)}`;
  const sailingName = `${nights}-night ${regionLabel(trade)} Princess sailing`;

  return {
    id,
    cruiseLine: "princess",
    shipName,
    sailingName,
    departureDate,
    returnDate: addDays(departureDate, nights),
    nights,
    departurePort,
    returnPort,
    destinationRegion: normalizeRegion(trade?.name),
    itineraryPorts: [],
    portCoordinates: [],
    startingPrice: null,
    currency: "USD",
    priceBasis: "unspecified",
    taxesAndFeesIncluded: false,
    directLink: link,
    affiliateLink: null,
    source: {
      provider: "princess.com",
      sourceType: "cruise-line-website",
      sourceUrl: link,
      affiliateNetwork: null,
      advertiserName: null,
      lastImported: importedAt,
      lastVerified: importedAt.slice(0, 10),
      confidence: "itinerary_verified_price_check_required",
      termsNotes:
        "Staged from Princess public cruise-search product JSON. Light feed verifies product, ship, sail date, duration, region, and embark/disembark ports but does not publish fare details; verify current price and full itinerary before promotion.",
    },
    sourceUrl: link,
    lastVerified: importedAt.slice(0, 10),
    confidence: "itinerary_verified_price_check_required",
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

function formatPrice(value) {
  return Number.isFinite(value) ? `$${Math.round(value).toLocaleString("en-US")}` : "n/a";
}

async function main() {
  const importedAt = new Date().toISOString();
  const schema = await loadJson("data/schema/sailing.schema.json");
  await Promise.all([mkdir(rawDir, { recursive: true }), mkdir(stagingDir, { recursive: true }), mkdir(reportsDir, { recursive: true }), mkdir(latestReportDir, { recursive: true })]);

  const [ships, trades, ports, products] = await Promise.all([
    fetchJson(`${apiBase}/ships`),
    fetchJson(`${apiBase}/trades?active=Y`),
    fetchJson(`${apiBase}/ports`),
    fetchJson(productsUrl),
  ]);
  await Promise.all([
    writeFile(resolve(rawDir, "ships.json"), `${JSON.stringify(ships, null, 2)}\n`),
    writeFile(resolve(rawDir, "trades.json"), `${JSON.stringify(trades, null, 2)}\n`),
    writeFile(resolve(rawDir, "ports.json"), `${JSON.stringify(ports, null, 2)}\n`),
    writeFile(resolve(rawDir, "products.json"), `${JSON.stringify(products, null, 2)}\n`),
  ]);

  const shipsById = new Map((ships.ships ?? []).map((ship) => [ship.id, ship]));
  const tradesById = new Map((trades.trades ?? []).map((trade) => [trade.id, trade]));
  const portsById = new Map((ports.ports ?? []).map((port) => [port.id, port]));
  const selectedProducts = maxProducts > 0 ? (products.products ?? []).slice(0, maxProducts) : (products.products ?? []);
  const stagingRecords = [];

  for (const product of selectedProducts) {
    for (const ship of product.ships ?? []) {
      for (const sailDate of ship.sailDates ?? []) {
        const record = toCanonicalSailing({ product, ship, sailDate, shipsById, tradesById, portsById, importedAt });
        if (record) stagingRecords.push(record);
      }
    }
  }

  const seen = new Set();
  const deduped = stagingRecords.filter((record) => {
    if (seen.has(record.id)) return false;
    seen.add(record.id);
    return true;
  });
  const schemaErrors = validateStaging(deduped, schema);
  await writeFile(resolve(stagingDir, "sailings.json"), `${JSON.stringify(deduped, null, 2)}\n`);
  await writeFile(resolve(stagingDir, "deals.json"), "[]\n");

  const byRegion = {};
  const byShip = {};
  for (const record of deduped) {
    byRegion[record.destinationRegion] = (byRegion[record.destinationRegion] ?? 0) + 1;
    byShip[record.shipName] = (byShip[record.shipName] ?? 0) + 1;
  }

  const report = {
    generatedAt: importedAt,
    provider,
    runId,
    mode: "staging-only",
    source: productsUrl,
    sourcePage: searchPageUrl,
    maxProducts: maxProducts > 0 ? maxProducts : null,
    sourceCounts: {
      ships: ships.ships?.length ?? 0,
      trades: trades.trades?.length ?? 0,
      ports: ports.ports?.length ?? 0,
      products: products.products?.length ?? 0,
      productsSampled: selectedProducts.length,
    },
    staging: {
      sailings: deduped.length,
      deals: 0,
      schemaErrors: schemaErrors.length,
      minPrice: null,
      maxPrice: null,
      byRegion: Object.fromEntries(Object.entries(byRegion).sort(([a], [b]) => a.localeCompare(b))),
      byShip: Object.fromEntries(Object.entries(byShip).sort(([a], [b]) => a.localeCompare(b))),
    },
    blockers: schemaErrors.map((error) => `${error.id}: ${error.errors.join("; ")}`),
    warnings: [
      "Princess light search JSON does not publish reliable starting fares.",
      "Staged records are inventory candidates, not public deals.",
      "Review exact itinerary, price, taxes/fees, and booking link before promotion.",
    ],
    paths: {
      raw: `data/ingest/raw/${provider}/${runId}`,
      staging: `data/ingest/staging/${provider}/${runId}`,
      report: `data/ingest/reports/${provider}/${runId}.json`,
    },
  };

  const markdown = `# Princess Staging Import Report

Generated: ${report.generatedAt}

Mode: ${report.mode}

Source: ${report.sourcePage}

## Counts

| Metric | Count |
| --- | ---: |
| Source ships | ${report.sourceCounts.ships} |
| Source trades | ${report.sourceCounts.trades} |
| Source ports | ${report.sourceCounts.ports} |
| Source products | ${report.sourceCounts.products} |
| Products sampled | ${report.sourceCounts.productsSampled} |
| Staged sailings | ${report.staging.sailings} |
| Schema errors | ${report.staging.schemaErrors} |

## Price Observation

| Metric | Value |
| --- | ---: |
| Min observed starting price | ${formatPrice(report.staging.minPrice)} |
| Max observed starting price | ${formatPrice(report.staging.maxPrice)} |

Princess' light public search feed does not expose trustworthy fare details, so staged records use \`startingPrice: null\`.

## By Region

${Object.entries(report.staging.byRegion).map(([region, count]) => `- ${region}: ${count}`).join("\n") || "- None"}

## By Ship

${Object.entries(report.staging.byShip).map(([ship, count]) => `- ${ship}: ${count}`).join("\n") || "- None"}

## Promotion Rules

- Do not auto-promote Princess staged records as public deals.
- Open the Princess source and verify exact ship, date, duration, itinerary, current fare, price basis, taxes/fees, and booking link before promotion.
- Keep promoted Princess records at \`itinerary_verified_price_check_required\` unless a human verifies price at publish time.

## Blockers

${report.blockers.length === 0 ? "- None\n" : report.blockers.map((blocker) => `- ${blocker}`).join("\n") + "\n"}`;

  await Promise.all([
    writeFile(resolve(reportsDir, `${runId}.json`), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(latestReportDir, "latest-princess-staging-import.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(latestReportDir, "latest-princess-staging-import.md"), markdown),
  ]);

  console.log(`Princess staging import: ${deduped.length} sailing(s), ${schemaErrors.length} schema error(s).`);
  console.log("Report written to data/reports/latest-princess-staging-import.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
