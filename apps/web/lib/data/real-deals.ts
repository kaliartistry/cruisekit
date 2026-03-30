/**
 * Real cruise deals from scraped API data.
 * Combines Carnival + NCL + Virgin Voyages + Royal Caribbean + Celebrity.
 *
 * Updated by running:
 *   node scripts/scrape-carnival.js
 *   node scripts/scrape-ncl.js
 *   node scripts/scrape-virgin.js
 *   node scripts/scrape-rci-intercept.js
 *   node scripts/scrape-celebrity-intercept.js
 */

import carnivalData from "./scraped/carnival-sailings.json";
import nclData from "./scraped/ncl-sailings.json";
import virginData from "./scraped/virgin-sailings.json";
import rciData from "./scraped/rci-sailings.json";
import celebrityData from "./scraped/celebrity-sailings.json";
import mscData from "./scraped/msc-sailings.json";
import halData from "./scraped/hal-sailings.json";
import disneyData from "./scraped/disney-sailings.json";

export type DealRegion = "caribbean" | "bahamas" | "mexico" | "mediterranean" | "europe" | "alaska" | "pacific" | "asia" | "other";

export interface RealDeal {
  id: string;
  cruiseLine: string;
  cruiseLineId: string;
  shipName: string;
  duration: number;
  departurePort: string;
  itineraryTitle: string;
  fromPrice: number;
  currency: string;
  departureDate: string | null;
  ports: string[];
  imageUrl: string | null;
  bookingUrl: string | null;
  region: DealRegion;
}

const CARIBBEAN_KEYWORDS = [
  "caribbean", "caribb", "bahamas", "nassau", "cococay", "cozumel", "costa maya",
  "roatan", "belize", "jamaica", "falmouth", "ocho rios", "montego bay",
  "grand cayman", "cayman", "aruba", "curacao", "bonaire", "st. thomas",
  "st. maarten", "san juan", "puerto rico", "virgin islands", "bermuda",
  "turks", "grand turk", "antigua", "barbados", "st. lucia", "grenada",
  "tortola", "st. kitts", "dominica", "martinique", "guadeloupe",
  "cartagena", "labadee", "amber cove", "puerto plata", "key west",
  "half moon", "celebration key", "harvest caye", "perfect day",
  "ocean cay", "great stirrup", "bimini",
  // Port codes used by Virgin Voyages
  "czm", "pop", "bim", "sjd",
];

const MEXICO_KEYWORDS = [
  "mexican riviera", "cabo", "ensenada", "puerto vallarta", "mazatlan",
  "sea of cortez", "baja",
];

const MEDITERRANEAN_KEYWORDS = [
  "mediterranean", "rome", "barcelona", "athens", "santorini", "venice",
  "dubrovnik", "naples", "amalfi", "greek", "adriatic", "lisbon",
];

const EUROPE_KEYWORDS = [
  "northern europe", "british isles", "norwegian fjord", "baltic",
  "canary island", "iceland", "transatlantic", "dover", "southampton",
  "copenhagen", "hamburg", "paris", "london", "cultural crossing",
  "canada", "new england", "quebec", "halifax",
];

const ALASKA_KEYWORDS = ["alaska", "juneau", "ketchikan", "skagway", "glacier"];

const PACIFIC_KEYWORDS = [
  "pacific", "hawaii", "vancouver", "victoria", "wine country",
  "pacific northwest", "pacific coast", "san diego", "seattle",
];

const ASIA_KEYWORDS = [
  "asia", "japan", "tokyo", "yokohama", "china", "singapore", "vietnam",
  "thailand", "incheon", "korea",
];

