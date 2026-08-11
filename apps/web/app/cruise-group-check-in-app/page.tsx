import type { Metadata } from "next";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  MapPinned,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import { StoreButtonRow } from "@/components/shared/store-buttons";

const PAGE_URL = "https://cruisekit.app/cruise-group-check-in-app";

export const metadata: Metadata = {
  title: "Cruise Group Check-In App for MyCrew Coordination",
  description:
    "How CruiseKit helps cruise groups coordinate simple MyCrew status check-ins, cruise-day plans, port-day timing, and shared trip context.",
  alternates: { canonical: "/cruise-group-check-in-app" },
  keywords: [
    "cruise group check in app",
    "cruise group coordination app",
    "MyCrew check-ins",
    "cruise group planning",
    "cruise trip coordination",
  ],
  openGraph: {
    title: "Cruise Group Check-In App for MyCrew Coordination",
    description:
      "A practical CruiseKit guide to group cruise check-ins, MyCrew status updates, and day-of cruise coordination.",
    url: "/cruise-group-check-in-app",
    images: [
      {
        url: "/assets/app-screenshots/mobile-feature-graphic.png",
        width: 1024,
        height: 500,
        alt: "CruiseKit mobile app showing MyDay, crew check-in, and drink package tracking",
      },
    ],
  },
};

type Feature = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const CHECK_IN_JOBS: Feature[] = [
  {
    title: "Simple status updates",
    description:
      "MyCrew check-ins are built for quick signals like on ship, at dinner, heading back, or meeting soon, so the group can understand the day without a long message thread.",
    icon: ClipboardCheck,
  },
  {
    title: "Cruise-day context",
    description:
      "Status updates sit beside device time, port-local time, ship-time verification, daily plans, and itinerary context instead of living in a generic notes app.",
    icon: CalendarDays,
  },
  {
    title: "Port-day coordination",
    description:
      "Groups can keep return plans, meetup timing, and port-day movement easier to scan while still verifying official ship instructions before final decisions.",
    icon: MapPinned,
  },
];

const GOOD_FIT = [
  "Families or friend groups that split up during sea days and want lightweight status context.",
  "Groups planning port days where some people shop, tour, eat, or return to the ship at different times.",
  "Cabins that want shared cruise-day awareness without turning every update into a group chat.",
  "Travelers who want cruise-specific timing and itinerary context next to group coordination.",
];

const BOUNDARIES = [
  "CruiseKit is independent and is not an official cruise line app.",
  "MyCrew check-ins are planning context, not emergency monitoring or ship security tools.",
  "CruiseKit should not replace official ship announcements, onboard staff, or cruise line instructions.",
  "CruiseKit does not need to be a full social network for the group to stay organized.",
];

const FLOW = [
  {
    title: "Save the cruise context",
    description:
      "Keep the sailing itinerary and the cruise-day details your group needs close in MyDay.",
    href: "/myday",
  },
  {
    title: "Open MyCrew under More",
    description:
      "Use manual Crew check-in updates while MyDay keeps the itinerary, schedule, and time context nearby and Spend holds purchases.",
    href: "/app",
  },
  {
    title: "Verify official details",
    description:
      "Before leaving the ship or changing plans, confirm all-aboard times and sailing-specific information with official onboard sources.",
    href: "/ship-time-vs-port-time",
  },
];

const SCREENSHOTS = [
  {
    src: "/assets/app-screenshots/mycrew-invite.png",
    alt: "CruiseKit MyCrew invite sheet showing a QR code, join code, copy, email, and share actions",
    title: "Invite MyCrew remotely",
    description:
      "Share a code, QR link, email, or text so everyone joins from their own phone before the trip.",
  },
  {
    src: "/assets/app-screenshots/myday-home.png",
    alt: "CruiseKit MyDay Today screen showing device time, port-local time, and daily plans",
    title: "Day context",
    description:
      "Group updates make more sense when the day's timing and plans are visible too.",
  },
  {
    src: "/assets/app-screenshots/itinerary-ports.png",
    alt: "CruiseKit Your ports screen showing ports tied to a saved itinerary",
    title: "Saved itinerary ports",
    description:
      "Port guides and practical day context stay connected to the saved sailing.",
  },
];

const FAQS = [
  {
    question: "What is a cruise group check-in app?",
    answer:
      "A cruise group check-in app helps travelers share lightweight status updates with their group during a cruise, such as where they are meeting, whether they are heading back, or what part of the day they are on.",
  },
  {
    question: "How does CruiseKit support group check-ins?",
    answer:
      "CruiseKit puts manual MyCrew check-ins under More. MyDay keeps device time, port-local time, ship-time verification, itinerary, and schedule context nearby, while Spend tracks purchases.",
  },
  {
    question: "Is MyCrew a replacement for the cruise line app?",
    answer:
      "No. CruiseKit is independent and is not an official cruise line app. Travelers should still use official cruise line and onboard sources for sailing-specific services, announcements, account details, dining, and all-aboard instructions.",
  },
  {
    question: "Does a group check-in app need constant location tracking?",
    answer:
      "No. Many cruise groups only need intentional status updates and shared day context. CruiseKit positions MyCrew around lightweight check-ins rather than making the product a constant tracking tool.",
  },
];

