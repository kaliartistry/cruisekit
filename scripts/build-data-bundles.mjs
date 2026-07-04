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
import { currentUtcDateOnly, dateOnly } from "./lib/date.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outRoot = resolve(repoRoot, "data/bundles");
const canonicalOut = resolve(outRoot, "canonical");
const mobileOut = resolve(outRoot, "mobile");

const PORT_IMAGE_SLUGS = new Set([
  "amber-cove",
  "amsterdam",
  "antigua",
  "aruba",
  "auckland",
  "baltimore",
  "barbados",
  "barcelona",
  "belize-city",
  "bermuda",
  "bimini",
  "bonaire",
  "busan",
  "cabo-san-lucas",
  "cartagena",
  "catalina-island",
  "celebration-key",
  "chania-souda",
  "cococay",
  "copenhagen",
  "costa-maya",
  "cozumel",
  "curacao",
  "dominica",
  "dover",
  "dubrovnik",
  "ensenada",
  "falmouth",
  "fort-lauderdale",
  "freeport",
  "funchal",
  "galveston",
  "grand-cayman",
  "grand-turk",
  "great-stirrup-cay",
  "grenada",
  "guadeloupe",
  "half-moon-cay",
  "halifax",
  "hamburg",
  "harvest-caye",
  "icy-strait-point",
  "jeju",
  "juneau",
  "ketchikan",
  "key-west",
  "kusadasi",
  "la-romana",
  "labadee",
  "le-havre",
  "lisbon",
  "los-angeles",
  "manhattan",
  "martinique",
  "mazatlan",
  "miami",
  "mobile",
  "montego-bay",
  "mykonos",
  "naples",
  "nassau",
  "new-orleans",
  "norfolk",
  "ocean-cay",
  "ocho-rios",
  "olympia-katakolon",
  "oslo",
  "port-canaveral",
  "port-royal",
  "princess-cays",
  "progreso",
  "puerto-plata",
  "puerto-vallarta",
  "roatan",
  "rome-civitavecchia",
  "samana",
  "san-diego",
  "san-juan",
  "santorini",
  "seattle",
  "shanghai",
  "sicily-messina",
  "sitka",
  "skagway",
  "southampton",
  "st-croix",
  "st-kitts",
  "st-lucia",
  "st-maarten",
  "st-thomas",
  "st-vincent",
  "stockholm",
  "sydney",
  "tampa",
  "tenerife",
  "tortola",
  "valletta",
  "vancouver",
  "victoria",
]);

const PORT_IMAGE_ALIASES = {
  "adriatic": "dubrovnik",
  "arctic crossing": "oslo",
  "athens": "santorini",
  "belize": "belize-city",
  "belize city": "belize-city",
  "boston": "halifax",
  "cape liberty": "manhattan",
  "charlotte amalie": "st-thomas",
  "civitavecchia": "rome-civitavecchia",
  "canada and new england": "halifax",
  "canada & new england": "halifax",
  "croatia": "dubrovnik",
  "dominican": "puerto-plata",
  "eastern caribbean": "st-thomas",
  "ephesus": "kusadasi",
  "george town": "grand-cayman",
  "grand cayman": "grand-cayman",
  "great stirrup cay": "great-stirrup-cay",
  "greek isles": "santorini",
  "half moon": "half-moon-cay",
  "half moon cay": "half-moon-cay",
  "icy strait": "icy-strait-point",
  "istanbul": "dubrovnik",
  "katakolon": "olympia-katakolon",
  "kralendijk": "bonaire",
  "malta": "valletta",
  "messina": "sicily-messina",
  "new zealand": "auckland",
  "new brunswick": "halifax",
  "new england": "halifax",
  "new york": "manhattan",
  "north cape": "oslo",
  "oranjestad": "aruba",
  "orlando": "port-canaveral",
  "panama canal": "cartagena",
  "paris": "le-havre",
  "perfect day": "cococay",
  "philipsburg": "st-maarten",
  "progreso yucatan": "progreso",
  "relaxaway half moon cay": "half-moon-cay",
  "road town": "tortola",
  "rome": "rome-civitavecchia",
  "rotterdam": "amsterdam",
  "saint kitts": "st-kitts",
  "saint lucia": "st-lucia",
  "san miguel de cozumel": "cozumel",
  "sicily": "sicily-messina",
  "souda": "chania-souda",
  "south america": "cartagena",
  "st kitts": "st-kitts",
  "st lucia": "st-lucia",
  "st maarten": "st-maarten",
  "st thomas": "st-thomas",
  "st. kitts": "st-kitts",
  "st. lucia": "st-lucia",
  "st. maarten": "st-maarten",
  "st. thomas": "st-thomas",
  "trieste": "dubrovnik",
  "western caribbean": "cozumel",
  "willemstad": "curacao",
};

