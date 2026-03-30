"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  SlidersHorizontal,
  X,
  Ship,
  Anchor,
} from "lucide-react";
import { REAL_DEALS, DEAL_STATS, type RealDeal } from "@/lib/data/real-deals";
import { CRUISE_LINES } from "@cruise/shared/constants";
import CruiseLineLogo from "@/components/shared/cruise-line-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import HeartButton from "@/components/shared/heart-button";

/* ------------------------------------------------------------------ */
/*  Constants & helpers                                                 */
/* ------------------------------------------------------------------ */

const ITEMS_PER_PAGE = 20;

const DURATION_RANGES = [
  { label: "3-4 nights", key: "3-4", min: 3, max: 4 },
  { label: "5-6 nights", key: "5-6", min: 5, max: 6 },
  { label: "7 nights", key: "7", min: 7, max: 7 },
  { label: "8-10 nights", key: "8-10", min: 8, max: 10 },
  { label: "11-14 nights", key: "11-14", min: 11, max: 14 },
  { label: "15+ nights", key: "15+", min: 15, max: Infinity },
] as const;

function getDurationKey(nights: number): string {
  for (const range of DURATION_RANGES) {
    if (nights >= range.min && nights <= range.max) return range.key;
  }
  return "15+";
}

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "duration-asc", label: "Duration: Short to Long" },
  { value: "duration-desc", label: "Duration: Long to Short" },
  { value: "ship-asc", label: "Ship Name A-Z" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

/* -- Deterministic hash for consistent image selection -- */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit
  }
  return Math.abs(hash);
}

