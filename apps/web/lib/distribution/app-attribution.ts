import type { SourceSurface, StorePlatform } from "@/lib/analytics";
import {
  APPLE_PROVIDER_TOKEN,
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "@/lib/config/app-store-urls";
import { safeToken } from "@/lib/analytics-contract";

export type AttributedStoreOptions = {
  appleProviderToken?: string | null;
  incomingSearch?: string | URLSearchParams;
};

const APPLE_CAMPAIGNS: Record<SourceSurface, string> = {
  homepage_hero: "homepage",
  mobile_section: "mobile_section",
  footer: "footer",
  app_page: "app_page",
  calculator_result: "cost_result",
  saved_trip: "saved_trip",
  blog: "blog",
  guide: "guide",
  port_page: "port_guide",
  cruises: "cruises",
  other: "other",
};

export function buildAttributedStoreUrl(
  platform: Exclude<StorePlatform, "unknown">,
  sourceSurface: SourceSurface,
  options: AttributedStoreOptions = {},
) {
  return platform === "ios"
    ? buildAppleCampaignUrl(sourceSurface, options)
    : buildPlayInstallReferrerUrl(sourceSurface, options.incomingSearch);
}

export function buildAppleCampaignUrl(
  sourceSurface: SourceSurface,
  options: AttributedStoreOptions = {},
) {
  const url = new URL(APP_STORE_URL);
  const providerToken =
    options.appleProviderToken === undefined
      ? APPLE_PROVIDER_TOKEN
      : options.appleProviderToken;

  // Apple requires a verified provider token for a measurable campaign link.
  // Omitting both values is safer than shipping a fabricated pt value.
  if (providerToken && /^\d{6,12}$/.test(providerToken)) {
    url.searchParams.set("pt", providerToken);
    url.searchParams.set("ct", APPLE_CAMPAIGNS[sourceSurface]);
    url.searchParams.set("mt", "8");
  }
  return url.toString();
}

export function buildPlayInstallReferrerUrl(
  sourceSurface: SourceSurface,
  incomingSearch?: string | URLSearchParams,
) {
  const url = new URL(PLAY_STORE_URL);
  const incoming =
    typeof incomingSearch === "string"
      ? new URLSearchParams(incomingSearch)
      : incomingSearch ?? new URLSearchParams();
  const referrer = new URLSearchParams({
    utm_source: safeToken(incoming.get("utm_source") ?? "") ?? "cruisekit_web",
    utm_medium: safeToken(incoming.get("utm_medium") ?? "") ?? "app_handoff",
    utm_campaign:
      safeToken(incoming.get("utm_campaign") ?? "") ??
      APPLE_CAMPAIGNS[sourceSurface],
    utm_content: sourceSurface,
  });

  url.searchParams.set("referrer", referrer.toString());
  return url.toString();
}

export function appleCampaignForSurface(sourceSurface: SourceSurface) {
  return APPLE_CAMPAIGNS[sourceSurface];
}
