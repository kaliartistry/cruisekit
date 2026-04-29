/**
 * Export website TypeScript data to JSON for CruiseKit-Mobile.
 *
 * Usage: npx tsx tools/export_plan_data.ts [output-dir]
 * Default output: ../CruiseKit-Mobile/assets/data/
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Import data from the website codebase
import { CRUISE_LINES } from '../packages/shared/constants/cruise-lines';
import { CRUISE_LINE_COSTS } from '../apps/web/lib/data/cruise-costs';
import { SHIPS } from '../apps/web/lib/data/ships';
import { FARE_ESTIMATES } from '../apps/web/lib/data/fare-estimates';
import { REAL_DEALS } from '../apps/web/lib/data/real-deals';
import { PORTS } from '../apps/web/lib/data/ports';
import {
  SAILING_CATALOG,
  SAILING_CATALOG_COVERAGE,
  SAILING_CATALOG_GAPS,
  SAILING_CATALOG_META,
  type SailingCatalogEntry,
} from '../apps/web/lib/data/sailing-catalog';

const outputDir = process.argv[2] || resolve(dirname(fileURLToPath(import.meta.url)), '../../CruiseKit-Mobile/assets/data');

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const shipIdByLineAndName = new Map(
  SHIPS.map((ship) => [`${ship.cruiseLineId}:${normalizeKey(ship.name)}`, ship.id])
);

const portSlugByKey = new Map<string, string>();
for (const port of PORTS) {
  portSlugByKey.set(normalizeKey(port.name), port.slug);
  portSlugByKey.set(normalizeKey(port.slug.replaceAll('-', ' ')), port.slug);
}

const portAliasMap: Record<string, string> = {
  'perfect day at cococay': 'cococay',
  'great stirrup cay': 'great-stirrup-cay',
  'george town': 'grand-cayman',
  'charlotte amalie': 'st-thomas',
  'philipsburg': 'st-maarten',
  'ocean cay msc marine reserve': 'ocean-cay',
  'ocean cay': 'ocean-cay',
  'costa maya mahahual': 'costa-maya',
  'le havre paris': 'le-havre',
};

// 1. Cruise Lines
writeFileSync(
  resolve(outputDir, 'cruise_lines.json'),
  JSON.stringify(CRUISE_LINES, null, 2)
);
console.log(`✓ cruise_lines.json (${CRUISE_LINES.length} lines)`);

// 2. Cruise Costs
writeFileSync(
  resolve(outputDir, 'cruise_costs.json'),
  JSON.stringify(CRUISE_LINE_COSTS, null, 2)
);
console.log(`✓ cruise_costs.json (${Object.keys(CRUISE_LINE_COSTS).length} cruise lines)`);

// 3. Ships
writeFileSync(
  resolve(outputDir, 'ships.json'),
  JSON.stringify(SHIPS, null, 2)
);
console.log(`✓ ships.json (${SHIPS.length} ships)`);

// 4. Fare Estimates
writeFileSync(
  resolve(outputDir, 'fare_estimates.json'),
  JSON.stringify(FARE_ESTIMATES, null, 2)
);
console.log(`✓ fare_estimates.json (${Object.keys(FARE_ESTIMATES).length} cruise lines)`);

// 5. Deals — top 200 diversified by region and line
const diversifiedDeals = getDiversifiedDeals(REAL_DEALS, 200);
writeFileSync(
  resolve(outputDir, 'deals.json'),
  JSON.stringify(diversifiedDeals, null, 2)
);
console.log(`✓ deals.json (${diversifiedDeals.length} deals from ${REAL_DEALS.length} total)`);

// 6. Sailing catalog — normalized line -> ship -> date data from current source feeds
writeFileSync(
  resolve(outputDir, 'sailing_catalog.json'),
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    meta: SAILING_CATALOG_META,
    coverage: SAILING_CATALOG_COVERAGE,
    gaps: SAILING_CATALOG_GAPS,
    sailings: SAILING_CATALOG,
  }, null, 2)
);
console.log(`✓ sailing_catalog.json (${SAILING_CATALOG.length} sailings across ${SAILING_CATALOG_COVERAGE.filter((line) => line.sailings > 0).length} cruise lines)`);

// 7. Legacy sailings asset for the existing Flutter setup flow
const mobileSailings = buildLegacySailings(SAILING_CATALOG);
writeFileSync(
  resolve(outputDir, 'sailings.json'),
  JSON.stringify(mobileSailings, null, 2)
);
console.log(`✓ sailings.json (${mobileSailings.length} mobile-ready sailings)`);

console.log(`\nAll files written to: ${outputDir}`);

/**
 * Get a diversified subset of deals — ensures representation across regions and lines.
 */
