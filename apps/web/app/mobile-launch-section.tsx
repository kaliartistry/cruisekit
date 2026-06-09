import { Apple, CheckCircle2, Clock3, Smartphone } from "lucide-react";
import {
  APP_STORE_STATUS,
  APP_STORE_URL,
  PLAY_STORE_STATUS,
  PLAY_STORE_URL,
  isStoreLive,
  type StoreStatus,
} from "@/lib/config/app-store-urls";

const MOBILE_FEATURES = [
  "True cost calculator",
  "Ship-time and port-time planning",
  "MyDay itinerary and spend tools",
  "Optional MyCrew check-ins",
] as const;

export default function MobileLaunchSection() {
  const iosLive = isStoreLive(APP_STORE_STATUS, APP_STORE_URL);
  const androidLive = isStoreLive(PLAY_STORE_STATUS, PLAY_STORE_URL);

  return (
    <section id="download" className="scroll-mt-28 border-y border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:px-8 lg:py-16">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-dark">
            <Smartphone className="h-3.5 w-3.5" />
            {iosLive && androidLive ? "Available for iPhone and Android" : "Mobile app launch"}
          </div>

          <h2 className="max-w-2xl text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            CruiseKit is now available for iPhone and Android.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
            The website stays useful today, and the mobile app gives cruisers
            the onboard tools they need for planning, port days, MyDay, and
            trip costs.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {MOBILE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-teal" strokeWidth={2.2} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-3">
          <StorePanel
            label="App Store"
            platform="iPhone"
            href={APP_STORE_URL}
            status={APP_STORE_STATUS}
            icon="apple"
          />
          <StorePanel
            label="Google Play"
            platform="Android"
            href={PLAY_STORE_URL}
            status={PLAY_STORE_STATUS}
            icon="play"
          />
        </div>
      </div>
    </section>
  );
}

function StorePanel({
  label,
  platform,
  href,
  status,
  icon,
}: {
  label: string;
  platform: string;
  href: string | null;
  status: StoreStatus;
  icon: "apple" | "play";
}) {
  const live = isStoreLive(status, href);
  const statusLabel =
    status === "live"
      ? `${platform} available now`
      : status === "review"
        ? `${platform} in store review`
        : `${platform} coming soon`;
  const Icon = icon === "apple" ? Apple : Smartphone;
  const indicator = live ? CheckCircle2 : Clock3;
  const IndicatorIcon = indicator;
  const className =
    "flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-left transition-colors";

  const inner = (
    <>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white">
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <div>
          <div className="text-xs font-semibold uppercase text-gray-500">
            {live ? "Download on" : "Store status"}
          </div>
          <div className="text-base font-bold text-navy">{label}</div>
          <div className="text-xs text-gray-500">{statusLabel}</div>
        </div>
      </div>
      <IndicatorIcon className="h-5 w-5 text-teal" strokeWidth={2.2} />
    </>
  );

  if (live) {
    return (
      <a
        href={href ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} hover:border-teal/40 hover:bg-teal/5`}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className={`${className} opacity-95`} aria-disabled="true">
      {inner}
    </div>
  );
}
