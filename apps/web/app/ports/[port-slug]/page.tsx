import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  MapPin,
  DollarSign,
  Wifi,
  AlertTriangle,
  Utensils,
  Bus,
  Anchor,
  Star,
  ChevronRight,
  Phone,
  Footprints,
  Globe,
  Ship,
  Smartphone,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AffiliateLink from "@/components/shared/affiliate-link";
import AffiliateDisclosure from "@/components/shared/affiliate-disclosure";
import ViatorExcursions from "@/components/viator/viator-excursions";
import PortGuideStatus from "./port-guide-status";
import PortTodayHeader from "./port-today-header";
import PortSectionNav from "./port-section-nav";
import { hasViatorProducts } from "@/lib/data/viator-destinations";
import { getHotelLink, getBoatRentalLink } from "@/lib/affiliate-config";
import { cn } from "@/lib/utils/cn";
import {
  getPortBySlug,
  getAllPortSlugs,
  REGION_LABELS,
  type PortData,
  type PortRegion,
} from "@/lib/data/ports";

/* ------------------------------------------------------------------ */
/*  Static Generation                                                  */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  return getAllPortSlugs().map((slug) => ({ "port-slug": slug }));
}

export const dynamicParams = false;

/* ------------------------------------------------------------------ */
/*  SEO Metadata                                                       */
/* ------------------------------------------------------------------ */

type Props = {
  params: Promise<{ "port-slug": string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "port-slug": slug } = await params;
  const port = getPortBySlug(slug);
  if (!port) return {};

  const title = `${port.name}, ${port.country} Cruise Port Guide`;
  const description = `CruiseKit guide to ${port.name}, ${port.country}: walkability, tender or dock status, port hours, currency, Wi-Fi, excursions, food, and a non-live destination snapshot.`;
  const url = `/ports/${port.slug}`;

  return {
    title,
    description,
    keywords: [
      `${port.name} cruise port`,
      `${port.name} excursions`,
      `${port.name} cruise tips`,
      `things to do in ${port.name}`,
      "cruise port guide",
      "cruise destination snapshot",
      "Caribbean cruise ports",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: port.imageUrl,
          alt: `${port.name}, ${port.country} cruise port`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [port.imageUrl],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Helper Components                                                  */
/* ------------------------------------------------------------------ */

function WalkabilityBadge({ rating }: { rating: number }) {
  const color =
    rating >= 9
      ? "bg-green-100 text-green-800 border-green-200"
      : rating >= 7
        ? "bg-teal/10 text-teal border-teal/30"
        : rating >= 5
          ? "bg-amber-100 text-amber-800 border-amber-200"
          : "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold",
        color
      )}
    >
      <Footprints className="h-4 w-4" />
      Walkability: {rating}/10
    </span>
  );
}

type PortFaq = {
  question: string;
  answer: string;
};

function getPortFaqs(port: PortData): PortFaq[] {
  return [
    {
      question: `Is ${port.name} a tender port or a docked port?`,
      answer: port.isTenderPort
        ? `${port.name} is commonly handled as a tender port in CruiseKit's guide, so cruise guests should build their port-day plan around tender boat operations.`
        : `${port.name} is listed as a docked cruise port in CruiseKit's guide, which usually makes the port area simpler to plan than a tender stop.`,
    },
    {
      question: `How walkable is ${port.name} from the cruise port?`,
      answer: `${port.name} has a CruiseKit walkability score of ${port.walkabilityRating}/10. The port-area note is: ${port.walkingDistanceToTown}.`,
    },
    {
      question: `What currency is used in ${port.name}?`,
      answer: `${port.currency} is the local currency for ${port.name}. ${port.usdAccepted ? "US dollars are commonly accepted in many visitor-facing places." : "Plan to use local currency or a payment card where accepted."}`,
    },
    {
      question: `Does this ${port.name} page use a live map provider?`,
      answer:
        "No. This port guide uses a pre-rendered OpenStreetMap-derived image that CruiseKit serves directly. It does not request live map tiles when you visit the page. CruiseKit's optional Explore Map is a separate app view and is only loaded when enabled and opened by the user.",
    },
  ];
}

