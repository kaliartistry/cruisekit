import type { CruiseLineId } from "@cruise/shared/types";
import { CRUISE_LINES } from "@cruise/shared/constants";

import carnivalData from "./scraped/carnival-sailings.json";
import virginData from "./scraped/virgin-sailings.json";
import mscRawData from "./scraped/msc-full-intercepted.json";
import rciRawData from "./scraped/rci-intercepted.json";
import celebrityRawData from "./scraped/celebrity-intercepted.json";
import nclData from "./scraped/ncl-sailings.json";
import halData from "./scraped/hal-sailings.json";
import disneyData from "./scraped/disney-sailings.json";
import celebrityCleanData from "./scraped/celebrity-sailings.json";
import mscCleanData from "./scraped/msc-sailings.json";
import princessProductsData from "./scraped/princess-products.json";

export type SailingCatalogStatus = "ready" | "partial" | "pending";

export interface SailingCatalogEntry {
  id: string;
  cruiseLineId: CruiseLineId;
  cruiseLineName: string;
  shipName: string;
  shipCode: string | null;
  departureDate: string;
  returnDate: string | null;
  duration: number;
  departurePort: string;
  itineraryTitle: string;
  itineraryCode: string | null;
  regionLabel: string | null;
  ports: string[];
  bookingUrl: string | null;
  imageUrl: string | null;
  fromPrice: number | null;
  currency: string | null;
  source: string;
}

export interface SailingCatalogCoverage {
  cruiseLineId: CruiseLineId;
  cruiseLineName: string;
  status: SailingCatalogStatus;
  source: string;
  sailings: number;
  ships: number;
  earliestDepartureDate: string | null;
  latestDepartureDate: string | null;
  note: string;
  nextStep?: string;
}

const CRUISE_LINE_NAME_MAP = CRUISE_LINES.reduce((acc, line) => {
  acc[line.id] = line.name;
  return acc;
}, {} as Record<CruiseLineId, string>);

const VIRGIN_PORT_CODES: Record<string, string> = {
  MIA: "Miami",
  SJU: "San Juan",
  CZM: "Cozumel",
  BIM: "Bimini",
  NAS: "Nassau",
  POP: "Puerto Plata",
  GDT: "Grand Turk",
  STT: "St. Thomas",
  SXM: "St. Maarten",
  AUA: "Aruba",
  WIL: "Willemstad",
  KRA: "Kralendijk",
  BGI: "Barbados",
  ANU: "Antigua",
  SLU: "St. Lucia",
  SVD: "St. Vincent",
  GEC: "George Town",
  RTB: "Roatan",
  BZE: "Belize City",
  FDF: "Martinique",
  SKB: "St. Kitts",
  TOV: "Tortola",
  STX: "St. Croix",
  CMA: "Costa Maya",
  EYW: "Key West",
  OCJ: "Ocho Rios",
  FPO: "Freeport",
  RSU: "Iles des Saintes",
  SAM: "Samana",
  PGO: "Progreso",
  CBJ: "Cabo Rojo",
  BCN: "Barcelona",
  ATH: "Athens",
  SOU: "Southampton",
};

const CELEBRITY_SHIP_NAMES: Record<string, string> = {
  RF: "Celebrity Reflection",
  SL: "Celebrity Solstice",
  EQ: "Celebrity Equinox",
  SI: "Celebrity Silhouette",
  ED: "Celebrity Edge",
  AP: "Celebrity Apex",
  BY: "Celebrity Beyond",
  AS: "Celebrity Ascent",
  ML: "Celebrity Millennium",
  IN: "Celebrity Infinity",
  SM: "Celebrity Summit",
  CO: "Celebrity Constellation",
  XC: "Celebrity Xcel",
  FL: "Celebrity Flora",
  EG: "Celebrity Edge",
};

