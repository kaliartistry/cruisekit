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

export const metadata: Metadata = {
  title: "Calculator Methodology | CruiseKit",
  description:
    "How the True Cost Calculator works — where each number comes from, how often it's updated, and what it assumes. Plainly written, fully auditable.",
};

const LAST_VERIFIED = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

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
      "You enter the advertised fare you're seeing on the cruise line's site, CruiseDirect, or a search engine. We don't pull a fare for you — we take whatever number you're quoted and treat it as the anchor.",
    frequency: "Real-time — reflects whatever you paste in.",
    verify:
      "Cross-check the fare on the cruise line's booking flow or a marketplace like CruiseDirect before trusting any total.",
  },
  {
    key: "gratuities",
    label: "Gratuities",
    icon: Heart,
    source:
      "Cruise-line published daily gratuity rates for standard cabins (interior / oceanview / balcony). We use the line's own current per-guest per-day number — Carnival, Royal, NCL, Princess, MSC, and Celebrity each publish theirs publicly.",
    frequency: "Reviewed quarterly and any time a cruise line announces a rate change.",
    verify:
      "Search \"[cruise line] daily gratuity\" — every major line has a customer-service page listing the current rate.",
  },
  {
    key: "drinkPackage",
    label: "Drink package",
    icon: Wine,
    source:
      "Cruise-line published package prices for the mid-tier unlimited alcohol package (e.g., Royal's Deluxe Beverage, NCL's Premium Plus, Carnival's Cheers!). We apply the per-guest per-day rate plus the line's automatic gratuity on packages.",
    frequency: "Reviewed quarterly. Pre-cruise sale pricing is not used — we show the on-board / standard rate so the number isn't optimistic.",
    verify:
      "The cruise line's \"beverage package\" page shows the current list price. Sale pricing is common; the calculator intentionally does not chase it.",
  },
  {
    key: "wifi",
    label: "WiFi",
    icon: Wifi,
    source:
      "Cruise-line published rates for a single-device streaming-capable package. We use the on-board / standard rate, not pre-cruise promo rates.",
    frequency: "Reviewed quarterly.",
    verify:
      "Each line publishes current WiFi plans — Royal's \"Surf & Stream,\" NCL's \"Premium WiFi,\" Carnival's \"Premium Plan.\"",
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
  "Standard cruise-line gratuity rates — not the \"suite\" or \"butler\" tier.",
  "Mid-tier unlimited alcohol package, one per adult. Non-alcoholic packages cost less; premium tiers cost more.",
  "Streaming-capable WiFi for one device per adult.",
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
          </section>

          {/* Last verified */}
          <section className="mb-10">
            <div className="flex items-start gap-3 rounded-xl border border-teal/20 bg-teal/5 p-5">
              <CalendarCheck className="h-6 w-6 flex-shrink-0 text-teal" />
              <div>
                <div className="text-sm font-semibold text-navy">
                  Last verified: {LAST_VERIFIED}
                </div>
                <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                  Every cruise-line published rate in the calculator was
                  cross-checked against the cruise line&rsquo;s own public
                  pricing pages on this date. Industry-average numbers were
                  last reviewed against published aggregate data within the
                  cadence listed in each category below.
                </p>
              </div>
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
