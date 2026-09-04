import {
  currentEntryPath,
  deviceCategory,
  nightsBucket,
  partySizeBucket,
  sanitizeAnalyticsParams,
  safePath,
  type AnalyticsEventName,
  type AnalyticsParams,
} from "@/lib/analytics-contract";

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

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  name: AnalyticsEventName,
  params: AnalyticsParams = {},
) {
  if (
    typeof window === "undefined" ||
    typeof window.gtag !== "function" ||
    !hasAnalyticsConsent()
  ) {
    return;
  }

  try {
    window.gtag("event", name, sanitizeAnalyticsParams(name, params));
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
    device_category: deviceCategory(),
    platform,
    source_surface: sourceSurface,
  });
}

export function trackStoreBadgeClicked(
  platform: StorePlatform,
  sourceSurface: SourceSurface,
  options: {
    calculatorFamily?: "total_cost" | "drink_package";
    placement?: StorePlacement;
  } = {},
) {
  const eventName =
    platform === "ios"
      ? "app_store_click"
      : platform === "android"
        ? "google_play_click"
        : "store_badge_clicked";

  trackEvent(eventName, {
    calculator_family: options.calculatorFamily,
    device_category: deviceCategory(),
    placement: options.placement ?? placementForSourceSurface(sourceSurface),
    source_surface: sourceSurface,
  });
}

export function trackCalculatorCtaClicked(sourceSurface: SourceSurface) {
  trackEvent("calculator_cta_clicked", {
    device_category: deviceCategory(),
    source_surface: sourceSurface,
  });
}

export function trackAppLandingViewed() {
  trackEvent("app_landing_viewed", {
    device_category: deviceCategory(),
    entry_path: currentEntryPath(),
  });
}

export type CalculatorEventContext = {
  cruiseLineId?: string;
  partySize?: number;
  nights?: number;
  hasManualFare?: boolean;
  resultKind?: "single" | "comparison";
  costCategoriesCount?: number;
};

function calculatorEventParams(params: CalculatorEventContext) {
  return {
    calculator_family: "total_cost" as const,
    cost_categories_count: params.costCategoriesCount,
    cruise_line_id: params.cruiseLineId,
    device_category: deviceCategory(),
    entry_path: currentEntryPath(),
    has_manual_fare: params.hasManualFare,
    nights_bucket:
      params.nights === undefined ? undefined : nightsBucket(params.nights),
    party_size_bucket:
      params.partySize === undefined
        ? undefined
        : partySizeBucket(params.partySize),
    result_kind: params.resultKind,
  };
}

export function trackCalculatorViewed(sourceSurface: SourceSurface = "other") {
  trackEvent("calculator_viewed", {
    calculator_family: "total_cost",
    device_category: deviceCategory(),
    entry_path: currentEntryPath(),
    source_surface: sourceSurface,
  });
}

export function trackCalculatorStarted(params: CalculatorEventContext) {
  trackEvent("calculator_started", calculatorEventParams(params));
}

export function trackCalculatorInputChanged(fieldGroup: "trip_basics" | "add_ons") {
  trackEvent("calculator_input_changed", {
    calculator_family: "total_cost",
    field_group: fieldGroup,
  });
}

export function trackCalculatorCompleted(params: CalculatorEventContext) {
  const safeParams = calculatorEventParams(params);
  const signature = JSON.stringify(safeParams);
  if (wasResultSignatureTracked(signature)) return;

  // Keep the historical event for continuity while the result event becomes
  // the canonical activation denominator.
  trackEvent("calculator_completed", safeParams);
  trackEvent("calculator_result_generated", safeParams);
}

export function trackResultShared(params: {
  cruiseLineId?: string;
  method: "native_share" | "clipboard";
  resultKind?: "single" | "comparison";
}) {
  const eventParams = {
    calculator_family: "total_cost" as const,
    cruise_line_id: params.cruiseLineId,
    method: params.method,
    result_kind: params.resultKind ?? "single",
  };
  trackEvent("result_shared", eventParams);
  trackEvent("calculator_result_shared", eventParams);
  if (params.method === "clipboard") trackEvent("result_copied", eventParams);
}

