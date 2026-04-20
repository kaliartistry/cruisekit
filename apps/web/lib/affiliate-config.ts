/**
 * Awin affiliate link configuration for CruiseKit.
 *
 * Publisher ID: 2850709
 * Deep link format: https://www.awin1.com/cread.php?awinmid={ADVERTISER_ID}&awinaffid=2850709&ued={ENCODED_URL}
 *
 * Set AWIN_ENABLED to true once at least one programme is approved.
 * Add advertiser IDs to AWIN_ADVERTISERS as programmes are approved.
 */

const AWIN_PUBLISHER_ID = "2850709";

/** Master switch — 3 programmes approved (Booking.com, SamBoat, Medjet) */
const AWIN_ENABLED = true;

/**
 * Map of programme purpose → Awin advertiser ID.
 * Only populate IDs for approved programmes.
 */
const AWIN_ADVERTISERS = {
  /** Primary cruise booking OTA */
  cruiseBooking: "", // GoToSea: pending
  /** Shore excursions — Viator */
  viator: "", // rejected — reapply with traffic
  /** Shore excursions — GetYourGuide */
  getYourGuide: "", // pending
  /** Travel insurance */
  travelInsurance: "", // Generali: pending
  /** Pre/post cruise hotels — APPROVED */
  hotels: "6776",
  /** Cruise port parking */
  parking: "", // One Stop Parking: pending
  /** Theme park tickets */
  themePark: "", // Undercover Tourist: pending
  /** Medical evacuation — APPROVED */
  medicalEvac: "20001",
  /** Boat rentals — APPROVED */
  boatRental: "32679",
  /** Cruise + tour packages */
  tourPackages: "", // Triptogo: pending
} as const;

/**
 * Wraps a destination URL with Awin tracking.
 * Returns the original URL if Awin is disabled or no advertiser ID is configured.
 */
export function wrapWithAwin(
  destinationUrl: string,
  advertiserId: string,
): string {
  if (!AWIN_ENABLED || !advertiserId) return destinationUrl;

  const encoded = encodeURIComponent(destinationUrl);
  return `https://www.awin1.com/cread.php?awinmid=${advertiserId}&awinaffid=${AWIN_PUBLISHER_ID}&ued=${encoded}`;
}

/**
 * Wraps a cruise booking URL with the primary cruise booking affiliate.
 * Falls back to GoToSea search if no direct booking URL exists.
 */
export function getBookingLink(
  bookingUrl: string | null,
  cruiseLineUrl: string,
): string {
  const destination = bookingUrl || cruiseLineUrl;
  const advertiserId = AWIN_ADVERTISERS.cruiseBooking;
  return wrapWithAwin(destination, advertiserId);
}

/**
 * Wraps a Viator or GetYourGuide excursion URL.
 */
export function getExcursionLink(
  url: string,
  provider: "viator" | "getYourGuide",
): string {
  const advertiserId = AWIN_ADVERTISERS[provider];
  return wrapWithAwin(url, advertiserId);
}

/**
 * Wraps a hotel booking URL (Booking.com etc).
 */
export function getHotelLink(url: string): string {
  return wrapWithAwin(url, AWIN_ADVERTISERS.hotels);
}

/**
 * Wraps a SamBoat boat rental URL.
 */
export function getBoatRentalLink(url: string): string {
  return wrapWithAwin(url, AWIN_ADVERTISERS.boatRental);
}

/**
 * Wraps a Medjet medical evacuation URL.
 */
export function getMedEvacLink(url: string): string {
  return wrapWithAwin(url, AWIN_ADVERTISERS.medicalEvac);
}

/**
 * Returns whether Awin tracking is currently active.
 */
export function isAwinEnabled(): boolean {
  return AWIN_ENABLED;
}

export { AWIN_ADVERTISERS, AWIN_PUBLISHER_ID };
