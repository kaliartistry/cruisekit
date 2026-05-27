import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import { CRUISE_LINE_COSTS } from "@/lib/data/cruise-costs";
import { CRUISE_LINES } from "@cruise/shared/constants";
import CalculatorWithParams from "./calculator-with-params";

export const metadata: Metadata = {
  title: "Cruise Cost Calculator: Estimate the Real Price of Your Cruise",
  description:
    "Use CruiseKit's free cruise cost calculator to estimate the real price of your cruise, including gratuities, drink packages, WiFi, excursions, port fees, and other common add-ons.",
  keywords: [
    "cruise cost calculator",
    "cruise budget calculator",
    "cruise vacation cost calculator",
    "cruise hidden fees calculator",
    "cruise gratuity calculator",
    "cruise drink package calculator",
  ],
};

const calculatorJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CruiseKit Cruise Cost Calculator",
  applicationCategory: "TravelApplication",
  operatingSystem: "All",
  url: "https://cruisekit.app/calculator",
  description:
    "Estimate the real cost of a cruise by adding common cruise expenses including gratuities, drink packages, WiFi, excursions, specialty dining, insurance, and port fees.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const lineCalculatorLinks = CRUISE_LINES.filter(
  (line) => CRUISE_LINE_COSTS[line.id]
).map((line) => ({
  href: `/calculator/${line.id}`,
  name: line.name.replace(" International", ""),
}));

export default function CalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd) }}
      />
      <Navbar />
      <main className="flex-1">
        <PageHeader
          pillar="plan"
          title="Cruise Cost Calculator"
          subtitle="Estimate the real price of your cruise before you book, including the add-ons that rarely fit in the advertised fare"
          breadcrumbs={[{ label: "Cruise Cost Calculator" }]}
        />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <CalculatorWithParams />
        </section>

        {/* Server-rendered SEO content */}
        <section className="border-t border-gray-200 bg-gray-50/60">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-navy">
              Estimate the Real Price, Not Just the Fare
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Cruise lines advertise base fares that often exclude mandatory
              and common trip costs: daily gratuities, taxes and port fees,
              drink packages, WiFi, specialty dining, excursions, parking,
              insurance, photos, and port spending. CruiseKit turns those
              separate line items into one planning estimate so you can compare
              the trip you will actually take.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-4 border border-gray-200">
                <p className="text-sm font-semibold text-navy">9 Cruise Lines</p>
                <p className="mt-1 text-xs text-gray-500">
                  Royal Caribbean, Carnival, Norwegian, Celebrity, Princess,
                  Holland America, MSC, Disney, and Virgin Voyages.
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 border border-gray-200">
                <p className="text-sm font-semibold text-navy">Published Cost Inputs</p>
                <p className="mt-1 text-xs text-gray-500">
                  Gratuities, drink packages, WiFi, dining, excursions,
                  insurance, and port fees are itemized.
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 border border-gray-200">
                <p className="text-sm font-semibold text-navy">Side-by-Side Compare</p>
                <p className="mt-1 text-xs text-gray-500">
                  Select two cruise lines to compare the same trip assumptions
                  without mixing up apples and oranges.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-bold text-navy">
                How the Cruise Cost Calculator Works
              </h3>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
                <li>
                  <span className="font-semibold text-navy">1. Enter the fare you found.</span>{" "}
                  Use the advertised cruise fare from the cruise line, travel
                  advisor, or booking platform you are already checking.
                </li>
                <li>
                  <span className="font-semibold text-navy">2. Add your real trip choices.</span>{" "}
                  Choose guests, nights, cabin type, drink habits, WiFi,
                  specialty dining, excursions, insurance, and other add-ons.
                </li>
                <li>
                  <span className="font-semibold text-navy">3. Compare the full estimate.</span>{" "}
                  See the fare plus common onboard and port costs before you
                  commit to a sailing.
                </li>
              </ol>
              <p className="mt-4 text-xs leading-relaxed text-gray-500">
                CruiseKit does not claim live booking availability or guaranteed
                final pricing. Treat the result as a planning estimate and
                confirm the final quote with the cruise line or booking partner.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-navy">
                Cruise Line Cost Calculators
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {lineCalculatorLinks.map((line) => (
                  <Link
                    key={line.href}
                    href={line.href}
                    className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-navy transition-all hover:border-teal/50 hover:text-teal hover:shadow-[var(--shadow-sm)]"
                  >
                    <span>{line.name} cost calculator</span>
                    <span aria-hidden="true" className="text-gray-300 group-hover:text-teal">
                      -&gt;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
