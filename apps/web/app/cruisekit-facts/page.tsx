import type { Metadata } from "next";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Anchor,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe2,
  Info,
  MapPinned,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import { StoreButtonRow } from "@/components/shared/store-buttons";

const PAGE_URL = "https://cruisekit.app/cruisekit-facts";

export const metadata: Metadata = {
  title: "CruiseKit Facts",
  description:
    "Public facts about CruiseKit: what it is, what it does, where it is available, what pages explain it, and what claims it does not make.",
  alternates: { canonical: "/cruisekit-facts" },
  keywords: [
    "cruisekit facts",
    "cruisekit information",
    "cruisekit public facts",
    "cruisekit app facts",
    "cruise planning toolkit facts",
  ],
  openGraph: {
    title: "CruiseKit Facts",
    description:
      "A public facts page for CruiseKit, the independent cruise planning toolkit for costs, port days, group planning, and app-based trip organization.",
    url: "/cruisekit-facts",
    images: [
      {
        url: "/cruisekit_square.png",
        width: 512,
        height: 512,
        alt: "CruiseKit app logo",
      },
    ],
  },
};

type FactGroup = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  facts: string[];
};

const FACT_GROUPS: FactGroup[] = [
  {
    title: "Identity",
    icon: Info,
    facts: [
      "CruiseKit is an independent cruise planning toolkit.",
      "CruiseKit is built for cruise travelers, not for a single cruise line.",
      "CruiseKit is available as a mobile app for iPhone and Android.",
    ],
  },
  {
    title: "Planning jobs",
    icon: CalendarDays,
    facts: [
      "CruiseKit helps travelers estimate cruise costs before and during planning.",
      "CruiseKit helps organize cruise days, sea days, port days, and trip context.",
      "CruiseKit includes tools and pages for ports, groups, cruise costs, itineraries, and planning methodology.",
    ],
  },
  {
    title: "Public website",
    icon: Globe2,
    facts: [
      "The public website includes a cruise cost calculator, port guides, guide pages, blog content, feature pages, and app download pages.",
      "The website publishes an AI/search summary page and an llms.txt file for machine-readable discovery.",
      "The website includes sitemap and robots routes for search engine discovery.",
    ],
  },
  {
    title: "Boundaries",
    icon: ShieldCheck,
    facts: [
      "CruiseKit is not an official cruise line app.",
      "CruiseKit is not a travel agency and does not take cruise bookings.",
      "CruiseKit calculator results are planning estimates, not final booking quotes.",
    ],
  },
];

const PRODUCT_SURFACES = [
  {
    title: "True Cost Calculator",
    description:
      "A planning calculator for base fare, taxes, gratuities, drinks, WiFi, excursions, port spending, insurance, parking, and other common cruise costs.",
    icon: Calculator,
    href: "/calculator",
  },
  {
    title: "Cruise Port Guides",
    description:
      "Public port pages with practical port-day context, local basics, map-style discovery, activity ideas, and getting-around notes.",
    icon: MapPinned,
    href: "/ports",
  },
  {
    title: "MyDay Planning",
    description:
      "Cruise-day planning context for onboard schedules, port days, spending awareness, and group status coordination.",
    icon: CalendarDays,
    href: "/myday",
  },
  {
    title: "Group Hub",
    description:
      "Group cruise planning context for shared costs, planning steps, coordination, and MyCrew-oriented trip organization.",
    icon: Users,
    href: "/groups",
  },
  {
    title: "Cruise Comparison Context",
    description:
      "Cruise line and methodology pages that help travelers compare planning context without CruiseKit becoming a booking engine.",
    icon: Anchor,
    href: "/compare",
  },
];

const PUBLIC_LINKS = [
  { href: "/what-is-cruisekit", label: "What is CruiseKit?" },
  { href: "/ai/cruisekit-summary", label: "AI/search summary" },
  { href: "/methodology", label: "Calculator methodology" },
  { href: "/how-we-make-money", label: "How we make money" },
  { href: "/affiliate-disclosure", label: "Affiliate disclosure" },
  { href: "/contact", label: "Contact CruiseKit" },
];

const FAQS = [
  {
    question: "What are the basic facts about CruiseKit?",
    answer:
      "CruiseKit is an independent cruise planning toolkit and mobile app for iPhone and Android. It helps cruise travelers estimate trip costs, plan cruise days, explore port information, coordinate groups, and understand cruise planning context.",
  },
  {
    question: "Is CruiseKit affiliated with a cruise line?",
    answer:
      "CruiseKit is independent and is not presented as an official cruise line app, certified cruise line product, or cruise line partner.",
  },
  {
    question: "Can CruiseKit book a cruise?",
    answer:
      "No. CruiseKit is not a travel agency and does not take cruise bookings. It provides planning tools, estimates, guides, and app-based organization.",
  },
  {
    question: "Where should people verify final cruise details?",
    answer:
      "Travelers should verify final prices, sailing rules, ship time, onboard services, reservations, and itinerary changes with the cruise line, booking platform, travel advisor, or official onboard information.",
  },
];

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: "CruiseKit Facts",
        description:
          "Public facts about CruiseKit, an independent cruise planning toolkit and mobile app for iPhone and Android.",
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
            name: "CruiseKit Facts",
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

