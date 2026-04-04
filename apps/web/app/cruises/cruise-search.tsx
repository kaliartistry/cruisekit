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
import { REAL_DEALS, DEAL_STATS, type RealDeal, type DealRegion } from "@/lib/data/real-deals";
import { getDealImage } from "@/lib/data/port-images";
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

const CRUISE_LINE_URLS: Record<string, string> = {
  "carnival": "https://www.carnival.com",
  "royal-caribbean": "https://www.royalcaribbean.com",
  "norwegian": "https://www.ncl.com",
  "msc": "https://www.msccruisesusa.com",
  "celebrity": "https://www.celebritycruises.com",
  "holland-america": "https://www.hollandamerica.com",
  "disney": "https://disneycruise.disney.go.com",
  "virgin-voyages": "https://www.virginvoyages.com",
  "princess": "https://www.princess.com",
};

function getCruiseLineUrl(cruiseLineId: string): string {
  return CRUISE_LINE_URLS[cruiseLineId] ?? `https://www.${cruiseLineId}.com`;
}

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
  caribbean: "Caribbean",
  bahamas: "Bahamas",
  mexico: "Mexico",
  mediterranean: "Mediterranean",
  europe: "Europe",
  alaska: "Alaska",
  pacific: "Pacific",
  asia: "Asia",
  other: "Other",
};
const ALL_REGIONS = [...new Set(REAL_DEALS.map((d) => d.region))] as DealRegion[];

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

// Lines where the scraped price already includes taxes & port fees
const TAXES_INCLUDED_LINES = new Set([
  "disney",           // Disney API returns total with taxes
  "royal-caribbean",  // RCI API has areTaxesAndFeesIncluded: true
  "celebrity",        // Celebrity uses same RCI API, taxes included
]);

// Estimated tax per night per person for lines where we only have base fare
// Based on industry averages for Caribbean cruises
const TAX_ESTIMATES: Record<string, number> = {
  "carnival": 25,       // Carnival typically $20-30/night
  "norwegian": 28,      // NCL typically $25-35/night
  "virgin-voyages": 30, // Virgin ~$30/night
  "msc": 22,            // MSC typically $20-25/night
  "holland-america": 27, // HAL typically $25-30/night
};

function estimateTaxes(deal: RealDeal): number {
  if (TAXES_INCLUDED_LINES.has(deal.cruiseLineId)) return 0;
  const perNight = TAX_ESTIMATES[deal.cruiseLineId] || 25;
  return deal.duration * perNight;
}

function DealCard({ deal, includeTaxes }: { deal: RealDeal; includeTaxes?: boolean }) {
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
              {deal.ports.slice(0, 6).map((port) => (
                <Badge key={port} variant="outline" className="text-[10px]">
                  {getPortWithCountry(port)}
                </Badge>
              ))}
              {deal.ports.length > 6 && (
                <span className="text-[10px] text-gray-400 self-center">
                  +{deal.ports.length - 6} more
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
            Interior from
          </p>
          <p className="font-price text-xl font-bold text-coral">
            ${includeTaxes
              ? (deal.fromPrice + estimateTaxes(deal)).toLocaleString()
              : deal.fromPrice.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400">
            per person {includeTaxes
              ? TAXES_INCLUDED_LINES.has(deal.cruiseLineId) ? "(incl. taxes)" : "(est. incl. taxes)"
              : TAXES_INCLUDED_LINES.has(deal.cruiseLineId) ? "(incl. taxes)" : "(excl. taxes)"}
          </p>
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
              href={getCruiseLineUrl(deal.cruiseLineId)}
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
  regions: Set<string>;
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
  const regionCountsMap = countByField(REAL_DEALS, "region");
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

  const toggleInSet = useCallback(
    (
      key: "regions" | "cruiseLines" | "durations" | "months" | "departurePorts" | "ships",
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
      regions: new Set(ALL_REGIONS),
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

        {/* Destination */}
        <FilterSection title="Destination">
          <CheckboxGroup
            items={regionItems}
            selected={filters.regions}
            onChange={(v) => toggleInSet("regions", v)}
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
    regions: new Set(["caribbean", "bahamas", "mexico"]),
    cruiseLines: new Set(ALL_CRUISE_LINE_IDS),
    durations: new Set(DURATION_RANGES.map((r) => r.key)),
    months: new Set(ALL_MONTHS),
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
      if (!filters.regions.has(d.region)) return false;
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
            {DEAL_STATS.cruiseLines.length} cruise lines &middot; Updated{" "}
            {new Date(DEAL_STATS.lastScraped).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
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
                      regions: new Set(ALL_REGIONS),
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
              <div className="space-y-4">
                {paginatedDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} includeTaxes={includeTaxes} />
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
