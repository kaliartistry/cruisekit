"use client";

import { useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Smartphone, Calendar, DollarSign, Users, Wine } from "lucide-react";
import { StoreButtonRow } from "@/components/shared/store-buttons";
import {
  hasAnalyticsConsent,
  trackAppHandoffViewed,
  type SourceSurface,
} from "@/lib/analytics";

interface AppHandoffProps {
  /** The tone of the headline — tailored to where it appears. */
  variant?: "calculator-result" | "saved-trip" | "footer";
  className?: string;
}

const DesktopStoreQrCodes = dynamic(
  () => import("@/components/shared/desktop-store-qr-codes"),
  { ssr: false },
);

const HEADLINES: Record<NonNullable<AppHandoffProps["variant"]>, { title: string; body: string }> = {
  "calculator-result": {
    title: "Take this on the ship.",
    body: "MyDay keeps the cruise day, ports, spend, and crew close after you run the web estimate.",
  },
  "saved-trip": {
    title: "Your cruise, in your pocket.",
    body: "Download CruiseKit to keep MyDay, spend tracking, drink package value, and itinerary port maps closer than a browser tab.",
  },
  footer: {
    title: "Your cruise, in your pocket.",
    body: "CruiseKit is available for iPhone and Android with MyDay, Spend, drink package value, itinerary port maps, and MyCrew invites.",
  },
};

const FEATURES = [
  { icon: Calendar, label: "MyDay cruise companion" },
  { icon: DollarSign, label: "Exact Spend tracker" },
  { icon: Wine, label: "Drink package value" },
  { icon: Users, label: "MyCrew invites" },
];

/**
 * Web-to-mobile handoff card. Reusable across calculator result, my-trips,
 * and footer. The store labels are controlled from app-store-urls.ts so launch
 * day is a small config flip.
 */
export default function AppHandoff({
  variant = "calculator-result",
  className = "",
}: AppHandoffProps) {
  const { title, body } = HEADLINES[variant];
  const sourceSurface = sourceSurfaceForVariant(variant);

  useEffect(() => {
    let tracked = false;
    const trackView = () => {
      if (tracked || !hasAnalyticsConsent()) return;
      tracked = true;
      trackAppHandoffViewed(sourceSurface);
    };
    trackView();
    window.addEventListener("cruisekit:analytics-consent-changed", trackView);
    return () =>
      window.removeEventListener(
        "cruisekit:analytics-consent-changed",
        trackView,
      );
  }, [sourceSurface]);

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-navy to-[#143057] p-6 sm:p-8 text-white ${className}`}
    >
      <div className="relative z-10 grid gap-6 sm:grid-cols-[1.2fr_1fr] sm:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase text-teal border border-white/10">
            <Smartphone className="h-3 w-3" />
            Free on iPhone and Android
          </div>
          <h3 className="mb-2 text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">
            {title}
          </h3>
          <p className="text-sm text-white/75 leading-relaxed mb-5">{body}</p>

          <ul className="space-y-2 mb-5">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm text-white/90"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal/20">
                  <Icon className="h-3.5 w-3.5 text-teal" strokeWidth={2.2} />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <StoreButtonRow
            sourceSurface={sourceSurface}
            variant="dark"
            className="sm:grid-cols-2"
          />
          <div className="mt-4 hidden sm:block">
            <p className="mb-2 text-xs font-semibold text-white/60">
              On a computer? Scan the store for your phone.
            </p>
            <DesktopStoreQrCodes sourceSurface={sourceSurface} />
          </div>
        </div>

        <div className="hidden sm:flex justify-end">
          <PhoneMock />
        </div>
      </div>
    </div>
  );
}

function sourceSurfaceForVariant(
  variant: NonNullable<AppHandoffProps["variant"]>,
): SourceSurface {
  if (variant === "calculator-result") return "calculator_result";
  if (variant === "saved-trip") return "saved_trip";
  return "footer";
}

function PhoneMock() {
  return (
    <div className="relative h-[280px] w-[150px] overflow-hidden rounded-[28px] border-[3px] border-white/15 bg-navy shadow-2xl">
      <div className="relative h-full w-full">
        <Image
          src="/assets/app-screenshots/myday-home.png"
          alt="CruiseKit MyDay app screenshot"
          fill
          sizes="150px"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