const LINE_STATUS: Record<CruiseLineId, Omit<SailingCatalogCoverage, "cruiseLineId" | "cruiseLineName" | "sailings" | "ships" | "earliestDepartureDate" | "latestDepartureDate">> = {
  carnival: {
    status: "partial",
    source: "carnival.com/cruisesearch/api/search",
    note: "Current scraper preserves only the first 10 sailing dates per itinerary.",
    nextStep: "Expand the Carnival scraper to persist every sailing date instead of truncating.",
  },
  celebrity: {
    status: "partial",
    source: "celebritycruises.com GraphQL cruiseSearch",
    note: "Saved GraphQL capture is a partial crawl, not a full fleet export.",
    nextStep: "Paginate the GraphQL crawl until the full itinerary set is captured.",
  },
  disney: {
    status: "partial",
    source: "disneycruise.disney.go.com available-products feed",
    note: "45 itineraries without specific sail dates. Synthetic dates assigned for display.",
    nextStep: "Re-scrape with date extraction or source sail dates from Disney's booking flow.",
  },
  "holland-america": {
    status: "partial",
    source: "hollandamerica.com/cruisesearch/api/search",
    note: "19 sailings with dates from Carnival-pattern API. Limited to initial Caribbean scrape.",
    nextStep: "Expand scraper to cover all regions and paginate fully.",
  },
  msc: {
    status: "partial",
    source: "MSC Algolia search feed",
    note: "Current saved feed is usable, but it reflects only a narrow captured result slice.",
    nextStep: "Fan out the Algolia queries by destination and market to capture the full schedule set.",
  },
  norwegian: {
    status: "partial",
    source: "ncl.com/api/v2/vacations/search",
    note: "152 itineraries without specific sail dates. Synthetic dates assigned for display.",
    nextStep: "Find the date-expanded NCL endpoint and normalize individual sailings.",
  },
  princess: {
    status: "partial",
    source: "Princess internal products API",
    note: "1,987 sail dates from products feed with ship codes mapped. No port-of-call names or pricing.",
    nextStep: "Capture Princess itinerary details endpoint for port names and pricing.",
  },
  "royal-caribbean": {
    status: "partial",
    source: "royalcaribbean.com GraphQL cruiseSearch",
    note: "Saved GraphQL capture includes real sailing dates and booking links, but it is only a partial crawl.",
    nextStep: "Paginate the GraphQL crawl until the full itinerary set is captured.",
  },
  "virgin-voyages": {
    status: "ready",
    source: "Virgin Voyages GraphQL allSailings",
    note: "Current dataset already contains per-sailing dates into 2028.",
  },
};

export const SAILING_CATALOG_META = {
  scope: "current-scraped-data-subset",
  description: "Normalized sailings for line -> ship -> date selection from the currently verified source feeds.",
  caveat: "This is not yet a complete all-lines inventory feed. Coverage is limited to the sources and crawl depth captured in the repo.",
};

function normalizeDate(value: string | null | undefined): string | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function addDays(date: string, days: number): string | null {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

function ensureAbsoluteUrl(baseUrl: string, value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  if (value.startsWith("/")) return `${baseUrl}${value}`;
  return `${baseUrl}/${value}`;
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])];
}

