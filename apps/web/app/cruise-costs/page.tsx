import type { Metadata } from "next";
import Link from "next/link";
import {
  Anchor,
  Calculator,
  ChevronRight,
  DollarSign,
  MapPinned,
  Receipt,
  Shield,
  UtensilsCrossed,
  Wifi,
  Wine,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import { CRUISE_LINE_COSTS } from "@/lib/data/cruise-costs";
import { CRUISE_LINES } from "@cruise/shared/constants";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Cruise Costs Guide: Fare, Fees, Tips, Drinks, WiFi & Extras",
  description:
    "See how cruise pricing works and estimate the real total after fare, taxes, port fees, gratuities, drinks, WiFi, excursions, port spending, and extras.",
  keywords: [
    "cruise costs",
    "cruise expenses",
    "how does cruise pricing work",
    "are cruise prices per person or room",
    "cruise cost calculator",
    "hidden cruise costs",
    "cruise gratuities",
    "cruise drink package cost",
    "cruise wifi cost",
    "shore excursion cost",
    "cruise port fees",
  ],
  alternates: {
    canonical: "https://cruisekit.app/cruise-costs/",
  },
  openGraph: {
    title: "Cruise Costs Guide: Fare, Fees, Tips, Drinks, WiFi & Extras",
    description:
      "Estimate the real total after fare, taxes, port fees, gratuities, drinks, WiFi, excursions, port spending, and extras.",
    url: "https://cruisekit.app/cruise-costs/",
    type: "website",
  },
};

type HubLink = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const primaryLinks: HubLink[] = [
  {
    title: "Cruise Cost Calculator",
    description:
      "Enter the fare you found and estimate gratuities, drinks, WiFi, excursions, port fees, dining, insurance, and parking.",
    href: "/calculator",
    icon: Calculator,
  },
  {
    title: "How Much Does a Cruise Cost?",
    description:
      "Start with the plain-English breakdown of base fare, mandatory costs, optional extras, and realistic 2026 budgets.",
    href: "/blog/how-much-does-a-cruise-really-cost-2026",
    icon: DollarSign,
  },
  {
    title: "15 Hidden Cruise Costs",
    description:
      "Use this as the main hidden-fees checklist before booking, from automatic gratuities to onboard holds.",
    href: "/blog/hidden-cruise-costs",
    icon: Receipt,
  },
  {
    title: "Calculator Methodology",
    description:
      "See where CruiseKit's planning numbers come from, how often they are reviewed, and what is not included.",
    href: "/methodology",
    icon: Shield,
  },
];

const categoryLinks: HubLink[] = [
  {
    title: "Gratuities",
    description:
      "Daily service charges by line, who pays them, and how to budget them before final checkout.",
    href: "/cruise-gratuity-calculator",
    icon: Anchor,
  },
  {
    title: "Drink Packages",
    description:
      "Unlimited beverage package math, break-even points, and when buying drinks individually is cheaper.",
    href: "/guides/drink-package-guide",
    icon: Wine,
  },
  {
    title: "WiFi",
    description:
      "Typical ship internet prices, device assumptions, and why connection costs should be in the budget early.",
    href: "/blog/hidden-cruise-costs#4-wifi-154-to-560-for-the-week",
    icon: Wifi,
  },
  {
    title: "Shore Excursions",
    description:
      "Per-port excursion estimates and the trade-off between ship-sponsored and independent port tours.",
    href: "/blog/hidden-cruise-costs#5-shore-excursions-510-to-600-per-couple",
    icon: MapPinned,
  },
  {
    title: "Port Taxes & Fees",
    description:
      "The mandatory taxes and port charges that usually appear after the headline fare.",
    href: "/blog/hidden-cruise-costs#2-port-taxes-and-fees-280-to-308-added-at-checkout",
    icon: Receipt,
  },
  {
    title: "Specialty Dining",
    description:
      "Typical per-meal costs for steakhouse, Italian, hibachi, and premium dining venues at sea.",
    href: "/blog/hidden-cruise-costs#6-specialty-dining-30-to-70-per-person-per-meal",
    icon: UtensilsCrossed,
  },
];

const comparisonLinks = [
  {
    title: "Compare Cruise Lines",
    href: "/compare",
    description: "Compare major cruise lines across value, onboard style, and cost assumptions.",
  },
  {
    title: "Royal Caribbean vs Carnival Cost",
    href: "/blog/royal-caribbean-vs-carnival-cost-comparison",
    description: "See where the advertised fare gap shrinks once add-ons are included.",
  },
  {
    title: "Norwegian vs Royal Caribbean",
    href: "/blog/norwegian-vs-royal-caribbean",
    description: "Compare Free at Sea value against Royal Caribbean's a-la-carte add-ons.",
  },
  {
    title: "Carnival vs Royal Caribbean",
    href: "/blog/carnival-vs-royal-caribbean-comparison",
    description: "A broader value comparison for two of the most-searched mainstream lines.",
  },
];