function DestinationSnapshot({ port }: { port: PortData }) {
  const highlights = [
    port.freeActivities[0]?.name,
    port.excursionCategories[0]?.name,
    port.restaurants[0]?.name,
  ].filter((highlight): highlight is string => Boolean(highlight));

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <figure>
          <div className="relative aspect-[20/13] bg-slate-100">
            <Image
              src={`/assets/maps/static/port-${port.slug}.webp`}
              alt={`Street map of the ${port.name}, ${port.country} port area`}
              fill
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover"
            />
            <div className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-navy shadow-sm backdrop-blur-sm">
              Static port-area map
            </div>
          </div>
          <figcaption className="flex flex-col gap-1 border-t border-gray-100 px-4 py-3 text-xs leading-relaxed text-gray-600 sm:flex-row sm:items-center sm:justify-between">
            <span>Pre-rendered and served by CruiseKit—no live tile request.</span>
            <span>
              Map: {" "}
              <a
                href="https://openfreemap.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-dark underline decoration-teal/30 underline-offset-2 hover:text-teal"
              >
                OpenFreeMap
              </a>{" "}
              © {" "}
              <a
                href="https://openmaptiles.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-dark underline decoration-teal/30 underline-offset-2 hover:text-teal"
              >
                OpenMapTiles
              </a>
              {" · Data © "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-dark underline decoration-teal/30 underline-offset-2 hover:text-teal"
              >
                OpenStreetMap contributors (ODbL)
              </a>
            </span>
          </figcaption>
        </figure>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <h3 className="text-lg font-bold text-navy">
          Port-area planning notes
        </h3>
        <div className="mt-4 grid gap-3">
          <QuickStat
            icon={port.isTenderPort ? Anchor : Ship}
            label="Arrival Style"
            value={port.isTenderPort ? "Tender port" : "Docked port"}
          />
          <QuickStat
            icon={Footprints}
            label="Walkability"
            value={`${port.walkabilityRating}/10`}
          />
          <QuickStat
            icon={Wifi}
            label="Connectivity"
            value={`${port.wifiAvailability} Wi-Fi, ${port.cellularCoverage} cell`}
          />
        </div>
        {highlights.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PortFaqSection({ faqs }: { faqs: PortFaq[] }) {
  return (
    <section id="faq" className="mb-12 scroll-mt-[160px]">
      <h2 className="mb-5 text-2xl font-bold tracking-tight text-navy">
        {faqs.length > 0 ? "Cruise Port FAQ" : "FAQ"}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <h3 className="font-semibold leading-6 text-navy">
              {faq.question}
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-navy">{value}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default async function PortDetailPage({ params }: Props) {
  const { "port-slug": slug } = await params;
  const port = getPortBySlug(slug);

  if (!port) notFound();

  const faqs = getPortFaqs(port);
  const canonicalUrl = `https://cruisekit.app/ports/${port.slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "TouristDestination",
                "@id": `${canonicalUrl}#destination`,
                name: `${port.name} Cruise Port`,
                url: canonicalUrl,
                image: port.imageUrl,
                description: port.overview,
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: port.coordinates.lat,
                  longitude: port.coordinates.lng,
                },
                touristType: "Cruise passengers",
              },
              {
                "@type": "BreadcrumbList",
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
                    name: "Cruise Port Guides",
                    item: "https://cruisekit.app/ports",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: `${port.name} Cruise Port Guide`,
                    item: canonicalUrl,
                  },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              },
            ],
          }),
        }}
      />
      <Navbar />
      <main className="flex-1">
        {/* ============================================================ */}
        {/*  1. Hero Section                                              */}
        {/* ============================================================ */}
        <section className="relative h-[340px] sm:h-[400px] lg:h-[440px] overflow-hidden">
          <Image
            src={port.imageUrl}
            alt={`${port.name}, ${port.country}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-navy/10" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center gap-1 text-sm text-white/70">
                  <li>
                    <Link
                      href="/"
                      className="transition-colors hover:text-white"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="flex items-center gap-1">
                    <ChevronRight className="h-3.5 w-3.5" />
                    <Link
                      href="/ports"
                      className="transition-colors hover:text-white"
                    >
                      Ports
                    </Link>
                  </li>
                  <li className="flex items-center gap-1">
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-white font-medium">{port.name}</span>
                  </li>
                </ol>
              </nav>

              {/* Port name + badges */}
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {port.name}
                </h1>
                <WalkabilityBadge rating={port.walkabilityRating} />
              </div>
              <p className="mt-2 text-lg text-white/80">{port.country}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                  {port.isTenderPort ? (
                    <>
                      <Anchor className="h-3.5 w-3.5" /> Tender Port
                    </>
                  ) : (
                    <>
                      <Ship className="h-3.5 w-3.5" /> Direct Dock
                    </>
                  )}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                  <Globe className="h-3.5 w-3.5" />
                  {REGION_LABELS[port.region]}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  2. Quick Stats Bar                                           */}
        {/* ============================================================ */}
        <section className="border-b border-gray-200 bg-gray-50/60">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <QuickStat
                icon={Clock}
                label="Hours in Port"
                value={`~${port.typicalPortHours} hours`}
              />
              <QuickStat
                icon={Footprints}
                label="Walk to Town"
                value={port.walkingDistanceToTown}
              />
              <QuickStat
                icon={DollarSign}
                label="Currency"
                value={`${port.currency}${port.usdAccepted ? " (USD accepted)" : ""}`}
              />
              <QuickStat
                icon={Wifi}
                label="WiFi"
                value={port.wifiAvailability.charAt(0).toUpperCase() + port.wifiAvailability.slice(1)}
              />
              <QuickStat
                icon={Smartphone}
                label="Cell Coverage"
                value={port.cellularCoverage.charAt(0).toUpperCase() + port.cellularCoverage.slice(1)}
              />
              <QuickStat
                icon={Clock}
                label="Time Zone"
                value={port.ianaTimeZone}
              />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Pinned "Today at [port]" header — live port time + TZ delta */}
          <PortTodayHeader
            portName={port.name}
            ianaTimeZone={port.ianaTimeZone}
          />

          {/* Section tabs — IntersectionObserver-powered in-page nav */}
          <PortSectionNav />

          {/* ============================================================ */}
          {/*  3. Time Zone Alert                                          */}
          {/* ============================================================ */}
          <div className="mb-10 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">Time check</p>
              <p className="mt-1 text-sm leading-relaxed text-amber-800">
                {port.name} uses {port.ianaTimeZone}. Your phone may switch to
                local time automatically, while the ship may keep a different
                clock. Treat the times on this page as planning aids and follow
                the ship&apos;s official time and all-aboard instructions.
              </p>
            </div>
          </div>

          <PortGuideStatus governance={port.governance} />

          {/* ============================================================ */}
          {/*  4. Overview                                                  */}
          {/* ============================================================ */}
          <section id="overview" className="mb-12 scroll-mt-[160px]">
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-navy">
              Overview
            </h2>
            <div className="mb-5 max-w-3xl rounded-xl border border-teal/25 bg-seafoam/60 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-dark">
                Direct answer
              </p>
              <p className="mt-2 text-base font-semibold leading-7 text-navy">
                {port.name} is a {port.isTenderPort ? "tender" : "docked"}{" "}
                cruise port with {port.walkabilityRating}/10 walkability,
                about {port.typicalPortHours} typical port hours, and{" "}
                {port.currency} as the local currency.
              </p>
            </div>
            <p className="max-w-3xl text-base leading-relaxed text-gray-600">
              {port.overview}
            </p>
            <DestinationSnapshot port={port} />
          </section>

          {/* ============================================================ */}
          {/*  5. Top Excursions                                            */}
          {/* ============================================================ */}
          <section id="excursions" className="mb-12 scroll-mt-[160px]">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-navy">
              Top Excursions
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {port.excursionCategories.map((exc) => (
                <div
                  key={exc.name}
                  className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <h3 className="font-semibold text-navy">{exc.name}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-teal">
                      <DollarSign className="h-4 w-4" />
                      ${exc.priceRange.min}
                      {exc.priceRange.min !== exc.priceRange.max &&
                        `–$${exc.priceRange.max}`}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      {exc.typicalDuration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/*  5b. Book Tours — Viator (client-side, dynamic)               */}
          {/* ============================================================ */}
          {hasViatorProducts(slug) && (
            <ViatorExcursions portSlug={slug} portName={port.name} />
          )}

          {/* ============================================================ */}
          {/*  5c. Affiliate CTAs — Hotels & Boat Rentals                   */}
          {/* ============================================================ */}
          <section className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Booking.com Hotels */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-navy">
                  Hotels Near {port.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Flying in the night before? Find hotels near the cruise
                terminal in {port.name}, {port.country}.
              </p>
              <AffiliateLink
                href={getHotelLink(
                  `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(port.name + ", " + port.country)}`
                )}
                partner="booking.com"
                source={`port-${slug}`}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold",
                  "bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                )}
              >
                Search Hotels
                <ChevronRight className="h-4 w-4" />
              </AffiliateLink>
              <AffiliateDisclosure className="mt-2" />
            </div>

            {/* SamBoat — only for warm-water / boat-friendly regions */}
            {(["western", "eastern", "southern", "bahamas", "europe-med"] as PortRegion[]).includes(port.region) && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                    <Anchor className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-navy">
                    Rent a Boat in {port.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Skip the cruise excursion desk — rent a private boat and
                  explore {port.name} at your own pace.
                </p>
                <AffiliateLink
                  href={getBoatRentalLink(
                    `https://www.samboat.com/boat-rental/${encodeURIComponent(port.name.toLowerCase().replace(/\s+/g, "-"))}`
                  )}
                  partner="samboat"
                  source={`port-${slug}`}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold",
                    "bg-teal text-white hover:bg-teal-dark transition-colors"
                  )}
                >
                  Browse Boats
                  <ChevronRight className="h-4 w-4" />
                </AffiliateLink>
                <AffiliateDisclosure className="mt-2" />
              </div>
            )}
          </section>

          {/* ============================================================ */}
          {/*  6. Free Things To Do                                         */}
          {/* ============================================================ */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-navy">
              Free Things To Do
            </h2>
            <div className="space-y-4">
              {port.freeActivities.map((activity) => (
                <div
                  key={activity.name}
                  className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy">
                      {activity.name}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/*  7. Restaurants Near Terminal                                  */}
          {/* ============================================================ */}
          <section id="eat" className="mb-12 scroll-mt-[160px]">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-navy flex items-center gap-2">
              <Utensils className="h-6 w-6 text-coral" />
              Restaurants Near Terminal
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {port.restaurants.map((rest) => (
                <div
                  key={rest.name}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5"
                >
                  <span className="font-medium text-navy">{rest.name}</span>
                  <span className="text-sm font-semibold text-teal">
                    {rest.priceRange}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/*  8. Getting Around                                            */}
          {/* ============================================================ */}
          <section id="get-around" className="mb-12 scroll-mt-[160px]">
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-navy flex items-center gap-2">
              <Bus className="h-6 w-6 text-ocean" />
              Getting Around
            </h2>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-sm leading-relaxed text-gray-600">
                {port.gettingAround}
              </p>
            </div>
          </section>

          <PortFaqSection faqs={faqs} />

          {/* ============================================================ */}
          {/*  9. Emergency Info                                            */}
          {/* ============================================================ */}
          <section id="emergency" className="mb-12 scroll-mt-[160px]">
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-navy flex items-center gap-2">
              <Phone className="h-6 w-6 text-coral" />
              Emergency Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Police
                </p>
                <p className="mt-1 text-sm font-semibold text-navy">
                  {port.emergencyInfo.police}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Hospital
                </p>
                <p className="mt-1 text-sm font-semibold text-navy">
                  {port.emergencyInfo.hospital}
                </p>
              </div>
              {port.emergencyInfo.usConsulate && (
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    US Consulate
                  </p>
                  <p className="mt-1 text-sm font-semibold text-navy">
                    {port.emergencyInfo.usConsulate}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ============================================================ */}
          {/*  10. CTA                                                      */}
          {/* ============================================================ */}
          <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-navy to-ocean p-8 sm:p-10 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              What will a cruise to {port.name} really cost?
            </h2>
            <p className="mt-3 mx-auto max-w-xl text-base text-white/80">
              Use our True Cost Calculator to uncover every hidden fee —
              gratuities, drink packages, excursions at {port.name}, and more.
            </p>
            <Link
              href="/calculator"
              className={cn(
                "mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3 text-base font-semibold",
                "bg-white text-navy shadow-lg",
                "transition-all hover:bg-gray-50 hover:shadow-xl",
                "active:scale-[0.97]"
              )}
            >
              Calculate True Cost
              <ChevronRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
