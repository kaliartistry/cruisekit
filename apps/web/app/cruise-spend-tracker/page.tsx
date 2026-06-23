import type { Metadata } from "next";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calculator,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import { StoreButtonRow } from "@/components/shared/store-buttons";

const PAGE_URL = "https://cruisekit.app/cruise-spend-tracker";

export const metadata: Metadata = {
  title: "Cruise Spend Tracker for Real Trip Costs",
  description:
    "Use CruiseKit to plan and track cruise spending across gratuities, drinks, WiFi, excursions, port days, and onboard extras without unsupported savings claims.",
  alternates: { canonical: "/cruise-spend-tracker" },
  keywords: [
    "cruise spend tracker",
    "cruise spending tracker",
    "cruise budget tracker",
    "track cruise expenses",
    "cruise cost planning app",
  ],
  openGraph: {
    title: "Cruise Spend Tracker for Real Trip Costs",
    description:
      "Plan and track the cruise costs that add up after the fare: gratuities, drinks, WiFi, excursions, port days, and onboard extras.",
    url: "/cruise-spend-tracker",
    images: [
      {
        url: "/assets/app-screenshots/myday-today.png",
        width: 1290,
        height: 2796,
        alt: "CruiseKit app screen for cruise day planning",
      },
    ],
  },
};

type SpendArea = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const SPEND_AREAS: SpendArea[] = [
  {
    title: "Before-you-sail costs",
    description:
      "Track fare context, taxes, gratuities, insurance, parking, flights, hotels, and other planning costs in one cruise-specific view.",
    icon: ClipboardList,
  },
  {
    title: "Onboard extras",
    description:
      "Keep drinks, WiFi, specialty dining, photos, spa visits, and shipboard purchases visible as part of the same trip picture.",
    icon: ReceiptText,
  },
  {
    title: "Port-day spending",
    description:
      "Plan for excursions, taxis, ferries, beach clubs, local food, tips, and souvenirs without losing them outside the cruise budget.",
    icon: CalendarDays,
  },
  {
    title: "Group context",
    description:
      "Use MyCrew-oriented planning to keep shared trip details easier to discuss without changing privacy-sensitive account data.",
    icon: Users,
  },
];

const TRACKING_STEPS = [
  "Start with the advertised fare, then add taxes, fees, gratuities, and common extras before treating the trip as affordable.",
  "Separate prepaid items from onboard spending so the total does not disappear across different receipts and apps.",
  "Give port days their own line items for transportation, excursions, food, tips, and emergency buffers.",
  "Revisit the estimate as plans change instead of waiting until the final onboard account statement.",
  "Verify final prices and onboard account details with the cruise line, booking platform, or official ship app.",
];

const BOUNDARIES = [
  "CruiseKit estimates and tracking views are planning help, not final booking quotes.",
  "CruiseKit does not replace the cruise line's official onboard account or payment records.",
  "CruiseKit does not promise savings or financial outcomes.",
  "Travelers should verify final prices, charges, and account balances with official sources.",
];

const RELATED_LINKS = [
  { href: "/calculator", label: "Use the True Cost Calculator" },
  { href: "/cruise-drink-package-calculator", label: "Check drink package math" },
  { href: "/methodology", label: "Read calculator methodology" },
  { href: "/myday", label: "Plan cruise days" },
  { href: "/groups", label: "Coordinate groups" },
  { href: "/app", label: "Download the app" },
];

