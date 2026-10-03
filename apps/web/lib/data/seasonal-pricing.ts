/**
 * Seasonal price multipliers for cruise fares.
 * Base prices in fare-estimates.ts represent shoulder-season averages.
 * These multipliers adjust based on travel month.
 */

export interface SeasonalMultiplier {
  label: string;
  multiplier: number;
  description: string;
}

export const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * Get the seasonal multiplier for a given month (0-indexed: 0=Jan, 11=Dec)
 * Applied to base fare estimates to reflect seasonal demand.
 */
export function getSeasonalMultiplier(month: number): SeasonalMultiplier {
  switch (month) {
    case 0: // January (holiday tail + wave season start)
      return { label: "Holiday Season", multiplier: 1.35, description: "Post-holiday pricing remains elevated" };
    case 1: // February (wave season)
      return { label: "Wave Season", multiplier: 1.0, description: "Best deals — cruise lines compete for bookings" };
    case 2: // March (spring break)
      return { label: "Spring Break", multiplier: 1.25, description: "Spring break demand pushes prices up" };
    case 3: // April (shoulder)
      return { label: "Shoulder Season", multiplier: 1.0, description: "Great value — between peak periods" };
    case 4: // May (shoulder)
      return { label: "Shoulder Season", multiplier: 0.95, description: "Low demand — excellent prices" };
    case 5: // June (summer starts)
      return { label: "Early Summer", multiplier: 1.30, description: "Summer family travel begins" };
    case 6: // July (peak summer)
      return { label: "Peak Summer", multiplier: 1.45, description: "Highest demand — book early for best rates" };
    case 7: // August (peak summer)
      return { label: "Peak Summer", multiplier: 1.40, description: "Peak family travel month" };
    case 8: // September (hurricane/low)
      return { label: "Hurricane Season", multiplier: 0.85, description: "Lowest prices — some weather risk" };
    case 9: // October (shoulder)
      return { label: "Shoulder Season", multiplier: 0.90, description: "Great value — crowds thin out" };
    case 10: // November (pre-holiday)
      return { label: "Pre-Holiday", multiplier: 1.05, description: "Prices start climbing toward holidays" };
    case 11: // December (peak holiday)
      return { label: "Holiday Peak", multiplier: 1.50, description: "Christmas & New Year's — highest prices" };
    default:
      return { label: "Average", multiplier: 1.0, description: "" };
  }
}

/** Get month index for "next available" — defaults to 2-3 months out */
export function getDefaultMonth(): number {
  const now = new Date();
  return (now.getMonth() + 3) % 12;
}
