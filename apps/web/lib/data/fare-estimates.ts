/**
 * Estimated base fare ranges per cruise line, duration, and cabin type.
 * Used when users don't have a specific fare — allows "discovery mode" in the calculator.
 *
 * Prices are PER PERSON, based on double occupancy, for Caribbean itineraries.
 * Updated: 2026-03-28
 * Source: Manually collected from cruise line websites and OTA listings.
 *
 * These are ESTIMATES — actual fares vary by ship, sail date, and availability.
 */

import { getSeasonalMultiplier } from "./seasonal-pricing";

export interface FareEstimate {
  /** Low end of typical price range (per person) */
  low: number;
  /** Mid/typical price (per person) — used as default in calculator */
  mid: number;
  /** High end of typical range (per person) */
  high: number;
}

type CabinType = "inside" | "ocean-view" | "balcony" | "suite";
type Duration = 3 | 4 | 5 | 7 | 10 | 14;

/**
 * FARE_ESTIMATES[cruiseLineId][duration][cabinType] → FareEstimate
 */
export const FARE_ESTIMATES: Record<
  string,
  Partial<Record<Duration, Record<CabinType, FareEstimate>>>
> = {
  "royal-caribbean": {
    3: {
      inside: { low: 250, mid: 350, high: 500 },
      "ocean-view": { low: 300, mid: 450, high: 600 },
      balcony: { low: 400, mid: 550, high: 750 },
      suite: { low: 800, mid: 1200, high: 2000 },
    },
    5: {
      inside: { low: 400, mid: 550, high: 750 },
      "ocean-view": { low: 500, mid: 700, high: 900 },
      balcony: { low: 650, mid: 900, high: 1200 },
      suite: { low: 1300, mid: 1900, high: 3000 },
    },
    7: {
      inside: { low: 550, mid: 800, high: 1100 },
      "ocean-view": { low: 700, mid: 1000, high: 1400 },
      balcony: { low: 900, mid: 1300, high: 1800 },
      suite: { low: 1800, mid: 2800, high: 5000 },
    },
    10: {
      inside: { low: 800, mid: 1100, high: 1500 },
      "ocean-view": { low: 1000, mid: 1400, high: 1900 },
      balcony: { low: 1300, mid: 1800, high: 2500 },
      suite: { low: 2500, mid: 3800, high: 6500 },
    },
    14: {
      inside: { low: 1100, mid: 1500, high: 2100 },
      "ocean-view": { low: 1400, mid: 1900, high: 2700 },
      balcony: { low: 1800, mid: 2500, high: 3500 },
      suite: { low: 3500, mid: 5500, high: 9000 },
    },
  },

  carnival: {
    3: {
      inside: { low: 180, mid: 270, high: 400 },
      "ocean-view": { low: 220, mid: 350, high: 500 },
      balcony: { low: 300, mid: 450, high: 650 },
      suite: { low: 600, mid: 900, high: 1500 },
    },
    4: {
      inside: { low: 230, mid: 350, high: 500 },
      "ocean-view": { low: 290, mid: 430, high: 600 },
      balcony: { low: 380, mid: 550, high: 800 },
      suite: { low: 750, mid: 1100, high: 1800 },
    },
    5: {
      inside: { low: 300, mid: 450, high: 650 },
      "ocean-view": { low: 380, mid: 550, high: 800 },
      balcony: { low: 500, mid: 750, high: 1050 },
      suite: { low: 1000, mid: 1500, high: 2500 },
    },
    7: {
      inside: { low: 430, mid: 650, high: 950 },
      "ocean-view": { low: 550, mid: 800, high: 1200 },
      balcony: { low: 700, mid: 1050, high: 1500 },
      suite: { low: 1400, mid: 2200, high: 3800 },
    },
    14: {
      inside: { low: 850, mid: 1200, high: 1800 },
      "ocean-view": { low: 1100, mid: 1600, high: 2300 },
      balcony: { low: 1400, mid: 2100, high: 3000 },
      suite: { low: 2800, mid: 4200, high: 7000 },
    },
  },

  norwegian: {
    5: {
      inside: { low: 450, mid: 650, high: 900 },
      "ocean-view": { low: 550, mid: 800, high: 1100 },
      balcony: { low: 700, mid: 1000, high: 1400 },
      suite: { low: 1400, mid: 2200, high: 3800 },
    },
    7: {
      inside: { low: 600, mid: 900, high: 1300 },
      "ocean-view": { low: 750, mid: 1100, high: 1600 },
      balcony: { low: 950, mid: 1400, high: 2000 },
      suite: { low: 2000, mid: 3200, high: 5500 },
    },
    10: {
      inside: { low: 900, mid: 1300, high: 1800 },
      "ocean-view": { low: 1100, mid: 1600, high: 2200 },
      balcony: { low: 1400, mid: 2000, high: 2800 },
      suite: { low: 2800, mid: 4500, high: 7500 },
    },
    14: {
      inside: { low: 1200, mid: 1700, high: 2400 },
      "ocean-view": { low: 1500, mid: 2200, high: 3100 },
      balcony: { low: 2000, mid: 2900, high: 4000 },
      suite: { low: 4000, mid: 6500, high: 10000 },
    },
  },

  msc: {
    7: {
      inside: { low: 400, mid: 600, high: 850 },
      "ocean-view": { low: 500, mid: 750, high: 1050 },
      balcony: { low: 650, mid: 950, high: 1350 },
      suite: { low: 1300, mid: 2000, high: 3500 },
    },
    10: {
      inside: { low: 600, mid: 900, high: 1250 },
      "ocean-view": { low: 750, mid: 1100, high: 1500 },
      balcony: { low: 950, mid: 1400, high: 1900 },
      suite: { low: 1900, mid: 3000, high: 5000 },
    },
    14: {
      inside: { low: 850, mid: 1200, high: 1700 },
      "ocean-view": { low: 1050, mid: 1500, high: 2100 },
      balcony: { low: 1350, mid: 1900, high: 2700 },
      suite: { low: 2700, mid: 4200, high: 7000 },
    },
  },

  celebrity: {
    7: {
      inside: { low: 650, mid: 950, high: 1400 },
      "ocean-view": { low: 800, mid: 1200, high: 1700 },
      balcony: { low: 1050, mid: 1500, high: 2100 },
      suite: { low: 2500, mid: 4000, high: 7000 },
    },
    10: {
      inside: { low: 950, mid: 1400, high: 2000 },
      "ocean-view": { low: 1200, mid: 1700, high: 2400 },
      balcony: { low: 1500, mid: 2200, high: 3000 },
      suite: { low: 3500, mid: 5500, high: 9000 },
    },
    14: {
      inside: { low: 1300, mid: 1900, high: 2700 },
      "ocean-view": { low: 1600, mid: 2300, high: 3300 },
      balcony: { low: 2100, mid: 3000, high: 4200 },
      suite: { low: 5000, mid: 7500, high: 12000 },
    },
  },

  princess: {
    7: {
      inside: { low: 500, mid: 750, high: 1100 },
      "ocean-view": { low: 650, mid: 950, high: 1350 },
      balcony: { low: 800, mid: 1200, high: 1700 },
      suite: { low: 1700, mid: 2700, high: 4500 },
    },
    10: {
      inside: { low: 750, mid: 1100, high: 1600 },
      "ocean-view": { low: 950, mid: 1400, high: 1900 },
      balcony: { low: 1200, mid: 1750, high: 2400 },
      suite: { low: 2400, mid: 3800, high: 6000 },
    },
    14: {
      inside: { low: 1050, mid: 1500, high: 2200 },
      "ocean-view": { low: 1300, mid: 1900, high: 2700 },
      balcony: { low: 1700, mid: 2400, high: 3400 },
      suite: { low: 3400, mid: 5300, high: 8500 },
    },
  },

  "holland-america": {
    7: {
      inside: { low: 550, mid: 800, high: 1150 },
      "ocean-view": { low: 700, mid: 1000, high: 1400 },
      balcony: { low: 900, mid: 1300, high: 1800 },
      suite: { low: 1800, mid: 2800, high: 4800 },
    },
    14: {
      inside: { low: 1100, mid: 1600, high: 2300 },
      "ocean-view": { low: 1400, mid: 2000, high: 2800 },
      balcony: { low: 1800, mid: 2600, high: 3600 },
      suite: { low: 3600, mid: 5600, high: 9000 },
    },
  },

  disney: {
    3: {
      inside: { low: 500, mid: 750, high: 1100 },
      "ocean-view": { low: 650, mid: 950, high: 1400 },
      balcony: { low: 900, mid: 1350, high: 1900 },
      suite: { low: 2000, mid: 3500, high: 6000 },
    },
    4: {
      inside: { low: 650, mid: 950, high: 1400 },
      "ocean-view": { low: 800, mid: 1200, high: 1700 },
      balcony: { low: 1100, mid: 1650, high: 2400 },
      suite: { low: 2600, mid: 4500, high: 7500 },
    },
    5: {
      inside: { low: 800, mid: 1200, high: 1700 },
      "ocean-view": { low: 1000, mid: 1500, high: 2100 },
      balcony: { low: 1400, mid: 2000, high: 2900 },
      suite: { low: 3200, mid: 5500, high: 9000 },
    },
    7: {
      inside: { low: 1100, mid: 1600, high: 2300 },
      "ocean-view": { low: 1400, mid: 2000, high: 2800 },
      balcony: { low: 1800, mid: 2600, high: 3700 },
      suite: { low: 4000, mid: 7000, high: 12000 },
    },
  },

  "virgin-voyages": {
    5: {
      inside: { low: 500, mid: 750, high: 1100 },
      "ocean-view": { low: 600, mid: 900, high: 1300 },
      balcony: { low: 750, mid: 1100, high: 1600 },
      suite: { low: 1500, mid: 2500, high: 4500 },
    },
    7: {
      inside: { low: 700, mid: 1000, high: 1500 },
      "ocean-view": { low: 850, mid: 1250, high: 1800 },
      balcony: { low: 1050, mid: 1550, high: 2200 },
      suite: { low: 2200, mid: 3500, high: 6000 },
    },
  },
};