/* -- Verified destination images: each photo confirmed to show the actual location -- */
const PORT_IMAGES: Record<string, string> = {
  // Mexico
  "cozumel": "https://images.unsplash.com/photo-1579493933703-70473cdf84f8?w=600&q=80",
  "costa maya": "https://images.unsplash.com/photo-1579493933703-70473cdf84f8?w=600&q=80",
  "progreso": "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600&q=80",
  // Bahamas
  "nassau": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
  "cococay": "https://images.unsplash.com/photo-1559956144-ee11501d5459?w=600&q=80",
  "bahamas": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
  "bimini": "https://images.unsplash.com/photo-1706455986634-225f93284c0c?w=600&q=80",
  "grand turk": "https://images.unsplash.com/photo-1558923240-2672e219374b?w=600&q=80",
  "celebration key": "https://images.unsplash.com/photo-1603756009316-20fafbee4a3e?w=600&q=80",
  "half moon": "https://images.unsplash.com/photo-1728994532864-1410da4e2037?w=600&q=80",
  // Caribbean islands
  "st. thomas": "https://images.unsplash.com/photo-1748624185483-3fd96e68c749?w=600&q=80",
  "charlotte amalie": "https://images.unsplash.com/photo-1748624185483-3fd96e68c749?w=600&q=80",
  "st. maarten": "https://images.unsplash.com/photo-1551960051-39f23da5ed22?w=600&q=80",
  "philipsburg": "https://images.unsplash.com/photo-1551960051-39f23da5ed22?w=600&q=80",
  "san juan": "https://images.unsplash.com/photo-1692719199304-86a527fb1df8?w=600&q=80",
  "aruba": "https://images.unsplash.com/photo-1593007466861-7707b21b81c0?w=600&q=80",
  "oranjestad": "https://images.unsplash.com/photo-1593007466861-7707b21b81c0?w=600&q=80",
  "curacao": "https://images.unsplash.com/photo-1693574276068-d5d65bb34ad0?w=600&q=80",
  "willemstad": "https://images.unsplash.com/photo-1693574276068-d5d65bb34ad0?w=600&q=80",
  "bonaire": "https://images.unsplash.com/photo-1543240498-d949ce4412b3?w=600&q=80",
  "kralendijk": "https://images.unsplash.com/photo-1543240498-d949ce4412b3?w=600&q=80",
  "barbados": "https://images.unsplash.com/photo-1712086353412-512d17c08403?w=600&q=80",
  "antigua": "https://images.unsplash.com/photo-1746208440749-b25fcc19e025?w=600&q=80",
  "st. lucia": "https://images.unsplash.com/photo-1745156705689-eef88991849d?w=600&q=80",
  "tortola": "https://images.unsplash.com/photo-1504659728239-b005b35c5d69?w=600&q=80",
  "st. kitts": "https://images.unsplash.com/photo-1706400486972-6b40488814af?w=600&q=80",
  "grenada": "https://images.unsplash.com/photo-1616464654572-43996d6b0133?w=600&q=80",
  // Central America
  "roatan": "https://images.unsplash.com/photo-1668813922137-e5dcda303af6?w=600&q=80",
  "belize": "https://images.unsplash.com/photo-1585540036061-a57122a5aa3f?w=600&q=80",
  "harvest caye": "https://images.unsplash.com/photo-1585540036061-a57122a5aa3f?w=600&q=80",
  "isla tropicale": "https://images.unsplash.com/photo-1585540036061-a57122a5aa3f?w=600&q=80",
  // Jamaica
  "falmouth": "https://images.unsplash.com/photo-1614529168796-cb235d6a2557?w=600&q=80",
  "ocho rios": "https://images.unsplash.com/photo-1530225029356-e301a685e6b1?w=600&q=80",
  "jamaica": "https://images.unsplash.com/photo-1530225029356-e301a685e6b1?w=600&q=80",
  // Cayman
  "grand cayman": "https://images.unsplash.com/photo-1555744164-728dd59f9d8b?w=600&q=80",
  // Dominican Republic
  "amber cove": "https://images.unsplash.com/photo-1678816331175-a61a6835e889?w=600&q=80",
  // Other
  "bermuda": "https://images.unsplash.com/photo-1584558701762-387e5d31e441?w=600&q=80",
  "key west": "https://images.unsplash.com/photo-1617202830798-cf48261fb70d?w=600&q=80",
  "labadee": "https://images.unsplash.com/photo-1554759068-c560c4563912?w=600&q=80",
  "cartagena": "https://images.unsplash.com/photo-1536308037887-165852797016?w=600&q=80",
  // Cruise type fallbacks
  "western caribbean": "https://images.unsplash.com/photo-1579493933703-70473cdf84f8?w=600&q=80",
  "eastern caribbean": "https://images.unsplash.com/photo-1692719199304-86a527fb1df8?w=600&q=80",
  "southern caribbean": "https://images.unsplash.com/photo-1693574276068-d5d65bb34ad0?w=600&q=80",
  "caribbean": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
};

const DEFAULT_CRUISE_IMAGE = "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80";

function getDealImage(deal: RealDeal): string {
  // 1. Use API image if available (but not Carnival's random ones)
  if (deal.imageUrl) return deal.imageUrl;

  // 2. Match by ports of call
  for (const port of deal.ports) {
    const portLower = port.toLowerCase();
    for (const [key, img] of Object.entries(PORT_IMAGES)) {
      if (portLower.includes(key)) return img;
    }
  }

  // 3. Match by itinerary title (e.g., "Western Caribbean")
  const titleLower = deal.itineraryTitle.toLowerCase();
  for (const [key, img] of Object.entries(PORT_IMAGES)) {
    if (titleLower.includes(key)) return img;
  }

  // 4. Match by departure port
  const depLower = deal.departurePort.toLowerCase();
  for (const [key, img] of Object.entries(PORT_IMAGES)) {
    if (depLower.includes(key)) return img;
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
  // Exact match
  if (PORT_COUNTRIES[port]) return `${port}, ${PORT_COUNTRIES[port]}`;
  // Case-insensitive partial match
  const portLower = port.toLowerCase();
  for (const [key, country] of Object.entries(PORT_COUNTRIES)) {
    if (portLower.includes(key.toLowerCase()) || key.toLowerCase().includes(portLower)) {
      return `${port}, ${country}`;
    }
  }
  return port;
}

/* -- Extract unique values from data -- */
const ALL_CRUISE_LINE_IDS = [
  ...new Set(REAL_DEALS.map((d) => d.cruiseLineId)),
];
const ALL_DEPARTURE_PORTS = [
  ...new Set(REAL_DEALS.map((d) => d.departurePort)),
].sort();
const ALL_SHIP_NAMES = [...new Set(REAL_DEALS.map((d) => d.shipName))].sort();

/* -- Count helpers -- */
function countByField(
  deals: RealDeal[],
  field: keyof RealDeal
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const d of deals) {
    const val = String(d[field]);
    counts.set(val, (counts.get(val) || 0) + 1);
  }
  return counts;
}

