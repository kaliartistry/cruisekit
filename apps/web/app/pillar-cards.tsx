"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Wine,
  Wifi,
  HandCoins,
  UtensilsCrossed,
  ShieldCheck,
  Sparkles,
  Anchor,
  MapPin,
  TrendingDown,
} from "lucide-react";
import { CRUISE_LINES } from "@cruise/shared/constants";
import CruiseLineLogo from "@/components/shared/cruise-line-logo";
import { SHIPS } from "@/lib/data/ships";
import { getTopDealsByRegion, DEAL_STATS, type RealDeal } from "@/lib/data/real-deals";

/* -- Verified destination images: each photo confirmed to show the actual location -- */
const PORT_IMAGES: Record<string, string> = {
  "cozumel": "https://images.unsplash.com/photo-1579493933703-70473cdf84f8?w=600&q=80",
  "costa maya": "https://images.unsplash.com/photo-1579493933703-70473cdf84f8?w=600&q=80",
  "progreso": "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600&q=80",
  "nassau": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
  "bahamas": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
  "cococay": "https://images.unsplash.com/photo-1559956144-ee11501d5459?w=600&q=80",
  "grand turk": "https://images.unsplash.com/photo-1558923240-2672e219374b?w=600&q=80",
  "st. thomas": "https://images.unsplash.com/photo-1748624185483-3fd96e68c749?w=600&q=80",
  "charlotte amalie": "https://images.unsplash.com/photo-1748624185483-3fd96e68c749?w=600&q=80",
  "st. maarten": "https://images.unsplash.com/photo-1551960051-39f23da5ed22?w=600&q=80",
  "philipsburg": "https://images.unsplash.com/photo-1551960051-39f23da5ed22?w=600&q=80",
  "san juan": "https://images.unsplash.com/photo-1692719199304-86a527fb1df8?w=600&q=80",
  "roatan": "https://images.unsplash.com/photo-1668813922137-e5dcda303af6?w=600&q=80",
  "aruba": "https://images.unsplash.com/photo-1593007466861-7707b21b81c0?w=600&q=80",
  "oranjestad": "https://images.unsplash.com/photo-1593007466861-7707b21b81c0?w=600&q=80",
  "grand cayman": "https://images.unsplash.com/photo-1555744164-728dd59f9d8b?w=600&q=80",
  "jamaica": "https://images.unsplash.com/photo-1530225029356-e301a685e6b1?w=600&q=80",
  "falmouth": "https://images.unsplash.com/photo-1614529168796-cb235d6a2557?w=600&q=80",
  "ocho rios": "https://images.unsplash.com/photo-1530225029356-e301a685e6b1?w=600&q=80",
  "belize": "https://images.unsplash.com/photo-1585540036061-a57122a5aa3f?w=600&q=80",
  "bermuda": "https://images.unsplash.com/photo-1584558701762-387e5d31e441?w=600&q=80",
  "key west": "https://images.unsplash.com/photo-1617202830798-cf48261fb70d?w=600&q=80",
  "curacao": "https://images.unsplash.com/photo-1693574276068-d5d65bb34ad0?w=600&q=80",
  "bonaire": "https://images.unsplash.com/photo-1543240498-d949ce4412b3?w=600&q=80",
  "kralendijk": "https://images.unsplash.com/photo-1543240498-d949ce4412b3?w=600&q=80",
  "st. lucia": "https://images.unsplash.com/photo-1745156705689-eef88991849d?w=600&q=80",
  "barbados": "https://images.unsplash.com/photo-1712086353412-512d17c08403?w=600&q=80",
  "antigua": "https://images.unsplash.com/photo-1746208440749-b25fcc19e025?w=600&q=80",
  "tortola": "https://images.unsplash.com/photo-1504659728239-b005b35c5d69?w=600&q=80",
  "grenada": "https://images.unsplash.com/photo-1616464654572-43996d6b0133?w=600&q=80",
  "cartagena": "https://images.unsplash.com/photo-1536308037887-165852797016?w=600&q=80",
  "labadee": "https://images.unsplash.com/photo-1554759068-c560c4563912?w=600&q=80",
  "amber cove": "https://images.unsplash.com/photo-1678816331175-a61a6835e889?w=600&q=80",
  "western caribbean": "https://images.unsplash.com/photo-1579493933703-70473cdf84f8?w=600&q=80",
  "eastern caribbean": "https://images.unsplash.com/photo-1692719199304-86a527fb1df8?w=600&q=80",
  "southern caribbean": "https://images.unsplash.com/photo-1693574276068-d5d65bb34ad0?w=600&q=80",
  "caribbean": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
};

const DEFAULT_CRUISE_IMAGE = "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80";