const RELATED_LINKS = [
  { href: "/groups", label: "Group planning guide" },
  { href: "/myday", label: "See MyDay" },
  { href: "/ship-time-vs-port-time", label: "Ship time guide" },
  { href: "/app", label: "Download the app" },
];

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${PAGE_URL}#article`,
        headline: "Cruise Group Check-In App for MyCrew Coordination",
        description:
          "A practical guide to using CruiseKit for cruise group check-ins and MyCrew coordination.",
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
            name: "Cruise Group Check-In App",
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

export default function CruiseGroupCheckInAppPage() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Cruise Group Check-In App"
          subtitle="CruiseKit helps groups coordinate cruise-day status, meetup plans, port-day timing, and MyCrew context without turning the trip into a full-time group chat."
          breadcrumbs={[{ label: "Cruise Group Check-In App" }]}
        />

        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-xs font-bold uppercase text-teal-dark">
                <Users className="h-3.5 w-3.5" />
                MyCrew coordination
              </p>
              <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 lg:hidden">
                <Image
                  src="/assets/app-screenshots/mycrew-invite.png"
                  alt="CruiseKit MyCrew invite screen showing a QR code and remote sharing options"
                  fill
                  sizes="100vw"
                  className="object-cover object-top"
                  loading="eager"
                  fetchPriority="high"
                  priority
                />
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-navy">
                Cruise groups need lightweight status, not another complicated
                travel dashboard.
              </h2>
              <div className="mt-5 space-y-4 text-base leading-7 text-gray-700">
                <p>
                  Cruise days split groups in natural ways. Someone heads to
                  breakfast, someone goes ashore, someone stays by the pool, and
                  someone is watching the all-aboard time. A simple check-in
                  layer helps the group understand what is happening without
                  making every update a long message.
                </p>
                <p>
                  CruiseKit connects that status context to the cruise day
                  itself: ship time, port time, itinerary, schedule, and
                  spending. MyCrew is available under More.
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
              <div className="relative mx-auto mb-6 aspect-[1290/2796] w-full max-w-[250px] overflow-hidden rounded-[2rem] border border-white bg-navy shadow-xl ring-1 ring-black/10">
                <Image
                  src="/assets/app-screenshots/mycrew-invite.png"
                  alt="CruiseKit MyCrew invite screen showing a QR code and remote sharing options"
                  fill
                  sizes="250px"
                  className="object-cover"
                  loading="eager"
                  fetchPriority="high"
                  priority
                />
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="h-7 w-7 text-teal" />
                <div>
                  <p className="text-sm font-semibold uppercase text-gray-500">
                    Built around cruise days
                  </p>
                  <p className="mt-1 text-xl font-bold text-navy">
                    MyCrew invites and check-ins under More
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                Group coordination works well when it lives next to the actual
                cruise context, not in a disconnected spreadsheet or scattered
                text thread.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 max-w-3xl">
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-teal-dark">
              <MessageCircle className="h-4 w-4" />
              What check-ins solve
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              The group does not need constant chatter to stay aligned
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {CHECK_IN_JOBS.map((item) => {
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
              Screenshots from the CruiseKit app
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              The check-in story is part of a broader cruise-day workflow:
              remote setup, status, schedule, timing, spending, and itinerary
              context in one app surface.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {SCREENSHOTS.map((item) => (
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
                    className="object-cover object-top"
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
                <CheckCircle2 className="h-4 w-4" />
                Good fit
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy">
                When group check-ins help
              </h2>
              <ul className="mt-5 space-y-3">
                {GOOD_FIT.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-6 text-gray-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-teal-dark">
                <ShieldCheck className="h-4 w-4" />
                Boundaries
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy">
                What CruiseKit is not claiming
              </h2>
              <ul className="mt-5 space-y-3">
                {BOUNDARIES.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-6 text-gray-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase text-teal-dark">
              <Bell className="h-4 w-4" />
              Planning flow
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy">
              Use check-ins as one part of the trip plan
            </h2>
            <div className="mt-6 grid gap-3">
              {FLOW.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-teal/50"
                >
                  <h3 className="text-base font-bold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy">
              Cruise group check-in FAQ
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Practical answers for travelers deciding how to coordinate a
              cruise group before and during the sailing.
            </p>
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

        <section className="bg-navy text-white">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Keep the cruise day connected in CruiseKit
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                Download CruiseKit to keep MyCrew check-ins, ship-day context,
                your saved itinerary, and onboard spend close during the trip.
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