/**
 * Get an estimated fare for a given cruise line, duration, and cabin type.
 * Falls back to the closest available duration if exact match isn't found.
 * Returns null if no estimate is available.
 */
export function getFareEstimate(
  cruiseLineId: string,
  duration: number,
  cabinType: CabinType,
  month?: number // 0-indexed: 0=Jan, 11=Dec
): FareEstimate | null {
  const lineData = FARE_ESTIMATES[cruiseLineId];
  if (!lineData) return null;

  // Try exact duration match first
  const exactMatch = lineData[duration as Duration];
  let result: FareEstimate | null = null;

  if (exactMatch && exactMatch[cabinType]) {
    result = { ...exactMatch[cabinType] };
  } else {
    // Find closest available duration
    const availableDurations = Object.keys(lineData).map(Number).sort((a, b) => a - b);
    if (availableDurations.length === 0) return null;

    let closest = availableDurations[0];
    let minDiff = Math.abs(duration - closest);
    for (const d of availableDurations) {
      const diff = Math.abs(duration - d);
      if (diff < minDiff) {
        minDiff = diff;
        closest = d;
      }
    }

    const closestData = lineData[closest as Duration];
    if (!closestData || !closestData[cabinType]) return null;

    // Scale the estimate proportionally if duration differs
    const scale = duration / closest;
    const base = closestData[cabinType];
    result = {
      low: Math.round(base.low * scale),
      mid: Math.round(base.mid * scale),
      high: Math.round(base.high * scale),
    };
  }

  // Apply seasonal multiplier if month is provided
  if (month !== undefined && result) {
    const { multiplier } = getSeasonalMultiplier(month);
    return {
      low: Math.round(result.low * multiplier),
      mid: Math.round(result.mid * multiplier),
      high: Math.round(result.high * multiplier),
    };
  }

  return result;
}
