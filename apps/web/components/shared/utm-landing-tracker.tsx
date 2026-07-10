"use client";

import { useEffect } from "react";
import { hasAnalyticsConsent, trackUtmLandingVisit } from "@/lib/analytics";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export default function UtmLandingTracker() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hasUtm = UTM_KEYS.some((key) => searchParams.has(key));

    if (!hasUtm) return;

    const storageKey = `cruisekit_utm_landing_visit:${window.location.pathname}:${window.location.search}`;
    let tracked = false;
    let timer: number | undefined;

    const scheduleIfAllowed = () => {
      if (tracked || !hasAnalyticsConsent()) return;

      try {
        if (window.sessionStorage.getItem(storageKey)) {
          tracked = true;
          return;
        }
        window.sessionStorage.setItem(storageKey, "1");
      } catch {
        // Browsers can disable sessionStorage; the event can still be sent.
      }

      tracked = true;
      timer = window.setTimeout(() => {
        trackUtmLandingVisit({
          landingPath: window.location.pathname,
          utmSource: searchParams.get("utm_source") ?? undefined,
          utmMedium: searchParams.get("utm_medium") ?? undefined,
          utmCampaign: searchParams.get("utm_campaign") ?? undefined,
          utmContent: searchParams.get("utm_content") ?? undefined,
          utmTerm: searchParams.get("utm_term") ?? undefined,
        });
      }, 250);
    };

    scheduleIfAllowed();
    window.addEventListener(
      "cruisekit:analytics-consent-changed",
      scheduleIfAllowed,
    );
    window.addEventListener("storage", scheduleIfAllowed);

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener(
        "cruisekit:analytics-consent-changed",
        scheduleIfAllowed,
      );
      window.removeEventListener("storage", scheduleIfAllowed);
    };
  }, []);

  return null;
}
