import type { Metadata } from "next";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlarmClock,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  Info,
  MapPinned,
  ShieldAlert,
  ShipWheel,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import { StoreButtonRow } from "@/components/shared/store-buttons";

const PAGE_URL = "https://cruisekit.app/ship-time-vs-port-time/";

export const metadata: Metadata = {
  title: { absolute: "Ship Time vs Port Time: Which Clock Do You Obey?" },
  description:
    "Ship time is the clock your all-aboard time uses; port time is the local clock ashore. Here's which one to obey, and how to avoid being left behind.",
  alternates: { canonical: "/ship-time-vs-port-time/" },
  keywords: [
    "ship time vs port time",
    "what is ship time on a cruise",
    "cruise port time",
    "cruise ship time",
    "port day planning",
  ],
  openGraph: {
    title: "Ship Time vs Port Time: Which Clock Do You Obey?",
    description:
      "Ship time is the clock your all-aboard time uses; port time is the local clock ashore. Learn which one to obey before returning to the ship.",
    url: "/ship-time-vs-port-time/",
    images: [
      {
        url: "/assets/app-screenshots/mobile-feature-graphic.png",
        width: 1024,
        height: 500,
        alt: "CruiseKit mobile app showing MyDay and drink package tracking",
      },
    ],
  },
};

type Guidance = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const BASICS: Guidance[] = [
  {
    title: "What ship time means",
    description:
      "Ship time is the time the cruise ship uses for onboard schedules, departure warnings, activity times, and return-to-ship instructions.",
    icon: ShipWheel,
  },
  {
    title: "What port time means",
    description:
      "Port time is the local time at the destination. It may match ship time, but it can differ when the ship crosses time zones or keeps a consistent onboard clock.",
    icon: MapPinned,
  },
  {
    title: "All aboard time",
    description:
      "All aboard time is the time passengers must be back on the ship. Treat the official shipboard all aboard time as the source of truth.",
    icon: AlarmClock,
  },
];

const PLANNING_STEPS = [
  "Check the daily program, ship app, gangway sign, and crew announcements before leaving the ship.",
  "Set phone alarms using the time the ship tells passengers to follow, not a guess from the port time zone.",
  "If your phone changes time zones automatically, confirm it still matches ship time before relying on it.",
  "Build a buffer before all aboard time, especially if you are using taxis, ferries, independent tours, or beach clubs.",
  "If anything conflicts, follow the cruise line's official onboard instruction.",
];

const COMMON_MISTAKES = [
  "Assuming the port's local clock always matches the ship's clock.",
  "Trusting a phone that auto-changed time zones without checking ship time.",
  "Planning an independent excursion that returns too close to all aboard time.",
  "Reading a third-party tour time without confirming whether it is local time or ship time.",
];

const TIME_VISUALS = [
  {
    src: "/assets/ports/miami.jpg",
    alt: "Miami cruise port waterfront",
    title: "Port days happen on land",
    description:
      "Once you step off the ship, local signs, taxis, and tours may be running on port time. That is why the ship's instruction matters.",
  },
  {
    src: "/assets/app-screenshots/mobile-feature-graphic.png",
    alt: "CruiseKit mobile app showing MyDay and drink package tracking",
    title: "Keep the day context visible",
    description:
      "Use the app for saved plans and day structure, then check official onboard information and set phone alarms before committing to the timing.",
  },
  {
    src: "/assets/ports/cozumel.jpg",
    alt: "Cozumel cruise port waterfront",
    title: "Build in a buffer",
    description:
      "Independent exploring is easier when the return plan leaves room for traffic, tender lines, weather, and time-zone confusion.",
  },
];

const FAQS = [
  {
    question: "What is ship time on a cruise?",
    answer:
      "Ship time is the time the cruise ship uses for onboard schedules and passenger instructions. It may or may not match the local time in port, so passengers should confirm the official ship time before leaving the ship.",
  },
  {
    question: "Is ship time always the same as port time?",
    answer:
      "No. Ship time and port time can match, but they can also differ when the ship crosses time zones or chooses to keep one onboard time for the itinerary.",
  },
  {
    question: "Which time matters for getting back to the ship?",
    answer:
      "The official all aboard time announced by the cruise line matters most. Check the ship app, daily program, gangway signs, and crew announcements before leaving the ship.",
  },
  {
    question: "How can I avoid missing the ship because of a time-zone mistake?",
    answer:
      "Confirm ship time before leaving, turn off automatic time changes if needed, set alarms using ship time, and plan to return well before the official all aboard time.",
  },
];