function getDealImage(deal: RealDeal): string {
  if (deal.imageUrl) return deal.imageUrl;

  // Match by ports
  for (const port of deal.ports) {
    const portLower = port.toLowerCase();
    for (const [key, img] of Object.entries(PORT_IMAGES)) {
      if (portLower.includes(key)) return img;
    }
  }
  // Match by title
  const titleLower = deal.itineraryTitle.toLowerCase();
  for (const [key, img] of Object.entries(PORT_IMAGES)) {
    if (titleLower.includes(key)) return img;
  }
  return DEFAULT_CRUISE_IMAGE;
}

/* -- Port to country mapping -- */
const PORT_COUNTRIES: Record<string, string> = {
  "Cozumel": "Mexico",
  "Costa Maya": "Mexico",
  "Progreso": "Mexico",
  "Nassau": "Bahamas",
  "CocoCay": "Bahamas",
  "Half Moon Cay": "Bahamas",
  "Perfect Day at CocoCay": "Bahamas",
  "Celebration Key": "Bahamas",
  "St. Thomas": "US Virgin Islands",
  "St. Maarten": "Netherlands",
  "Grand Cayman": "Cayman Islands",
  "Roatan": "Honduras",
  "Falmouth": "Jamaica",
  "Ocho Rios": "Jamaica",
  "San Juan": "Puerto Rico",
  "Aruba": "Aruba",
  "Curacao": "Cura\u00e7ao",
  "Belize City": "Belize",
  "Harvest Caye": "Belize",
  "Grand Turk": "Turks & Caicos",
  "Bermuda": "Bermuda",
  "Key West": "Florida, USA",
  "Amber Cove": "Dominican Republic",
  "Tortola": "British Virgin Islands",
  "Barbados": "Barbados",
  "Antigua": "Antigua",
  "St. Lucia": "St. Lucia",
  "St. Kitts": "St. Kitts",
  "Bimini": "Bahamas",
};