function classifyRegion(deal: Omit<RealDeal, "region">): DealRegion {
  const text = `${deal.itineraryTitle} ${deal.ports.join(" ")} ${deal.departurePort}`.toLowerCase();

  // Check most specific first
  if (CARIBBEAN_KEYWORDS.some((k) => text.includes(k))) return "caribbean";
  if (MEXICO_KEYWORDS.some((k) => text.includes(k))) return "mexico";
  if (ALASKA_KEYWORDS.some((k) => text.includes(k))) return "alaska";
  if (ASIA_KEYWORDS.some((k) => text.includes(k))) return "asia";
  if (MEDITERRANEAN_KEYWORDS.some((k) => text.includes(k))) return "mediterranean";
  if (EUROPE_KEYWORDS.some((k) => text.includes(k))) return "europe";
  if (PACIFIC_KEYWORDS.some((k) => text.includes(k))) return "pacific";

  // Florida departure ports are usually Caribbean
  if (/miami|fort lauderdale|port canaveral|tampa|galveston|new orleans/.test(text)) return "caribbean";

  return "other";
}

const VIRGIN_SHIP_NAMES: Record<string, string> = {
  SC: "Scarlet Lady",
  VL: "Valiant Lady",
  RL: "Resilient Lady",
  BL: "Brilliant Lady",
  RS: "Resilient Lady",
  BR: "Brilliant Lady",
};

type DealWithoutRegion = Omit<RealDeal, "region">;

function normalizeCarnival(): DealWithoutRegion[] {
  return carnivalData.sailings
    .filter((s) => s.fromPrice > 0)
    .map((s, i) => ({
      id: `carnival-${i}`,
      cruiseLine: "Carnival Cruise Line",
      cruiseLineId: "carnival",
      shipName: s.shipName,
      duration: s.duration,
      departurePort: s.departurePort,
      itineraryTitle: s.itineraryTitle,
      fromPrice: s.fromPrice,
      currency: s.currency || "USD",
      departureDate: s.departureDate || null,
      ports: s.ports?.map((p: { name: string }) => p.name).filter(Boolean) || [],
      imageUrl: s.imageUrl && !s.imageUrl.includes("RandomImage")
        ? s.imageUrl.startsWith("http")
          ? s.imageUrl
          : `https://www.carnival.com${s.imageUrl}`
        : null,
      bookingUrl: s.itineraryUrl || null,
    }));
}

function normalizeNCL(): DealWithoutRegion[] {
  return nclData.sailings
    .filter((s) => (s.combinedPrice ?? 0) > 0)
    .map((s, i) => ({
      id: `ncl-${i}`,
      cruiseLine: "Norwegian Cruise Line",
      cruiseLineId: "norwegian",
      shipName: s.shipName,
      duration: s.duration,
      departurePort: s.departurePort,
      itineraryTitle: s.itineraryTitle,
      fromPrice: s.combinedPrice!,
      currency: s.currency || "USD",
      departureDate: null,
      ports: s.ports?.map((p: { name: string }) => p.name).filter(Boolean) || [],
      imageUrl: s.imageUrl || null,
      bookingUrl: null,
    }));
}

function normalizeVirgin(): DealWithoutRegion[] {
  return virginData.sailings
    .filter((s) => (s.fromPrice ?? 0) > 0)
    .map((s, i) => {
      const homePort = (s as Record<string, unknown>).homePort as string;
      const depPort = s.departurePort || getVirginPortName(homePort);
      // Expand port codes to real names and filter out departure port
      const expandedPorts = (Array.isArray(s.ports) ? s.ports : [])
        .map((code: string) => getVirginPortName(code))
        .filter((name: string) => name && name !== depPort && name !== "Miami");
      const uniquePorts = [...new Set(expandedPorts)];
      // Build a real itinerary title from port names
      const portSummary = uniquePorts.length > 0
        ? uniquePorts.slice(0, 2).join(" & ")
        : "Caribbean";
      return {
        id: `virgin-${i}`,
        cruiseLine: "Virgin Voyages",
        cruiseLineId: "virgin-voyages",
        shipName: VIRGIN_SHIP_NAMES[s.shipCode] || s.shipName || s.shipCode || "Unknown",
        duration: s.duration,
        departurePort: depPort,
        itineraryTitle: `${s.duration}-Night ${portSummary} from ${depPort}`,
        fromPrice: s.fromPrice ?? 0,
        currency: "USD",
        departureDate: s.departureDate || null,
        ports: uniquePorts,
        imageUrl: null,
        bookingUrl: null,
      };
    });
}