function toIdPart(value: string | null | undefined): string {
  return (value || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "unknown";
}

function buildId(parts: Array<string | null | undefined>): string {
  return parts.map((part) => toIdPart(part)).join(":");
}

function getVirginPortName(code: string | null | undefined): string {
  if (!code) return "";
  return VIRGIN_PORT_CODES[code] || code;
}

function getGraphqlDeparturePort(itinerary: any): string {
  const embarkVisit = (itinerary?.days || [])
    .flatMap((day: any) => day?.ports || [])
    .find((visit: any) => visit?.activity === "EMBARK");

  return embarkVisit?.port?.name || "";
}

function getGraphqlPorts(itinerary: any, departurePort: string): string[] {
  const portNames = (itinerary?.days || [])
    .flatMap((day: any) => day?.ports || [])
    .map((visit: any) => visit?.port?.name)
    .filter((name: string | undefined) => {
      if (!name) return false;
      if (name === departurePort) return false;
      if (name === "Cruising") return false;
      return true;
    });

  return uniqueStrings(portNames);
}

function buildCarnivalCatalog(): SailingCatalogEntry[] {
  return (carnivalData.sailings || []).flatMap((itinerary: any) => {
    const departureDates = Array.isArray(itinerary.allSailingDates) && itinerary.allSailingDates.length > 0
      ? itinerary.allSailingDates.map((sailing: any) => sailing?.departureDate)
      : [itinerary.departureDate];

    const ports = uniqueStrings(
      (itinerary.ports || []).map((port: any) => port?.name).filter((name: string | undefined) => name && name !== itinerary.departurePort)
    );

    return departureDates
      .map((rawDate: string | null | undefined) => {
        const departureDate = normalizeDate(rawDate);
        if (!departureDate) return null;

        return {
          id: buildId(["carnival", itinerary.shipCode, itinerary.itineraryTitle, departureDate]),
          cruiseLineId: "carnival" as const,
          cruiseLineName: CRUISE_LINE_NAME_MAP.carnival,
          shipName: itinerary.shipName || "Unknown",
          shipCode: itinerary.shipCode || null,
          departureDate,
          returnDate: addDays(departureDate, itinerary.duration || 0),
          duration: itinerary.duration || 0,
          departurePort: itinerary.departurePort || "",
          itineraryTitle: itinerary.itineraryTitle || "",
          itineraryCode: itinerary.shipCode || null,
          regionLabel: itinerary.region || null,
          ports,
          bookingUrl: itinerary.itineraryUrl || null,
          imageUrl: ensureAbsoluteUrl("https://www.carnival.com", itinerary.imageUrl),
          fromPrice: typeof itinerary.fromPrice === "number" ? itinerary.fromPrice : null,
          currency: itinerary.currency || "USD",
          source: "carnival-public-api",
        } satisfies SailingCatalogEntry;
      })
      .filter(Boolean) as SailingCatalogEntry[];
  });
}

function buildVirginCatalog(): SailingCatalogEntry[] {
  return (virginData.sailings || [])
    .map((sailing: any) => {
      const departureDate = normalizeDate(sailing.departureDate);
      if (!departureDate) return null;

      const departurePort = getVirginPortName(sailing.departurePort);
      const ports = uniqueStrings(
        (sailing.ports || []).map((code: string) => getVirginPortName(code)).filter((name: string) => name && name !== departurePort)
      );

      return {
        id: buildId(["virgin-voyages", sailing.packageCode, departureDate]),
        cruiseLineId: "virgin-voyages" as const,
        cruiseLineName: CRUISE_LINE_NAME_MAP["virgin-voyages"],
        shipName: sailing.shipName || "Unknown",
        shipCode: sailing.shipCode || null,
        departureDate,
        returnDate: addDays(departureDate, sailing.duration || 0),
        duration: sailing.duration || 0,
        departurePort,
        itineraryTitle: `${sailing.duration || 0}-Night Voyage`,
        itineraryCode: sailing.packageCode || null,
        regionLabel: sailing.region || null,
        ports,
        bookingUrl: null,
        imageUrl: null,
        fromPrice: typeof sailing.fromPrice === "number" ? sailing.fromPrice : null,
        currency: sailing.currency || "USD",
        source: "virgin-graphql",
      } satisfies SailingCatalogEntry;
    })
    .filter(Boolean) as SailingCatalogEntry[];
}

function buildMscCatalog(): SailingCatalogEntry[] {
  return ((mscRawData as any).hits || [])
    .map((hit: any) => {
      const departureDate = normalizeDate(hit.departureStartDate);
      if (!departureDate) return null;

      const duration = hit.numberOfNights || 0;
      const departurePort = hit.embkPort?.value || "";

      return {
        id: buildId(["msc", hit.cruiseID || hit.itinCd, departureDate]),
        cruiseLineId: "msc" as const,
        cruiseLineName: CRUISE_LINE_NAME_MAP.msc,
        shipName: hit.shipCd?.value || "Unknown",
        shipCode: hit.shipCd?.key || null,
        departureDate,
        returnDate: addDays(departureDate, duration),
        duration,
        departurePort,
        itineraryTitle: hit.itineraryName || hit.itemDesc || "",
        itineraryCode: hit.cruiseID || hit.itinCd || null,
        regionLabel: hit.commArea?.[0]?.value || null,
        ports: uniqueStrings(
          (hit.visitingPorts || []).map((port: any) => port?.value).filter((name: string | undefined) => name && name !== departurePort && name !== "Day At Sea")
        ),
        bookingUrl: null,
        imageUrl: ensureAbsoluteUrl("https://www.msccruisesusa.com", hit.itineraryImages?.desktop || hit.itineraryImages?.mobile || null),
        fromPrice: typeof hit.prices?.adultPrice === "number"
          ? hit.prices.adultPrice
          : typeof hit.priceWithGft === "number"
            ? hit.priceWithGft
            : null,
        currency: "USD",
        source: "msc-algolia",
      } satisfies SailingCatalogEntry;
    })
    .filter(Boolean) as SailingCatalogEntry[];
}

function buildRcgCatalog(
  cruiseLineId: "royal-caribbean" | "celebrity",
  rawData: unknown,
  baseUrl: string,
  shipNameFallback: Record<string, string> = {}
): SailingCatalogEntry[] {
  const cruises = ((rawData as any).data?.cruiseSearch?.results?.cruises || []) as any[];

  return cruises.flatMap((cruise: any) => {
    const itinerary = cruise.masterSailing?.itinerary || cruise.displaySailing?.itinerary;
    const shipCode = itinerary?.ship?.code || itinerary?.code?.slice(0, 2) || null;
    const shipName = itinerary?.ship?.name || shipNameFallback[shipCode || ""] || shipCode || "Unknown";
    const departurePort = getGraphqlDeparturePort(itinerary);
    const duration = Array.isArray(itinerary?.days) ? Math.max(itinerary.days.length - 1, 0) : 0;
    const ports = getGraphqlPorts(itinerary, departurePort);

    return (cruise.sailings || [])
      .map((sailing: any) => {
        const departureDate = normalizeDate(sailing.sailDate || sailing.startDate);
        if (!departureDate) return null;

        const priceValue = sailing.lowestStateroomClassPrice?.price?.value;

        return {
          id: buildId([cruiseLineId, itinerary?.code || cruise.id, departureDate]),
          cruiseLineId,
          cruiseLineName: CRUISE_LINE_NAME_MAP[cruiseLineId],
          shipName,
          shipCode,
          departureDate,
          returnDate: normalizeDate(sailing.endDate) || addDays(departureDate, duration),
          duration,
          departurePort,
          itineraryTitle: itinerary?.name || "",
          itineraryCode: itinerary?.code || null,
          regionLabel: null,
          ports,
          bookingUrl: ensureAbsoluteUrl(baseUrl, sailing.bookingLink),
          imageUrl: ensureAbsoluteUrl(baseUrl, itinerary?.media?.images?.[0]?.path || null),
          fromPrice: typeof priceValue === "number" ? Math.round(priceValue) : null,
          currency: sailing.lowestStateroomClassPrice?.price?.currency?.code || "USD",
          source: `${cruiseLineId}-graphql`,
        } satisfies SailingCatalogEntry;
      })
      .filter(Boolean) as SailingCatalogEntry[];
  });
}

const PRINCESS_SHIP_NAMES: Record<string, string> = {
  AP: "Crown Princess",
  CB: "Caribbean Princess",
  CO: "Coral Princess",
  DI: "Discovery Princess",
  EP: "Emerald Princess",
  EX: "Enchanted Princess",
  GP: "Grand Princess",
  IP: "Island Princess",
  KP: "Sky Princess",
  MJ: "Majestic Princess",
  RP: "Regal Princess",
  RU: "Ruby Princess",
  SA: "Sapphire Princess",
  ST: "Star Princess",
  SU: "Sun Princess",
  XP: "Royal Princess",
  YP: "Diamond Princess",
};

const PRINCESS_PORT_NAMES: Record<string, string> = {
  FLL: "Fort Lauderdale",
  MIA: "Miami",
  PCV: "Port Canaveral",
  SEA: "Seattle",
  SFO: "San Francisco",
  LAX: "Los Angeles",
  SAN: "San Diego",
  NYC: "Manhattan",
  BOS: "Boston",
  YVR: "Vancouver",
  SJU: "San Juan",
  SOU: "Southampton",
  BCN: "Barcelona",
  ROM: "Rome (Civitavecchia)",
  ATH: "Athens (Piraeus)",
  CPH: "Copenhagen",
  IST: "Istanbul",
  SIN: "Singapore",
  SYD: "Sydney",
  HNL: "Honolulu",
  HKG: "Hong Kong",
  TYO: "Tokyo",
  YOK: "Yokohama",
  BUE: "Buenos Aires",
  CPT: "Cape Town",
  ADL: "Adelaide",
  AKL: "Auckland",
  BNE: "Brisbane",
  MEL: "Melbourne",
  BGI: "Barbados",
  HEL: "Helsinki",
  REK: "Reykjavik",
  YQB: "Quebec City",
  TRS: "Trieste",
  JFM: "Juneau",
  SA3: "Samaná",
  QQD: "Québec City",
  WH1: "Whittier",
};

function buildNclCatalog(): SailingCatalogEntry[] {
  // NCL scraped data is itinerary-level without individual sail dates.
  // We create one entry per itinerary with a synthetic date placeholder.
  return ((nclData as any).sailings || [])
    .map((itin: any, idx: number) => {
      const ports = uniqueStrings(
        (itin.ports || []).map((port: any) => {
          const name = typeof port === "string" ? port : port?.name || "";
          // Strip city/country suffix like "Cozumel, Mexico"
          return name.split(",")[0].trim();
        }).filter((name: string) => name && name !== itin.departurePort?.split(",")[0]?.trim())
      );

      // Use a deterministic synthetic date based on index to avoid null
      const syntheticDate = `2026-${String(Math.floor(idx / 30) + 4).padStart(2, "0")}-${String((idx % 28) + 1).padStart(2, "0")}`;

      return {
        id: buildId(["norwegian", itin.shipCode || itin.code, itin.itineraryTitle, syntheticDate]),
        cruiseLineId: "norwegian" as const,
        cruiseLineName: CRUISE_LINE_NAME_MAP.norwegian,
        shipName: itin.shipName || "Unknown",
        shipCode: itin.shipCode || null,
        departureDate: syntheticDate,
        returnDate: addDays(syntheticDate, itin.duration || 0),
        duration: itin.duration || 0,
        departurePort: itin.departurePort?.split(",")[0]?.trim() || "",
        itineraryTitle: itin.itineraryTitle || `${itin.duration || 0}-Night Cruise`,
        itineraryCode: itin.code || itin.packageId || null,
        regionLabel: itin.region || null,
        ports,
        bookingUrl: null,
        imageUrl: itin.imageUrl || null,
        fromPrice: typeof itin.combinedPrice === "number" ? itin.combinedPrice : null,
        currency: itin.currency || "USD",
        source: "ncl-public-api",
      } satisfies SailingCatalogEntry;
    });
}

function buildCleanSailingsCatalog(
  sailingsData: any,
  cruiseLineId: CruiseLineId,
  source: string,
): SailingCatalogEntry[] {
  const sailings = (sailingsData as any).sailings || sailingsData;
  if (!Array.isArray(sailings)) return [];

  return sailings
    .map((s: any) => {
      const departureDate = normalizeDate(s.departureDate);
      if (!departureDate) return null;

      const ports = uniqueStrings(
        (s.ports || []).map((p: any) => {
          const name = typeof p === "string" ? p : p?.name || "";
          return name.split(",")[0].trim();
        })
      );

      return {
        id: buildId([cruiseLineId, s.shipCode || s.shipName, departureDate, s.itineraryTitle]),
        cruiseLineId,
        cruiseLineName: CRUISE_LINE_NAME_MAP[cruiseLineId],
        shipName: s.shipName || "Unknown",
        shipCode: s.shipCode || null,
        departureDate,
        returnDate: addDays(departureDate, s.duration || 0),
        duration: s.duration || 0,
        departurePort: s.departurePort?.split(",")[0]?.trim() || "",
        itineraryTitle: s.itineraryTitle || `${s.duration || 0}-Night Cruise`,
        itineraryCode: null,
        regionLabel: s.region || null,
        ports,
        bookingUrl: s.bookingUrl || null,
        imageUrl: s.imageUrl || null,
        fromPrice: typeof s.fromPrice === "number" ? s.fromPrice : null,
        currency: s.currency || "USD",
        source,
      } satisfies SailingCatalogEntry;
    })
    .filter(Boolean) as SailingCatalogEntry[];
}

function buildDisneyCatalog(): SailingCatalogEntry[] {
  // Disney scraped data has no departure dates. Create one entry per itinerary.
  const sailings = (disneyData as any).sailings || disneyData;
  if (!Array.isArray(sailings)) return [];

  return sailings.map((s: any, idx: number) => {
    const syntheticDate = `2026-${String(Math.floor(idx / 28) + 5).padStart(2, "0")}-${String((idx % 28) + 1).padStart(2, "0")}`;

    const ports = uniqueStrings(
      (s.ports || []).map((p: any) => {
        const name = typeof p === "string" ? p : p?.name || "";
        return name.split(",")[0].trim();
      })
    );

    return {
      id: buildId(["disney", s.shipName, s.itineraryTitle, syntheticDate]),
      cruiseLineId: "disney" as const,
      cruiseLineName: CRUISE_LINE_NAME_MAP.disney,
      shipName: s.shipName || "Unknown",
      shipCode: null,
      departureDate: syntheticDate,
      returnDate: addDays(syntheticDate, s.duration || 0),
      duration: s.duration || 0,
      departurePort: s.departurePort?.split(",")[0]?.trim() || "",
      itineraryTitle: s.itineraryTitle || `${s.duration || 0}-Night Cruise`,
      itineraryCode: null,
      regionLabel: null,
      ports,
      bookingUrl: null,
      imageUrl: s.imageUrl || null,
      fromPrice: typeof s.fromPrice === "number" ? s.fromPrice : null,
      currency: s.currency || "USD",
      source: "disney-available-products",
    } satisfies SailingCatalogEntry;
  });
}

function buildPrincessCatalog(): SailingCatalogEntry[] {
  const products = (princessProductsData as any).products || [];

  return products.flatMap((product: any) => {
    const duration = product.cruiseDuration || 0;
    const embkPort = product.embkDbkPortIds?.[0] || "";
    const dbkPort = product.embkDbkPortIds?.[1] || "";
    const departurePort = PRINCESS_PORT_NAMES[embkPort] || embkPort;

    return (product.ships || []).flatMap((ship: any) => {
      const shipCode = ship.id || "";
      const shipName = PRINCESS_SHIP_NAMES[shipCode] || shipCode;

      return (ship.sailDates || [])
        .map((rawDate: string) => {
          const departureDate = normalizeDate(rawDate);
          if (!departureDate) return null;

          return {
            id: buildId(["princess", product.id, shipCode, departureDate]),
            cruiseLineId: "princess" as const,
            cruiseLineName: CRUISE_LINE_NAME_MAP.princess,
            shipName,
            shipCode,
            departureDate,
            returnDate: addDays(departureDate, duration),
            duration,
            departurePort,
            itineraryTitle: `${duration}-Night Cruise from ${departurePort}`,
            itineraryCode: product.id || null,
            regionLabel: null,
            ports: [], // Products API doesn't include port-of-call names
            bookingUrl: null,
            imageUrl: null,
            fromPrice: null, // Products API doesn't include pricing
            currency: "USD",
            source: "princess-products-api",
          } satisfies SailingCatalogEntry;
        })
        .filter(Boolean) as SailingCatalogEntry[];
    });
  });
}

function dedupeCatalog(entries: SailingCatalogEntry[]): SailingCatalogEntry[] {
  const uniqueEntries = new Map<string, SailingCatalogEntry>();

  for (const entry of entries) {
    uniqueEntries.set(entry.id, entry);
  }

  return [...uniqueEntries.values()].sort((left, right) => {
    if (left.cruiseLineName !== right.cruiseLineName) {
      return left.cruiseLineName.localeCompare(right.cruiseLineName);
    }
    if (left.shipName !== right.shipName) {
      return left.shipName.localeCompare(right.shipName);
    }
    return left.departureDate.localeCompare(right.departureDate);
  });
}

export const SAILING_CATALOG: SailingCatalogEntry[] = dedupeCatalog([
  ...buildCarnivalCatalog(),
  ...buildVirginCatalog(),
  ...buildMscCatalog(),
  ...buildRcgCatalog("royal-caribbean", rciRawData, "https://www.royalcaribbean.com"),
  ...buildRcgCatalog("celebrity", celebrityRawData, "https://www.celebritycruises.com", CELEBRITY_SHIP_NAMES),
  ...buildNclCatalog(),
  ...buildCleanSailingsCatalog(halData, "holland-america", "hal-carnival-api"),
  ...buildCleanSailingsCatalog(celebrityCleanData, "celebrity", "celebrity-clean-scrape"),
  ...buildCleanSailingsCatalog(mscCleanData, "msc", "msc-clean-scrape"),
  ...buildDisneyCatalog(),
  ...buildPrincessCatalog(),
]);

export const SAILING_CATALOG_COVERAGE: SailingCatalogCoverage[] = CRUISE_LINES.map((line) => {
  const lineEntries = SAILING_CATALOG.filter((entry) => entry.cruiseLineId === line.id);
  const dates = lineEntries.map((entry) => entry.departureDate).sort();
  const base = LINE_STATUS[line.id];

  return {
    cruiseLineId: line.id,
    cruiseLineName: line.name,
    status: base.status,
    source: base.source,
    sailings: lineEntries.length,
    ships: new Set(lineEntries.map((entry) => entry.shipName)).size,
    earliestDepartureDate: dates[0] || null,
    latestDepartureDate: dates[dates.length - 1] || null,
    note: base.note,
    nextStep: base.nextStep,
  };
});

export const SAILING_CATALOG_GAPS = SAILING_CATALOG_COVERAGE.filter(
  (coverage) => coverage.status !== "ready"
);

export function getCatalogShipsByLine(cruiseLineId: CruiseLineId): string[] {
  return uniqueStrings(
    SAILING_CATALOG
      .filter((entry) => entry.cruiseLineId === cruiseLineId)
      .map((entry) => entry.shipName)
  ).sort((left, right) => left.localeCompare(right));
}

export function getCatalogSailingsByLineAndShip(
  cruiseLineId: CruiseLineId,
  shipName: string
): SailingCatalogEntry[] {
  return SAILING_CATALOG.filter(
    (entry) => entry.cruiseLineId === cruiseLineId && entry.shipName === shipName
  );
}