export type StoreStatus = "live" | "review" | "coming-soon";

/**
 * Launch-day toggle.
 *
 * The App Store URL is the stable Apple ID URL. Keep APP_STORE_STATUS at
 * "review" until Apple approves and the app is manually released, then switch
 * it to "live". Google Play stays "coming-soon" until the closed test and
 * production review are complete.
 */
export const APP_STORE_URL = "https://apps.apple.com/us/app/cruisekit/id6770305548";
export const APP_STORE_STATUS: StoreStatus = "live";

export const PLAY_STORE_URL: string | null = null;
export const PLAY_STORE_STATUS: StoreStatus = "coming-soon";

export function isStoreLive(status: StoreStatus, href: string | null) {
  return status === "live" && Boolean(href);
}