const RELATED_LINKS = [
  { href: "/myday", label: "Plan cruise days" },
  { href: "/ports", label: "Explore port guides" },
  { href: "/guides/port-day-tips", label: "Read port-day tips" },
  { href: "/app", label: "Download CruiseKit" },
];

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${PAGE_URL}#article`,
        headline: "Ship Time vs Port Time: Which Clock Do You Obey?",
        description:
          "A practical cruise planning guide to ship time, port time, and all aboard time.",
        url: PAGE_URL,
        publisher: {
          "@type": "Organization",
          name: "CruiseKit",
          url: "https://cruisekit.app",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${PAGE_URL}#webpage`,
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
            name: "Ship Time vs Port Time",
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

export default function ShipTimeVsPortTimePage() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Ship Time vs Port Time"
          subtitle="Cruise ships and cruise ports do not always use the same clock. Here is how to plan port days without losing track of the time that matters."
          pillar="myday"
          breadcrumbs={[{ label: "Ship Time vs Port Time" }]}
        />

        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-xs font-bold uppercase text-teal-dark">
                <Clock3 className="h-3.5 w-3.5" />
                Port-day time check
              </p>
              <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl bg-white lg:hidden">
                <Image
                  src="/assets/ports/nassau.jpg"
                  alt="Nassau cruise port waterfront on a port day"
                  fill
                  sizes="100vw"
                  className="object-cover"
                  loading="eager"
                  fetchPriority="high"
                  priority
                />
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy">
                The one-sentence answer
              </h2>
              <div className="mt-5 space-y-4 text-base leading-7 text-gray-700">
                <p>
                  <strong className="text-navy">
                    Obey the time your ship identifies for all aboard.
                  </strong>{" "}
                  That is the only clock that controls when you must be back
                  onboard. Port time is the local clock ashore; sometimes it
                  matches the ship&apos;s instruction and sometimes it does not.
                </p>
                <p>
                  Before leaving the ship, confirm the official all aboard time
                  and the time standard the ship wants passengers to use. If a
                  phone, tour operator, or port clock disagrees, ask crew before
                  you rely on it.
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

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-xl bg-white">
                <Image
                  src="/assets/ports/nassau.jpg"
                  alt="Nassau cruise port waterfront on a port day"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  loading="eager"
                  fetchPriority="high"
                  priority
                />
              </div>
              <ShieldAlert className="h-7 w-7 text-amber-600" />
              <h2 className="mt-4 text-xl font-bold text-navy">
                What happens if you miss the ship
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">
                Cruise lines state that passengers exploring independently are
                responsible for returning on time and for the cost of rejoining
                the ship if they miss it. This guide is planning help; your
                cruise line, ship app, daily programme, gangway signs, and crew
                announcements are the source of truth for your sailing.
              </p>
              <div className="mt-5 rounded-xl bg-white p-4">
                <p className="text-xs font-bold uppercase text-gray-500">
                  Simple rule
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-navy">
                  Confirm ship time before leaving, set a return alarm, and aim
                  to be back onboard well before all aboard.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs leading-5 text-gray-600">
                <span>Official guidance checked September 4, 2026:</span>
                <a
                  href="https://www.ncl.com/faq/boarding-times"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-teal-dark underline decoration-teal/30 underline-offset-2 hover:text-teal"
                >
                  NCL shipboard-time guidance
                </a>
                <a
                  href="https://www.royalcaribbean.com/faq/questions/do-i-need-to-book-a-shore-excursion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-teal-dark underline decoration-teal/30 underline-offset-2 hover:text-teal"
                >
                  Royal Caribbean all-aboard guidance
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-4 md:grid-cols-3">
            {BASICS.map((item) => {
              const Icon = item.icon;
              return (
                <section
                  key={item.title}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <Icon className="h-6 w-6 text-teal" />
                  <h2 className="mt-4 text-xl font-bold text-navy">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </section>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              When ship time and port time differ
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              The risk is not that cruisers ignore the time. It is that there
              can be more than one clock in play. These are the moments where a
              little visual planning and a clear return buffer help.
            </p>
            <div className="mt-5 rounded-xl border border-teal/25 bg-seafoam/50 p-5 text-sm leading-6 text-gray-700">
              <strong className="text-navy">Cozumel example:</strong> Cozumel
              stays on UTC-5 year-round. If a Florida-based ship keeps Eastern
              Daylight Time (UTC-4), the ship&apos;s clock is one hour ahead of the
              local clock. Confirm the ship&apos;s actual instruction before using
              that offset.
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TIME_VISUALS.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className={
                      item.src.includes("mobile-feature-graphic")
                        ? "object-contain"
                        : "object-cover"
                    }
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-gray-200 bg-seafoam/35">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-teal-dark">
                <Compass className="h-4 w-4" />
                Port-day checklist
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy">
                How to plan around ship time
              </h2>
              <ul className="mt-5 space-y-3">
                {PLANNING_STEPS.map((step) => (
                  <li key={step} className="flex gap-3 text-sm leading-6 text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-teal-dark">
                <Info className="h-4 w-4" />
                Common mistakes
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy">
                Where time confusion usually happens
              </h2>
              <ul className="mt-5 space-y-3">
                {COMMON_MISTAKES.map((mistake) => (
                  <li key={mistake} className="flex gap-3 text-sm leading-6 text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <CalendarDays className="h-7 w-7 text-teal" />
              <h2 className="mt-4 text-xl font-bold text-navy">
                Where MyDay helps with both clocks
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              CruiseKit can help organize port-day context and saved plans, but
              official ship information should always be checked before final
              timing decisions.
            </p>
            <div className="mt-6">
              <StoreButtonRow sourceSurface="other" variant="light" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy">
              Ship time FAQ
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
