export type GrowthTouch = {
  landingPage: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referralCode?: string;
  capturedAt: string;
};

export type GrowthAttribution = {
  anonymousId: string;
  firstTouch: GrowthTouch;
  lastTouch: GrowthTouch;
};

const VISITOR_KEY = "cruisekit:growth:visitor:v1";
const FIRST_TOUCH_KEY = "cruisekit:growth:first-touch:v1";
const LAST_TOUCH_KEY = "cruisekit:growth:last-touch:v1";

function clean(value: string | null, max = 120) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function createAnonymousId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ck_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

function readTouch(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GrowthTouch;
    return parsed?.landingPage ? parsed : null;
  } catch {
    return null;
  }
}

function writeTouch(key: string, touch: GrowthTouch) {
  try {
    window.localStorage.setItem(key, JSON.stringify(touch));
  } catch {
    // Attribution remains best effort when storage is unavailable.
  }
}

function currentTouch(): GrowthTouch {
  const params = new URLSearchParams(window.location.search);
  const referralCandidate = clean(
    params.get("referral_code") ?? params.get("ref"),
    32,
  );
  // Match the server's opaque, non-sequential referral code contract. An
  // unrelated `ref` value should not poison otherwise valid UTM attribution.
  const referralCode = referralCandidate && /^[A-Z2-9]{8,32}$/i.test(referralCandidate)
    ? referralCandidate.toUpperCase()
    : undefined;
  return {
    // Keep query strings out of the durable record. A query can contain an
    // accidentally pasted email or other sensitive value; attribution fields
    // below retain only the explicitly supported, length-limited parameters.
    landingPage: window.location.pathname.slice(0, 500),
    utmSource: clean(params.get("utm_source")),
    utmMedium: clean(params.get("utm_medium")),
    utmCampaign: clean(params.get("utm_campaign")),
    utmContent: clean(params.get("utm_content")),
    utmTerm: clean(params.get("utm_term")),
    referralCode,
    capturedAt: new Date().toISOString(),
  };
}

function hasCampaignSignal(touch: GrowthTouch) {
  return Boolean(
    touch.utmSource ||
      touch.utmMedium ||
      touch.utmCampaign ||
      touch.utmContent ||
      touch.utmTerm ||
      touch.referralCode,
  );
}

/**
 * Returns a local, pseudonymous attribution snapshot. This data intentionally
 * contains no email, name, quote total, cabin, ship, or private itinerary.
 */
export function getGrowthAttribution(): GrowthAttribution {
  if (typeof window === "undefined") {
    const fallback: GrowthTouch = {
      landingPage: "/",
      capturedAt: new Date(0).toISOString(),
    };
    return { anonymousId: "server", firstTouch: fallback, lastTouch: fallback };
  }

  let anonymousId: string | null = null;
  try {
    anonymousId = window.localStorage.getItem(VISITOR_KEY);
    if (!anonymousId) {
      anonymousId = createAnonymousId();
      window.localStorage.setItem(VISITOR_KEY, anonymousId);
    }
  } catch {
    anonymousId = createAnonymousId();
  }

  const visit = currentTouch();
  const existingFirst = readTouch(FIRST_TOUCH_KEY);
  const existingLast = readTouch(LAST_TOUCH_KEY);
  const firstTouch = existingFirst ?? visit;
  const lastTouch = hasCampaignSignal(visit) || !existingLast ? visit : existingLast;

  if (!existingFirst) writeTouch(FIRST_TOUCH_KEY, firstTouch);
  if (hasCampaignSignal(visit) || !existingLast) writeTouch(LAST_TOUCH_KEY, lastTouch);

  return { anonymousId, firstTouch, lastTouch };
}

export function currentDeviceCategory() {
  if (typeof window === "undefined") return "unknown";
  if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1023px)").matches) return "tablet";
  return "desktop";
}

export function currentPlatform() {
  if (typeof navigator === "undefined") return "web";
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) return "iphone";
  if (/android/.test(userAgent)) return "android";
  return "web";
}