function getPortWithCountry(port: string): string {
  if (PORT_COUNTRIES[port]) return `${port}, ${PORT_COUNTRIES[port]}`;
  const portLower = port.toLowerCase();
  for (const [key, country] of Object.entries(PORT_COUNTRIES)) {
    if (portLower.includes(key.toLowerCase()) || key.toLowerCase().includes(portLower)) {
      return `${port}, ${country}`;
    }
  }
  return port;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

/* -- Real deals from scraped API data (Carnival + NCL) -- */
const REAL_TRENDING = getTopDealsByRegion("caribbean", 10);
/* -- Fallback to ship database if no scraped data available -- */
const SHIP_DEALS = SHIPS
  .filter((s) => s.fare7Night.inside > 0)
  .sort((a, b) => a.fare7Night.inside - b.fare7Night.inside)
  .slice(0, 8);

const COMPARISONS = [
  {
    lineA: "royal-caribbean",
    lineB: "carnival",
    label: "Royal Caribbean vs Carnival",
  },
  {
    lineA: "norwegian",
    lineB: "royal-caribbean",
    label: "Norwegian vs Royal Caribbean",
  },
  {
    lineA: "celebrity",
    lineB: "princess",
    label: "Celebrity vs Princess",
  },
  {
    lineA: "msc",
    lineB: "norwegian",
    label: "MSC vs Norwegian",
  },
  {
    lineA: "disney",
    lineB: "royal-caribbean",
    label: "Disney vs Royal Caribbean",
  },
  {
    lineA: "virgin-voyages",
    lineB: "celebrity",
    label: "Virgin Voyages vs Celebrity",
  },
];

const HIDDEN_COSTS = [
  {
    icon: Wine,
    title: "Drink Packages",
    price: "$70-$110",
    note: "per person / day",
  },
  {
    icon: Wifi,
    title: "WiFi Packages",
    price: "$15-$25",
    note: "per device / day",
  },
  {
    icon: HandCoins,
    title: "Gratuities",
    price: "$16-$26",
    note: "per person / day",
  },
  {
    icon: UtensilsCrossed,
    title: "Specialty Dining",
    price: "$35-$75",
    note: "per person / meal",
  },
  {
    icon: ShieldCheck,
    title: "Travel Insurance",
    price: "$100-$300",
    note: "per person / trip",
  },
  {
    icon: Sparkles,
    title: "Shore Excursions",
    price: "$50-$200",
    note: "per person / port",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ContentSections() {
  return (
    <>
      {/* ---- Real Cruise Deals (from scraped API data) ---- */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-5 w-5 text-coral" />
                <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
                  Lowest Caribbean Cruise Fares
                </h2>
              </div>
              <p className="text-sm text-gray-500">
                Real prices from {DEAL_STATS.cruiseLines.length} cruise lines &middot; {DEAL_STATS.totalDeals} sailings tracked &middot; See the{" "}
                <span className="font-semibold text-navy">true cost</span> with our calculator
              </p>
            </div>
            <Link
              href="/cruises"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-teal hover:text-teal-dark transition-colors"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            {/* Scroll fade indicators */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-white to-transparent z-10" />
            <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-4 bg-gradient-to-r from-white to-transparent z-10 sm:hidden" />

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: "thin" }}>
            {REAL_TRENDING.map((deal) => {
              const line = CRUISE_LINES.find((l) => l.id === deal.cruiseLineId);
              return (
                <Link
                  key={deal.id}
                  href={`/calculator?line=${deal.cruiseLineId}&duration=${deal.duration}&adults=2&fare=${deal.fromPrice}${deal.departureDate ? `&month=${new Date(deal.departureDate).getMonth()}` : ""}`}
                  className="group flex-shrink-0 w-[280px] sm:w-[300px] snap-start rounded-xl border border-gray-200 bg-white shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 overflow-hidden"
                >
                  {/* Ship image area */}
                  <div
                    className="relative h-36 w-full overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${line?.color ?? "#0077B6"}15, ${line?.color ?? "#0077B6"}35)`,
                    }}
                  >
                    <Image
                      src={getDealImage(deal)}
                      alt={`${deal.shipName} - ${deal.itineraryTitle}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="300px"
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/30" />
                    {/* Price badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow">
                      <p className="font-price text-[10px] text-gray-400 uppercase tracking-wider">from</p>
                      <p className="font-price text-xl font-bold text-coral leading-tight">
                        ${deal.fromPrice.toLocaleString()}
                      </p>
                      <p className="font-price text-[10px] text-gray-400">per person</p>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute top-3 left-3 bg-navy/80 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {deal.duration} nights
                    </div>
                    {/* Cruise line badge */}
                    <div className="absolute bottom-3 left-3">
                      <CruiseLineLogo cruiseLineId={deal.cruiseLineId} size="sm" />
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-4">
                    <h3 className="font-bold text-navy text-sm group-hover:text-teal transition-colors leading-tight">
                      {deal.shipName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {deal.itineraryTitle}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2">
                      <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-400 truncate">
                        From {deal.departurePort}
                      </p>
                    </div>

                    {deal.ports.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {deal.ports.slice(0, 3).map((port) => (
                          <span
                            key={port}
                            className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                          >
                            {getPortWithCountry(port)}
                          </span>
                        ))}
                        {deal.ports.length > 3 && (
                          <span className="text-[10px] text-gray-400">
                            +{deal.ports.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      {deal.departureDate && (
                        <p className="text-xs text-gray-400">{deal.departureDate}</p>
                      )}
                      <span className="flex items-center gap-1 text-xs font-semibold text-teal group-hover:text-teal-dark transition-colors ml-auto">
                        See true cost
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          </div>

          <Link
            href="/cruises"
            className="sm:hidden flex items-center justify-center gap-1 mt-4 text-sm font-semibold text-teal hover:text-teal-dark transition-colors"
          >
            View all cruises
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ---- Section A: Compare cruise line costs ---- */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Compare cruise line costs
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              See how the true cost stacks up between the most popular cruise
              lines.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {COMPARISONS.map((cmp) => (
              <motion.div key={cmp.label} variants={cardVariants}>
                <Link
                  href={`/calculator/${cmp.lineA}?compare=${cmp.lineB}`}
                  className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5"
                >
                  <CruiseLineLogo cruiseLineId={cmp.lineA} size="md" />
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    vs
                  </span>
                  <CruiseLineLogo cruiseLineId={cmp.lineB} size="md" />
                  <div className="ml-auto flex items-center gap-1 text-sm font-semibold text-navy transition-colors group-hover:text-teal">
                    Compare
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- Section B: Hidden costs ---- */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              The costs cruise lines don&apos;t show you
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              These extras add up fast. Our calculator includes them all so
              there are no surprises.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {HIDDEN_COSTS.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={cardVariants}
                  className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-coral/10">
                    <Icon className="h-5 w-5 text-coral" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy">
                      {item.title}
                    </h3>
                    <p className="font-price text-lg font-bold text-coral mt-0.5">
                      {item.price}
                    </p>
                    <p className="text-xs text-gray-400">{item.note}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ---- Section C: Cruise lines we cover ---- */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Cruise lines we cover
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              Detailed cost data for all major cruise lines, updated regularly.
            </p>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "thin" }}>
            {CRUISE_LINES.map((line) => (
              <Link
                key={line.id}
                href={`/calculator/${line.id}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 snap-start shrink-0 w-[140px]"
              >
                <CruiseLineLogo cruiseLineId={line.id} size="lg" />
                <span className="text-xs font-semibold text-navy text-center leading-tight group-hover:text-teal transition-colors">
                  {line.shortName}
                </span>
              </Link>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* ---- Section D: CTA banner ---- */}
      <section className="bg-gradient-to-r from-navy to-ocean py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">
            Ready to see the real price of your cruise?
          </h2>
          <p className="mt-3 text-base text-white/70 sm:text-lg max-w-2xl mx-auto">
            Stop guessing. Get a transparent breakdown of every cost before you
            book.
          </p>
          <Link
            href="/calculator"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-teal-dark hover:shadow-xl active:scale-[0.97]"
          >
            Calculate Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
