"use client";

import { useEffect } from "react";
import {
  hasAnalyticsConsent,
  trackSessionEntry,
  trackUtmLandingVisit,
} from "@/lib/analytics";

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

    const entryStorageKey = `cruisekit_session_entry:${window.location.pathname}`;
    const utmStorageKey = `cruisekit_utm_landing_visit:${window.location.pathname}`;
    let entryTracked = false;
    let utmTracked = false;
    let timer: number | undefined;

    const scheduleIfAllowed = () => {
      if (!hasAnalyticsConsent()) return;

      try {
        if (window.sessionStorage.getItem(entryStorageKey)) {
          entryTracked = true;
        } else {
          window.sessionStorage.setItem(entryStorageKey, "1");
        }
        if (hasUtm && window.sessionStorage.getItem(utmStorageKey)) {
          utmTracked = true;
        } else if (hasUtm) {
          window.sessionStorage.setItem(utmStorageKey, "1");
        }
      } catch {
        // Browsers can disable sessionStorage; the event can still be sent.
      }

      if (entryTracked && (!hasUtm || utmTracked)) return;
      timer = window.setTimeout(() => {
        if (!entryTracked) {
          entryTracked = true;
          trackSessionEntry();
        }
        if (hasUtm && !utmTracked) {
          utmTracked = true;
          trackUtmLandingVisit({
            landingPath: window.location.pathname,
            utmSource: searchParams.get("utm_source") ?? undefined,
            utmMedium: searchParams.get("utm_medium") ?? undefined,
            utmCampaign: searchParams.get("utm_campaign") ?? undefined,
            utmContent: searchParams.get("utm_content") ?? undefined,
            utmTerm: searchParams.get("utm_term") ?? undefined,
          });
        }
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
