"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  DollarSign,
  Map,
  Users,
  Wine,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { StoreButtonRow } from "@/components/shared/store-buttons";
import {
  trackAppLandingViewed,
  trackCalculatorCtaClicked,
} from "@/lib/analytics";

const BENEFITS = [
  {
    icon: CalendarDays,
    title: "MyDay first",
    body: "Save your sailing, see the countdown or current cruise day, and keep port times, all-aboard context, notes, and plans in one place.",
  },
  {
    icon: DollarSign,
    title: "Spend that stays honest",
    body: "Track trip spending by category with exact cents, then compare what is left against the budget you set.",
  },
  {
    icon: Wine,
    title: "Drink package value",
    body: "Log covered drinks to see prepaid package value used without turning the app into a pressure tool.",
  },
  {
    icon: Map,
    title: "Itinerary port maps",
    body: "Open the ports on your cruise, expand the map, and start port-day plans from practical points of interest.",
  },
  {
    icon: Users,
    title: "MyCrew invites",
    body: "Create a crew, share a code or QR link, and let people join before everyone is physically together.",
  },
  {
    icon: ShieldCheck,
    title: "Independent by design",
    body: "CruiseKit is not a booking engine, cruise line app, or upsell funnel. It is built around the cruise you already chose.",
  },
] as const;

const SCREENSHOTS = [
  {
    src: "/assets/app-screenshots/myday-home.png",
    title: "MyDay",
    body: "Today, countdown, ports, crew, and quick spend from the first screen.",
  },
  {
    src: "/assets/app-screenshots/add-cruise.png",
    title: "Add cruise",
    body: "Choose the cruise line, ship, month, and sailing to populate the trip.",
  },
  {
    src: "/assets/app-screenshots/drink-package.png",
    title: "Drink package",
    body: "Choose the package and actual amount paid, then track covered value without encouraging overdrinking.",
  },
  {
    src: "/assets/app-screenshots/itinerary-ports.png",
    title: "Your ports",
    body: "See the ports tied to the saved itinerary instead of browsing everything.",
  },
  {
    src: "/assets/app-screenshots/port-map.png",
    title: "Port maps",
    body: "Expanded itinerary maps with terminal and point-of-interest context.",
  },
  {
    src: "/assets/app-screenshots/port-guide.png",
    title: "Port guide",
    body: "Keep port-local time, ship-time verification, all-aboard context, basics, and planning notes together.",
  },
  {
    src: "/assets/app-screenshots/spend-exact.png",
    title: "Exact Spend",
    body: "Add amounts like $42.75 and keep category totals precise.",
  },
  {
    src: "/assets/app-screenshots/mycrew-invite.png",
    title: "MyCrew invite",
    body: "Share a code, QR, email, or system share link for remote crew setup.",
  },
] as const;

export default function AppLandingClient() {
  useEffect(() => {
    trackAppLandingViewed();
  }, []);

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-teal/20 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase text-teal-dark">
              <Smartphone className="h-3.5 w-3.5" />
              Free cruise companion app
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold text-navy sm:text-5xl">
              MyDay, Spend, ports, and crew for your cruise.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Save your cruise, set a budget, track prepaid drink package
              value, open itinerary-only port maps, and invite your crew before
              embarkation. No booking flow. No deals feed. No upsell-heavy
              planner.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-teal" />
                Free to use
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1">
                <CalendarDays className="h-3.5 w-3.5 text-teal" />
                Built for cruise days
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1">
                <Wine className="h-3.5 w-3.5 text-teal" />
                Drink package value
              </span>
            </div>
            <StoreButtonRow
              sourceSurface="app_page"
              variant="light"
              className="mt-8 max-w-2xl"
            />
            <Link
              href="/calculator"
              onClick={() => trackCalculatorCtaClicked("app_page")}
              className="mt-5 inline-flex items-center text-sm font-bold text-teal transition-colors hover:text-teal-dark"
            >
              Use the web calculator instead -&gt;
            </Link>
            <Link
              href="/cruisekit-public-information"
              className="ml-0 mt-3 block text-sm font-bold text-navy transition-colors hover:text-teal sm:ml-5 sm:mt-5 sm:inline-flex"
            >
              Read CruiseKit public information -&gt;
            </Link>
          </div>

          <div className="relative mx-auto grid w-full max-w-xl grid-cols-[0.86fr_1fr] items-end gap-4">
            <PhoneScreenshot
              src="/assets/app-screenshots/myday-home.png"
              alt="CruiseKit MyDay screen showing saved cruise day, ports, spend, and crew tools"
              priority
            />
            <div className="grid gap-4">
              <PhoneScreenshot
                src="/assets/app-screenshots/drink-package.png"
                alt="CruiseKit drink package setup showing a package selection, estimated amount paid, and start tracking action"
                priority
              />
              <div className="rounded-lg border border-teal/20 bg-teal/10 p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/cruisekit_square.png"
                    alt="CruiseKit app icon"
                    width={44}
                    height={44}
                    className="rounded-lg"
                    priority
                  />
                  <div>
                    <div className="text-sm font-extrabold text-navy">
                      CruiseKit
                    </div>
                    <div className="text-xs text-gray-600">
                      MyDay + Spend + Ports
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="spend" className="scroll-mt-28 bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal/10 text-teal">
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <h2 className="mt-4 text-lg font-bold text-navy">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold text-navy">
              Screenshots that match the real app flow.
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              These are current app screens, focused on the moments cruisers
              actually use onboard: the day view, covered package value, port
              maps, and joining a crew. Sailing dates and spending amounts are
              illustrative sample data.
            </p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SCREENSHOTS.map((screen) => (
              <article
                key={screen.title}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <div className="mx-auto max-w-[210px]">
                  <PhoneScreenshot src={screen.src} alt={`${screen.title} screen in CruiseKit`} />
                </div>
                <h3 className="mt-4 text-base font-extrabold text-navy">
                  {screen.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {screen.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PhoneScreenshot({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border-[6px] border-navy bg-navy shadow-xl">
      <div className="relative aspect-[1290/2796] bg-white">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 260px, 42vw"
          className="object-cover"
          loading={priority ? "eager" : "lazy"}
        />
      </div>
    </div>
  );
}