const costFaqs = [
  {
    question: "Are cruise prices per person or room?",
    answer:
      "Cruise prices are usually shown per person based on double occupancy, not as the full room total. Taxes, port fees, gratuities, drinks, WiFi, excursions, insurance, parking, and port spending can be separate from the first fare you see.",
  },
  {
    question: "What cruise expenses should I budget for?",
    answer:
      "Budget for the fare, taxes and port fees, daily gratuities, drink packages or pay-per-drink spending, WiFi, shore excursions, specialty dining, spa or photos, parking, hotel nights, travel insurance, and cash for port days.",
  },
  {
    question: "How does cruise pricing work?",
    answer:
      "The advertised fare usually covers the cabin, transportation between ports, included dining, entertainment, pools, and basic ship activities. Cruise lines then add mandatory fees and optional onboard spending, which is why the real total can be much higher than the headline fare.",
  },
  {
    question: "Are cruise taxes and port fees included?",
    answer:
      "Taxes and port fees may not be included in the first price shown during cruise search. They usually appear before checkout, and they commonly add hundreds of dollars to a 7-night cruise for two people.",
  },
  {
    question: "What costs are not included in a cruise fare?",
    answer:
      "Common costs not included in a base fare are gratuities, drinks, WiFi, excursions, specialty dining, room service fees, casino spend, photos, spa treatments, transportation, parking, hotels, travel insurance, and port spending.",
  },
];

const lineCostSlugs = new Set([
  "royal-caribbean",
  "carnival",
  "norwegian",
  "msc",
  "celebrity",
  "princess",
  "holland-america",
  "disney",
  "virgin-voyages",
]);

const lineLinks = CRUISE_LINES.filter(
  (line) => lineCostSlugs.has(line.id) && CRUISE_LINE_COSTS[line.id]
).map((line) => ({
  id: line.id,
  name: line.name.replace(" International", ""),
  calculatorHref: `/calculator/${line.id}`,
  articleHref: `/blog/${line.id}-cruise-cost`,
}));

function CardLink({ item }: { item: HubLink }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group rounded-lg border border-gray-200 bg-white p-5",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-[var(--shadow-md)]"
      )}
    >
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 text-teal">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h2 className="text-base font-bold text-navy transition-colors group-hover:text-teal">
        {item.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        {item.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal">
        Open
        <ChevronRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

export default function CruiseCostsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          pillar="plan"
          title="Cruise Costs Guide"
          subtitle="See how cruise pricing works, what is not included in the fare, and which add-ons change the real price before you book."
          breadcrumbs={[{ label: "Cruise Costs" }]}
        />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {primaryLinks.map((item) => (
              <CardLink key={item.href} item={item} />
            ))}
          </div>
        </section>

        <section className="border-y border-gray-200 bg-gray-50/60">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-teal">
                Budget Categories
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                The add-ons that change the total
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                The cruise fare is only the starting point. These are the
                recurring cost categories that turn a cheap-looking sailing into
                the real vacation budget.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categoryLinks.map((item) => (
                <CardLink key={item.href} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-teal">
                Cruise Pricing FAQ
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                How cruise pricing works before add-ons
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                These are the broad cost questions this hub owns. For a
                personalized estimate, start with the calculator and then use
                the guides below for the specific add-ons you care about.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {costFaqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-lg border border-gray-200 bg-gray-50/60"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-sm font-bold text-navy [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-gray-300 transition-transform group-open:rotate-90"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="border-t border-gray-200 px-5 py-4 text-sm leading-relaxed text-gray-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                { href: "/calculator", label: "Calculate my cruise cost" },
                {
                  href: "/blog/how-much-does-a-cruise-really-cost-2026",
                  label: "Real cruise cost examples",
                },
                {
                  href: "/blog/hidden-cruise-costs",
                  label: "Hidden cruise fees",
                },
                {
                  href: "/cruise-gratuity-calculator",
                  label: "Gratuity guide",
                },
                {
                  href: "/guides/drink-package-guide",
                  label: "Drink package math",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-teal/25 bg-teal/5 px-3 py-1.5 text-xs font-semibold text-teal transition-colors hover:border-teal hover:bg-teal/10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-teal">
                Cruise Line Calculators
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                Estimate by cruise line
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                CruiseKit does not need live inventory to be useful. Enter the
                fare you found from a cruise line or booking partner, then use
                the line-specific calculator to estimate the full trip.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {lineLinks.map((line) => (
                  <Link
                    key={line.id}
                    href={line.calculatorHref}
                    className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-navy transition-all hover:border-teal/50 hover:text-teal hover:shadow-[var(--shadow-sm)]"
                  >
                    <span>{line.name} calculator</span>
                    <ChevronRight
                      className="h-4 w-4 text-gray-300 transition-colors group-hover:text-teal"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-coral">
                Planning Note
              </p>
              <h2 className="mt-2 text-xl font-bold text-navy">
                No scraping, no claimed live prices
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Some cruise lines, including Royal Caribbean, do not provide
                public inventory access to independent planning tools.
                CruiseKit launch planning uses reliable estimates from
                user-entered fares and published add-on costs instead of
                scraping consumer booking pages or claiming live cabin
                availability.
              </p>
              <Link
                href="/calculator/royal-caribbean"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
              >
                Royal Caribbean calculator
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-gray-50/60">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-teal">
                Line-by-Line Articles
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy">
                Cost guides by brand
              </h2>
              <div className="mt-6 space-y-3">
                {lineLinks.map((line) => (
                  <Link
                    key={line.articleHref}
                    href={line.articleHref}
                    className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-navy transition-all hover:border-teal/50 hover:text-teal hover:shadow-[var(--shadow-sm)]"
                  >
                    <span>{line.name} cruise cost guide</span>
                    <ChevronRight
                      className="h-4 w-4 text-gray-300 transition-colors group-hover:text-teal"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-teal">
                Comparisons
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy">
                Compare before booking
              </h2>
              <div className="mt-6 space-y-3">
                {comparisonLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group block rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-teal/50 hover:shadow-[var(--shadow-sm)]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-sm font-bold text-navy transition-colors group-hover:text-teal">
                        {item.title}
                      </h3>
                      <ChevronRight
                        className="h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-teal"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {item.description}
                    </p>
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
