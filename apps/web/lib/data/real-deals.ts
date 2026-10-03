/**
 * Canonical Sailing loader.
 *
 * Reads /data/bundles/canonical/sailings.json (generated from validated seed
 * records by `pnpm run data:build`) and exposes the array as `SAILINGS`.
 *
 * Compatibility: also exports `REAL_DEALS` and helpers (`getTopDealsByRegion`,
 * `DEAL_STATS`, etc.) under the legacy `RealDeal` shape so existing card UI keeps
 * compiling. New code should import `SAILINGS` and use the canonical fields.
 */
import publicSailings from "../../../../data/bundles/canonical/sailings.json";
import type { Sailing } from "../../../../shared/models/ts/sailing";
import { getDealImage } from "./port-images";

export type DealRegion =
  | "caribbean"
  | "bahamas"
  | "mexico"
  | "mediterranean"
  | "europe"
  | "alaska"
  | "pacific"
  | "asia"
  | "south-america"
  | "antarctica"
  | "panama-canal"
  | "canada-new-england"
  | "australia-new-zealand"
  | "other";

/**
 * Canonical sailings, ready for UI rendering. Records with
 * `confidence === "internal_do_not_publish"` are excluded by the bundle build.
 *
 * QUARANTINE NOTE — DO NOT UNHIDE WITHOUT MANUAL REVERIFICATION.
 * As of 2026-04-28, four Royal Caribbean sailings (Symphony, Anthem, Wonder,
 * Independence) are quarantined in the seed data because their `directLink`
 * URLs redirect to a generic royalcaribbean.com landing page instead of the
 * intended ship page. If you flip any of these back to a publishable confidence
 * tier, manually follow the directLink in a fresh browser session first.
 */
export const SAILINGS: Sailing[] = publicSailings as Sailing[];

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
  monthKey: string | null;
  monthLabel: string | null;
  dealScore: number;
  badges: string[];
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
    case "bahamas":
      return "caribbean";
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
    case "canada-new-england":
      return "canada-new-england";
    case "south-america":
      return "south-america";
    case "antarctica":
      return "antarctica";
    case "panama-canal":
      return "panama-canal";
    case "south-pacific":
    case "hawaii":
    case "california-coast":
      return "pacific";
    case "australia-new-zealand":
      return "australia-new-zealand";
    case "asia":
    case "middle-east":
      return "asia";
    default:
      return "other";
  }
}

function toRealDeal(s: Sailing): RealDeal {
  const cruiseLineId = s.cruiseLine;
  const monthKey = s.departureDate.slice(0, 7);
  const deal: RealDeal = {
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
    monthKey,
    monthLabel: formatMonth(monthKey),
    dealScore: dealScore(s),
    badges: dealBadges(s),
  };

  return {
    ...deal,
    imageUrl: getDealImage(deal),
  };
}

function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function dealScore(s: Sailing): number {
  let score = 0;
  const price = s.startingPrice;
  if (Number.isFinite(price)) {
    if ((price ?? 0) <= 350) score += 45;
    else if ((price ?? 0) <= 500) score += 35;
    else if ((price ?? 0) <= 750) score += 22;
    else if ((price ?? 0) <= 1000) score += 12;
  }
  if (s.nights >= 4 && s.nights <= 6) score += 18;
  if (s.nights === 7) score += 14;
  if (s.destinationRegion === "caribbean" || s.destinationRegion === "bahamas") score += 12;
  if (["mediterranean", "asia", "south-america", "panama-canal"].includes(s.destinationRegion)) score += 10;
  if (["canada-new-england", "australia-new-zealand", "antarctica"].includes(s.destinationRegion)) score += 6;
  if (s.confidence === "verified_from_cruise_line") score += 8;
  if (s.confidence === "itinerary_verified_price_check_required") score += 4;
  return score;
}

function dealBadges(s: Sailing): string[] {
  const badges: string[] = [];
  if (Number.isFinite(s.startingPrice) && (s.startingPrice ?? 0) <= 350) badges.push("Low price");
  if (s.nights >= 3 && s.nights <= 5) badges.push("Short cruise");
  if (s.nights === 7) badges.push("7-night");
  if (s.confidence === "itinerary_verified_price_check_required") badges.push("Price check required");
  return badges.slice(0, 3);
}

/** Real deals from canonical seed (sorted by price ascending). */
export const REAL_DEALS: RealDeal[] = SAILINGS.map(toRealDeal).sort(
  (a, b) => b.dealScore - a.dealScore || a.fromPrice - b.fromPrice,
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
  lowestPrice: REAL_DEALS.length > 0 ? Math.min(...REAL_DEALS.map((d) => d.fromPrice)) : 0,
  highestPrice: REAL_DEALS.length > 0 ? Math.max(...REAL_DEALS.map((d) => d.fromPrice)) : 0,
  cruiseLines: [...new Set(REAL_DEALS.map((d) => d.cruiseLineId))],
  ships: [...new Set(REAL_DEALS.map((d) => d.shipName))],
  /** Latest verification date across the seed set — used in the page header. */
  lastVerified:
    REAL_DEALS.length > 0
      ? REAL_DEALS.reduce((latest, d) => (d.lastVerified > latest ? d.lastVerified : latest), REAL_DEALS[0].lastVerified)
      : null,
};
