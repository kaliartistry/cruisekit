export type StoreStatus = "live" | "review" | "coming-soon";

/**
 * Launch-day toggle.
 *
 * Store URLs are stable before each public listing is visible. Keep each
 * status at "review" until the store listing resolves publicly, then switch it
 * to "live".
 */
export const APP_STORE_URL = "https://apps.apple.com/us/app/cruisekit/id6770305548";
export const APP_STORE_STATUS: StoreStatus = "live";

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.cruisekit.mobile";
export const PLAY_STORE_STATUS: StoreStatus = "review";

export function isStoreLive(status: StoreStatus, href: string | null) {
  return status === "live" && Boolean(href);
}
