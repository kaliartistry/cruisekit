const DISTRIBUTION_PARAMS = [
  "cruise_line_id",
  "landing_context",
  "source_id",
  "source_type",
] as const;

const DRINK_CALCULATOR_PARAMS = [
  "completion",
  "cruise_line",
  "nights_bucket",
  "party_size_bucket",
  "result_bucket",
] as const;

export const ANALYTICS_EVENT_CONTRACT = {
  app_handoff_clicked: [
    "calculator_family",
    "cruise_line_id",
    "device_category",
    "landing_context",
    "placement",
    "platform",
    "source_id",
    "source_surface",
    "source_type",
  ],
  app_handoff_imported: [
    "cruise_line_id",
    "landing_context",
    "source_id",
    "source_type",
  ],
  app_handoff_viewed: [
    "calculator_family",
    "device_category",
    "placement",
    "source_surface",
  ],
  app_landing_viewed: ["device_category", "entry_path"],
  app_offer_dismissed: [
    "calculator_family",
    "device_category",
    "placement",
    "source_surface",
  ],
  app_offer_viewed: [
    "calculator_family",
    "device_category",
    "placement",
    "source_surface",
  ],
  app_store_click: [
    "calculator_family",
    "device_category",
    "placement",
    "source_surface",
  ],
  affiliate_click: ["partner", "source"],
  affiliate_offer_viewed: ["partner", "source"],
  blog_cta_click: ["destination_path", "source"],
  calculator_completed: [
    "calculator_family",
    "cost_categories_count",
    "cruise_line_id",
    "device_category",
    "entry_path",
    "has_manual_fare",
    "nights_bucket",
    "party_size_bucket",
    "result_kind",
  ],
  calculator_cta_clicked: ["device_category", "source_surface"],
  calculator_input_changed: ["calculator_family", "field_group"],
  calculator_result_generated: [
    "calculator_family",
    "cost_categories_count",
    "cruise_line_id",
    "device_category",
    "entry_path",
    "has_manual_fare",
    "nights_bucket",
    "party_size_bucket",
    "result_kind",
  ],
  calculator_result_returned: [
    "calculator_family",
    "cruise_line_id",
    "nights_bucket",
    "party_size_bucket",
    "result_kind",
  ],
  calculator_result_saved: [
    "calculator_family",
    "cruise_line_id",
    "nights_bucket",
    "party_size_bucket",
    "result_kind",
    "save_target",
  ],
  calculator_result_shared: [
    "calculator_family",
    "cruise_line_id",
    "method",
    "result_kind",
  ],
  calculator_started: [
    "calculator_family",
    "cruise_line_id",
    "device_category",
    "entry_path",
    "has_manual_fare",
    "nights_bucket",
    "party_size_bucket",
    "result_kind",
  ],
  calculator_viewed: [
    "calculator_family",
    "device_category",
    "entry_path",
    "source_surface",
  ],
  compare_fares_clicked: DRINK_CALCULATOR_PARAMS,
  cruise_line_selected: DRINK_CALCULATOR_PARAMS,
  download_cta_clicked: ["device_category", "platform", "source_surface"],
  drink_calculator_start: [],
  drink_calculator_view: [],
  dynamic_price_entered: DRINK_CALCULATOR_PARAMS,
  google_play_click: [
    "calculator_family",
    "device_category",
    "placement",
    "source_surface",
  ],
  mycrew_invite_accepted: DISTRIBUTION_PARAMS,
  mycrew_invite_created: DISTRIBUTION_PARAMS,
  mycrew_invite_opened: DISTRIBUTION_PARAMS,
  outbound_affiliate_click: ["partner", "source"],
  package_selected: DRINK_CALCULATOR_PARAMS,
  port_page_affiliate_click: ["partner", "source"],
  preset_selected: DRINK_CALCULATOR_PARAMS,
  qr_offer_displayed: [
    "calculator_family",
    "device_category",
    "placement",
    "platform",
    "source_surface",
  ],
  referred_cruise_created: DISTRIBUTION_PARAMS,
  result_copied: [
    "calculator_family",
    "cruise_line_id",
    "result_kind",
  ],
  result_shared: [
    ...DRINK_CALCULATOR_PARAMS,
    "calculator_family",
    "cruise_line_id",
    "method",
    "result_kind",
  ],
  result_viewed: DRINK_CALCULATOR_PARAMS,
  save_cruise_completed: DISTRIBUTION_PARAMS,
  save_cruise_started: DISTRIBUTION_PARAMS,
  save_estimate_clicked: DRINK_CALCULATOR_PARAMS,
  save_trip_clicked: ["source_surface"],
  saved_cruise_handoff_opened: DISTRIBUTION_PARAMS,
  session_entry: ["device_category", "entry_path"],
  source_link_clicked: DRINK_CALCULATOR_PARAMS,
  store_badge_clicked: [
    "calculator_family",
    "device_category",
    "placement",
    "source_surface",
  ],
  utm_landing_visit: [
    "landing_path",
    "utm_campaign",
    "utm_content",
    "utm_medium",
    "utm_source",
    "utm_term",
  ],
} as const;

