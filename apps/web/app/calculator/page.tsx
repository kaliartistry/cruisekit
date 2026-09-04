import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import CalculatorSwitcher from "@/components/calculator/calculator-switcher";
import { CRUISE_LINE_COSTS } from "@/lib/data/cruise-costs";
import { CRUISE_LINES } from "@cruise/shared/constants";
import CalculatorWithParams from "./calculator-with-params";

export const metadata: Metadata = {
  title:
    "Free Cruise Cost Calculator: Estimate Fare, Fees, Drinks, WiFi & Excursions",
  description:
    "Use CruiseKit's free cruise cost calculator to estimate the real total beyond the advertised fare, including gratuities, taxes, drinks, WiFi, excursions, port spending, parking, insurance, and onboard extras.",
  keywords: [
    "cruise cost calculator",
    "cruise budget calculator",
    "cruise vacation cost calculator",
    "cruise hidden fees calculator",
    "cruise gratuity calculator",
    "cruise drink package calculator",
  ],
  openGraph: {
    title:
      "Free Cruise Cost Calculator: Estimate Fare, Fees, Drinks, WiFi & Excursions",
    description:
      "Estimate the real total before you book: fare, taxes, gratuities, drinks, WiFi, excursions, port spending, insurance, and onboard extras.",
    url: "https://cruisekit.app/calculator",
    type: "website",
  },
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
          subtitle="Cruise fares leave out gratuities, taxes, drinks, WiFi, excursions, port spending, parking, insurance, and onboard extras. CruiseKit adds it up before you commit."
          breadcrumbs={[{ label: "Cruise Cost Calculator" }]}
        />
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <CalculatorSwitcher active="total-cost" />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
              <Link
                href="/cruise-costs"
                className="mt-4 inline-flex items-center text-sm font-semibold text-teal transition-colors hover:text-teal-dark"
              >
                Browse the full cruise costs hub -&gt;
              </Link>
            </div>

            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-bold text-navy">
                Cruise Cost Calculator Questions
              </h3>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-navy">
                    What does a cruise cost calculator include?
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    A useful cruise cost calculator includes the advertised
                    fare, taxes and port fees, daily gratuities, drink packages,
                    WiFi, specialty dining, excursions, port spending, parking,
                    insurance, and other onboard extras. CruiseKit keeps those
                    line items visible so the estimate reflects the trip you
                    actually plan to take.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy">
                    How do I estimate the true total cruise cost?
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Start with the fare you found, then add the mandatory costs
                    you cannot skip and the optional add-ons you are likely to
                    buy. If you are still deciding, use the default fare
                    estimates and adjust the choices until the total matches
                    your travel style.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy">
                    Are taxes, port fees, and gratuities included in cruise prices?
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Taxes and port fees are usually added during checkout, and
                    gratuities are commonly charged daily to your onboard
                    account or prepaid before sailing. That is why the
                    advertised fare can be much lower than the real cruise
                    total.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy">
                    How much spending money should I budget for a cruise?
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Budget beyond the ship: cash tips, taxis, independent food
                    and drinks, local purchases, and emergency buffer money can
                    matter as much as onboard extras. The port-day guide covers
                    the cash and excursion side of the estimate.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy">
                    Can I estimate drinks, WiFi, excursions, and port spending?
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Yes. CruiseKit includes drink packages, WiFi tiers,
                    specialty dining, excursions by port, parking, insurance,
                    and manual fare inputs so you can compare the base fare
                    against a realistic total.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-5">
                <Link
                  href="/guides/drink-package-guide"
                  className="rounded-full border border-teal/25 bg-teal/5 px-3 py-1.5 text-xs font-semibold text-teal transition-colors hover:border-teal hover:bg-teal/10"
                >
                  Drink package break-even math
                </Link>
                <Link
                  href="/cruise-gratuity-calculator"
                  className="rounded-full border border-teal/25 bg-teal/5 px-3 py-1.5 text-xs font-semibold text-teal transition-colors hover:border-teal hover:bg-teal/10"
                >
                  Cruise gratuities
                </Link>
                <Link
                  href="/guides/port-day-tips"
                  className="rounded-full border border-teal/25 bg-teal/5 px-3 py-1.5 text-xs font-semibold text-teal transition-colors hover:border-teal hover:bg-teal/10"
                >
                  Port spending and cash
                </Link>
                <Link
                  href="/blog/hidden-cruise-costs"
                  className="rounded-full border border-teal/25 bg-teal/5 px-3 py-1.5 text-xs font-semibold text-teal transition-colors hover:border-teal hover:bg-teal/10"
                >
                  Hidden cruise costs
                </Link>
                <Link
                  href="/cruise-costs"
                  className="rounded-full border border-teal/25 bg-teal/5 px-3 py-1.5 text-xs font-semibold text-teal transition-colors hover:border-teal hover:bg-teal/10"
                >
                  Cruise costs hub
                </Link>
              </div>
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
