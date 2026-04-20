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
  Shield,
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
import PortTodayHeader from "./port-today-header";
import PortSectionNav from "./port-section-nav";
import { hasViatorProducts } from "@/lib/data/viator-destinations";
import { getHotelLink, getBoatRentalLink, getMedEvacLink } from "@/lib/affiliate-config";
import { cn } from "@/lib/utils/cn";
import {
  PORTS,
  getPortBySlug,
  getAllPortSlugs,
  REGION_LABELS,
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

  return {
    title: `${port.name}, ${port.country} Cruise Port Guide — Excursions, Tips & Safety | CruiseKit`,
    description: `Complete cruise port guide for ${port.name}, ${port.country}. Safety rating ${port.safetyRating}/10, top excursions, free activities, time zone alerts, and transport tips.`,
    keywords: [
      `${port.name} cruise port`,
      `${port.name} excursions`,
      `${port.name} cruise tips`,
      `things to do in ${port.name}`,
      "cruise port guide",
      "Caribbean cruise ports",
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  Helper Components                                                  */
/* ------------------------------------------------------------------ */

function SafetyBadge({ rating }: { rating: number }) {
  const color =
    rating >= 9
      ? "bg-green-100 text-green-800 border-green-200"
      : rating >= 7
        ? "bg-teal/10 text-teal border-teal/30"
        : rating >= 5
          ? "bg-amber-100 text-amber-800 border-amber-200"
          : "bg-red-100 text-red-800 border-red-200";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold",
        color
      )}
    >
      <Shield className="h-4 w-4" />
      Safety: {rating}/10
    </span>
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            name: `${port.name} Cruise Port`,
            description: port.overview,
            geo: {
              "@type": "GeoCoordinates",
              latitude: port.coordinates.lat,
              longitude: port.coordinates.lng,
            },
            touristType: "Cruise passengers",
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
                <SafetyBadge rating={port.safetyRating} />
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
                value={port.timezone}
              />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Pinned "Today at [port]" header — live port time + TZ delta */}
          <PortTodayHeader
            portName={port.name}
            timezone={port.timezone}
            timeZoneAlert={port.timeZoneAlert}
          />

          {/* Section tabs — IntersectionObserver-powered in-page nav */}
          <PortSectionNav />

          {/* ============================================================ */}
          {/*  3. Time Zone Alert                                          */}
          {/* ============================================================ */}
          {port.timeZoneAlert && (
            <div className="mb-10 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-900">
                  Time Zone Alert
                </p>
                <p className="mt-1 text-sm leading-relaxed text-amber-800">
                  {port.timeZoneAlert}
                </p>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/*  4. Overview                                                  */}
          {/* ============================================================ */}
          <section id="overview" className="mb-12 scroll-mt-[160px]">
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-navy">
              Overview
            </h2>
            <p className="max-w-3xl text-base leading-relaxed text-gray-600">
              {port.overview}
            </p>

            {/* All-aboard math — three plain sentences. No GPS, no ETA —
                just the logic every cruiser needs to do in their head. */}
            <div className="mt-6 max-w-3xl rounded-xl border-l-4 border-teal bg-teal/5 px-5 py-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-teal">
                All-aboard math
              </p>
              <p className="text-sm leading-relaxed text-navy">
                All-aboard in {port.name} is typically 30&ndash;60 minutes
                before your ship departs &mdash; confirm the exact time on the
                day&rsquo;s ship newsletter.{" "}
                {port.isTenderPort && (
                  <>
                    This is a{" "}
                    <span className="font-semibold text-coral">tender port</span>,
                    so add ~20 minutes for the tender queue on a full ship and
                    head back earlier than you think.{" "}
                  </>
                )}
                {port.timeZoneAlert && (
                  <>
                    <span className="font-semibold">Time-zone note:</span>{" "}
                    {port.timeZoneAlert}
                  </>
                )}
              </p>
            </div>
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
          {/*  9b. Medjet — Medical Evacuation                              */}
          {/* ============================================================ */}
          <section className="mb-12">
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-navy">
                    Medical Evacuation Coverage
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Helicopter evacuations from ports like {port.name} can cost
                    $50,000+. Medjet covers medical transport to your home
                    hospital — not just the nearest facility.
                  </p>
                  <AffiliateLink
                    href={getMedEvacLink("https://www.medjetassist.com/")}
                    partner="medjet"
                    source={`port-${slug}`}
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold",
                      "bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                    )}
                  >
                    Learn About Medjet
                    <ChevronRight className="h-4 w-4" />
                  </AffiliateLink>
                  <AffiliateDisclosure className="mt-2" />
                </div>
              </div>
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
