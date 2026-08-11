import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight } from "lucide-react";

/**
 * Teaser for the Drink Package Worth It guide on the home page.
 * Designer flagged this as the single most search-friendly, most
 * trust-building piece of content on the site — putting it on home
 * previews the editorial quality before a user commits to the calc.
 */
export default function HomeGuideTeaser() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 border-y border-gray-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:px-8 lg:py-16">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-teal" />
            <span className="text-xs font-semibold uppercase text-teal">
              Drink package math, without pressure
            </span>
          </div>

          <h2 className="mb-3 max-w-3xl text-2xl font-extrabold text-navy sm:text-3xl">
            See whether the drink package is paying off for your trip.
          </h2>
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-gray-600">
            CruiseKit can estimate break-even before you sail, then the app lets
            you log covered drinks as prepaid value used. It is a tracker, not a
            challenge to drink more.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-6">
            {[
              { stat: "$42.75", label: "Exact Spend entry" },
              { stat: "Covered", label: "Package value log" },
              { stat: "$0", label: "What we charge to track it" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="font-price text-lg font-bold text-navy">
                  {s.stat}
                </div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/cruise-drink-package-calculator"
              className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-navy/90"
            >
              Estimate break-even
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal"
            >
              Download the app
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="relative aspect-[1290/2796]">
            <Image
              src="/assets/app-screenshots/drink-package.png"
              alt="CruiseKit drink package setup showing a package selection, estimated amount paid, and start tracking action"
              fill
              sizes="280px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
