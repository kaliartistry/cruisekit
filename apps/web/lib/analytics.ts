export type StorePlatform = "ios" | "android" | "unknown";

export type SourceSurface =
  | "homepage_hero"
  | "mobile_section"
  | "footer"
  | "app_page"
  | "calculator_result"
  | "saved_trip"
  | "blog"
  | "guide"
  | "port_page"
  | "cruises"
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
  if (
    typeof window === "undefined" ||
    typeof window.gtag !== "function" ||
    !hasAnalyticsConsent()
  ) {
    return;
  }

  try {
    window.gtag("event", name, compactParams(params));
  } catch {
    // Analytics must never affect rendering or navigation.
  }
}

export function hasAnalyticsConsent() {
  try {
    return (
      window.localStorage.getItem("cruisekit_analytics_consent_v1") ===
      "granted"
    );
  } catch {
    return false;
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
  const eventName =
    platform === "ios"
      ? "app_store_click"
      : platform === "android"
        ? "google_play_click"
        : "store_badge_clicked";

  trackEvent(eventName, {
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

export function trackResultShared(params: {
  cruiseLineId?: string;
  method: "native_share" | "clipboard";
}) {
  trackEvent("result_shared", {
    cruise_line_id: params.cruiseLineId,
    method: params.method,
  });
}

export type DistributionSourceType =
  | "calculator"
  | "traveler"
  | "advisor"
  | "creator"
  | "organic"
  | "direct";

export type LandingContext =
  | "generic"
  | "cruise_line"
  | "ship"
  | "sailing"
  | "itinerary"
  | "port";

type DistributionEventParams = {
  sourceType?: DistributionSourceType;
  sourceId?: string;
  landingContext?: LandingContext;
  cruiseLineId?: string;
};

function distributionParams(params: DistributionEventParams) {
  return {
    source_type: params.sourceType,
    source_id: params.sourceId,
    landing_context: params.landingContext,
    cruise_line_id: params.cruiseLineId,
  };
}

export function trackSaveCruiseStarted(params: DistributionEventParams) {
  trackEvent("save_cruise_started", distributionParams(params));
}

export function trackSaveCruiseCompleted(params: DistributionEventParams) {
  trackEvent("save_cruise_completed", distributionParams(params));
}

export function trackSavedCruiseHandoffOpened(params: DistributionEventParams) {
  trackEvent("saved_cruise_handoff_opened", distributionParams(params));
}

export function trackAppHandoffClicked(
  params: DistributionEventParams & { platform?: StorePlatform },
) {
  trackEvent("app_handoff_clicked", {
    ...distributionParams(params),
    platform: params.platform,
  });
}

export function trackAppHandoffImported(params: DistributionEventParams) {
  trackEvent("app_handoff_imported", distributionParams(params));
}

export function trackMyCrewInviteCreated(params: DistributionEventParams) {
  trackEvent("mycrew_invite_created", distributionParams(params));
}

export function trackMyCrewInviteOpened(params: DistributionEventParams) {
  trackEvent("mycrew_invite_opened", distributionParams(params));
}

export function trackMyCrewInviteAccepted(params: DistributionEventParams) {
  trackEvent("mycrew_invite_accepted", distributionParams(params));
}

export function trackReferredCruiseCreated(params: DistributionEventParams) {
  trackEvent("referred_cruise_created", distributionParams(params));
}

export function trackBlogCtaClick(source: string, href: string) {
  trackEvent("blog_cta_click", {
    source,
    href,
  });
}

export function trackUtmLandingVisit(params: {
  landingPath: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}) {
  trackEvent("utm_landing_visit", {
    landing_path: params.landingPath,
    utm_source: params.utmSource,
    utm_medium: params.utmMedium,
    utm_campaign: params.utmCampaign,
    utm_content: params.utmContent,
    utm_term: params.utmTerm,
  });
}

export function trackOutboundAffiliateClick(partner: string, source: string) {
  trackEvent("outbound_affiliate_click", {
    partner,
    source,
  });

  if (source.startsWith("port-") || source.startsWith("port_page")) {
    trackEvent("port_page_affiliate_click", {
      partner,
      source,
    });
  }
}

export function trackSaveTripClicked(sourceSurface: SourceSurface) {
  trackEvent("save_trip_clicked", {
    source_surface: sourceSurface,
  });
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
