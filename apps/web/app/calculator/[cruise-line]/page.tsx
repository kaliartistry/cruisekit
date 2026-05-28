import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import CalculatorForm from "@/components/calculator/calculator-form";
import { CRUISE_LINE_COSTS } from "@/lib/data/cruise-costs";
import { CRUISE_LINES } from "@cruise/shared/constants";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** All valid cruise-line slugs derived from the shared CRUISE_LINES array. */
const VALID_SLUGS = CRUISE_LINES.map((cl) => cl.id);

/** Lookup a cruise line record by slug, or return undefined. */
function getCruiseLine(slug: string) {
  return CRUISE_LINES.find((cl) => cl.id === slug);
}

/* ------------------------------------------------------------------ */
/*  Static Generation                                                  */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ "cruise-line": slug }));
}

/** Only the slugs returned by generateStaticParams are valid. */
export const dynamicParams = false;

/* ------------------------------------------------------------------ */
/*  SEO Metadata                                                       */
/* ------------------------------------------------------------------ */

type Props = {
  params: Promise<{ "cruise-line": string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "cruise-line": slug } = await params;
  const line = getCruiseLine(slug);
  if (!line) return {};

  const name = line.name;
  const displayName = name.replace(" International", "");

  if (slug === "royal-caribbean") {
    return {
      title: "Royal Caribbean Cruise Cost Calculator — Estimate Your Real Total",
      description:
        "Enter the Royal Caribbean fare you found and estimate the real total with gratuities, drink packages, WiFi, excursions, port fees, and common add-ons.",
      keywords: [
        "Royal Caribbean cruise cost calculator",
        "Royal Caribbean cruise cost",
        "Royal Caribbean hidden fees",
        "Royal Caribbean drink package cost",
        "Royal Caribbean gratuities",
        "cruise cost calculator",
      ],
    };
  }

  return {
    title: `${displayName} Cruise Cost Calculator — Estimate Your Real Total`,
    description: `Calculate the estimated total cost of a ${displayName} cruise including gratuities, drink packages, WiFi, excursions, and hidden fees. Free calculator tool.`,
    keywords: [
      `${displayName} cruise cost`,
      `${displayName} hidden fees`,
      `${displayName} drink package cost`,
      "cruise cost calculator",
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  FAQ Data (per cruise line)                                         */
/* ------------------------------------------------------------------ */

function buildFaqs(slug: string) {
  const line = getCruiseLine(slug);
  const costs = CRUISE_LINE_COSTS[slug];
  if (!line || !costs) return [];

  const name = line.name;
  const displayName = name.replace(" International", "");

  const faqs: { question: string; answer: string }[] = [
    ...(slug === "royal-caribbean"
      ? [
          {
            question: "Can CruiseKit show live Royal Caribbean prices?",
            answer:
              "No. CruiseKit does not scrape Royal Caribbean consumer booking pages and does not claim real-time Royal Caribbean fare or cabin availability. Use the fare you found directly from Royal Caribbean, a travel advisor, or a booking platform, then use this calculator to estimate the full trip cost.",
          },
          {
            question: "How should I use this calculator for a Royal Caribbean quote?",
            answer:
              "Enter the Royal Caribbean fare you found, then add the guests, nights, cabin type, drink package choice, WiFi, specialty dining, excursions, insurance, and other trip extras you expect to buy. The result is a planning estimate, not a guaranteed booking quote.",
          },
        ]
      : []),
    {
      question: `How much are daily gratuities on ${displayName}?`,
      answer: `${displayName} charges $${costs.gratuityPerPersonPerDay.toFixed(2)} per person per day for standard cabins${costs.suiteGratuityPerPersonPerDay !== costs.gratuityPerPersonPerDay ? ` and $${costs.suiteGratuityPerPersonPerDay.toFixed(2)} per person per day for suites` : ""}. These are automatically added to your onboard account.`,
    },
    {
      question: `What is included free on a ${displayName} cruise?`,
      answer: `${displayName} includes the following at no extra charge: ${costs.includedFree.join(", ")}.`,
    },
    {
      question: `How much does a drink package cost on ${displayName}?`,
      answer:
        costs.drinkPackages.tiers.length > 0
          ? `${displayName} offers ${costs.drinkPackages.tiers.length} drink package tier${costs.drinkPackages.tiers.length > 1 ? "s" : ""}. ${costs.drinkPackages.tiers.map((t) => `The ${t.name} is $${t.pricePerDay.toFixed(2)}/day per person`).join(". ")}. ${costs.drinkPackages.notes || ""}`
          : `${displayName} does not offer traditional unlimited drink packages. ${costs.drinkPackages.notes || ""}`,
    },
    {
      question: `What are the hidden fees on a ${displayName} cruise?`,
      answer: `Beyond the advertised fare, expect to pay for gratuities ($${costs.gratuityPerPersonPerDay.toFixed(2)}/day/person), port fees (~$${costs.portFeesPerPersonPerDay}/day/person), WiFi, specialty dining (avg $${costs.specialtyDining.averagePerMeal}/meal), shore excursions (avg $${costs.averageExcursionCostPerPort}/port), and optional extras like spa treatments (avg $${costs.spaAverageTreatment}).`,
    },
    {
      question: `Does ${displayName} charge a service charge on drinks?`,
      answer:
        costs.serviceChargePercent > 0
          ? `Yes, ${displayName} adds ${costs.serviceChargePercent}% as a service charge to beverage purchases and drink packages.`
          : `${displayName} does not add a separate service charge on drinks. Gratuities are handled through the daily per-person charge.`,
    },
  ];

  return faqs;
}

/* ------------------------------------------------------------------ */
/*  JSON-LD Structured Data                                            */
/* ------------------------------------------------------------------ */

function FaqJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default async function CruiseLinePage({ params }: Props) {
  const { "cruise-line": slug } = await params;
  const line = getCruiseLine(slug);
  const costs = CRUISE_LINE_COSTS[slug];

  if (!line || !costs) notFound();

  const name = line.name;
  const displayName = name.replace(" International", "");
  const isRoyalCaribbean = slug === "royal-caribbean";
  const faqs = buildFaqs(slug);

  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Navbar />
      <main className="flex-1">
        {/* Hero / Page Header */}
        <PageHeader
          pillar="plan"
          title={
            isRoyalCaribbean
              ? "Royal Caribbean Cruise Cost Calculator"
              : `What does a ${displayName} cruise REALLY cost?`
          }
          subtitle={
            isRoyalCaribbean
              ? "Enter the Royal Caribbean fare you found, then estimate gratuities, drink packages, WiFi, excursions, port fees, and other common add-ons."
              : `Use our free calculator to uncover every hidden fee on ${displayName} — gratuities, drink packages, WiFi, excursions, and more.`
          }
          breadcrumbs={[
            { label: "Cruise Cost Calculator", href: "/calculator" },
            { label: displayName },
          ]}
        />

        {/* Key Facts Section */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-navy">
            Key Cost Facts for {displayName}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Gratuity Rate */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Daily Gratuity
              </p>
              <p className="mt-1 font-price text-2xl font-bold text-navy">
                ${costs.gratuityPerPersonPerDay.toFixed(2)}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                per person per day
                {costs.suiteGratuityPerPersonPerDay !==
                  costs.gratuityPerPersonPerDay &&
                  ` ($${costs.suiteGratuityPerPersonPerDay.toFixed(2)} for suites)`}
              </p>
            </div>

            {/* Service Charge */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Service Charge
              </p>
              <p className="mt-1 font-price text-2xl font-bold text-navy">
                {costs.serviceChargePercent > 0
                  ? `${costs.serviceChargePercent}%`
                  : "None"}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {costs.serviceChargePercent > 0
                  ? "on beverages & packages"
                  : "included in pricing"}
              </p>
            </div>

            {/* Included Free */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Included Free
              </p>
              <p className="mt-1 font-price text-2xl font-bold text-teal">
                {costs.includedFree.length} items
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {costs.includedFree.slice(0, 2).join(", ")}
                {costs.includedFree.length > 2 && " & more"}
              </p>
            </div>

            {/* Drink Package */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Drink Packages
              </p>
              <p className="mt-1 font-price text-2xl font-bold text-navy">
                {costs.drinkPackages.tiers.length > 0
                  ? `$${costs.drinkPackages.tiers[0].pricePerDay.toFixed(0)}`
                  : "N/A"}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {costs.drinkPackages.tiers.length > 0
                  ? `${costs.drinkPackages.tiers[0].name} /day`
                  : costs.drinkPackages.includedFree
                    ? "Included with booking"
                    : "No packages offered"}
              </p>
            </div>
          </div>

          {/* What's Included Free List */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-3 text-lg font-bold text-navy">
              What&apos;s Included Free on {displayName}
            </h3>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {costs.includedFree.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {isRoyalCaribbean && (
            <div className="mt-8 rounded-xl border border-teal/20 bg-teal/5 p-6">
              <h3 className="text-xl font-bold tracking-tight text-navy">
                The Legal Workaround for Royal Caribbean Pricing
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                Royal Caribbean live fares and cabin availability are difficult
                to access without direct commercial access, and CruiseKit does
                not scrape Royal Caribbean booking pages. This page is built for
                the practical path: you bring the fare you found, and CruiseKit
                estimates the full trip cost around it.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="text-sm font-semibold text-navy">
                    1. Find the fare
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    Use Royal Caribbean, a travel advisor, or a booking platform
                    to get the advertised cruise fare.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="text-sm font-semibold text-navy">
                    2. Enter it here
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    Add your nights, guests, cabin type, drink plans, WiFi,
                    dining, excursions, and insurance choices.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="text-sm font-semibold text-navy">
                    3. Compare the total
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    Use the estimate to compare Royal Caribbean against other
                    lines without pretending it is a live quote.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-gray-500">
                Want to audit the assumptions? Read the{" "}
                <Link
                  href="/methodology"
                  className="font-semibold text-teal hover:text-teal-dark"
                >
                  calculator methodology
                </Link>
                .
              </p>
            </div>
          )}
        </section>

        {/* Calculator Form */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-navy">
            Calculate Your {displayName} Cruise Cost
          </h2>
          <p className="mb-8 text-gray-600">
            {isRoyalCaribbean
              ? "Royal Caribbean is pre-selected. Enter the fare you found, then adjust trip details and add-ons to estimate the real total."
              : "Your cruise line is pre-selected. Adjust trip details and add-ons below to see the true total cost."}
          </p>
          <CalculatorForm defaultCruiseLineId={slug} />
        </section>

        {/* FAQ Section */}
        <section className="border-t border-gray-200 bg-gray-50/60">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-navy">
              Frequently Asked Questions About {displayName} Costs
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-gray-200 bg-white"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-navy [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <svg
                      className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4 text-sm leading-relaxed text-gray-600">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
