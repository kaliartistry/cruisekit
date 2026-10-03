"use client";

import { Apple, ArrowUpRight, Smartphone } from "lucide-react";
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "@/lib/config/app-store-urls";
import {
  trackStoreBadgeClicked,
  trackAppHandoffClicked,
  type SourceSurface,
  type StorePlatform,
} from "@/lib/analytics";
import { cn } from "@/lib/utils/cn";

type StoreButtonVariant = "panel" | "dark" | "light";

const STORE_DETAILS = {
  ios: {
    href: APP_STORE_URL,
    label: "App Store",
    eyebrow: "Download on",
    platformLabel: "iPhone",
    icon: Apple,
  },
  android: {
    href: PLAY_STORE_URL,
    label: "Google Play",
    eyebrow: "Get it on",
    platformLabel: "Android",
    icon: Smartphone,
  },
} as const;

export function StoreButtonRow({
  sourceSurface,
  variant = "panel",
  className,
}: {
  sourceSurface: SourceSurface;
  variant?: StoreButtonVariant;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      <StoreButton
        platform="ios"
        sourceSurface={sourceSurface}
        variant={variant}
      />
      <StoreButton
        platform="android"
        sourceSurface={sourceSurface}
        variant={variant}
      />
    </div>
  );
}

export function StoreButton({
  platform,
  sourceSurface,
  variant = "panel",
  className,
}: {
  platform: Exclude<StorePlatform, "unknown">;
  sourceSurface: SourceSurface;
  variant?: StoreButtonVariant;
  className?: string;
}) {
  const store = STORE_DETAILS[platform];
  const Icon = store.icon;
  const href =
    platform === "android"
      ? withPlayInstallReferrer(store.href, sourceSurface)
      : store.href;
  const calculatorHandoff =
    sourceSurface === "saved_trip" || sourceSurface === "calculator_result";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackStoreBadgeClicked(platform, sourceSurface);
        trackAppHandoffClicked({
          platform,
          sourceType: calculatorHandoff ? "calculator" : "direct",
          landingContext:
            sourceSurface === "saved_trip"
              ? "sailing"
              : sourceSurface === "calculator_result"
                ? "cruise_line"
                : "generic",
        });
      }}
      className={cn(
        "group flex items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-all",
        variant === "panel" &&
          "border-gray-200 bg-gray-50 text-navy hover:border-teal/40 hover:bg-teal/5",
        variant === "dark" &&
          "border-white/20 bg-white/5 text-white hover:border-teal/50 hover:bg-white/10",
        variant === "light" &&
          "border-gray-200 bg-white text-navy shadow-sm hover:border-teal/40 hover:shadow-md",
        className,
      )}
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg",
            variant === "dark" ? "bg-white text-navy" : "bg-navy text-white",
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <span>
          <span
            className={cn(
              "block text-xs font-semibold uppercase",
              variant === "dark" ? "text-white/60" : "text-gray-500",
            )}
          >
            {store.eyebrow}
          </span>
          <span className="block text-base font-bold">{store.label}</span>
          <span
            className={cn(
              "block text-xs",
              variant === "dark" ? "text-white/55" : "text-gray-500",
            )}
          >
            Free on {store.platformLabel}
          </span>
        </span>
      </span>
      <ArrowUpRight
        className={cn(
          "h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
          variant === "dark" ? "text-teal" : "text-teal",
        )}
        strokeWidth={2.2}
      />
    </a>
  );
}

function withPlayInstallReferrer(href: string, sourceSurface: SourceSurface) {
  const url = new URL(href);
  const referrer = new URLSearchParams({
    utm_source: "cruisekit_web",
    utm_medium: "app_handoff",
    utm_campaign: sourceSurface,
  });
  url.searchParams.set("referrer", referrer.toString());
  return url.toString();
}