export type AnalyticsEventName = keyof typeof ANALYTICS_EVENT_CONTRACT;
export type AnalyticsParamName =
  (typeof ANALYTICS_EVENT_CONTRACT)[AnalyticsEventName][number];
export type AnalyticsParamValue = string | number | boolean | null | undefined;
export type AnalyticsParams = Partial<
  Record<AnalyticsParamName, AnalyticsParamValue>
>;

const BOOLEAN_PARAMS = new Set<AnalyticsParamName>([
  "completion",
  "has_manual_fare",
]);

const COUNT_PARAMS = new Set<AnalyticsParamName>(["cost_categories_count"]);

const PATH_PARAMS = new Set<AnalyticsParamName>([
  "destination_path",
  "entry_path",
  "landing_path",
]);

const TOKEN_PARAMS = new Set<AnalyticsParamName>([
  "cruise_line",
  "cruise_line_id",
  "field_group",
  "partner",
  "source",
  "source_id",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term",
]);

const ENUM_VALUES: Partial<Record<AnalyticsParamName, readonly string[]>> = {
  calculator_family: ["total_cost", "drink_package"],
  device_category: ["mobile", "tablet", "desktop"],
  landing_context: [
    "generic",
    "cruise_line",
    "ship",
    "sailing",
    "itinerary",
    "port",
  ],
  method: ["native_share", "clipboard"],
  nights_bucket: ["1_3", "4_6", "7_9", "10_14", "15_plus"],
  party_size_bucket: ["1", "2", "3_4", "5_plus"],
  placement: [
    "calculator_result",
    "saved_trip",
    "footer",
    "app_page",
    "port_guide",
    "other",
  ],
  platform: ["ios", "android", "unknown"],
  result_bucket: [
    "price_needed",
    "credit_covers_plan",
    "credit_shortfall",
    "borderline",
    "package_saves_25_plus_daily",
    "package_saves_11_25_daily",
    "paygo_saves_25_plus_daily",
    "paygo_saves_11_25_daily",
  ],
  result_kind: ["single", "comparison", "save", "borderline", "paygo"],
  save_target: ["browser", "account"],
  source_surface: [
    "homepage_hero",
    "mobile_section",
    "footer",
    "app_page",
    "calculator_result",
    "saved_trip",
    "blog",
    "guide",
    "port_page",
    "cruises",
    "other",
  ],
  source_type: [
    "calculator",
    "traveler",
    "advisor",
    "creator",
    "organic",
    "direct",
  ],
};

export function sanitizeAnalyticsParams(
  eventName: AnalyticsEventName,
  params: AnalyticsParams,
) {
  const allowedParams = new Set<AnalyticsParamName>(
    ANALYTICS_EVENT_CONTRACT[eventName] as readonly AnalyticsParamName[],
  );
  const sanitized: Record<string, string | number | boolean> = {};

  for (const [rawKey, rawValue] of Object.entries(params)) {
    const key = rawKey as AnalyticsParamName;
    if (!allowedParams.has(key) || rawValue == null) continue;

    if (BOOLEAN_PARAMS.has(key)) {
      if (typeof rawValue === "boolean") sanitized[key] = rawValue;
      continue;
    }

    if (COUNT_PARAMS.has(key)) {
      if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
        sanitized[key] = Math.max(0, Math.min(16, Math.round(rawValue)));
      }
      continue;
    }

    if (typeof rawValue !== "string") continue;
    const value = rawValue.trim();
    const enumValues = ENUM_VALUES[key];
    if (enumValues) {
      if (enumValues.includes(value)) sanitized[key] = value;
      continue;
    }

    if (PATH_PARAMS.has(key)) {
      const path = safePath(value);
      if (path) sanitized[key] = path;
      continue;
    }

    if (TOKEN_PARAMS.has(key)) {
      const token = safeToken(value);
      if (token) sanitized[key] = token;
      continue;
    }
  }

  return sanitized;
}

export function deviceCategory(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth < 640) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

export function currentEntryPath() {
  if (typeof window === "undefined") return "/";
  return safePath(window.location.pathname) ?? "/";
}

export function partySizeBucket(size: number) {
  if (size <= 1) return "1";
  if (size === 2) return "2";
  if (size <= 4) return "3_4";
  return "5_plus";
}

export function nightsBucket(nights: number) {
  if (nights <= 3) return "1_3";
  if (nights <= 6) return "4_6";
  if (nights <= 9) return "7_9";
  if (nights <= 14) return "10_14";
  return "15_plus";
}

export function safePath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) return undefined;
  if (value.includes("?") || value.includes("#") || value.length > 120) {
    return undefined;
  }
  return /^\/[a-zA-Z0-9_./-]*$/.test(value) ? value : undefined;
}

export function safeToken(value: string) {
  if (value.length === 0 || value.length > 64) return undefined;
  if (/[@?#:/\\]/.test(value)) return undefined;
  return /^[a-zA-Z0-9_.-]+$/.test(value) ? value : undefined;
}
