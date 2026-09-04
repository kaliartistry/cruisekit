import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import CalculatorForm from "@/components/calculator/calculator-form";
import { LineWifiSummary } from "@/components/calculator/wifi-cost-guide";
import { CRUISE_LINE_COSTS } from "@/lib/data/cruise-costs";
import { PURCHASE_PRICE_PAIRS } from "@/lib/data/price-facts";
import { CRUISE_LINES } from "@cruise/shared/constants";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Only cruise lines with published cost data get a calculator page. */
const VALID_SLUGS = CRUISE_LINES.filter((cl) => CRUISE_LINE_COSTS[cl.id]).map(
  (cl) => cl.id
);

/** Lookup a cruise line record by slug, or return undefined. */
function getCruiseLine(slug: string) {
  return CRUISE_LINES.find((cl) => cl.id === slug);
}

type RelatedLink = {
  href: string;
  label: string;
};

type LineSeoOverride = {
  title: string;
  description: string;
  keywords: string[];
  pageTitle: string;
  pageSubtitle: string;
  relatedLinks: RelatedLink[];
};

const LINE_SEO_OVERRIDES: Partial<Record<string, LineSeoOverride>> = {
  carnival: {
    title: "Carnival Cruise Cost Calculator: Fare, WiFi, Tips & CHEERS",
    description:
      "Estimate a real Carnival total with $17/$19 gratuities, CHEERS at $83.94 before sailing or $89.94 onboard, WiFi, port fees, and excursions.",
    keywords: [
      "Carnival cruise cost calculator",
      "Carnival cruise cost",
      "Carnival WiFi cost",
      "Carnival cruise gratuities per day",
      "Carnival CHEERS drink package worth it",
      "Carnival drink package calculator",
      "cruise cost calculator",
    ],
    pageTitle: "Carnival Cruise Cost Calculator",
    pageSubtitle:
      "Enter the Carnival fare you found, then add gratuities, CHEERS, WiFi, excursions, port fees, and port spending before you book.",
    relatedLinks: [
      { href: "/blog/carnival-cruise-cost", label: "Carnival cost guide" },
      {
        href: "/blog/carnival-cheers-drink-package-worth-it",
        label: "Carnival CHEERS math",
      },
      {
        href: "/guides/drink-package-guide",
        label: "Drink package break-even guide",
      },
      { href: "/blog/hidden-cruise-costs", label: "Hidden cruise costs" },
    ],
  },
  msc: {
    title: "MSC Cruise Cost Calculator: Drinks, WiFi, Tips & Real Total",
    description:
      "Estimate the real MSC cruise cost with fare, gratuities, MSC drinks package prices, WiFi, excursions, port fees, and onboard extras.",
    keywords: [
      "MSC cruise cost calculator",
      "MSC cruise cost",
      "MSC drinks package prices",
      "MSC drink package cost",
      "MSC cruise WiFi cost",
      "cruise cost calculator",
    ],
    pageTitle: "MSC Cruise Cost Calculator",
    pageSubtitle:
      "Enter the MSC fare you found, then compare gratuities, drinks package prices, WiFi, excursions, port fees, and onboard extras.",
    relatedLinks: [
      { href: "/blog/msc-cruise-cost", label: "MSC cost guide" },
      {
        href: "/guides/drink-package-guide",
        label: "Drink package break-even guide",
      },
      { href: "/cruise-costs", label: "Cruise costs hub" },
      { href: "/blog/hidden-cruise-costs", label: "Hidden cruise costs" },
    ],
  },
  norwegian: {
    title: "Norwegian Cruise Cost Calculator: NCL Free at Sea, WiFi & Tips",
    description:
      "Estimate the real Norwegian cruise total with fare, daily service charges, NCL Free at Sea costs, WiFi upgrades, excursions, and extras.",
    keywords: [
      "Norwegian cruise cost calculator",
      "NCL cruise cost calculator",
      "NCL Free at Sea cost",
      "is NCL Free at Sea really free",
      "NCL WiFi cost",
      "Norwegian cruise WiFi cost",
      "cruise cost calculator",
    ],
    pageTitle: "Norwegian Cruise Cost Calculator",
    pageSubtitle:
      "Enter the Norwegian fare you found, then add daily service charges, Free at Sea costs, WiFi upgrades, excursions, and onboard extras.",
    relatedLinks: [
      {
        href: "/blog/norwegian-free-at-sea-explained",
        label: "NCL Free at Sea costs",
      },
      { href: "/blog/norwegian-cruise-cost", label: "Norwegian cost guide" },
      { href: "/blog/norwegian-vs-royal-caribbean", label: "NCL vs Royal" },
      { href: "/blog/hidden-cruise-costs", label: "Hidden cruise costs" },
    ],
  },
  disney: {
    title: "Disney Cruise Budget Calculator: WiFi, Tips, Family Costs",
    description:
      "Estimate a Disney cruise budget with fare, gratuities, WiFi, port fees, excursions, adult dining, family extras, and onboard spending.",
    keywords: [
      "Disney cruise budget",
      "Disney cruise cost calculator",
      "Disney cruise WiFi cost",
      "Disney cruise gratuity calculator",
      "Disney cruise cost",
      "family cruise cost calculator",
      "cruise cost calculator",
    ],
    pageTitle: "Disney Cruise Budget Calculator",
    pageSubtitle:
      "Enter the Disney fare you found, then add gratuities, WiFi, adult dining, excursions, port fees, and family extras before you book.",
    relatedLinks: [
      { href: "/blog/disney-cruise-cost", label: "Disney cruise budget guide" },
      {
        href: "/blog/disney-cruise-vs-royal-caribbean-families",
        label: "Disney vs Royal for families",
      },
      { href: "/cruise-costs", label: "Cruise costs hub" },
      { href: "/blog/hidden-cruise-costs", label: "Hidden cruise costs" },
    ],
  },
};

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
  const seoOverride = LINE_SEO_OVERRIDES[slug];

  if (slug === "royal-caribbean") {
    return {
      title: "Royal Caribbean Cruise Cost Calculator: Estimate Your Real Total",
      description:
        "Enter the Royal Caribbean fare you found and estimate the real total with gratuities, drink packages, WiFi, excursions, port fees, and common add-ons.",
      keywords: [
        "Royal Caribbean cruise cost calculator",
        "Royal Caribbean cruise cost",
        "Royal Caribbean hidden fees",
        "Royal Caribbean WiFi cost",
        "Royal Caribbean drink package cost",
        "Royal Caribbean drink package worth it",
        "Royal Caribbean gratuities",
        "Royal Caribbean gratuity calculator",
        "cruise cost calculator",
      ],
      openGraph: {
        title:
          "Royal Caribbean Cruise Cost Calculator: Estimate Your Real Total",
        description:
          "Estimate the real Royal Caribbean cruise total after gratuities, drink packages, WiFi, excursions, port fees, and common add-ons.",
        url: "https://cruisekit.app/calculator/royal-caribbean/",
        type: "website",
      },
      alternates: {
        canonical: "https://cruisekit.app/calculator/royal-caribbean/",
      },
    };
  }

  if (seoOverride) {
    return {
      title: seoOverride.title,
      description: seoOverride.description,
      keywords: seoOverride.keywords,
      openGraph: {
        title: seoOverride.title,
        description: seoOverride.description,
        url: `https://cruisekit.app/calculator/${slug}/`,
        type: "website",
      },
      alternates: {
        canonical: `https://cruisekit.app/calculator/${slug}/`,
      },
    };
  }

  return {
    title: `${displayName} Cruise Cost Calculator: Estimate Your Real Total`,
    description: `Calculate the estimated total cost of a ${displayName} cruise including gratuities, drink packages, WiFi, excursions, and hidden fees. Free calculator tool.`,
    keywords: [
      `${displayName} cruise cost`,
      `${displayName} hidden fees`,
      `${displayName} drink package cost`,
      "cruise cost calculator",
    ],
    openGraph: {
      title: `${displayName} Cruise Cost Calculator: Estimate Your Real Total`,
      description: `Estimate the real ${displayName} cruise total after gratuities, drink packages, WiFi, excursions, port fees, and common add-ons.`,
      url: `https://cruisekit.app/calculator/${slug}/`,
      type: "website",
    },
    alternates: {
      canonical: `https://cruisekit.app/calculator/${slug}/`,
    },
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
  const lineSpecificFaqs: { question: string; answer: string }[] = [];

  if (slug === "carnival") {
    lineSpecificFaqs.push(
      {
        question: "How much does Carnival WiFi cost?",
        answer:
          costs.wifiPackages.tiers.length > 0
            ? `Carnival WiFi starts with ${costs.wifiPackages.tiers[0].name} at $${costs.wifiPackages.tiers[0].pricePerDay.toFixed(2)} before sailing or $${costs.wifiPackages.tiers[0].onboardPricePerDay?.toFixed(2)} onboard. The other cruise-long plans are ${costs.wifiPackages.tiers.slice(1).map((tier) => `${tier.name} at $${tier.pricePerDay.toFixed(2)} pre-cruise or $${tier.onboardPricePerDay?.toFixed(2)} onboard`).join(" and ")}. Budget only the number of plans your group needs.`
            : "Carnival WiFi varies by sailing. Add the quoted internet package price to the calculator before comparing your full cruise budget.",
      },
      {
        question: "How much are Carnival cruise gratuities per day?",
        answer: `Carnival gratuities are $${costs.gratuityPerPersonPerDay.toFixed(2)} per person per day for standard cabins and $${costs.suiteGratuityPerPersonPerDay.toFixed(2)} per person per day for suites in the current CruiseKit planning data.`,
      },
      {
        question: "Is Carnival CHEERS worth it?",
        answer:
          "Carnival CHEERS is $83.94 per adult per day when bought before sailing and $89.94 onboard, both including the 20% service charge. Pre-purchasing saves two adults $84 over seven nights. Whether the package itself is worthwhile still depends on what both adults would otherwise buy.",
      },
      {
        question:
          "How much does a Carnival cruise really cost after add-ons?",
        answer:
          "Start with the fare and taxes, then add daily gratuities, CHEERS or pay-per-drink spending, WiFi, excursions, specialty dining, parking, insurance, and port cash. This calculator keeps those Carnival-specific assumptions in one estimate.",
      }
    );
  }

  if (slug === "msc") {
    lineSpecificFaqs.push(
      {
        question: "How much are MSC drinks package prices?",
        answer:
          costs.drinkPackages.tiers.length > 0
            ? `CruiseKit's MSC planning inputs include ${costs.drinkPackages.tiers.map((tier) => `${tier.name} at $${tier.pricePerDay.toFixed(2)} per person per day`).join(" and ")}. Yacht Club and regional fare rules can change what is included, so use this as a planning estimate.`
            : "MSC drink package pricing varies by market and sailing. Add the quoted package price to the calculator when you compare the real total.",
      },
      {
        question: "How much does the MSC drink package cost?",
        answer:
          costs.drinkPackages.tiers.length > 0
            ? `The main MSC drink package input in CruiseKit is ${costs.drinkPackages.tiers[0].name} at $${costs.drinkPackages.tiers[0].pricePerDay.toFixed(2)} per person per day. Compare that against how many drinks you expect to buy on ship and in port.`
            : "MSC drink package costs vary by sailing. Use the calculator's custom add-on fields if your booking quote shows a different package price.",
      },
      {
        question: "How much does MSC cruise WiFi cost?",
        answer:
          costs.wifiPackages.tiers.length > 0
            ? `MSC WiFi planning inputs include ${costs.wifiPackages.tiers.map((tier) => `${tier.name} at $${tier.pricePerDay.toFixed(2)} per day`).join(" and ")}. Yacht Club guests may have WiFi included, so check your fare type before adding it.`
            : "MSC WiFi varies by sailing and fare type. Add the quoted internet package price to the calculator before booking.",
      },
      {
        question: "How much does an MSC cruise really cost after add-ons?",
        answer:
          "A low MSC fare can stay cheap if you skip packages, but drinks, WiFi, excursions, gratuities, and specialty dining change the total quickly. Use this calculator to compare bare-bones, mid-range, and bundled MSC budgets.",
      }
    );
  }

  if (slug === "norwegian") {
    lineSpecificFaqs.push(
      {
        question: "How much does NCL WiFi cost?",
        answer:
          costs.wifiPackages.tiers.length > 0
            ? `Norwegian's Free at Sea WiFi input starts with ${costs.wifiPackages.tiers[0].description}. Unlimited options in CruiseKit include ${costs.wifiPackages.tiers.slice(1).map((tier) => `${tier.name} at $${tier.pricePerDay.toFixed(2)} per day`).join(" and ")}.`
            : "Norwegian WiFi varies by sailing. Add the quoted internet upgrade to the calculator if you need more than the included minutes.",
      },
      {
        question: "Is NCL Free at Sea really free?",
        answer:
          "No. Free at Sea can include valuable perks, but the costs are built into the fare and some perks still carry mandatory gratuities or upgrade charges. Treat it as a bundle to compare, not as a zero-cost add-on.",
      },
      {
        question: "What does Norwegian Free at Sea still cost?",
        answer:
          "The open bar perk commonly carries mandatory beverage gratuity, WiFi may require an unlimited upgrade, specialty dining can have service charges, and excursions still cost more than the credit. Add those pieces before comparing Norwegian against other lines.",
      },
      {
        question:
          "How much does a Norwegian cruise really cost after add-ons?",
        answer:
          "Start with the Norwegian fare, then add daily service charges, Free at Sea gratuities, Free at Sea Plus if you want it, WiFi upgrades, excursions, specialty dining beyond the perk, parking, insurance, and port spending.",
      }
    );
  }

  if (slug === "disney") {
    lineSpecificFaqs.push(
      {
        question: "How much does Disney cruise WiFi cost?",
        answer:
          costs.wifiPackages.tiers.length > 0
            ? `Disney WiFi planning inputs include ${costs.wifiPackages.tiers.map((tier) => `${tier.name} at $${tier.pricePerDay.toFixed(2)} per day`).join(", ")}. Multiply by the number of devices and nights your family needs.`
            : "Disney WiFi varies by sailing. Add the quoted package price to the calculator before comparing family budgets.",
      },
      {
        question: "How much are Disney cruise gratuities per day?",
        answer: `Disney gratuities are $${costs.gratuityPerPersonPerDay.toFixed(2)} per person per day for standard staterooms and $${costs.suiteGratuityPerPersonPerDay.toFixed(2)} per person per day for concierge or suite planning assumptions.`,
      },
      {
        question: "How much should I budget for a Disney cruise?",
        answer:
          "For a Disney family budget, start with the fare, taxes, and gratuities, then add WiFi by device, adult dining, excursions, photos, nursery time if needed, parking or flights, hotel nights, and port spending.",
      },
      {
        question:
          "How much does a Disney cruise really cost after add-ons?",
        answer:
          "Disney includes strong family entertainment and rotational dining, but the real total still depends on WiFi, adult dining, excursions, gratuities, photos, travel insurance, and transportation. This calculator lets you test the family total before booking.",
      }
    );
  }

  if (slug === "virgin-voyages") {
    lineSpecificFaqs.push(
      {
        question: "Should I prepay Virgin Voyages gratuities?",
        answer:
          "For bookings made on or after October 7, 2025, Virgin Voyages charges $20 per sailor per night when prepaid or $22 per sailor per night onboard. Prepaying saves two sailors $28 over seven nights. Eligible earlier bookings may still have gratuities included, so check the original confirmation.",
      },
      {
        question: "Are Virgin Voyages gratuities different for suites?",
        answer:
          "No. The current $20 prepaid and $22 onboard rates are based on payment timing, not cabin category. CruiseKit keeps the legacy included cohort separate from both current choices.",
      },
    );
  }

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
          {
            question: "How much does Royal Caribbean WiFi cost?",
            answer:
              "Royal Caribbean WiFi pricing varies by sailing. Enter the current per-plan daily quote shown in Cruise Planner instead of relying on a fixed public average, then choose how many plans your group actually needs.",
          },
          {
            question: "Is the Royal Caribbean drink package worth it?",
            answer:
              "It depends on the current quote for your sailing, daily drink plans, port days, and the all-adults-in-the-cabin rule. Royal Caribbean publishes that package pricing varies by sailing, so enter the all-in Cruise Planner quote rather than relying on a fixed public average.",
          },
          {
            question:
              "How much does a Royal Caribbean cruise really cost after add-ons?",
            answer:
              "The advertised fare is only the starting point. A realistic Royal Caribbean estimate should include taxes, port fees, daily gratuities, drink packages, WiFi, specialty dining, excursions, parking, insurance, and port spending. Use this page to add those line items around the fare you found.",
          },
          {
            question: "What should I budget for a Royal Caribbean cruise?",
            answer:
              "Start with the fare and taxes, then budget daily gratuities, internet, drinks, excursions, specialty dining, insurance, parking, hotel nights, and cash for port days. The calculator keeps those assumptions in one place so you can compare the real total before you book.",
          },
        ]
      : []),
    ...lineSpecificFaqs,
    {
      question:
        slug === "royal-caribbean"
          ? "How much are Royal Caribbean gratuities per day?"
          : `How much are daily gratuities on ${displayName}?`,
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
          ? costs.drinkPackages.tiers.some((tier) => tier.priceEntryRequired)
            ? `${displayName} prices one or more beverage packages dynamically by sailing. Choose the package and enter the current all-in per-person daily quote shown for your booking; CruiseKit will not turn a $0 placeholder into a fake public price. ${costs.drinkPackages.notes || ""}`
            : `${displayName} offers ${costs.drinkPackages.tiers.length} drink package tier${costs.drinkPackages.tiers.length > 1 ? "s" : ""}. ${costs.drinkPackages.tiers.map((t) => `The ${t.name} is $${t.pricePerDay.toFixed(2)}/day per person${t.onboardPricePerDay !== undefined ? ` before sailing or $${t.onboardPricePerDay.toFixed(2)}/day onboard` : ""}`).join(". ")}. ${costs.drinkPackages.notes || ""}`
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
  const seoOverride = LINE_SEO_OVERRIDES[slug];
  const costPlanningLinks = isRoyalCaribbean
    ? [
        { href: "/calculator", label: "Cruise cost calculator" },
        {
          href: "/guides/drink-package-guide",
          label: "Drink package break-even math",
        },
        {
          href: "/cruise-gratuity-calculator",
          label: "Cruise gratuity guide",
        },
        {
          href: "/blog/royal-caribbean-cruise-cost",
          label: "Royal Caribbean cost guide",
        },
        {
          href: "/blog/hidden-cruise-costs",
          label: "Hidden cruise costs",
        },
      ]
    : (seoOverride?.relatedLinks ?? []);

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
              : seoOverride?.pageTitle ||
                `What does a ${displayName} cruise REALLY cost?`
          }
          subtitle={
            isRoyalCaribbean
              ? "Enter the Royal Caribbean fare you found, then estimate gratuities, drink packages, WiFi, excursions, port fees, and other common add-ons."
              : seoOverride?.pageSubtitle ||
                `Use our free calculator to uncover every hidden fee on ${displayName} — gratuities, drink packages, WiFi, excursions, and more.`
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
                {slug === "virgin-voyages"
                  ? `$${PURCHASE_PRICE_PAIRS.virginGratuity.prePurchase.amount.toFixed(2)} / $${PURCHASE_PRICE_PAIRS.virginGratuity.onboard.amount.toFixed(2)}`
                  : `$${costs.gratuityPerPersonPerDay.toFixed(2)}`}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {slug === "virgin-voyages"
                  ? "prepaid / onboard per sailor nightly"
                  : "per person per day"}
                {slug !== "virgin-voyages" && costs.suiteGratuityPerPersonPerDay !==
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
                {slug === "carnival"
                  ? `$${PURCHASE_PRICE_PAIRS.carnivalCheers.prePurchase.amount.toFixed(2)} / $${PURCHASE_PRICE_PAIRS.carnivalCheers.onboard.amount.toFixed(2)}`
                  : costs.drinkPackages.tiers.length > 0
                  ? costs.drinkPackages.tiers[0].priceEntryRequired
                    ? "Your quote"
                    : `$${costs.drinkPackages.tiers[0].pricePerDay.toFixed(2)}`
                  : "N/A"}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {slug === "carnival"
                  ? "CHEERS before sailing / onboard"
                  : costs.drinkPackages.tiers.length > 0
                  ? costs.drinkPackages.tiers[0].priceEntryRequired
                    ? `${costs.drinkPackages.tiers[0].name} varies by sailing`
                    : `${costs.drinkPackages.tiers[0].name} /day${costs.drinkPackages.tiers[0].onboardPricePerDay !== undefined ? " before sailing" : ""}`
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

          {costPlanningLinks.length > 0 && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-bold tracking-tight text-navy">
                {isRoyalCaribbean
                  ? "Plan the Royal Caribbean add-ons people miss"
                  : `Plan the ${displayName} add-ons people search before booking`}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {isRoyalCaribbean
                  ? "Use these guides to pressure-test the biggest Royal Caribbean budget variables before you compare fares."
                  : "Use these mapped guides and calculators to compare the biggest budget variables before you commit to the fare."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {costPlanningLinks.map((link) => (
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

        <LineWifiSummary cruiseLineId={slug} displayName={displayName} />

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
