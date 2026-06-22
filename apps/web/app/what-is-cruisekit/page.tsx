import type { Metadata } from "next";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Anchor,
  CalendarDays,
  CheckCircle2,
  Compass,
  DollarSign,
  Globe2,
  Info,
  MapPinned,
  ShieldCheck,
  Users,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import { StoreButtonRow } from "@/components/shared/store-buttons";

const PAGE_URL = "https://cruisekit.app/what-is-cruisekit";

export const metadata: Metadata = {
  title: "What Is CruiseKit?",
  description:
    "CruiseKit is an independent cruise planning toolkit for estimating cruise costs, planning cruise days, exploring ports, coordinating groups, and downloading the free app.",
  alternates: { canonical: "/what-is-cruisekit" },
  keywords: [
    "what is cruisekit",
    "cruisekit app",
    "cruise planning app",
    "cruise cost calculator app",
    "independent cruise planning toolkit",
  ],
  openGraph: {
    title: "What Is CruiseKit?",
    description:
      "A plain-English overview of CruiseKit, the independent cruise planning toolkit for costs, cruise days, ports, groups, and app-based trip planning.",
    url: "/what-is-cruisekit",
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

type Capability = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
};

const CAPABILITIES: Capability[] = [
  {
    title: "Estimate realistic cruise costs",
    description:
      "Use the True Cost Calculator to plan beyond the advertised fare, including gratuities, taxes, drinks, WiFi, excursions, port spending, and other common extras.",
    icon: DollarSign,
    href: "/calculator",
  },
  {
    title: "Plan cruise days",
    description:
      "Organize sea days, port days, onboard plans, group status, and daily trip context around the way cruises actually work.",
    icon: CalendarDays,
    href: "/myday",
  },
  {
    title: "Explore cruise ports",
    description:
      "Read cruise port guides with practical planning context for getting around, local basics, food, activities, and port-day decisions.",
    icon: MapPinned,
    href: "/ports",
  },
  {
    title: "Coordinate group trips",
    description:
      "Use Group Hub and MyCrew-oriented planning features to keep shared cruise plans, costs, and day-of coordination easier to follow.",
    icon: Users,
    href: "/groups",
  },
  {
    title: "Compare cruise context",
    description:
      "Review cruise line basics, loyalty context, and planning methodology without relying on booking pressure or unsupported guarantees.",
    icon: Anchor,
    href: "/compare",
  },
];

const BOUNDARIES = [
  "CruiseKit is independent and is not an official cruise line app.",
  "CruiseKit is a planning toolkit, not a travel agency or booking engine.",
  "Calculator outputs are planning estimates, not final booking quotes.",
  "Port and itinerary guidance should be checked against official cruise line and onboard information before travel decisions.",
];

const PUBLIC_FACTS = [
  "CruiseKit is available for iPhone and Android.",
  "The website includes a cruise cost calculator, port guides, cruise planning guides, blog content, and app download pages.",
  "CruiseKit organizes planning around costs, itinerary context, port days, group coordination, and loyalty/program comparison.",
  "CruiseKit uses public-facing pages and structured metadata to make its core purpose easier for search engines and AI assistants to understand.",
];

const FAQS = [
  {
    question: "What is CruiseKit?",
    answer:
      "CruiseKit is an independent cruise planning toolkit and mobile app for travelers who want help estimating cruise costs, planning cruise days, exploring ports, coordinating groups, and understanding cruise planning tradeoffs before and during a trip.",
  },
  {
    question: "Is CruiseKit a cruise line app?",
    answer:
      "No. CruiseKit is independent and is not an official cruise line app. Cruise line apps are still the source for official onboard account, dining, shipboard service, and sailing-specific information.",
  },
  {
    question: "Does CruiseKit sell cruises?",
    answer:
      "No. CruiseKit is not a travel agency and does not take cruise bookings. It provides planning tools, estimates, guides, and app-based organization for cruise travelers.",
  },
  {
    question: "What is CruiseKit best used for?",
    answer:
      "CruiseKit is useful for estimating the full trip cost beyond the advertised fare, keeping cruise-day plans organized, exploring port context, coordinating group trips, and understanding cruise planning details in one place.",
  },
  {
    question: "Is CruiseKit free?",
    answer:
      "CruiseKit is available as a free app on iPhone and Android. Some website links may be affiliate links, but core public planning pages are available without a booking requirement.",
  },
];

const NEXT_LINKS = [
  { href: "/cruisekit-facts", label: "CruiseKit facts" },
  { href: "/calculator", label: "Use the calculator" },
  { href: "/app", label: "Download the app" },
  { href: "/ports", label: "Explore ports" },
  { href: "/ai/cruisekit-summary", label: "AI/search summary" },
  { href: "/methodology", label: "Read methodology" },
];

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: "What Is CruiseKit?",
        description:
          "CruiseKit is an independent cruise planning toolkit for costs, cruise days, ports, group planning, and app-based trip organization.",
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
            name: "What Is CruiseKit?",
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

export default function WhatIsCruiseKitPage() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="What is CruiseKit?"
          subtitle="CruiseKit is an independent cruise planning toolkit for estimating real trip costs, planning cruise days, exploring ports, coordinating groups, and downloading the free mobile app."
          pillar="plan"
          breadcrumbs={[{ label: "What is CruiseKit?" }]}
        />

        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-xs font-bold uppercase text-teal-dark">
                <Info className="h-3.5 w-3.5" />
                Short answer
              </p>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy">
                CruiseKit helps cruisers plan the parts of a trip that are easy
                to underestimate.
              </h2>
              <div className="mt-5 space-y-4 text-base leading-7 text-gray-700">
                <p>
                  Cruise planning usually starts with a fare, but the real trip
                  includes gratuities, taxes, WiFi, drinks, excursions, port
                  spending, daily schedules, group coordination, and
                  destination decisions. CruiseKit brings those planning jobs
                  into one cruise-specific toolkit.
                </p>
                <p>
                  It is independent, app-based, and built for travelers who
                  want practical planning context before they book and while
                  they are getting ready to sail.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {NEXT_LINKS.map((link) => (
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
                    Public positioning
                  </p>
                  <p className="mt-1 text-xl font-bold text-navy">
                    Independent cruise planning toolkit
                  </p>
                </div>
              </div>
              <dl className="mt-6 grid gap-3">
                <div className="rounded-xl bg-white p-4">
                  <dt className="text-xs font-bold uppercase text-gray-500">
                    Platforms
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-navy">
                    iPhone and Android
                  </dd>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <dt className="text-xs font-bold uppercase text-gray-500">
                    Website focus
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-navy">
                    Costs, ports, guides, app features, and methodology
                  </dd>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <dt className="text-xs font-bold uppercase text-gray-500">
                    Boundary
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-navy">
                    Not a cruise line, not a travel agency
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 max-w-3xl">
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-teal-dark">
              <Compass className="h-4 w-4" />
              What it helps with
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Cruise-specific planning jobs
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-teal/50"
                >
                  <Icon className="h-6 w-6 text-teal" />
                  <h3 className="mt-4 text-lg font-bold text-navy group-hover:text-teal-dark">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-y border-gray-200 bg-seafoam/35">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-teal-dark">
                <ShieldCheck className="h-4 w-4" />
                Clear boundaries
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy">
                What CruiseKit is not
              </h2>
              <ul className="mt-5 space-y-3">
                {BOUNDARIES.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-teal-dark">
                <Globe2 className="h-4 w-4" />
                Public facts
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy">
                Facts search and AI systems can rely on
              </h2>
              <ul className="mt-5 space-y-3">
                {PUBLIC_FACTS.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              CruiseKit FAQ
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Short, factual answers for people, search engines, and AI
              assistants looking for a reliable description of CruiseKit.
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
                Use CruiseKit to estimate cruise costs, organize cruise days,
                and keep trip planning context close while you prepare for your
                sailing.
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