const VIRGIN_PORT_CODES: Record<string, string> = {
  MIA: "Miami",
  SJU: "San Juan",
  CZM: "Cozumel",
  BIM: "Bimini",
  NAS: "Nassau",
  POP: "Puerto Plata",
  GDT: "Grand Turk",
  STT: "St. Thomas",
  SXM: "St. Maarten",
  AUA: "Aruba",
  WIL: "Willemstad",
  KRA: "Kralendijk",
  BGI: "Barbados",
  ANU: "Antigua",
  SLU: "St. Lucia",
  SVD: "St. Vincent",
  GEC: "George Town",
  RTB: "Roatan",
  BZE: "Belize City",
  FDF: "Martinique",
  SKB: "St. Kitts",
  TOV: "Tortola",
  STX: "St. Croix",
  CMA: "Costa Maya",
  EYW: "Key West",
  OCJ: "Ocho Rios",
  FPO: "Freeport",
  RSU: "Iles des Saintes",
  SAM: "Samaná",
  PGO: "Progreso",
  CBJ: "Cabo Rojo",
  BCN: "Barcelona",
  ATH: "Athens",
  SOU: "Southampton",
};

function getVirginPortName(code: string | undefined): string {
  return VIRGIN_PORT_CODES[code || ""] || code || "";
}

function normalizeRCI(): DealWithoutRegion[] {
  return rciData.sailings
    .filter((s) => s.fromPrice > 0)
    .map((s, i) => ({
      id: `rci-${i}`,
      cruiseLine: "Royal Caribbean International",
      cruiseLineId: "royal-caribbean",
      shipName: s.shipName,
      duration: s.duration,
      departurePort: s.departurePort,
      itineraryTitle: s.itineraryTitle,
      fromPrice: s.fromPrice,
      currency: "USD",
      departureDate: s.departureDate || null,
      ports: Array.isArray(s.ports) ? s.ports.filter(Boolean) : [],
      imageUrl: s.imageUrl || null,
      bookingUrl: s.bookingUrl || null,
    }));
}

function normalizeCelebrity(): DealWithoutRegion[] {
  return celebrityData.sailings
    .filter((s) => s.fromPrice > 0)
    .map((s, i) => ({
      id: `celebrity-${i}`,
      cruiseLine: "Celebrity Cruises",
      cruiseLineId: "celebrity",
      shipName: s.shipName,
      duration: s.duration,
      departurePort: s.departurePort,
      itineraryTitle: s.itineraryTitle,
      fromPrice: s.fromPrice,
      currency: "USD",
      departureDate: s.departureDate || null,
      ports: Array.isArray(s.ports) ? s.ports.filter(Boolean) : [],
      imageUrl: s.imageUrl || null,
      bookingUrl: s.bookingUrl || null,
    }));
}

function normalizeMSC(): DealWithoutRegion[] {
  return mscData.sailings
    .filter((s) => s.fromPrice > 0)
    .map((s, i) => ({
      id: `msc-${i}`,
      cruiseLine: "MSC Cruises",
      cruiseLineId: "msc",
      shipName: s.shipName,
      duration: s.duration,
      departurePort: s.departurePort,
      itineraryTitle: s.itineraryTitle,
      fromPrice: s.fromPrice,
      currency: "USD",
      departureDate: s.departureDate || null,
      ports: Array.isArray(s.ports) ? [...new Set(s.ports.filter(Boolean))] : [],
      imageUrl: null, // MSC CDN images are unreliable (orcas for Bahamas) — use port-matched images instead
      bookingUrl: null,
    }));
}

function normalizeHAL(): DealWithoutRegion[] {
  return halData.sailings
    .filter((s) => s.fromPrice > 0 && s.duration > 0)
    .map((s, i) => ({
      id: `hal-${i}`,
      cruiseLine: "Holland America Line",
      cruiseLineId: "holland-america",
      shipName: s.shipName,
      duration: s.duration,
      departurePort: s.departurePort,
      itineraryTitle: s.itineraryTitle,
      fromPrice: s.fromPrice,
      currency: "USD",
      departureDate: s.departureDate || null,
      ports: Array.isArray(s.ports) ? s.ports.filter(Boolean) : [],
      imageUrl: s.imageUrl || null,
      bookingUrl: null,
    }));
}

