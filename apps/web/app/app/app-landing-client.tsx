"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calculator,
  CalendarDays,
  Clock3,
  Map,
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
    icon: Calculator,
    title: "True cruise cost calculator",
    body: "Estimate drinks, Wi-Fi, gratuities, excursions, port spending, and other add-ons before the folio surprise.",
  },
  {
    icon: Clock3,
    title: "Ship time, port time, MyDay",
    body: "Keep the day straight when your phone, the ship, and the port are not all showing the same time.",
  },
  {
    icon: Map,
    title: "Port-day planning",
    body: "Browse ports, plan the day, and keep the all-aboard context close when cruise Wi-Fi is spotty.",
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
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-dark">
              <Smartphone className="h-3.5 w-3.5" />
              Free on iPhone and Android
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Know what your cruise really costs.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              CruiseKit helps you plan the parts that get confusing fast:
              hidden cruise costs, ship time, port time, MyDay, and port days.
              No booking required. No upsell-heavy planner.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-teal" />
                Free to use
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1">
                <CalendarDays className="h-3.5 w-3.5 text-teal" />
                Built for cruise days
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

          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-5 shadow-xl">
              <div className="rounded-[1.5rem] bg-navy p-5 text-white">
                <div className="flex items-center gap-3">
                  <Image
                    src="/cruisekit_square.png"
                    alt="CruiseKit app icon"
                    width={48}
                    height={48}
                    className="rounded-xl"
                    priority
                  />
                  <div>
                    <div className="text-lg font-extrabold">CruiseKit</div>
                    <div className="text-xs text-white/60">
                      Cruise-day planner
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  <div className="rounded-xl bg-white/10 p-4">
                    <div className="text-xs uppercase tracking-wider text-white/50">
                      Estimated true cost
                    </div>
                    <div className="mt-1 font-price text-3xl font-extrabold text-teal">
                      $3,842
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/10 p-4">
                      <div className="text-xs uppercase tracking-wider text-white/50">
                        Ship time
                      </div>
                      <div className="mt-1 font-price text-xl font-bold text-amber-400">
                        2:41
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4">
                      <div className="text-xs uppercase tracking-wider text-white/50">
                        Port time
                      </div>
                      <div className="mt-1 font-price text-xl font-bold text-teal">
                        1:41
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 text-teal">
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
    </>
  );
}