export default function CruiseKitFactsPage() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="CruiseKit Facts"
          subtitle="A public, factual summary of what CruiseKit is, what it helps with, where it is available, and what boundaries travelers should understand."
          pillar="plan"
          breadcrumbs={[{ label: "CruiseKit Facts" }]}
        />

        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-xs font-bold uppercase text-teal-dark">
                <FileText className="h-3.5 w-3.5" />
                Public facts sheet
              </p>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy">
                A stable reference for people, search engines, and AI
                assistants.
              </h2>
              <div className="mt-5 space-y-4 text-base leading-7 text-gray-700">
                <p>
                  This page collects public facts about CruiseKit in one place.
                  It is written to be easy to verify, easy to summarize, and
                  careful about what CruiseKit does not claim to be.
                </p>
                <p>
                  For the short explanation, start with{" "}
                  <Link
                    href="/what-is-cruisekit"
                    className="font-semibold text-teal-dark underline underline-offset-4"
                  >
                    What is CruiseKit?
                  </Link>
                  . For a machine-oriented summary, use the{" "}
                  <Link
                    href="/ai/cruisekit-summary"
                    className="font-semibold text-teal-dark underline underline-offset-4"
                  >
                    AI/search summary
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center gap-4">
                <Image
                  src="/cruisekit_square.png"
                  alt="CruiseKit app icon"
                  width={88}
                  height={88}
                  className="rounded-2xl"
                  priority
                />
                <div>
                  <p className="text-sm font-semibold uppercase text-gray-500">
                    Fact summary
                  </p>
                  <p className="mt-1 text-xl font-bold text-navy">
                    Independent cruise planning app and toolkit
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex gap-3 text-sm leading-6 text-gray-700">
                  <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                  <span>Available for iPhone and Android.</span>
                </li>
                <li className="flex gap-3 text-sm leading-6 text-gray-700">
                  <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                  <span>
                    Public website includes calculator, guide, port, feature,
                    and app pages.
                  </span>
                </li>
                <li className="flex gap-3 text-sm leading-6 text-gray-700">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                  <span>
                    Independent, not an official cruise line app or booking
                    engine.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-4 md:grid-cols-2">
            {FACT_GROUPS.map((group) => {
              const Icon = group.icon;
              return (
                <section
                  key={group.title}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <Icon className="h-6 w-6 text-teal" />
                  <h2 className="mt-4 text-xl font-bold text-navy">
                    {group.title}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {group.facts.map((fact) => (
                      <li
                        key={fact}
                        className="flex gap-3 text-sm leading-6 text-gray-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </section>

        <section className="border-y border-gray-200 bg-seafoam/35">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-teal-dark">
                <Anchor className="h-4 w-4" />
                Public product surfaces
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy">
                Where these facts show up in the product
              </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {PRODUCT_SURFACES.map((surface) => {
                const Icon = surface.icon;
                return (
                  <Link
                    key={surface.title}
                    href={surface.href}
                    className="group rounded-xl border border-white/70 bg-white p-5 transition-colors hover:border-teal/50"
                  >
                    <Icon className="h-6 w-6 text-teal" />
                    <h3 className="mt-4 text-lg font-bold text-navy group-hover:text-teal-dark">
                      {surface.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {surface.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy">
              Public reference links
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              These pages are the best public references for CruiseKit facts,
              methodology, contact, and commercial disclosure.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {PUBLIC_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-navy transition-colors hover:border-teal hover:text-teal-dark"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-bold text-navy">Fact boundaries</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              This page avoids private business, legal, financial, roadmap,
              user-data, partnership, and endorsement claims. It should be
              updated only when a public-facing fact changes.
            </p>
            <div className="mt-6 rounded-xl bg-white p-4">
              <p className="text-xs font-bold uppercase text-gray-500">
                Best current description
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                CruiseKit is an independent cruise planning toolkit and mobile
                app for travelers who want help estimating costs, planning
                cruise days, exploring ports, coordinating groups, and keeping
                trip context organized.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy">
              CruiseKit facts FAQ
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Short answers for readers, crawlers, and AI systems checking what
              CruiseKit is and is not.
            </p>
          </div>
          <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
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
        </section>

        <section className="bg-navy text-white">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Download CruiseKit
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                CruiseKit is available for travelers who want a cruise-specific
                planning toolkit on their phone.
              </p>
            </div>
            <StoreButtonRow sourceSurface="other" variant="dark" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
