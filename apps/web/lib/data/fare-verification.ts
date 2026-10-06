import publicChecks from "../../../../data/bundles/canonical/fare-verifications.json";
import type { Sailing } from "../../../../shared/models/ts/sailing";
import { fareFreshness, formatLastVerified } from "../format/confidence";
import type { CabinType } from "@cruise/shared/types";

export interface FareCheck {
  price: number;
  currency: string;
  sourceUrl: string;
  cabinType: CabinType;
  quoteBasis: string;
  lastSuccessfulVerification: string;
  nextCheckAt: string;
  context: { shipName: string; departureDate: string; returnDate: string; nights: number; priceBasis: string; taxesAndFeesIncluded: boolean };
}

export function verifiedFareCheck(s: Sailing, entries: Record<string, FareCheck> = publicChecks.entries): FareCheck | null {
  const e = entries[s.id];
  if (!e || e.price !== s.startingPrice || e.currency !== s.currency || e.sourceUrl !== s.sourceUrl) return null;
  if (!["inside", "oceanview", "balcony", "suite"].includes(e.cabinType) || !e.quoteBasis) return null;
  if (!e.context || !(["shipName", "departureDate", "returnDate", "nights", "priceBasis", "taxesAndFeesIncluded"] as const).every(k => e.context[k] === s[k])) return null;
  if (fareFreshness(e.lastSuccessfulVerification) === "unverified" || Date.parse(e.nextCheckAt) !== Date.parse(e.lastSuccessfulVerification) + 7 * 86400000) return null;
  return e;
}

/** Uses UTC calendar days for legible age; freshness uses the precise instant. */
export function fareCheckLabel(checked: string | null, recordReviewed: string, nextCheck: string | null, now = new Date()): string {
  if (fareFreshness(checked, now) === "unverified") return `Price check date unverified. Record reviewed ${formatLastVerified(recordReviewed) || "date unavailable"}.`;
  const age = Math.floor((Date.parse(now.toISOString().slice(0, 10)) - Date.parse(checked!.slice(0, 10))) / 86400000);
  const due = nextCheck && Number.isFinite(Date.parse(nextCheck)) ? ` Recheck due ${formatLastVerified(nextCheck)}.` : "";
  return `Price checked on ${formatLastVerified(checked!)} (${age} ${age === 1 ? "day" : "days"} ago).${due}`;
}
