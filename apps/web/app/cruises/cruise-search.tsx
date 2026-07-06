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
  CalendarDays,
} from "lucide-react";
import { REAL_DEALS, DEAL_STATS, type RealDeal, type DealRegion } from "@/lib/data/real-deals";
import { getDealImage } from "@/lib/data/port-images";
import { CRUISE_LINES } from "@cruise/shared/constants";
import CruiseLineLogo from "@/components/shared/cruise-line-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import HeartButton from "@/components/shared/heart-button";
import ActiveCruiseButton from "@/components/shared/active-cruise-button";
import AffiliateDisclosure from "@/components/shared/affiliate-disclosure";
import {
  confidenceLabel,
  confidenceBadgeClass,
  formatLastVerified,
  priceBasisLabel,
} from "@/lib/format/confidence";

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
  { value: "best", label: "Best Matches" },
  { value: "date-asc", label: "Date: Soonest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "duration-asc", label: "Duration: Short to Long" },
  { value: "duration-desc", label: "Duration: Long to Short" },
  { value: "ship-asc", label: "Ship Name A-Z" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

/* Port images and getDealImage imported from @/lib/data/port-images */

/* Port images and getDealImage imported from @/lib/data/port-images */

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

const REGION_LABELS: Record<DealRegion, string> = {
  caribbean: "Caribbean & Bahamas",
  bahamas: "Bahamas",
  mexico: "Mexico",
  mediterranean: "Mediterranean",
  europe: "Europe",
  alaska: "Alaska",
  pacific: "Pacific",
  asia: "Asia",
  "south-america": "South America",
  antarctica: "Antarctica",
  "panama-canal": "Panama Canal",
  "canada-new-england": "Canada & New England",
  "australia-new-zealand": "Australia & New Zealand",
  other: "Other",
};
const ALL_REGIONS = [
  ...new Set(REAL_DEALS.map((d) => normalizeFilterRegion(d.region))),
] as DealRegion[];

const PORT_HIGHLIGHTS = [
  { key: "bahamas", label: "Bahamas stop" },
  { key: "private-island", label: "Private island stop" },
  { key: "mexico", label: "Mexico stop" },
  { key: "dominican-republic", label: "Dominican Republic stop" },
  { key: "jamaica", label: "Jamaica stop" },
  { key: "grand-cayman", label: "Grand Cayman stop" },
] as const;

type PortHighlightKey = (typeof PORT_HIGHLIGHTS)[number]["key"];

function getPortHighlightKeys(deal: RealDeal): Set<PortHighlightKey> {
  const text = [deal.itineraryTitle, ...deal.ports].join(" ").toLowerCase();
  const keys = new Set<PortHighlightKey>();

  if (
    /bahamas|bimini|nassau|cococay|great stirrup|half moon cay|celebration key|ocean cay|princess cays/.test(
      text,
    )
  ) {
    keys.add("bahamas");
  }
  if (
    /private island|beach club|cococay|great stirrup|half moon cay|celebration key|ocean cay|princess cays|harvest caye|labadee/.test(
      text,
    )
  ) {
    keys.add("private-island");
  }
  if (/mexico|cozumel|costa maya|progreso|cabo san lucas|puerto vallarta|mazatlan|ensenada/.test(text)) {
    keys.add("mexico");
  }
  if (/dominican republic|puerto plata|amber cove|la romana|samana/.test(text)) {
    keys.add("dominican-republic");
  }
  if (/jamaica|falmouth|ocho rios|montego bay/.test(text)) {
    keys.add("jamaica");
  }
  if (/grand cayman|george town/.test(text)) {
    keys.add("grand-cayman");
  }

  return keys;
}

function normalizeFilterRegion(region: DealRegion): DealRegion {
  return region === "bahamas" ? "caribbean" : region;
}

function matchesRegionFilter(deal: RealDeal, selectedRegions: Set<string>): boolean {
  return selectedRegions.has(normalizeFilterRegion(deal.region));
}

function countByPortHighlight(deals: RealDeal[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const deal of deals) {
    for (const key of getPortHighlightKeys(deal)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function getDepartureMonth(date: string | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(ym: string): string {
  const [year, month] = ym.split("-");
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const ALL_MONTHS = [...new Set(
  REAL_DEALS.map((d) => getDepartureMonth(d.departureDate)).filter(Boolean) as string[]
)].sort();

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

function countByNormalizedRegion(deals: RealDeal[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const deal of deals) {
    const region = normalizeFilterRegion(deal.region);
    counts.set(region, (counts.get(region) || 0) + 1);
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
  const imgSrc = getDealImage(deal);

  const ctaHref = deal.affiliateLink ?? deal.directLink ?? null;
  const calcHref = `/calculator?line=${deal.cruiseLineId}&duration=${deal.duration}&adults=2&fare=${deal.fromPrice}${deal.departureDate ? `&month=${new Date(deal.departureDate).getMonth()}` : ""}`;
  const basisText = priceBasisLabel(deal.priceBasis) || "per person, double occupancy";
  const taxText = deal.taxesAndFeesIncluded
    ? "Taxes, fees, and gratuities included."
    : "Excludes taxes, fees, and gratuities.";
  const checkedDate = formatLastVerified(deal.lastVerified);
  const priceDisclosure = checkedDate
    ? `Planning fare last checked ${checkedDate}. Confirm current price and availability on ${deal.cruiseLine}.`
    : `Planning fare only. Confirm current price and availability on ${deal.cruiseLine}.`;
  const displayedPrice = deal.startingPrice ?? deal.fromPrice;
  const visiblePorts = deal.ports.slice(0, 4);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[var(--shadow-sm)] transition-all hover:border-teal/40 hover:shadow-[var(--shadow-lg)] md:flex-row">
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
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-teal/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-teal">
              {deal.duration} nights
            </span>
            <span
              className={cn(
                "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide",
                confidenceBadgeClass(deal.confidence),
              )}
            >
              {confidenceLabel(deal.confidence)}
            </span>
          </div>

          <h3 className="text-base font-bold leading-tight text-navy transition-colors group-hover:text-teal">
            {deal.itineraryTitle}
          </h3>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
            {deal.departureDate
              ? new Date(deal.departureDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Multiple dates available"}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="truncate">From {deal.departurePort}</span>
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <CruiseLineLogo cruiseLineId={deal.cruiseLineId} size="sm" />
            <span className="text-xs text-gray-500">
              {deal.cruiseLine} &middot; {deal.shipName}
            </span>
          </div>

          {deal.ports.length > 0 && (
            <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">Ports</p>
              <div className="flex flex-wrap gap-1">
              {visiblePorts.map((port, index) => (
                <Badge
                  key={`${port}-${index}`}
                  variant="outline"
                  className="text-[10px]"
                >
                  {getPortWithCountry(port)}
                </Badge>
              ))}
              {deal.ports.length > visiblePorts.length && (
                <span className="text-[10px] text-gray-400 self-center">
                  +{deal.ports.length - visiblePorts.length} more
                </span>
              )}
              </div>
            </div>
          )}

          {deal.badges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {deal.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-md bg-teal/10 px-2 py-1 text-[10px] font-semibold text-teal"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Price + source attribution + CTA. Headline is a planning fare from
          the source data, not a live quote. The TCO breakdown lives in
          /calculator. Source row is
          required on every visible card per the canonical schema. */}
      <div className="flex shrink-0 flex-col gap-3 border-t border-gray-100 bg-gray-50/60 px-5 py-4 md:items-end md:justify-center md:border-t-0 md:border-l md:p-5 md:w-[235px]">
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-gray-400">
            Planning fare from
          </p>
          {displayedPrice !== null ? (
            <p className="font-price text-2xl font-bold text-navy leading-none">
              ${displayedPrice.toLocaleString()}
            </p>
          ) : (
            <p className="text-sm font-semibold text-gray-500">Price on cruise line site</p>
          )}
          {basisText && (
            <p className="text-[10px] text-gray-500 mt-1">{basisText}</p>
          )}
          <p className="text-[10px] text-gray-400 mt-0.5">{taxText}</p>
        </div>

        <div className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-right text-[10px] leading-snug text-gray-500">
          <span className="block font-medium text-gray-700">Source: {deal.source}</span>
          <span className="block">Checked: {formatLastVerified(deal.lastVerified)}</span>
          <span className="mt-1 block">{priceDisclosure}</span>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto">
          {ctaHref ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer sponsored nofollow"
              className="inline-flex items-center justify-center rounded-lg bg-teal px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-teal-dark"
            >
              Check with source
            </a>
          ) : null}
          <Button asChild size="sm" variant="outline" className="w-full">
            <Link href={calcHref}>Estimate total cost</Link>
          </Button>
          <ActiveCruiseButton deal={deal} />
          <AffiliateDisclosure className="mt-1 text-right md:text-right" />
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
  regions: Set<string>;
  portHighlights: Set<string>;
  cruiseLines: Set<string>;
  durations: Set<string>;
  months: Set<string>;
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
  const regionCountsMap = countByNormalizedRegion(REAL_DEALS);
  const portHighlightCountsMap = countByPortHighlight(REAL_DEALS);
  const lineCountsMap = countByField(REAL_DEALS, "cruiseLineId");
  const durationCountsMap = countByDuration(REAL_DEALS);
  const monthCountsMap = (() => {
    const m = new Map<string, number>();
    for (const d of REAL_DEALS) {
      const mo = getDepartureMonth(d.departureDate);
      if (mo) m.set(mo, (m.get(mo) || 0) + 1);
    }
    return m;
  })();
  const portCountsMap = countByField(REAL_DEALS, "departurePort");
  const shipCountsMap = countByField(REAL_DEALS, "shipName");

  const toggleInSet = (
    key:
      | "regions"
      | "portHighlights"
      | "cruiseLines"
      | "durations"
      | "months"
      | "departurePorts"
      | "ships",
    value: string
  ) => {
    setFilters((prev) => {
      const next = new Set(prev[key]);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return { ...prev, [key]: next };
    });
  };

  const clearAll = () => {
    setFilters({
      priceRange: [ABSOLUTE_MIN_PRICE, ABSOLUTE_MAX_PRICE],
      regions: new Set(ALL_REGIONS),
      portHighlights: new Set(),
      cruiseLines: new Set(ALL_CRUISE_LINE_IDS),
      durations: new Set(DURATION_RANGES.map((r) => r.key)),
      months: new Set(ALL_MONTHS),
      departurePorts: new Set(ALL_DEPARTURE_PORTS),
      ships: new Set(ALL_SHIP_NAMES),
    });
  };

  const regionItems = ALL_REGIONS.map((r) => ({
    value: r,
    label: REGION_LABELS[r] || r,
    count: regionCountsMap.get(r) ?? 0,
  })).sort((a, b) => b.count - a.count);

  const portHighlightItems = PORT_HIGHLIGHTS.map((highlight) => ({
    value: highlight.key,
    label: highlight.label,
    count: portHighlightCountsMap.get(highlight.key) ?? 0,
  })).filter((item) => item.count > 0);

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

  const monthItems = ALL_MONTHS.map((m) => ({
    value: m,
    label: formatMonth(m),
    count: monthCountsMap.get(m) ?? 0,
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

        {/* Destination region */}
        <FilterSection title="Destination Region">
          <CheckboxGroup
            items={regionItems}
            selected={filters.regions}
            onChange={(v) => toggleInSet("regions", v)}
          />
        </FilterSection>

        {/* Port highlights */}
        <FilterSection title="Stops Include" defaultOpen={false}>
          <CheckboxGroup
            items={portHighlightItems}
            selected={filters.portHighlights}
            onChange={(v) => toggleInSet("portHighlights", v)}
          />
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

        {/* Month */}
        {monthItems.length > 0 && (
          <FilterSection title="Departure Month" defaultOpen={false}>
            <CheckboxGroup
              items={monthItems}
              selected={filters.months}
              onChange={(v) => toggleInSet("months", v)}
              maxVisible={6}
            />
          </FilterSection>
        )}

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
    regions: new Set(ALL_REGIONS),
    portHighlights: new Set(),
    cruiseLines: new Set(ALL_CRUISE_LINE_IDS),
    durations: new Set(DURATION_RANGES.map((r) => r.key)),
    months: new Set(ALL_MONTHS),
    departurePorts: new Set(ALL_DEPARTURE_PORTS),
    ships: new Set(ALL_SHIP_NAMES),
  });

  const [sort, setSort] = useState<SortKey>("best");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  /* Filtered + sorted deals */
  const filteredDeals = useMemo(() => {
    let deals = REAL_DEALS.filter((d) => {
      if (d.fromPrice < filters.priceRange[0]) return false;
      if (d.fromPrice > filters.priceRange[1]) return false;
      if (!matchesRegionFilter(d, filters.regions)) return false;
      if (filters.portHighlights.size > 0) {
        const dealHighlights = getPortHighlightKeys(d);
        if (![...filters.portHighlights].some((key) => dealHighlights.has(key as PortHighlightKey))) {
          return false;
        }
      }
      if (!filters.cruiseLines.has(d.cruiseLineId)) return false;
      if (!filters.durations.has(getDurationKey(d.duration))) return false;
      if (filters.months.size < ALL_MONTHS.length) {
        const m = getDepartureMonth(d.departureDate);
        if (m && !filters.months.has(m)) return false;
      }
      if (!filters.departurePorts.has(d.departurePort)) return false;
      if (!filters.ships.has(d.shipName)) return false;
      return true;
    });

    /* Sort */
    deals = [...deals].sort((a, b) => {
      switch (sort) {
        case "best":
          return b.dealScore - a.dealScore || a.fromPrice - b.fromPrice;
        case "date-asc":
          return String(a.departureDate ?? "").localeCompare(String(b.departureDate ?? "")) || a.fromPrice - b.fromPrice;
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
  const paginatedDeals = filteredDeals.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = page * ITEMS_PER_PAGE < filteredDeals.length;
  const groupedDeals = useMemo(() => groupDealsByMonth(paginatedDeals), [paginatedDeals]);
  const curatedCollections = useMemo(() => buildCuratedCollections(REAL_DEALS), []);

  /* Reset page when filters change */
  const setFiltersAndResetPage: typeof setFilters = useCallback(
    (val) => {
      setFilters(val);
      setPage(1);
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFiltersAndResetPage({
      priceRange: [ABSOLUTE_MIN_PRICE, ABSOLUTE_MAX_PRICE],
      regions: new Set(ALL_REGIONS),
      portHighlights: new Set(),
      cruiseLines: new Set(ALL_CRUISE_LINE_IDS),
      durations: new Set(DURATION_RANGES.map((r) => r.key)),
      months: new Set(ALL_MONTHS),
      departurePorts: new Set(ALL_DEPARTURE_PORTS),
      ships: new Set(ALL_SHIP_NAMES),
    });
    setSort("best");
  }, [setFiltersAndResetPage]);

  const applyCuratedCollection = useCallback(
    (key: CuratedCollectionKey) => {
      const nextFilters: FilterState = {
        priceRange: [ABSOLUTE_MIN_PRICE, ABSOLUTE_MAX_PRICE],
        regions: new Set(ALL_REGIONS),
        portHighlights: new Set(),
        cruiseLines: new Set(ALL_CRUISE_LINE_IDS),
        durations: new Set(DURATION_RANGES.map((r) => r.key)),
        months: new Set(ALL_MONTHS),
        departurePorts: new Set(ALL_DEPARTURE_PORTS),
        ships: new Set(ALL_SHIP_NAMES),
      };

      if (key === "under-500") nextFilters.priceRange = [ABSOLUTE_MIN_PRICE, 500];
      if (key === "short") nextFilters.durations = new Set(["3-4", "5-6"]);
      if (key === "seven-night-caribbean") {
        nextFilters.regions = new Set(["caribbean"]);
        nextFilters.durations = new Set(["7"]);
      }
      if (key === "florida") {
        nextFilters.departurePorts = new Set(
          ALL_DEPARTURE_PORTS.filter((port) =>
            /miami|tampa|fort lauderdale|port canaveral|orlando/i.test(port),
          ),
        );
      }
      if (key === "virgin-voyages") nextFilters.cruiseLines = new Set(["virgin-voyages"]);

      setFiltersAndResetPage(nextFilters);
      setSort(key === "soonest" ? "date-asc" : "best");
    },
    [setFiltersAndResetPage],
  );

  return (
    <>
      {/* Page header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-1">
              <Anchor className="h-5 w-5 text-teal" />
            <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Curated Sailings
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            {DEAL_STATS.totalDeals} planning-ready sailing
            {DEAL_STATS.totalDeals === 1 ? "" : "s"} from{" "}
            {DEAL_STATS.cruiseLines.length} cruise line
            {DEAL_STATS.cruiseLines.length === 1 ? "" : "s"}
            {DEAL_STATS.lastVerified
              ? ` · Latest check ${formatLastVerified(DEAL_STATS.lastVerified)}`
              : ""}
            {" "}· Final fares and availability must be confirmed with the source.
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
            <CuratedCollections
              collections={curatedCollections}
              onSelect={applyCuratedCollection}
              onReset={resetFilters}
            />

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
                      regions: new Set(ALL_REGIONS),
                      portHighlights: new Set(),
                      cruiseLines: new Set(ALL_CRUISE_LINE_IDS),
                      durations: new Set(DURATION_RANGES.map((r) => r.key)),
                      months: new Set(ALL_MONTHS),
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
              <div className="space-y-8">
                {groupedDeals.map((group) => (
                  <section key={group.monthKey} className="space-y-3">
                    <div className="flex items-end justify-between gap-3 border-b border-gray-200 pb-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-teal" />
                        <h2 className="text-lg font-bold text-navy">{group.monthLabel}</h2>
                      </div>
                      <p className="text-xs text-gray-500">
                        {group.deals.length} visible
                      </p>
                    </div>
                    <div className="space-y-4">
                      {group.deals.map((deal) => (
                        <DealCard key={deal.id} deal={deal} />
                      ))}
                    </div>
                  </section>
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

type CuratedCollectionKey =
  | "best"
  | "under-500"
  | "short"
  | "seven-night-caribbean"
  | "florida"
  | "virgin-voyages"
  | "soonest";

interface CuratedCollection {
  key: CuratedCollectionKey;
  label: string;
  subtitle: string;
  count: number;
  fromPrice: number | null;
}

function buildCuratedCollections(deals: RealDeal[]): CuratedCollection[] {
  const collections: Omit<CuratedCollection, "count" | "fromPrice">[] = [
    { key: "best", label: "Best picks", subtitle: "Useful starting points" },
    { key: "under-500", label: "Under $500", subtitle: "Lowest entry fares" },
    { key: "short", label: "Short cruises", subtitle: "3-6 night getaways" },
    { key: "seven-night-caribbean", label: "7-night Caribbean", subtitle: "Classic weeklong trips" },
    { key: "florida", label: "Leaving from Florida", subtitle: "Miami, Tampa, Port Canaveral" },
    { key: "virgin-voyages", label: "Virgin Voyages", subtitle: "Adults-only sailings" },
    { key: "soonest", label: "Soonest departures", subtitle: "Upcoming sailings" },
  ];

  return collections.map((collection) => {
    const matches = curatedMatches(collection.key, deals);
    const prices = matches.map((deal) => deal.fromPrice).filter(Number.isFinite);
    return {
      ...collection,
      count: matches.length,
      fromPrice: prices.length ? Math.min(...prices) : null,
    };
  });
}

function curatedMatches(key: CuratedCollectionKey, deals: RealDeal[]): RealDeal[] {
  switch (key) {
    case "under-500":
      return deals.filter((deal) => deal.fromPrice <= 500);
    case "short":
      return deals.filter((deal) => deal.duration >= 3 && deal.duration <= 6);
    case "seven-night-caribbean":
      return deals.filter((deal) => deal.duration === 7 && deal.region === "caribbean");
    case "florida":
      return deals.filter((deal) => /miami|tampa|fort lauderdale|port canaveral|orlando/i.test(deal.departurePort));
    case "virgin-voyages":
      return deals.filter((deal) => deal.cruiseLineId === "virgin-voyages");
    case "soonest":
      return [...deals].sort((a, b) => String(a.departureDate ?? "").localeCompare(String(b.departureDate ?? ""))).slice(0, 12);
    case "best":
    default:
      return [...deals].sort((a, b) => b.dealScore - a.dealScore || a.fromPrice - b.fromPrice).slice(0, 12);
  }
}

function CuratedCollections({
  collections,
  onSelect,
  onReset,
}: {
  collections: CuratedCollection[];
  onSelect: (key: CuratedCollectionKey) => void;
  onReset: () => void;
}) {
  return (
    <section className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-[var(--shadow-sm)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-navy">Start with a curated set</h2>
          <p className="text-xs text-gray-500">Quick entry points before the full month catalog.</p>
        </div>
        <button onClick={onReset} className="text-xs font-semibold text-teal hover:text-teal-dark">
          All cruises
        </button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {collections.map((collection) => (
          <button
            key={collection.key}
            onClick={() => onSelect(collection.key)}
            className="min-w-0 rounded-lg border border-gray-200 px-3 py-3 text-left transition-colors hover:border-teal hover:bg-teal/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-navy">{collection.label}</p>
                <p className="truncate text-xs text-gray-500">{collection.subtitle}</p>
              </div>
              <span className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600">
                {collection.count}
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold text-teal">
              {collection.fromPrice != null ? `From $${collection.fromPrice.toLocaleString()}` : "Browse"}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

function groupDealsByMonth(deals: RealDeal[]): {
  monthKey: string;
  monthLabel: string;
  deals: RealDeal[];
}[] {
  const groups = new Map<string, RealDeal[]>();
  for (const deal of deals) {
    const key = deal.monthKey ?? "unknown";
    groups.set(key, [...(groups.get(key) ?? []), deal]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, monthDeals]) => ({
      monthKey,
      monthLabel: monthDeals[0]?.monthLabel ?? "Date TBD",
      deals: monthDeals,
    }));
}
