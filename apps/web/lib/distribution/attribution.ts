import type {
  DistributionSourceType,
  LandingContext,
} from "@/lib/analytics";
import { safeToken } from "@/lib/analytics-contract";

export type CampaignAttribution = {
  sourceType: DistributionSourceType;
  sourceId?: string;
  landingContext: LandingContext;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

const FIRST_TOUCH_KEY = "cruisekit:first-touch:v1";

export function readCampaignAttribution(
  sailingContext?: { sailingId?: string; shipName?: string },
): CampaignAttribution {
  if (typeof window === "undefined") {
    return { sourceType: "calculator", landingContext: "generic" };
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = clean(params.get("utm_source"));
  const utmMedium = clean(params.get("utm_medium"));
  const utmCampaign = clean(params.get("utm_campaign"));
  const utmContent = clean(params.get("utm_content"));
  const utmTerm = clean(params.get("utm_term"));
  const explicitSource = clean(params.get("source_type"));
  const sourceId = clean(params.get("source_id")) ?? utmCampaign;
  const sourceType = sourceTypeFrom(explicitSource, utmSource, utmMedium);
  const landingContext: LandingContext = sailingContext?.sailingId
    ? "sailing"
    : sailingContext?.shipName
      ? "ship"
      : params.get("line")
        ? "cruise_line"
        : "generic";

  return {
    sourceType,
    sourceId,
    landingContext,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
  };
}

export function getOrCreateFirstTouch(
  convertingTouch: CampaignAttribution,
): CampaignAttribution {
  if (typeof window === "undefined") return convertingTouch;
  try {
    const existing = window.localStorage.getItem(FIRST_TOUCH_KEY);
    if (existing) return JSON.parse(existing) as CampaignAttribution;
    window.localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(convertingTouch));
  } catch {
    // Attribution storage is best-effort and never blocks saving.
  }
  return convertingTouch;
}

function sourceTypeFrom(
  explicit?: string,
  utmSource?: string,
  utmMedium?: string,
): DistributionSourceType {
  if (
    explicit === "traveler" ||
    explicit === "advisor" ||
    explicit === "creator" ||
    explicit === "organic" ||
    explicit === "direct" ||
    explicit === "calculator"
  ) {
    return explicit;
  }
  if (utmSource === "advisor") return "advisor";
  if (utmSource === "creator" || utmMedium === "organic_partner") return "creator";
  if (utmSource || utmMedium) return "organic";
  return "calculator";
}

function clean(value: string | null) {
  const trimmed = value?.trim();
  return trimmed ? safeToken(trimmed) : undefined;
}