function countByDuration(deals: RealDeal[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const d of deals) {
    const key = getDurationKey(d.duration);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

/* -- Price bounds -- */
const ABSOLUTE_MIN_PRICE = DEAL_STATS.lowestPrice;
const ABSOLUTE_MAX_PRICE = DEAL_STATS.highestPrice;

/* ------------------------------------------------------------------ */
/*  Filter section components                                          */
/* ------------------------------------------------------------------ */

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold text-navy"
      >
        {title}
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function CheckboxGroup({
  items,
  selected,
  onChange,
  maxVisible = Infinity,
}: {
  items: { value: string; label: string; count: number }[];
  selected: Set<string>;
  onChange: (value: string) => void;
  maxVisible?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, maxVisible);
  const hasMore = items.length > maxVisible;

  return (
    <div className="space-y-2">
      {visible.map((item) => (
        <label
          key={item.value}
          className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 hover:text-navy"
        >
          <input
            type="checkbox"
            checked={selected.has(item.value)}
            onChange={() => onChange(item.value)}
            className="h-4 w-4 rounded border-gray-300 accent-teal"
          />
          <span className="flex-1 truncate">{item.label}</span>
          <span className="text-xs text-gray-400">({item.count})</span>
        </label>
      ))}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-semibold text-teal hover:text-teal-dark"
        >
          {showAll ? "Show less" : `Show all ${items.length}`}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Deal card                                                          */
/* ------------------------------------------------------------------ */

function DealCard({ deal }: { deal: RealDeal }) {
  const line = CRUISE_LINES.find((l) => l.id === deal.cruiseLineId);
  const imgSrc = getDealImage(deal);
  const region =
    deal.itineraryTitle
      .replace(/^\d+-Night\s+/i, "")
      .replace(/\s+from\s+.*/i, "")
      .trim() || "Caribbean";

  const calcHref = `/calculator?line=${deal.cruiseLineId}&duration=${deal.duration}&adults=2&fare=${deal.fromPrice}${deal.departureDate ? `&month=${new Date(deal.departureDate).getMonth()}` : ""}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-lg)] md:flex-row">
      {/* Image */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-auto md:w-[220px]">
        <Image
          src={imgSrc}
          alt={`${deal.shipName} - ${deal.itineraryTitle}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 220px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <div className="absolute top-3 left-3 rounded-md bg-navy/80 px-2 py-1 text-xs font-bold text-white">
          {deal.duration} nights
        </div>
        <HeartButton
          dealId={deal.id}
          dealData={{
            cruiseLineId: deal.cruiseLineId,
            cruiseLine: deal.cruiseLine,
            shipName: deal.shipName,
            duration: deal.duration,
            departurePort: deal.departurePort,
            ports: deal.ports,
            fromPrice: deal.fromPrice,
            departureDate: deal.departureDate,
            itineraryTitle: deal.itineraryTitle,
            imageUrl: deal.imageUrl,
            bookingUrl: deal.bookingUrl,
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4 md:p-5">
        <div>
          <h3 className="font-bold text-navy group-hover:text-teal transition-colors">
            {deal.duration} Night {region} Cruise
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {deal.departureDate
              ? new Date(deal.departureDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Multiple dates available"}
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span>Departs from {deal.departurePort}</span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <CruiseLineLogo cruiseLineId={deal.cruiseLineId} size="sm" />
            <span className="text-xs text-gray-500">
              {deal.cruiseLine} &middot; {deal.shipName}
            </span>
          </div>

          {deal.ports.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {deal.ports.slice(0, 4).map((port) => (
                <Badge key={port} variant="outline" className="text-[10px]">
                  {getPortWithCountry(port)}
                </Badge>
              ))}
              {deal.ports.length > 4 && (
                <span className="text-[10px] text-gray-400 self-center">
                  +{deal.ports.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex shrink-0 flex-col gap-3 border-t border-gray-100 px-5 py-4 md:items-end md:justify-center md:border-t-0 md:border-l md:p-5 md:w-[180px]">
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-gray-400">
            from
          </p>
          <p className="font-price text-xl font-bold text-coral">
            ${deal.fromPrice.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400">per person</p>
        </div>
        <div className="flex flex-col gap-2 mt-3 w-full md:w-auto">
          <Button asChild size="sm" className="w-full">
            <Link href={calcHref}>See True Cost</Link>
          </Button>
          {deal.bookingUrl ? (
            <a
              href={deal.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border-2 border-coral bg-white px-4 py-2 text-xs font-bold text-coral transition-colors hover:bg-coral hover:text-white"
            >
              Book Now
            </a>
          ) : (
            <a
              href={`https://www.${deal.cruiseLineId === "virgin-voyages" ? "virginvoyages.com" : deal.cruiseLineId === "norwegian" ? "ncl.com" : deal.cruiseLineId === "royal-caribbean" ? "royalcaribbean.com" : deal.cruiseLineId === "celebrity" ? "celebritycruises.com" : deal.cruiseLineId + ".com"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border-2 border-coral bg-white px-4 py-2 text-xs font-bold text-coral transition-colors hover:bg-coral hover:text-white"
            >
              Book Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar filters                                                    */
/* ------------------------------------------------------------------ */

interface FilterState {
  priceRange: [number, number];
  cruiseLines: Set<string>;
  durations: Set<string>;
  departurePorts: Set<string>;
  ships: Set<string>;
}

function FilterSidebar({
  filters,
  setFilters,
  filteredCount,
  totalCount,
  onClose,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  filteredCount: number;
  totalCount: number;
  onClose?: () => void;
}) {
  /* Counts based on unfiltered data */
  const lineCountsMap = countByField(REAL_DEALS, "cruiseLineId");
  const durationCountsMap = countByDuration(REAL_DEALS);
  const portCountsMap = countByField(REAL_DEALS, "departurePort");
  const shipCountsMap = countByField(REAL_DEALS, "shipName");

  const toggleInSet = useCallback(
    (
      key: "cruiseLines" | "durations" | "departurePorts" | "ships",
      value: string
    ) => {
      setFilters((prev) => {
        const next = new Set(prev[key]);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        return { ...prev, [key]: next };
      });
    },
    [setFilters]
  );

  const clearAll = () => {
    setFilters({
      priceRange: [ABSOLUTE_MIN_PRICE, ABSOLUTE_MAX_PRICE],
      cruiseLines: new Set(ALL_CRUISE_LINE_IDS),
      durations: new Set(DURATION_RANGES.map((r) => r.key)),
      departurePorts: new Set(ALL_DEPARTURE_PORTS),
      ships: new Set(ALL_SHIP_NAMES),
    });
  };

  /* Cruise line items with display names */
  const cruiseLineItems = ALL_CRUISE_LINE_IDS.map((id) => {
    const line = CRUISE_LINES.find((l) => l.id === id);
    return {
      value: id,
      label: line?.name ?? id,
      count: lineCountsMap.get(id) ?? 0,
    };
  });

  const durationItems = DURATION_RANGES.map((r) => ({
    value: r.key,
    label: r.label,
    count: durationCountsMap.get(r.key) ?? 0,
  }));

  const portItems = ALL_DEPARTURE_PORTS.map((p) => ({
    value: p,
    label: p,
    count: portCountsMap.get(p) ?? 0,
  }));

  const shipItems = ALL_SHIP_NAMES.map((s) => ({
    value: s,
    label: s,
    count: shipCountsMap.get(s) ?? 0,
  }));

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <div>
          <p className="text-sm font-bold text-navy">
            {filteredCount} of {totalCount} cruises
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-teal hover:text-teal-dark"
          >
            Clear all
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded hover:bg-gray-100"
              aria-label="Close filters"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="px-5">
        {/* Price range */}
        <FilterSection title="Price Range">
          <div className="flex items-center justify-between mb-3">
            <span className="font-price text-sm font-semibold text-navy">
              ${filters.priceRange[0].toLocaleString()}
            </span>
            <span className="font-price text-sm font-semibold text-navy">
              ${filters.priceRange[1].toLocaleString()}
            </span>
          </div>
          <Slider
            value={filters.priceRange}
            min={ABSOLUTE_MIN_PRICE}
            max={ABSOLUTE_MAX_PRICE}
            step={25}
            onValueChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                priceRange: [val[0], val[1]],
              }))
            }
            formatValue={(v) => `$${v.toLocaleString()}`}
          />
          <div className="flex gap-2 mt-3">
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 uppercase">Min</label>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => {
                  const v = Math.max(
                    ABSOLUTE_MIN_PRICE,
                    Math.min(Number(e.target.value) || 0, filters.priceRange[1])
                  );
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [v, prev.priceRange[1]],
                  }));
                }}
                className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm font-price text-navy focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 uppercase">Max</label>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => {
                  const v = Math.min(
                    ABSOLUTE_MAX_PRICE,
                    Math.max(
                      Number(e.target.value) || 0,
                      filters.priceRange[0]
                    )
                  );
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], v],
                  }));
                }}
                className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm font-price text-navy focus:outline-none focus:ring-2 focus:ring-teal"
              />
            </div>
          </div>
        </FilterSection>

        {/* Cruise line */}
        <FilterSection title="Cruise Line">
          <CheckboxGroup
            items={cruiseLineItems}
            selected={filters.cruiseLines}
            onChange={(v) => toggleInSet("cruiseLines", v)}
          />
        </FilterSection>

        {/* Duration */}
        <FilterSection title="Duration">
          <CheckboxGroup
            items={durationItems}
            selected={filters.durations}
            onChange={(v) => toggleInSet("durations", v)}
          />
        </FilterSection>

        {/* Departure port */}
        <FilterSection title="Departure Port">
          <CheckboxGroup
            items={portItems}
            selected={filters.departurePorts}
            onChange={(v) => toggleInSet("departurePorts", v)}
            maxVisible={5}
          />
        </FilterSection>

        {/* Ship */}
        <FilterSection title="Ship">
          <CheckboxGroup
            items={shipItems}
            selected={filters.ships}
            onChange={(v) => toggleInSet("ships", v)}
            maxVisible={8}
          />
        </FilterSection>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main search page component                                         */
/* ------------------------------------------------------------------ */

export default function CruiseSearchPage() {
  /* Filter state */
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [ABSOLUTE_MIN_PRICE, ABSOLUTE_MAX_PRICE],
    cruiseLines: new Set(ALL_CRUISE_LINE_IDS),
    durations: new Set(DURATION_RANGES.map((r) => r.key)),
    departurePorts: new Set(ALL_DEPARTURE_PORTS),
    ships: new Set(ALL_SHIP_NAMES),
  });

  const [sort, setSort] = useState<SortKey>("price-asc");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [includeTaxes, setIncludeTaxes] = useState(false);

  /* Filtered + sorted deals */
  const filteredDeals = useMemo(() => {
    let deals = REAL_DEALS.filter((d) => {
      if (d.fromPrice < filters.priceRange[0]) return false;
      if (d.fromPrice > filters.priceRange[1]) return false;
      if (!filters.cruiseLines.has(d.cruiseLineId)) return false;
      if (!filters.durations.has(getDurationKey(d.duration))) return false;
      if (!filters.departurePorts.has(d.departurePort)) return false;
      if (!filters.ships.has(d.shipName)) return false;
      return true;
    });

    /* Sort */
    deals = [...deals].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.fromPrice - b.fromPrice;
        case "price-desc":
          return b.fromPrice - a.fromPrice;
        case "duration-asc":
          return a.duration - b.duration;
        case "duration-desc":
          return b.duration - a.duration;
        case "ship-asc":
          return a.shipName.localeCompare(b.shipName);
        default:
          return 0;
      }
    });

    return deals;
  }, [filters, sort]);

  /* Pagination */
  const totalPages = Math.ceil(filteredDeals.length / ITEMS_PER_PAGE);
  const paginatedDeals = filteredDeals.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = page * ITEMS_PER_PAGE < filteredDeals.length;

  /* Reset page when filters change */
  const setFiltersAndResetPage: typeof setFilters = useCallback(
    (val) => {
      setFilters(val);
      setPage(1);
    },
    []
  );

  return (
    <>
      {/* Page header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-1">
            <Anchor className="h-5 w-5 text-teal" />
            <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Cruise Deals
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Browse {DEAL_STATS.totalDeals} real sailings from{" "}
            {DEAL_STATS.cruiseLines.length} cruise lines &middot; Prices
            updated daily
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* ---- Desktop sidebar ---- */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-20 rounded-xl border border-gray-200 bg-white shadow-[var(--shadow-sm)] overflow-hidden max-h-[calc(100vh-6rem)] overflow-y-auto">
              <FilterSidebar
                filters={filters}
                setFilters={setFiltersAndResetPage}
                filteredCount={filteredDeals.length}
                totalCount={REAL_DEALS.length}
              />
            </div>
          </aside>

          {/* ---- Results area ---- */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-navy shadow-sm hover:bg-gray-50"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>

                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-navy">
                    {filteredDeals.length}
                  </span>{" "}
                  cruises
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Tax toggle */}
                <label className="hidden sm:flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                  <Switch
                    checked={includeTaxes}
                    onCheckedChange={setIncludeTaxes}
                  />
                  Include taxes &amp; fees
                </label>

                {/* Sort */}
                <Select
                  value={sort}
                  onValueChange={(v) => {
                    setSort(v as SortKey);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results list */}
            {filteredDeals.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20 text-center">
                <Ship className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg font-semibold text-navy">
                  No cruises match your filters
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your price range or clearing some filters.
                </p>
                <button
                  onClick={() =>
                    setFiltersAndResetPage({
                      priceRange: [ABSOLUTE_MIN_PRICE, ABSOLUTE_MAX_PRICE],
                      cruiseLines: new Set(ALL_CRUISE_LINE_IDS),
                      durations: new Set(DURATION_RANGES.map((r) => r.key)),
                      departurePorts: new Set(ALL_DEPARTURE_PORTS),
                      ships: new Set(ALL_SHIP_NAMES),
                    })
                  }
                  className="mt-4 text-sm font-semibold text-teal hover:text-teal-dark"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            )}

            {/* Load more / pagination */}
            {hasMore && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPage((p) => p + 1)}
                >
                  Show more cruises
                </Button>
                <p className="text-xs text-gray-400">
                  Showing {paginatedDeals.length} of {filteredDeals.length}
                </p>
              </div>
            )}

            {/* Bottom pagination info */}
            {!hasMore && filteredDeals.length > 0 && (
              <p className="mt-8 text-center text-xs text-gray-400">
                Showing all {filteredDeals.length} results
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ---- Mobile filter drawer ---- */}
      {mobileFiltersOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-[320px] max-w-[85vw] bg-white shadow-xl lg:hidden overflow-hidden">
            <FilterSidebar
              filters={filters}
              setFilters={setFiltersAndResetPage}
              filteredCount={filteredDeals.length}
              totalCount={REAL_DEALS.length}
              onClose={() => setMobileFiltersOpen(false)}
            />
          </div>
        </>
      )}
    </>
  );
}
