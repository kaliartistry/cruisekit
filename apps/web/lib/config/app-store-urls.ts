export type StoreStatus = "live" | "review" | "coming-soon";

/**
 * App store links used by every public download surface.
 * Both public listings are live; keep status values only as a guarded config
 * escape hatch for future store incidents.
 */
export const APP_STORE_URL = "https://apps.apple.com/us/app/cruisekit/id6770305548";
export const APP_STORE_STATUS: StoreStatus = "live";

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.cruisekit.mobile";
export const PLAY_STORE_STATUS: StoreStatus = "live";

export function isStoreLive(status: StoreStatus, href: string | null) {
  return status === "live" && Boolean(href);
}
