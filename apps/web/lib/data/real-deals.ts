/**
 * Real cruise deals from scraped API data.
 * Combines Carnival + NCL + Virgin Voyages into a unified format.
 *
 * Updated by running:
 *   node scripts/scrape-carnival.js
 *   node scripts/scrape-ncl.js
 *   node scripts/scrape-virgin.js
 */

import carnivalData from "./scraped/carnival-sailings.json";
import nclData from "./scraped/ncl-sailings.json";
import virginData from "./scraped/virgin-sailings.json";

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
}

const VIRGIN_SHIP_NAMES: Record<string, string> = {
  SC: "Scarlet Lady",
  VL: "Valiant Lady",
  RL: "Resilient Lady",
  BL: "Brilliant Lady",
  RS: "Resilient Lady",
  BR: "Brilliant Lady",
};

function normalizeCarnival(): RealDeal[] {
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

function normalizeNCL(): RealDeal[] {
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

function normalizeVirgin(): RealDeal[] {
  return virginData.sailings
    .filter((s) => (s.fromPrice ?? 0) > 0)
    .map((s, i) => ({
      id: `virgin-${i}`,
      cruiseLine: "Virgin Voyages",
      cruiseLineId: "virgin-voyages",
      shipName: VIRGIN_SHIP_NAMES[s.shipCode] || s.shipName || s.shipCode || "Unknown",
      duration: s.duration,
      departurePort: s.departurePort || getVirginPortName((s as Record<string, unknown>).homePort as string),
      itineraryTitle: `${s.duration}-Night ${s.region?.replace("..", "").trim() || "Caribbean"} from ${getVirginPortName((s as Record<string, unknown>).homePort as string)}`,
      fromPrice: s.fromPrice ?? 0,
      currency: "USD",
      departureDate: s.departureDate || null,
      ports: Array.isArray(s.ports) ? s.ports.filter(Boolean) : [],
      imageUrl: null,
      bookingUrl: null,
    }));
}

function getVirginPortName(code: string | undefined): string {
  const map: Record<string, string> = {
    MIA: "Miami, FL",
    SJU: "San Juan, PR",
    BCN: "Barcelona",
    ATH: "Athens",
    SOU: "Southampton",
  };
  return map[code || ""] || code || "";
}

/** All real deals from scraped data, sorted by price (lowest first) */
export const REAL_DEALS: RealDeal[] = [
  ...normalizeCarnival(),
  ...normalizeNCL(),
  ...normalizeVirgin(),
].sort((a, b) => a.fromPrice - b.fromPrice);

/** Get top N deals by lowest price */
export function getTopDeals(n: number = 10): RealDeal[] {
  return REAL_DEALS.slice(0, n);
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