export function trackCalculatorResultSaved(params: CalculatorEventContext) {
  trackEvent("calculator_result_saved", {
    ...calculatorEventParams(params),
    save_target: "browser",
  });
}

export function trackCalculatorResultReturned(params: CalculatorEventContext) {
  trackEvent("calculator_result_returned", calculatorEventParams(params));
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
  params: DistributionEventParams & {
    calculatorFamily?: "total_cost" | "drink_package";
    placement?: StorePlacement;
    platform?: StorePlatform;
    sourceSurface?: SourceSurface;
  },
) {
  trackEvent("app_handoff_clicked", {
    ...distributionParams(params),
    calculator_family: params.calculatorFamily,
    device_category: deviceCategory(),
    placement:
      params.placement ??
      (params.sourceSurface
        ? placementForSourceSurface(params.sourceSurface)
        : undefined),
    platform: params.platform,
    source_surface: params.sourceSurface,
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
    destination_path: safeDestinationPath(href),
    source,
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

export function trackSessionEntry() {
  trackEvent("session_entry", {
    device_category: deviceCategory(),
    entry_path: currentEntryPath(),
  });
}

export function trackOutboundAffiliateClick(partner: string, source: string) {
  const params = {
    partner,
    source,
  };
  trackEvent("outbound_affiliate_click", params);
  trackEvent("affiliate_click", params);

  if (source.startsWith("port-") || source.startsWith("port_page")) {
    trackEvent("port_page_affiliate_click", {
      partner,
      source,
    });
  }
}

export function trackAffiliateOfferViewed(partner: string, source: string) {
  trackEvent("affiliate_offer_viewed", { partner, source });
}

export function trackSaveTripClicked(sourceSurface: SourceSurface) {
  trackEvent("save_trip_clicked", {
    source_surface: sourceSurface,
  });
}

export function trackAppHandoffViewed(sourceSurface: SourceSurface) {
  const params = {
    calculator_family:
      sourceSurface === "calculator_result" ? ("total_cost" as const) : undefined,
    device_category: deviceCategory(),
    placement: placementForSourceSurface(sourceSurface),
    source_surface: sourceSurface,
  };
  trackEvent("app_handoff_viewed", params);
  trackEvent("app_offer_viewed", params);
}

export type StorePlacement =
  | "calculator_result"
  | "saved_trip"
  | "footer"
  | "app_page"
  | "port_guide"
  | "other";

export function trackQrOfferDisplayed(params: {
  platform: Exclude<StorePlatform, "unknown">;
  sourceSurface: SourceSurface;
  calculatorFamily?: "total_cost" | "drink_package";
}) {
  trackEvent("qr_offer_displayed", {
    calculator_family: params.calculatorFamily,
    device_category: "desktop",
    placement: placementForSourceSurface(params.sourceSurface),
    platform: params.platform,
    source_surface: params.sourceSurface,
  });
}

function placementForSourceSurface(sourceSurface: SourceSurface): StorePlacement {
  if (sourceSurface === "calculator_result") return "calculator_result";
  if (sourceSurface === "saved_trip") return "saved_trip";
  if (sourceSurface === "footer") return "footer";
  if (sourceSurface === "app_page") return "app_page";
  if (sourceSurface === "port_page") return "port_guide";
  return "other";
}

function safeDestinationPath(href: string) {
  try {
    const url = new URL(href, "https://cruisekit.app");
    if (url.origin !== "https://cruisekit.app") return undefined;
    return safePath(url.pathname);
  } catch {
    return undefined;
  }
}

function wasResultSignatureTracked(signature: string) {
  if (typeof window === "undefined") return false;
  const key = `cruisekit:calculator-result-event:${signature}`;
  try {
    if (window.sessionStorage.getItem(key)) return true;
    window.sessionStorage.setItem(key, "1");
  } catch {
    // A blocked sessionStorage must not block analytics or the calculator.
  }
  return false;
}
