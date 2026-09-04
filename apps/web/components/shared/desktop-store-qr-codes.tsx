"use client";

import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  hasAnalyticsConsent,
  trackQrOfferDisplayed,
  trackStoreBadgeClicked,
  type SourceSurface,
  type StorePlatform,
} from "@/lib/analytics";
import { useAttributedStoreUrl } from "@/components/shared/store-buttons";

const STORE_LABELS = {
  ios: "App Store",
  android: "Google Play",
} as const;

export default function DesktopStoreQrCodes({
  sourceSurface,
}: {
  sourceSurface: SourceSurface;
}) {
  return (
    <div
      className="hidden gap-3 sm:grid sm:grid-cols-2"
      aria-label="Scan to install CruiseKit"
    >
      <StoreQrCode platform="ios" sourceSurface={sourceSurface} />
      <StoreQrCode platform="android" sourceSurface={sourceSurface} />
    </div>
  );
}

function StoreQrCode({
  platform,
  sourceSurface,
}: {
  platform: Exclude<StorePlatform, "unknown">;
  sourceSurface: SourceSurface;
}) {
  const href = useAttributedStoreUrl(platform, sourceSurface);
  const calculatorFamily =
    sourceSurface === "calculator_result" ? "total_cost" : undefined;

  useEffect(() => {
    if (!window.matchMedia("(min-width: 640px)").matches) return;
    let tracked = false;
    const trackView = () => {
      if (tracked || !hasAnalyticsConsent()) return;
      tracked = true;
      trackQrOfferDisplayed({ platform, sourceSurface, calculatorFamily });
    };
    trackView();
    window.addEventListener("cruisekit:analytics-consent-changed", trackView);
    return () =>
      window.removeEventListener(
        "cruisekit:analytics-consent-changed",
        trackView,
      );
  }, [calculatorFamily, platform, sourceSurface]);

  const storeLabel = STORE_LABELS[platform];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackStoreBadgeClicked(platform, sourceSurface, { calculatorFamily })
      }
      className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-3 text-white transition-colors hover:border-teal/50 hover:bg-white/10"
      aria-label={`Scan or open ${storeLabel}`}
    >
      <span className="rounded-lg bg-white p-1.5">
        <QRCodeSVG
          value={href}
          size={76}
          level="M"
          marginSize={0}
          title={`CruiseKit on ${storeLabel}`}
        />
      </span>
      <span className="text-xs leading-snug text-white/75">
        Scan for
        <strong className="mt-0.5 block text-sm text-white">
          {storeLabel}
        </strong>
      </span>
    </a>
  );
}