function normalizeDisney(): DealWithoutRegion[] {
  return disneyData.sailings
    .filter((s) => s.fromPrice > 0 && s.duration > 0)
    .map((s, i) => ({
      id: `disney-${i}`,
      cruiseLine: "Disney Cruise Line",
      cruiseLineId: "disney",
      shipName: s.shipName,
      duration: s.duration,
      departurePort: s.departurePort,
      itineraryTitle: s.itineraryTitle,
      fromPrice: s.fromPrice,
      currency: "USD",
      departureDate: s.departureDate || null,
      ports: Array.isArray(s.ports) ? s.ports.filter(Boolean) : [],
      imageUrl: s.imageUrl || null,
      bookingUrl: null,
    }));
}

/** All real deals from scraped data, sorted by price (lowest first) */
export const REAL_DEALS: RealDeal[] = [
  ...normalizeCarnival(),
  ...normalizeNCL(),
  ...normalizeVirgin(),
  ...normalizeRCI(),
  ...normalizeCelebrity(),
  ...normalizeMSC(),
  ...normalizeHAL(),
  ...normalizeDisney(),
].map((deal) => ({ ...deal, region: classifyRegion(deal) } as RealDeal))
  .sort((a, b) => a.fromPrice - b.fromPrice);

/** Get top N deals by lowest price */
export function getTopDeals(n: number = 10): RealDeal[] {
  return REAL_DEALS.slice(0, n);
}

/** Get top N deals for a specific region, diversified (1 per cruise line, then 1 per ship) */
export function getTopDealsByRegion(region: DealRegion, n: number = 10): RealDeal[] {
  const regionDeals = REAL_DEALS.filter((d) => d.region === region);
  const result: RealDeal[] = [];
  const seenLines = new Set<string>();
  const seenShips = new Set<string>();

  // Round 1: cheapest deal per cruise line
  for (const d of regionDeals) {
    if (!seenLines.has(d.cruiseLineId)) {
      seenLines.add(d.cruiseLineId);
      seenShips.add(d.shipName);
      result.push(d);
    }
    if (result.length >= n) break;
  }
  // Round 2: cheapest deal per unseen ship (different ship, same line OK)
  if (result.length < n) {
    for (const d of regionDeals) {
      if (!seenShips.has(d.shipName)) {
        seenShips.add(d.shipName);
        result.push(d);
      }
      if (result.length >= n) break;
    }
  }
  return result.sort((a, b) => a.fromPrice - b.fromPrice);
}

/** Get all unique regions with counts */
export function getRegionCounts(): { region: DealRegion; count: number }[] {
  const counts = new Map<DealRegion, number>();
  for (const deal of REAL_DEALS) {
    counts.set(deal.region, (counts.get(deal.region) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count);
}

/** Get deals for a specific cruise line */
export function getDealsByLine(cruiseLineId: string): RealDeal[] {
  return REAL_DEALS.filter((d) => d.cruiseLineId === cruiseLineId);
}

/** Get deals by duration range */
export function getDealsByDuration(
  minNights: number,
  maxNights: number
): RealDeal[] {
  return REAL_DEALS.filter(
    (d) => d.duration >= minNights && d.duration <= maxNights
  );
}

/** Get a specific deal by ID */
export function getDealById(id: string): RealDeal | undefined {
  return REAL_DEALS.find((d) => d.id === id);
}

/** Summary stats */
export const DEAL_STATS = {
  totalDeals: REAL_DEALS.length,
  lowestPrice: REAL_DEALS.length > 0 ? REAL_DEALS[0].fromPrice : 0,
  highestPrice:
    REAL_DEALS.length > 0 ? REAL_DEALS[REAL_DEALS.length - 1].fromPrice : 0,
  cruiseLines: [...new Set(REAL_DEALS.map((d) => d.cruiseLineId))],
  ships: [...new Set(REAL_DEALS.map((d) => d.shipName))],
  lastScraped: carnivalData.scrapedAt,
};
