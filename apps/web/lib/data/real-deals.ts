/**
 * Real cruise deals from scraped API data.
 * Combines Carnival + NCL (and future lines) into a unified format.
 *
 * Updated by running: node scripts/scrape-carnival.js && node scripts/scrape-ncl.js
 */

import carnivalData from "./scraped/carnival-sailings.json";
import nclData from "./scraped/ncl-sailings.json";

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
      imageUrl: s.imageUrl
        ? (s.imageUrl.startsWith("http") ? s.imageUrl : `https://www.carnival.com${s.imageUrl}`)
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
      departureDate: null, // NCL API doesn't return specific dates in search results
      ports: s.ports?.map((p: { name: string }) => p.name).filter(Boolean) || [],
      imageUrl: s.imageUrl || null,
      bookingUrl: null,
    }));
}

/** All real deals from scraped data, sorted by price (lowest first) */
export const REAL_DEALS: RealDeal[] = [
  ...normalizeCarnival(),
  ...normalizeNCL(),
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
export function getDealsByDuration(minNights: number, maxNights: number): RealDeal[] {
  return REAL_DEALS.filter((d) => d.duration >= minNights && d.duration <= maxNights);
}

/** Summary stats */
export const DEAL_STATS = {
  totalDeals: REAL_DEALS.length,
  lowestPrice: REAL_DEALS.length > 0 ? REAL_DEALS[0].fromPrice : 0,
  highestPrice: REAL_DEALS.length > 0 ? REAL_DEALS[REAL_DEALS.length - 1].fromPrice : 0,
  cruiseLines: [...new Set(REAL_DEALS.map((d) => d.cruiseLineId))],
  ships: [...new Set(REAL_DEALS.map((d) => d.shipName))],
  lastScraped: carnivalData.scrapedAt,
};
