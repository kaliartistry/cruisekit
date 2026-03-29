import type { Metadata } from "next";
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

  return {
    title: `${name} True Cost Calculator — What Your Cruise Really Costs | CruiseKit`,
    description: `Calculate the real total cost of a ${name} cruise including gratuities, drink packages, WiFi, excursions, and hidden fees. Free calculator tool.`,
    keywords: [
      `${name} cruise cost`,
      `${name} hidden fees`,
      `${name} drink package cost`,
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

  const faqs: { question: string; answer: string }[] = [
    {
      question: `How much are daily gratuities on ${name}?`,
      answer: `${name} charges $${costs.gratuityPerPersonPerDay.toFixed(2)} per person per day for standard cabins${costs.suiteGratuityPerPersonPerDay !== costs.gratuityPerPersonPerDay ? ` and $${costs.suiteGratuityPerPersonPerDay.toFixed(2)} per person per day for suites` : ""}. These are automatically added to your onboard account.`,
    },
    {
      question: `What is included free on a ${name} cruise?`,
      answer: `${name} includes the following at no extra charge: ${costs.includedFree.join(", ")}.`,
    },
    {
      question: `How much does a drink package cost on ${name}?`,
      answer:
        costs.drinkPackages.tiers.length > 0
          ? `${name} offers ${costs.drinkPackages.tiers.length} drink package tier${costs.drinkPackages.tiers.length > 1 ? "s" : ""}. ${costs.drinkPackages.tiers.map((t) => `The ${t.name} is $${t.pricePerDay.toFixed(2)}/day per person`).join(". ")}. ${costs.drinkPackages.notes || ""}`
          : `${name} does not offer traditional unlimited drink packages. ${costs.drinkPackages.notes || ""}`,
    },
    {
      question: `What are the hidden fees on a ${name} cruise?`,
      answer: `Beyond the advertised fare, expect to pay for gratuities ($${costs.gratuityPerPersonPerDay.toFixed(2)}/day/person), port fees (~$${costs.portFeesPerPersonPerDay}/day/person), WiFi, specialty dining (avg $${costs.specialtyDining.averagePerMeal}/meal), shore excursions (avg $${costs.averageExcursionCostPerPort}/port), and optional extras like spa treatments (avg $${costs.spaAverageTreatment}).`,
    },
    {
      question: `Does ${name} charge a service charge on drinks?`,
      answer:
        costs.serviceChargePercent > 0
          ? `Yes, ${name} adds a ${costs.serviceChargePercent}% service charge to beverage purchases and drink packages.`
          : `${name} does not add a separate service charge on drinks. Gratuities are handled through the daily per-person charge.`,
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
  const faqs = buildFaqs(slug);

  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <Navbar />
      <main className="flex-1">
        {/* Hero / Page Header */}
        <PageHeader
          pillar="plan"
          title={`What does a ${name} cruise REALLY cost?`}
          subtitle={`Use our free calculator to uncover every hidden fee on ${name} — gratuities, drink packages, WiFi, excursions, and more.`}
          breadcrumbs={[
            { label: "True Cost Calculator", href: "/calculator" },
            { label: name },
          ]}
        />

        {/* Key Facts Section */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-navy">
            Key Cost Facts for {name}
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
              What&apos;s Included Free on {name}
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
        </section>

        {/* Calculator Form */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-navy">
            Calculate Your {name} Cruise Cost
          </h2>
          <p className="mb-8 text-gray-600">
            Your cruise line is pre-selected. Adjust trip details and add-ons
            below to see the true total cost.
          </p>
          <CalculatorForm defaultCruiseLineId={slug} />
        </section>

        {/* FAQ Section */}
        <section className="border-t border-gray-200 bg-gray-50/60">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-navy">
              Frequently Asked Questions About {name} Costs
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
