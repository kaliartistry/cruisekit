import type { Metadata } from "next";
import Link from "next/link";
import {
  DollarSign,
  Heart,
  Wine,
  Wifi,
  UtensilsCrossed,
  MapPin,
  Shield,
  Anchor,
  Car,
  Check,
  X,
  CalendarCheck,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import { MATERIAL_PRICE_FACTS } from "@/lib/data/price-facts";

export const metadata: Metadata = {
  title: "Calculator Methodology",
  description:
    "How the True Cost Calculator works — where each number comes from, how often it's updated, and what it assumes. Plainly written, fully auditable.",
};

/**
 * Frozen review dates per data category. These are the actual dates the
 * underlying data files were last hand-verified — do NOT replace with
 * `new Date()`, because doing so makes the page look freshly verified every
 * day even when nobody touched the data. When you re-verify a category,
 * update the matching date below.
 *
 * Sources of truth:
 *   - cruise-line published rates → apps/web/lib/data/cruise-costs.ts
 *   - sailing prices → data/seed/sailings.json (per-record lastVerified)
 *   - industry averages → reviewed on the cadence noted under each category
 */
const REVIEW_DATES = {
  cruiseLinePublishedRates: "September 4, 2026",
  sailingPrices: "April 28, 2026",
  industryAverages: "March 28, 2026",
} as const;

type CategoryRow = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  source: string;
  frequency: string;
  verify: string;
};

const CATEGORIES: CategoryRow[] = [
  {
    key: "baseFare",
    label: "Base fare",
    icon: DollarSign,
    source:
      "You enter one traveler's advertised fare. We multiply it by the guest count before adding party-level costs. If you leave it blank, the clearly labeled per-person market estimate is used.",
    frequency: "Real-time — reflects whatever you paste in.",
    verify:
      "Cross-check the fare on the cruise line's booking flow or a marketplace like CruiseDirect before trusting any total.",
  },
  {
    key: "gratuities",
    label: "Gratuities",
    icon: Heart,
    source:
      "Cruise-line published daily rates with cabin, booking-date, payment-timing, age, and regional conditions kept separate. Suite rates apply when Suite is selected. Virgin's legacy/current cohorts are selected explicitly. MSC is labeled corroborated until its official page can be retrieved.",
    frequency: "Reviewed quarterly and any time a cruise line announces a rate change.",
    verify:
      "Search \"[cruise line] daily gratuity\" — every major line has a customer-service page listing the current rate.",
  },
  {
    key: "drinkPackage",
    label: "Drink package",
    icon: Wine,
    source:
      "Official package or bundle prices where a stable public rate exists. Dynamic prices require the traveler to enter the current quote. Princess Plus/Premier are modeled as full bundles and their included gratuity and Wi-Fi are not counted twice.",
    frequency: "High-volatility package facts are rechecked monthly; stable gratuity facts quarterly.",
    verify:
      "The cruise line's \"beverage package\" page shows the current list price. Sale pricing is common; the calculator intentionally does not chase it.",
  },
  {
    key: "wifi",
    label: "WiFi",
    icon: Wifi,
    source:
      "Cruise-line published pre-cruise and onboard rates when both are public. The calculator asks how many plans to budget and uses a traveler-entered quote when pricing varies by sailing. Unverified fixed amounts remain labeled as planning inputs.",
    frequency: "Official paired prices are reviewed monthly; other planning inputs quarterly.",
    verify:
      "Check the internet-plan page or cruise planner for your sailing, including the number of devices allowed at one time and the pre-purchase cutoff.",
  },
  {
    key: "specialtyDining",
    label: "Specialty dining",
    icon: UtensilsCrossed,
    source:
      "Industry-average cover charge for a single adult specialty dinner, weighted across the major lines' mid-tier venues (steakhouse, Italian, hibachi). Used as a per-meal estimate, not a package.",
    frequency: "Reviewed twice a year.",
    verify:
      "Specialty venue cover charges are listed on each cruise line's dining page.",
  },
  {
    key: "excursions",
    label: "Shore excursions",
    icon: MapPin,
    source:
      "Industry average for a single half-day shore excursion per port, per guest. This is a planning placeholder — your actual excursion price depends entirely on what you book.",
    frequency: "Reviewed annually.",
    verify:
      "For a real number, search your specific port on Viator or GetYourGuide and use the median listed price.",
  },
  {
    key: "travelInsurance",
    label: "Travel insurance",
    icon: Shield,
    source:
      "Industry average for a standard cruise-travel policy for a 7-night Caribbean itinerary, adult traveler, mid-range trip cost. Typically 5–7% of the non-refundable trip cost.",
    frequency: "Reviewed annually.",
    verify:
      "Squaremouth and InsureMyTrip both publish aggregate cruise-insurance pricing; the cruise line's own policy is usually the most expensive option.",
  },
  {
    key: "portFees",
    label: "Port fees & taxes",
    icon: Anchor,
    source:
      "Industry average for a 7-night Caribbean itinerary, per guest. Actual port fees are set by the cruise line at booking and vary meaningfully by region and itinerary.",
    frequency: "Reviewed twice a year.",
    verify:
      "Your booking confirmation lists exact port fees and taxes as a separate line item. Use that number once you have it.",
  },
  {
    key: "parking",
    label: "Port parking",
    icon: Car,
    source:
      "Industry average for on-port parking at major U.S. departure ports (Miami, Port Canaveral, Galveston, Seattle). Off-port lots are almost always cheaper.",
    frequency: "Reviewed annually.",
    verify:
      "Your departure port's authority website publishes current daily parking rates.",
  },
];

