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

/** Master switch — flip to true once GoToSea or any programme is approved */
const AWIN_ENABLED = false;

/**
 * Map of programme purpose → Awin advertiser ID.
 * Add IDs here as programmes get approved.
 */
const AWIN_ADVERTISERS = {
  /** Primary cruise booking OTA */
  cruiseBooking: "", // GoToSea: "57795"
  /** Shore excursions — Viator */
  viator: "", // "11018"
  /** Shore excursions — GetYourGuide */
  getYourGuide: "", // "18925"
  /** Travel insurance */
  travelInsurance: "", // Generali: "49127"
  /** Pre/post cruise hotels */
  hotels: "", // Booking.com: "6776"
  /** Cruise port parking */
  parking: "", // One Stop Parking: "54341"
  /** Theme park tickets */
  themePark: "", // Undercover Tourist: "96367"
  /** Medical evacuation */
  medicalEvac: "", // Medjet: "20001"
  /** Boat rentals */
  boatRental: "", // SamBoat: "32679"
  /** Cruise + tour packages */
  tourPackages: "", // Triptogo: "98699"
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
 * Returns whether Awin tracking is currently active.
 */
export function isAwinEnabled(): boolean {
  return AWIN_ENABLED;
}

export { AWIN_ADVERTISERS, AWIN_PUBLISHER_ID };
