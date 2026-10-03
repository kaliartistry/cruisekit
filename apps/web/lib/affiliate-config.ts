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

/**
 * Viator affiliate account ID (direct programme, not via Awin).
 *
 * Awin rejected CruiseKit's Viator application ("reapply with traffic"),
 * but the Viator Partner programme approved us directly. Direct is also
 * strictly better economics: full commission (no Awin cut), faster
 * payout cycle, single redirect instead of two.
 *
 * Live account: partners.viator.com, USD payout, account P00294955.
 */
const VIATOR_PARTNER_ID = "P00294955";

/**
 * `mcid` (marketing campaign ID) lets us split Viator reports by
 * surface — port pages vs. blog vs. app webview, etc. Keep numeric,
 * 5 digits by convention.
 */
const VIATOR_MCID_PORT_PAGE = "42383";

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
 * Wraps an excursion URL with the right affiliate tracking.
 *
 * Viator goes direct (no Awin) — we hold a direct partner account
 * P00294955, which pays more and ships in one redirect.
 *   - If the URL already contains `pid=`, it was returned by the
 *     Viator Partner API with attribution baked in — pass through.
 *   - Otherwise, append `?pid=…&mcid=…&medium=link` ourselves.
 *
 * GetYourGuide continues to route through Awin (no direct programme
 * yet — once they approve the Awin application, the `GYG_*` id on
 * AWIN_ADVERTISERS lights up).
 */
export function getExcursionLink(
  url: string,
  provider: "viator" | "getYourGuide",
): string {
  if (provider === "viator") {
    if (/[?&]pid=/.test(url)) return url;
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}pid=${VIATOR_PARTNER_ID}&mcid=${VIATOR_MCID_PORT_PAGE}&medium=link`;
  }
  return wrapWithAwin(url, AWIN_ADVERTISERS[provider]);
}

/**
 * Builds a link to Viator's destination browse page — used when we
 * have no specific products for a port but still want to send
 * interested users to Viator's own search (earns attribution on
 * whatever they book).
 */
export function getViatorDestinationLink(
  destinationId: number,
  portName: string,
): string {
  // Viator's URL format: /Destination-tours/d{ID}-ttd
  const slug = portName
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const base = `https://www.viator.com/${slug}-tours/d${destinationId}-ttd`;
  return `${base}?pid=${VIATOR_PARTNER_ID}&mcid=${VIATOR_MCID_PORT_PAGE}&medium=link`;
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