const ASSUMPTIONS = [
  "Two adult guests sharing a standard interior cabin.",
  "A typical 7-night Caribbean itinerary for any category tied to itinerary (port fees, excursions, insurance).",
  "The cabin gratuity tier follows the cabin selection; line-specific booking cohorts are kept separate.",
  "Mid-tier unlimited alcohol package, one per adult. Non-alcoholic packages cost less; premium tiers cost more.",
  "One WiFi plan by default. Increase the plan count only when multiple travelers need separate simultaneous access; some lines allow device switching on one plan.",
  "One specialty dinner per adult, per cruise.",
  "One half-day excursion per port, per guest.",
  "Standard cruise travel insurance — not \"cancel for any reason.\"",
  "Driving to the port and parking on-site (not flying, not using off-port lots).",
];

const NOT_INCLUDED = [
  "Air travel to and from your departure port",
  "Pre-cruise or post-cruise hotel nights",
  "Souvenirs, photos, and onboard shopping",
  "Casino, spa, and salon",
  "Tips to specific staff beyond the daily gratuity pool",
  "Rental cars and private transfers",
  "Passport or visa fees",
  "Childcare surcharges, specialty kids' programs",
];

export default function MethodologyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="How the True Cost Calculator works"
          subtitle="Every number in the calculator comes from somewhere specific. Here's each source, how often we update it, and how you can verify it yourself."
          pillar="plan"
        />

        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          {/* Thesis */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-navy mb-3">
              The short version
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Cruise lines advertise a base fare and then bill the rest of the
              trip in eight or nine separate line items. The calculator takes
              the fare you&rsquo;re quoted, adds each of those line items using
              cruise-line published rates where they exist and industry
              averages where they don&rsquo;t, and hands you a total you can
              actually budget around. We never mark numbers up, we never pad
              totals to make partner bookings look better, and we show you the
              source of every line.
            </p>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Looking for the broader CruiseKit reference trail? Start with the{" "}
              <Link
                href="/cruisekit-public-information"
                className="font-semibold text-teal-dark underline underline-offset-4"
              >
                public information hub
              </Link>
              , then use this page for calculator-specific methodology.
            </p>
          </section>

          {/* Last reviewed — frozen per-category dates */}
          <section className="mb-10">
            <div className="rounded-xl border border-teal/20 bg-teal/5 p-5">
              <div className="flex items-start gap-3">
                <CalendarCheck className="h-6 w-6 flex-shrink-0 text-teal" />
                <div>
                  <div className="text-sm font-semibold text-navy">
                    When each data source was last reviewed
                  </div>
                  <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                    The dates below are when the underlying data files were
                    last hand-verified against their sources. They do not roll
                    forward automatically — if a date here looks stale,
                    that&rsquo;s honest signal that a refresh is due.
                  </p>
                </div>
              </div>
              <dl className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Cruise-line published rates
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-navy">
                    {REVIEW_DATES.cruiseLinePublishedRates}
                  </dd>
                </div>
                <div className="rounded-lg bg-white p-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Sailing prices last checked
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-navy">
                    {REVIEW_DATES.sailingPrices}
                  </dd>
                </div>
                <div className="rounded-lg bg-white p-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Estimate methodology last reviewed
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-navy">
                    {REVIEW_DATES.industryAverages}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="mb-10" aria-labelledby="material-price-facts">
            <h2 id="material-price-facts" className="mb-3 text-2xl font-bold text-navy">
              Material price fact register
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-gray-600">
              These are the dated records currently used for the calculator&apos;s highest-impact prices. “Official” means the linked cruise-line source supports the value; “corroborated” is visibly lower confidence. Effective, retrieval, and recheck dates are never generated from today&apos;s date.
            </p>
            <div className="space-y-3">
              {MATERIAL_PRICE_FACTS.map((fact) => (
                <article key={fact.id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-navy">{fact.label}</h3>
                      <p className="mt-1 font-price text-lg font-bold text-teal-dark">
                        {fact.currency === "USD" ? "$" : "€"}{fact.amount.toFixed(fact.amount % 1 ? 2 : 0)}
                        <span className="ml-1 text-xs font-normal text-gray-500">/{fact.unit.replace("-", " ")}</span>
                      </p>
                    </div>
                    <span className={fact.status === "official" ? "rounded-full bg-teal/10 px-2.5 py-1 text-xs font-semibold text-teal-dark" : "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800"}>
                      {fact.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">{fact.conditions}</p>
                  {fact.calculation && <p className="mt-1 text-xs text-gray-500">Derived: {fact.calculation}</p>}
                  <p className="mt-2 text-[11px] text-gray-500">
                    Retrieved {fact.retrievedAt}{fact.effectiveOn ? ` · Effective ${fact.effectiveOn}` : ""} · Recheck by {fact.recheckBy}
                  </p>
                  <a className="mt-1 inline-flex text-xs font-semibold text-teal-dark underline underline-offset-2" href={fact.sourceUrl} rel="noopener noreferrer" target="_blank">
                    {fact.sourceTitle}
                  </a>
                </article>
              ))}
            </div>
          </section>

          {/* Where the numbers come from */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-navy mb-4">
              Where the numbers come from
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              The calculator has nine categories. For each one, here&rsquo;s
              the source, the update cadence, and where you can independently
              verify it.
            </p>

            <div className="space-y-5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.key}
                    className="rounded-xl border border-gray-200 bg-white p-5"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal/10">
                        <Icon className="h-4 w-4 text-teal" />
                      </span>
                      <h3 className="text-base font-semibold text-navy">
                        {cat.label}
                      </h3>
                    </div>
                    <dl className="space-y-2.5 text-sm">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          What we pulled
                        </dt>
                        <dd className="mt-1 text-gray-700 leading-relaxed">
                          {cat.source}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Update cadence
                        </dt>
                        <dd className="mt-1 text-gray-700 leading-relaxed">
                          {cat.frequency}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          How to verify
                        </dt>
                        <dd className="mt-1 text-gray-700 leading-relaxed">
                          {cat.verify}
                        </dd>
                      </div>
                    </dl>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Assumptions */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-navy mb-4">
              What the calculator assumes
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              The default numbers describe a typical mainstream cruise. If your
              trip differs meaningfully from these assumptions (solo traveler,
              suite, 14-night Europe, kids under 3), your real total will
              differ too.
            </p>
            <ul className="space-y-3">
              {ASSUMPTIONS.map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <Check className="h-5 w-5 flex-shrink-0 mt-0.5 text-teal" />
                  <span className="text-gray-700">{line}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* What's not included */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-navy mb-4">
              What&rsquo;s not included
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              The calculator is deliberately scoped to the costs the cruise
              line controls. These come out of your pocket too, but they
              don&rsquo;t belong in an apples-to-apples comparison between
              cruise lines.
            </p>
            <ul className="space-y-3">
              {NOT_INCLUDED.map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <X className="h-5 w-5 flex-shrink-0 mt-0.5 text-coral" />
                  <span className="text-gray-700">{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-gray-600 leading-relaxed">
              Two of these &mdash; pre-cruise hotels and medical evacuation
              &mdash; show up as &ldquo;often forgotten&rdquo; callouts on the
              results page because they&rsquo;re the two most commonly
              underbudgeted. They aren&rsquo;t rolled into the total.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-xl border border-teal/20 bg-teal/5 p-6">
            <h3 className="text-lg font-semibold text-navy mb-2">
              Spot an error? Email us.
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              If a cruise line has changed a rate and we haven&rsquo;t caught
              up, or an average looks wrong for your region, tell us. We fix
              it, update the &ldquo;last verified&rdquo; date, and credit the
              catch.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-dark"
            >
              Get in touch
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
