"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Script from "next/script";

export const ANALYTICS_CONSENT_KEY = "cruisekit_analytics_consent_v1";
const OPEN_CONSENT_EVENT = "cruisekit:open-analytics-consent";
const CONSENT_CHANGED_EVENT = "cruisekit:analytics-consent-changed";
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type ConsentChoice = "granted" | "denied";
type ConsentSnapshot = ConsentChoice | "unset" | "server";

export default function AnalyticsLoader() {
  const choice = useSyncExternalStore(
    subscribeToConsent,
    readConsentSnapshot,
    () => "server",
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const openSettings = () => setSettingsOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, openSettings);
  }, []);

  const choose = useCallback((nextChoice: ConsentChoice) => {
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_KEY, nextChoice);
    } catch {
      // If browser storage is blocked, analytics stays unloaded by default.
    }
    window.gtag?.("consent", "update", {
      analytics_storage: nextChoice,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
    setSettingsOpen(false);
  }, []);

  const showChoice = choice !== "server" && (choice === "unset" || settingsOpen);

  return (
    <>
      {measurementId && choice === "granted" ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="cruisekit-gtag" strategy="afterInteractive">
            {`
              window.gtag('consent', 'update', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
              window.gtag('js', new Date());
              window.gtag('config', '${measurementId}');
            `}
          </Script>
        </>
      ) : null}

      {showChoice ? (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="analytics-consent-title"
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:inset-x-6 sm:p-6"
        >
          <h2 id="analytics-consent-title" className="text-lg font-bold text-navy">
            Optional website analytics
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            CruiseKit can use Google Analytics to understand which pages and
            tools are useful. Analytics stays off unless you allow it. Your
            choice is the only consent value saved by this control.
          </p>
          {choice === "granted" || choice === "denied" ? (
            <p className="mt-2 text-xs font-medium text-slate-500">
              Current choice: {choice === "granted" ? "Allowed" : "Not allowed"}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => choose("granted")}
              className="rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              Allow analytics
            </button>
            <button
              type="button"
              onClick={() => choose("denied")}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              Keep analytics off
            </button>
            {settingsOpen ? (
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="px-2 py-2.5 text-sm font-semibold text-slate-500 underline underline-offset-4"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}

export function AnalyticsPreferenceButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="font-medium text-teal underline decoration-teal/30 underline-offset-2 transition-colors hover:text-teal-dark"
    >
      Change website analytics choice
    </button>
  );
}

export function parseAnalyticsConsent(value: string | null): ConsentChoice | null {
  return value === "granted" || value === "denied" ? value : null;
}

function readConsentSnapshot(): ConsentSnapshot {
  try {
    return (
      parseAnalyticsConsent(
        window.localStorage.getItem(ANALYTICS_CONSENT_KEY),
      ) ?? "unset"
    );
  } catch {
    return "unset";
  }
}

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener(CONSENT_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}
