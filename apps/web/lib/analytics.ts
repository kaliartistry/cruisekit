export type StorePlatform = "ios" | "android" | "unknown";

export type SourceSurface =
  | "homepage_hero"
  | "mobile_section"
  | "footer"
  | "app_page"
  | "calculator_result"
  | "saved_trip"
  | "other";

type AnalyticsParam = string | number | boolean | null | undefined;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  name: string,
  params: Record<string, AnalyticsParam> = {},
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  try {
    window.gtag("event", name, compactParams(params));
  } catch {
    // Analytics must never affect rendering or navigation.
  }
}

export function trackDownloadCtaClicked(
  platform: StorePlatform,
  sourceSurface: SourceSurface,
) {
  trackEvent("download_cta_clicked", {
    platform,
    source_surface: sourceSurface,
  });
}

export function trackStoreBadgeClicked(
  platform: StorePlatform,
  sourceSurface: SourceSurface,
) {
  trackEvent("store_badge_clicked", {
    platform,
    source_surface: sourceSurface,
  });
}

export function trackCalculatorCtaClicked(sourceSurface: SourceSurface) {
  trackEvent("calculator_cta_clicked", {
    source_surface: sourceSurface,
  });
}

export function trackAppLandingViewed() {
  trackEvent("app_landing_viewed");
}

export function trackCalculatorStarted() {
  trackEvent("calculator_started");
}

export function trackCalculatorCompleted() {
  trackEvent("calculator_completed");
}

export function trackAppHandoffViewed(sourceSurface: SourceSurface) {
  trackEvent("app_handoff_viewed", {
    source_surface: sourceSurface,
  });
}

function compactParams(params: Record<string, AnalyticsParam>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );
}