const FAQS = [
  {
    question: "What is a cruise spend tracker?",
    answer:
      "A cruise spend tracker helps travelers keep the real trip cost visible across the cruise fare, taxes, gratuities, drinks, WiFi, excursions, port-day spending, transportation, and other extras that can be missed during planning.",
  },
  {
    question: "How is CruiseKit different from a generic budget app?",
    answer:
      "CruiseKit is organized around cruise planning jobs such as true-cost estimating, sea days, port days, onboard extras, and group trip context instead of generic monthly finance categories.",
  },
  {
    question: "Does CruiseKit replace my cruise line account?",
    answer:
      "No. CruiseKit is independent planning help. The cruise line's app, onboard account, booking platform, and official receipts remain the source of truth for final charges and sailing-specific information.",
  },
  {
    question: "Can CruiseKit tell me whether a drink package is worth it?",
    answer:
      "CruiseKit can support calculator-style planning for drink package tradeoffs, but travelers should verify current package rules, prices, and restrictions with the cruise line before buying.",
  },
];

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: "Cruise Spend Tracker for Real Trip Costs",
        description:
          "A CruiseKit authority page about tracking cruise spending across onboard extras, port days, gratuities, and true-cost planning.",
        isPartOf: {
          "@type": "WebSite",
          name: "CruiseKit",
          url: "https://cruisekit.app",
        },
        about: {
          "@type": "SoftwareApplication",
          name: "CruiseKit",
          applicationCategory: "TravelApplication",
          operatingSystem: "iOS, Android",
          url: "https://cruisekit.app",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://cruisekit.app",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Cruise Spend Tracker",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function CruiseSpendTrackerPage() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Cruise Spend Tracker"
          subtitle="Plan the cruise costs that happen beyond the fare, keep onboard and port-day spending visible, and use CruiseKit as a practical true-cost planning companion."
          pillar="plan"
          breadcrumbs={[{ label: "Cruise Spend Tracker" }]}
        />

        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-xs font-bold uppercase text-teal-dark">
                <DollarSign className="h-3.5 w-3.5" />
                True-cost planning
              </p>
              <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 lg:hidden">
                <Image
                  src="/assets/app-screenshots/myday-today.png"
                  alt="CruiseKit app screen showing cruise day planning context"
                  fill
                  sizes="100vw"
                  className="object-cover object-top"
                  loading="eager"
                  fetchPriority="high"
                  priority
                />
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy">
                The cruise fare is only the first line of the trip cost.
              </h2>
              <div className="mt-5 space-y-4 text-base leading-7 text-gray-700">
                <p>
                  Cruise spending often spreads across the booking site, the
                  cruise line app, onboard charges, port-day purchases, and
                  group plans. CruiseKit keeps those planning categories close
                  to the itinerary so travelers can see the trip more clearly.
                </p>
                <p>
                  The goal is not to promise a cheaper cruise. The goal is to
                  help cruisers notice the expenses that usually show up after
                  the headline fare.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {RELATED_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-bold text-navy transition-colors hover:border-teal hover:text-teal"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-xl bg-white">
                <Image
                  src="/assets/app-screenshots/myday-today.png"
                  alt="CruiseKit app screen showing cruise day planning context"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-top"
                  loading="eager"
                  fetchPriority="high"
                  priority
                />
              </div>
              <Calculator className="h-7 w-7 text-teal" />
              <h2 className="mt-4 text-xl font-bold text-navy">
                Track the trip, not just the fare
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">
                Start with a true-cost estimate, then keep updating it as you
                add excursions, packages, transportation, port plans, and
                onboard extras.
              </p>
              <div className="mt-5 rounded-xl bg-white p-4">
                <p className="text-xs font-bold uppercase text-gray-500">
                  Important boundary
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-navy">
                  CruiseKit supports planning. Official cruise line records
                  remain the source of truth for final charges.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Cruise spending categories worth tracking
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              These are the costs that tend to sit outside the clean booking
              total but still shape the real trip.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {SPEND_AREAS.map((area) => {
              const Icon = area.icon;
              return (
                <section
                  key={area.title}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <Icon className="h-6 w-6 text-teal" />
                  <h2 className="mt-4 text-lg font-bold text-navy">
                    {area.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {area.description}
                  </p>
                </section>
              );
            })}
          </div>
        </section>

        <section className="border-y border-gray-200 bg-seafoam/35">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-teal-dark">
                <ReceiptText className="h-4 w-4" />
                Practical workflow
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy">
                How to keep cruise spending visible
              </h2>
              <ul className="mt-5 space-y-3">
                {TRACKING_STEPS.map((step) => (
                  <li key={step} className="flex gap-3 text-sm leading-6 text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-teal-dark">
                <ShieldCheck className="h-4 w-4" />
                What CruiseKit is not
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy">
                Clear spend-tracking boundaries
              </h2>
              <ul className="mt-5 space-y-3">
                {BOUNDARIES.map((boundary) => (
                  <li key={boundary} className="flex gap-3 text-sm leading-6 text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                    <span>{boundary}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <Smartphone className="h-7 w-7 text-teal" />
            <h2 className="mt-4 text-xl font-bold text-navy">
              Bring the spend plan into the app
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Use CruiseKit to keep trip costs, cruise-day plans, port context,
              and group coordination close while you prepare for the sailing.
            </p>
            <div className="mt-6">
              <StoreButtonRow sourceSurface="other" variant="light" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy">
              Cruise spend tracker FAQ
            </h2>
            <div className="mt-5 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
              {FAQS.map((faq) => (
                <div key={faq.question} className="p-5 sm:p-6">
                  <h3 className="text-base font-bold text-navy">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
