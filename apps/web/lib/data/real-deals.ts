/**
 * Canonical Sailing loader.
 *
 * Reads /data/seed/sailings.json (validated against /data/schema/sailing.schema.json
 * by `pnpm run schema:validate`), filters out internal_do_not_publish records, and
 * exposes the array as `SAILINGS`.
 *
 * Compatibility: also exports `REAL_DEALS` and helpers (`getTopDealsByRegion`,
 * `DEAL_STATS`, etc.) under the legacy `RealDeal` shape so existing card UI keeps
 * compiling. New code should import `SAILINGS` and use the canonical fields.
 */
import seedSailings from "../../../../data/seed/sailings.json";
import type { Sailing } from "../../../../shared/models/ts/sailing";

export type DealRegion =
  | "caribbean"
  | "bahamas"
  | "mexico"
  | "mediterranean"
  | "europe"
  | "alaska"
  | "pacific"
  | "asia"
  | "other";

/**
 * Canonical sailings, ready for UI rendering. Records with
 * `confidence === "internal_do_not_publish"` are filtered out at load time.
 */
export const SAILINGS: Sailing[] = (seedSailings as Sailing[]).filter(
  (s) => s.confidence !== "internal_do_not_publish",
);

/**
 * Legacy view used by the existing DealCard / pillar carousel. Each property is
 * derived from the canonical Sailing — no fabricated fields. `bookingUrl` resolves
 * to affiliateLink when present, else directLink, else null (CTA hidden).
 */
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
  /* Canonical-schema fields exposed for the new card UI */
  source: string;
  sourceUrl: string;
  lastVerified: string;
  confidence: Sailing["confidence"];
  priceBasis: Sailing["priceBasis"];
  taxesAndFeesIncluded: boolean;
  startingPrice: number | null;
  affiliateLink: string | null;
  directLink: string;
}

const CRUISE_LINE_DISPLAY: Record<string, string> = {
  carnival: "Carnival Cruise Line",
  "royal-caribbean": "Royal Caribbean International",
  norwegian: "Norwegian Cruise Line",
  msc: "MSC Cruises",
  celebrity: "Celebrity Cruises",
  princess: "Princess Cruises",
  "holland-america": "Holland America Line",
  disney: "Disney Cruise Line",
  "virgin-voyages": "Virgin Voyages",
};

function toLegacyRegion(region: Sailing["destinationRegion"]): DealRegion {
  switch (region) {
    case "caribbean":
      return "caribbean";
    case "bahamas":
      return "bahamas";
    case "mexico":
    case "mexican-riviera":
      return "mexico";
    case "mediterranean":
      return "mediterranean";
    case "northern-europe":
    case "transatlantic":
      return "europe";
    case "alaska":
      return "alaska";
    case "south-pacific":
    case "hawaii":
    case "california-coast":
      return "pacific";
    case "asia":
      return "asia";
    default:
      return "other";
  }
}

function toRealDeal(s: Sailing): RealDeal {
  const cruiseLineId = s.cruiseLine;
  return {
    id: s.id,
    cruiseLine: CRUISE_LINE_DISPLAY[cruiseLineId] ?? cruiseLineId,
    cruiseLineId,
    shipName: s.shipName,
    duration: s.nights,
    departurePort: s.departurePort,
    itineraryTitle: s.sailingName,
    fromPrice: s.startingPrice ?? 0,
    currency: s.currency,
    departureDate: s.departureDate,
    ports: s.itineraryPorts,
    imageUrl: null,
    bookingUrl: s.affiliateLink ?? s.directLink ?? null,
    region: toLegacyRegion(s.destinationRegion),
    source: s.source.provider,
    sourceUrl: s.sourceUrl,
    lastVerified: s.lastVerified,
    confidence: s.confidence,
    priceBasis: s.priceBasis,
    taxesAndFeesIncluded: s.taxesAndFeesIncluded,
    startingPrice: s.startingPrice,
    affiliateLink: s.affiliateLink ?? null,
    directLink: s.directLink,
  };
}

/** Real deals from canonical seed (sorted by price ascending). */
export const REAL_DEALS: RealDeal[] = SAILINGS.map(toRealDeal).sort(
  (a, b) => a.fromPrice - b.fromPrice,
);

/** Get top N deals by lowest price. */
export function getTopDeals(n: number = 10): RealDeal[] {
  return REAL_DEALS.slice(0, n);
}

/**
 * Get top N deals for a specific region, diversified (1 per cruise line, then 1 per ship).
 */
export function getTopDealsByRegion(region: DealRegion, n: number = 10): RealDeal[] {
  const regionDeals = REAL_DEALS.filter((d) => d.region === region);
  const result: RealDeal[] = [];
  const seenLines = new Set<string>();
  const seenShips = new Set<string>();

  for (const d of regionDeals) {
    if (!seenLines.has(d.cruiseLineId)) {
      seenLines.add(d.cruiseLineId);
      seenShips.add(d.shipName);
      result.push(d);
    }
    if (result.length >= n) break;
  }
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

/** Get all unique regions with counts. */
export function getRegionCounts(): { region: DealRegion; count: number }[] {
  const counts = new Map<DealRegion, number>();
  for (const deal of REAL_DEALS) {
    counts.set(deal.region, (counts.get(deal.region) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count);
}

/** Get deals for a specific cruise line. */
export function getDealsByLine(cruiseLineId: string): RealDeal[] {
  return REAL_DEALS.filter((d) => d.cruiseLineId === cruiseLineId);
}

/** Get deals by duration range. */
export function getDealsByDuration(minNights: number, maxNights: number): RealDeal[] {
  return REAL_DEALS.filter((d) => d.duration >= minNights && d.duration <= maxNights);
}

/** Get a specific deal by ID. */
export function getDealById(id: string): RealDeal | undefined {
  return REAL_DEALS.find((d) => d.id === id);
}

/** Summary stats. */
export const DEAL_STATS = {
  totalDeals: REAL_DEALS.length,
  lowestPrice: REAL_DEALS.length > 0 ? REAL_DEALS[0].fromPrice : 0,
  highestPrice: REAL_DEALS.length > 0 ? REAL_DEALS[REAL_DEALS.length - 1].fromPrice : 0,
  cruiseLines: [...new Set(REAL_DEALS.map((d) => d.cruiseLineId))],
  ships: [...new Set(REAL_DEALS.map((d) => d.shipName))],
  /** Latest verification date across the seed set — used in the page header. */
  lastVerified:
    REAL_DEALS.length > 0
      ? REAL_DEALS.reduce((latest, d) => (d.lastVerified > latest ? d.lastVerified : latest), REAL_DEALS[0].lastVerified)
      : null,
};