const REGION_IMAGE_SLUGS = {
  alaska: "juneau",
  antarctica: "cartagena",
  asia: "shanghai",
  bahamas: "nassau",
  caribbean: "nassau",
  "california-coast": "san-diego",
  "canada-new-england": "halifax",
  europe: "barcelona",
  hawaii: "miami",
  mediterranean: "barcelona",
  mexico: "cozumel",
  "mexican-riviera": "cabo-san-lucas",
  "northern-europe": "hamburg",
  "panama-canal": "cartagena",
  "south-america": "cartagena",
  "south-pacific": "sydney",
  "australia-new-zealand": "sydney",
  transatlantic: "barcelona",
};

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function stringifyJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function isPublicSailing(record, today) {
  if (record.confidence === "internal_do_not_publish") return false;
  const departureDate = dateOnly(record.departureDate);
  return departureDate !== null && departureDate >= today;
}

function isPublicDeal(record) {
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
    imageUrl: mobileImagePathForSailing(sailing),
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

function mobileImagePathForSailing(sailing) {
  const slug = imageSlugForSailing(sailing);
  return slug ? `assets/images/ports/${slug}.jpg` : null;
}

function imageSlugForSailing(sailing) {
  const departure = normalizeImageText(sailing.departurePort);
  const returning = normalizeImageText(sailing.returnPort);
  const destinationPorts = sailing.itineraryPorts.filter((port) => {
    const normalized = normalizeImageText(port);
    return normalized && normalized !== departure && normalized !== returning;
  });
  const candidates = [
    ...destinationPorts,
    sailing.sailingName,
    sailing.destinationRegion,
    sailing.departurePort,
  ];

  for (const candidate of candidates) {
    const slug = resolvePortImageSlug(candidate);
    if (slug) return slug;
  }

  return REGION_IMAGE_SLUGS[sailing.destinationRegion] ?? null;
}

function resolvePortImageSlug(value) {
  const normalized = normalizeImageText(value);
  if (!normalized) return null;

  const candidates = new Set([
    normalized,
    normalized.split(",")[0]?.trim(),
    normalized.split("/")[0]?.trim(),
    normalized.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim(),
  ]);

  for (const candidate of candidates) {
    if (!candidate) continue;
    const aliasSlug = PORT_IMAGE_ALIASES[candidate];
    if (aliasSlug) return aliasSlug;

    const directSlug = slugify(candidate);
    if (PORT_IMAGE_SLUGS.has(directSlug)) return directSlug;
  }

  for (const [key, slug] of Object.entries(PORT_IMAGE_ALIASES)) {
    if (normalized.includes(key)) return slug;
  }

  for (const slug of PORT_IMAGE_SLUGS) {
    if (normalized.includes(slug.replace(/-/g, " "))) return slug;
  }

  return null;
}

function normalizeImageText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[™®]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9(),/.\s-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  if (["mediterranean", "asia", "south-america", "panama-canal"].includes(sailing.destinationRegion)) score += 10;
  if (["canada-new-england", "australia-new-zealand", "antarctica"].includes(sailing.destinationRegion)) score += 6;
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
    azamara: "Azamara",
    carnival: "Carnival Cruise Line",
    celebrity: "Celebrity Cruises",
    disney: "Disney Cruise Line",
    "holland-america": "Holland America Line",
    msc: "MSC Cruises",
    norwegian: "Norwegian Cruise Line",
    princess: "Princess Cruises",
    "royal-caribbean": "Royal Caribbean International",
    viking: "Viking",
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

  const today = currentUtcDateOnly();
  const publicSailings = seedSailings.filter((sailing) => isPublicSailing(sailing, today));
  const publicDeals = seedDeals.filter(isPublicDeal);
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