function getDiversifiedDeals(deals: typeof REAL_DEALS, maxTotal: number) {
  // Group by region
  const byRegion = new Map<string, typeof REAL_DEALS>();
  for (const deal of deals) {
    const region = deal.region || 'other';
    if (!byRegion.has(region)) byRegion.set(region, []);
    byRegion.get(region)!.push(deal);
  }

  // Take proportional share from each region, sorted by price
  const result: typeof REAL_DEALS = [];
  const regions = [...byRegion.keys()];
  const perRegion = Math.max(10, Math.floor(maxTotal / regions.length));

  for (const region of regions) {
    const regionDeals = byRegion.get(region)!
      .sort((a, b) => a.fromPrice - b.fromPrice)
      .slice(0, perRegion);

    // Diversify within region by cruise line
    const seen = new Set<string>();
    const diversified: typeof REAL_DEALS = [];

    // First pass: one per line
    for (const deal of regionDeals) {
      if (!seen.has(deal.cruiseLineId)) {
        seen.add(deal.cruiseLineId);
        diversified.push(deal);
      }
    }
    // Second pass: fill remaining slots
    for (const deal of regionDeals) {
      if (!diversified.includes(deal) && diversified.length < perRegion) {
        diversified.push(deal);
      }
    }

    result.push(...diversified);
  }

  return result.slice(0, maxTotal).sort((a, b) => a.fromPrice - b.fromPrice);
}

function buildLegacySailings(entries: SailingCatalogEntry[]) {
  return entries
    .map((entry) => {
      const returnDate = entry.returnDate ?? addDays(entry.departureDate, entry.duration);
      if (!returnDate) return null;

      return {
        id: entry.id,
        cruiseLineId: entry.cruiseLineId,
        shipName: entry.shipName,
        shipId: shipIdByLineAndName.get(`${entry.cruiseLineId}:${normalizeKey(entry.shipName)}`) ?? null,
        departureDate: entry.departureDate,
        returnDate,
        duration: entry.duration,
        departurePort: entry.departurePort,
        region: normalizeRegion(entry.regionLabel),
        itinerary: buildLegacyItinerary(entry),
      };
    })
    .filter(Boolean);
}

function buildLegacyItinerary(entry: SailingCatalogEntry) {
  const totalMiddleDays = Math.max(entry.duration - 1, 0);
  const portStops = entry.ports.slice(0, totalMiddleDays);
  const seaDayCount = Math.max(totalMiddleDays - portStops.length, 0);
  const itinerary = [
    {
      day: 1,
      type: 'departure',
      portName: simplifyPortLabel(entry.departurePort),
    },
  ];

  for (let index = 0; index < portStops.length; index += 1) {
    const portName = portStops[index];
    const portSlug = findPortSlug(portName);
    const portGuide = portSlug ? PORTS.find((port) => port.slug == portSlug) : null;
    itinerary.push({
      day: itinerary.length + 1,
      type: 'port',
      portSlug,
      portName,
      isTender: portGuide?.isTenderPort ?? false,
    });
  }

  for (let index = 0; index < seaDayCount; index += 1) {
    itinerary.push({
      day: itinerary.length + 1,
      type: 'sea',
    });
  }

  itinerary.push({
    day: itinerary.length + 1,
    type: 'arrival',
    portName: simplifyPortLabel(entry.departurePort),
  });

  return itinerary;
}

function normalizeRegion(regionLabel: string | null) {
  const value = normalizeKey(regionLabel ?? '');
  if (!value) return 'other';
  if (value.includes('caribbean') || value.includes('bahamas')) return 'caribbean';
  if (value.includes('alaska')) return 'alaska';
  if (value.includes('mediterranean')) return 'mediterranean';
  if (value.includes('europe')) return 'northern-europe';
  if (value.includes('asia')) return 'asia';
  if (value.includes('pacific')) return 'south-pacific';
  return 'other';
}

function simplifyPortLabel(value: string) {
  return value.split(',')[0].trim();
}

function findPortSlug(portName: string) {
  const key = normalizeKey(portName);
  const alias = portAliasMap[key];
  if (alias) return alias;
  if (portSlugByKey.has(key)) return portSlugByKey.get(key) ?? null;

  for (const [candidate, slug] of portSlugByKey.entries()) {
    if (candidate.includes(key) || key.includes(candidate)) {
      return slug;
    }
  }

  return null;
}

function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function addDays(date: string, days: number) {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}
