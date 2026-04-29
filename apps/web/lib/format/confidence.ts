import type { Sailing } from "../../../../shared/models/ts/sailing";

type Confidence = Sailing["confidence"];

const CONFIDENCE_LABELS: Record<Confidence, string> = {
  verified_from_cruise_line: "Verified with cruise line",
  itinerary_verified_price_check_required:
    "Itinerary verified — check current rate",
  editorial_only: "Editorial pick",
  internal_do_not_publish: "",
} as const;

const CONFIDENCE_BADGE_CLASSES: Record<Confidence, string> = {
  verified_from_cruise_line: "bg-teal/10 text-teal",
  itinerary_verified_price_check_required: "bg-amber-50 text-amber-700",
  editorial_only: "bg-gray-100 text-gray-600",
  internal_do_not_publish: "hidden",
} as const;

const PRICE_BASIS_LABELS: Record<Sailing["priceBasis"], string> = {
  "per-person-double-occupancy": "per person, double occupancy",
  "per-person-quad-occupancy": "per person, quad occupancy",
  "per-cabin": "per cabin",
  "per-person-solo": "per person, solo",
  unspecified: "",
} as const;

/**
 * Plain-English label for a confidence tier. Empty string for
 * `internal_do_not_publish` because such records must never reach the UI;
 * the data loader filters them out, but the empty return is a defensive
 * fallback.
 */
export function confidenceLabel(c: Confidence): string {
  return CONFIDENCE_LABELS[c] ?? "";
}

/**
 * Tailwind class for the small badge shown next to source attribution.
 * Color tracks the trust ladder: teal = top-tier, amber = price-check, gray = editorial.
 */
export function confidenceBadgeClass(c: Confidence): string {
  return CONFIDENCE_BADGE_CLASSES[c] ?? "hidden";
}

/**
 * Formats a `lastVerified` ISO date for display, e.g. "Apr 28, 2026".
 * Returns empty string for invalid input.
 */
export function formatLastVerified(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Plain-English label for the priceBasis field.
 */
export function priceBasisLabel(b: Sailing["priceBasis"]): string {
  return PRICE_BASIS_LABELS[b] ?? "";
}
