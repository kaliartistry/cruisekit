export type StoreStatus = "live" | "review" | "coming-soon";

/**
 * App store links used by every public download surface.
 * Both public listings are live; keep status values only as a guarded config
 * escape hatch for future store incidents.
 */
export const APP_STORE_URL =
  "https://apps.apple.com/app/apple-store/id6770305548";
export const APP_STORE_STATUS: StoreStatus = "live";

/**
 * Public App Store provider token used with Apple campaign links. The fallback
 * was read from CruiseKit's App Store Connect campaign-link builder on
 * 2026-09-04; an environment override supports a future provider-token change.
 */
export const APPLE_PROVIDER_TOKEN = validAppleProviderToken(
  process.env.NEXT_PUBLIC_APPLE_PROVIDER_TOKEN,
) ?? "128557928";

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.cruisekit.mobile";
export const PLAY_STORE_STATUS: StoreStatus = "live";

export function isStoreLive(status: StoreStatus, href: string | null) {
  return status === "live" && Boolean(href);
}

function validAppleProviderToken(value: string | undefined) {
  const token = value?.trim();
  return token && /^\d{6,12}$/.test(token) ? token : null;
}
