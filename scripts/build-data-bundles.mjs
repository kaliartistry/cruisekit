#!/usr/bin/env node
/**
 * Builds versioned public data bundles from canonical seed records.
 *
 * These bundles are the handoff layer between ingestion/review jobs and
 * consumers such as the Next.js website, Flutter app, CDN, or Firebase Storage.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outRoot = resolve(repoRoot, "data/bundles");
const canonicalOut = resolve(outRoot, "canonical");
const mobileOut = resolve(outRoot, "mobile");

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function stringifyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function isPublic(record) {
  return record.confidence !== "internal_do_not_publish";
}

function validateRecords(label, records, validate) {
  let errors = 0;
  for (const record of records) {
    if (validate(record)) continue;
    errors++;
    console.error(`\n[FAIL] ${label} id=${record?.id ?? "<unknown>"}`);
    for (const err of validate.errors ?? []) {
      console.error(`  ${err.instancePath || "/"} ${err.message}`);
    }
  }
  return errors;
}

function toMobileSailing(sailing) {
  return {
    id: sailing.id,
    cruiseLineId: sailing.cruiseLine,
    shipName: sailing.shipName,
    shipId: slugify(sailing.shipName),
    departureDate: sailing.departureDate,
    returnDate: sailing.returnDate,
    duration: sailing.nights,
    departurePort: sailing.departurePort,
    region: sailing.destinationRegion,
    itinerary: buildMobileItinerary(sailing),
  };
}

function buildMobileItinerary(sailing) {
  const itinerary = [
    {
      day: 1,
      type: "departure",
      portName: sailing.departurePort,
    },
  ];

  const middleDays = Math.max(sailing.nights - 1, 0);
  const ports = sailing.itineraryPorts.slice(0, middleDays);
  for (const portName of ports) {
    itinerary.push({
      day: itinerary.length + 1,
      type: "port",
      portName,
      portSlug: slugify(portName),
      isTender: false,
    });
  }

  while (itinerary.length < sailing.nights) {
    itinerary.push({
      day: itinerary.length + 1,
      type: "sea",
    });
  }

  itinerary.push({
    day: itinerary.length + 1,
    type: "arrival",
    portName: sailing.returnPort,
  });

  return itinerary;
}

function toMobileDeal(sailing) {
  const monthKey = sailing.departureDate.slice(0, 7);
  return {
    id: sailing.id,
    cruiseLine: displayCruiseLine(sailing.cruiseLine),
    cruiseLineId: sailing.cruiseLine,
    shipName: sailing.shipName,
    duration: sailing.nights,
    departurePort: sailing.departurePort,
    itineraryTitle: sailing.sailingName,
    fromPrice: sailing.startingPrice ?? 0,
    currency: sailing.currency,
    departureDate: sailing.departureDate,
    ports: sailing.itineraryPorts,
    imageUrl: null,
    bookingUrl: sailing.affiliateLink ?? sailing.directLink ?? null,
    region: sailing.destinationRegion,
    source: sailing.source?.provider ?? sailing.cruiseLine,
    lastVerified: sailing.lastVerified,
    confidence: sailing.confidence,
    priceBasis: sailing.priceBasis,
    taxesAndFeesIncluded: sailing.taxesAndFeesIncluded,
    monthKey,
    monthLabel: formatMonth(monthKey),
    dealScore: dealScore(sailing),
    badges: dealBadges(sailing),
  };
}

function formatMonth(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function dealScore(sailing) {
  let score = 0;
  const price = sailing.startingPrice;
  if (Number.isFinite(price)) {
    if (price <= 350) score += 45;
    else if (price <= 500) score += 35;
    else if (price <= 750) score += 22;
    else if (price <= 1000) score += 12;
  }
  if (sailing.nights >= 4 && sailing.nights <= 6) score += 18;
  if (sailing.nights === 7) score += 14;
  if (sailing.destinationRegion === "caribbean" || sailing.destinationRegion === "bahamas") score += 12;
  if (sailing.confidence === "verified_from_cruise_line") score += 8;
  if (sailing.confidence === "itinerary_verified_price_check_required") score += 4;
  return score;
}

function dealBadges(sailing) {
  const badges = [];
  if (Number.isFinite(sailing.startingPrice) && sailing.startingPrice <= 350) badges.push("Low price");
  if (sailing.nights >= 3 && sailing.nights <= 5) badges.push("Short cruise");
  if (sailing.nights === 7) badges.push("7-night");
  if (sailing.confidence === "itinerary_verified_price_check_required") badges.push("Price check required");
  return badges.slice(0, 3);
}

function displayCruiseLine(slug) {
  const names = {
    carnival: "Carnival Cruise Line",
    celebrity: "Celebrity Cruises",
    disney: "Disney Cruise Line",
    "holland-america": "Holland America Line",
    msc: "MSC Cruises",
    norwegian: "Norwegian Cruise Line",
    princess: "Princess Cruises",
    "royal-caribbean": "Royal Caribbean International",
    "virgin-voyages": "Virgin Voyages",
  };
  return names[slug] ?? slug;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function writeBundle(relPath, value) {
  const absPath = resolve(repoRoot, relPath);
  const content = stringifyJson(value);
  await mkdir(dirname(absPath), { recursive: true });
  await writeFile(absPath, content);
  return {
    path: relPath,
    bytes: Buffer.byteLength(content),
    sha256: sha256(content),
    records: Array.isArray(value) ? value.length : value?.sailings?.length ?? null,
  };
}

async function main() {
  const [sailingSchema, dealSchema, seedSailings, seedDeals] = await Promise.all([
    loadJson("data/schema/sailing.schema.json"),
    loadJson("data/schema/deal.schema.json"),
    loadJson("data/seed/sailings.json"),
    loadJson("data/seed/deals.json"),
  ]);

  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validateSailing = ajv.compile(sailingSchema);
  const validateDeal = ajv.compile(dealSchema);
  const errors =
    validateRecords("sailing", seedSailings, validateSailing) +
    validateRecords("deal", seedDeals, validateDeal);

  if (errors > 0) {
    console.error(`\nBundle build blocked by ${errors} schema error(s).`);
    process.exit(1);
  }

  const publicSailings = seedSailings.filter(isPublic);
  const publicDeals = seedDeals.filter(isPublic);
  const mobileSailings = publicSailings.map(toMobileSailing);
  const mobileDeals = publicSailings.map(toMobileDeal);
  const generatedAt = new Date().toISOString();

  await Promise.all([mkdir(canonicalOut, { recursive: true }), mkdir(mobileOut, { recursive: true })]);

  const bundles = {
    canonicalSailings: await writeBundle("data/bundles/canonical/sailings.json", publicSailings),
    canonicalDeals: await writeBundle("data/bundles/canonical/deals.json", publicDeals),
    mobileSailings: await writeBundle("data/bundles/mobile/sailings.json", mobileSailings),
    mobileDeals: await writeBundle("data/bundles/mobile/deals.json", mobileDeals),
  };

  const manifest = {
    schemaVersion: "1.0.0",
    generatedAt,
    source: {
      sailings: "data/seed/sailings.json",
      deals: "data/seed/deals.json",
      excludedConfidence: "internal_do_not_publish",
    },
    counts: {
      seedSailings: seedSailings.length,
      publicSailings: publicSailings.length,
      seedDeals: seedDeals.length,
      publicDeals: publicDeals.length,
    },
    bundles,
  };

  await writeBundle("data/bundles/manifest.json", manifest);

  console.log(`Built data bundles at ${outRoot}`);
  console.log(`Public sailings: ${publicSailings.length}/${seedSailings.length}`);
  console.log(`Public deals: ${publicDeals.length}/${seedDeals.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
