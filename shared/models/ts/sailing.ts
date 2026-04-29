/**
 * A canonical cruise sailing record. Source of truth for both the Next.js web app
 * (cruisekit.app) and the CruiseKit-Mobile Flutter app via Quicktype-generated models.
 */
export interface Sailing {
    /**
     * Optional. Tracked affiliate URL (Awin, CJ, direct partner). When present, CTAs prefer
     * this over directLink.
     */
    affiliateLink?: null | string;
    confidence:     Confidence;
    /**
     * ISO 8601 timestamp the record was first added.
     */
    createdAt: string;
    /**
     * Canonical cruise line slug.
     */
    cruiseLine: CruiseLine;
    /**
     * ISO 4217 currency code, e.g. 'USD'.
     */
    currency: string;
    /**
     * ISO date (YYYY-MM-DD) of embarkation.
     */
    departureDate: string;
    /**
     * Embarkation port name, e.g. 'Cape Liberty (Bayonne, NJ)'.
     */
    departurePort: string;
    /**
     * Primary marketing region for the itinerary.
     */
    destinationRegion: DestinationRegion;
    /**
     * Required. Direct cruise-line URL to the sailing detail page. CTAs use this when
     * affiliateLink is not yet populated.
     */
    directLink: string;
    /**
     * Stable unique identifier. Convention: <cruiseLine>-<shipSlug>-<YYYYMMDD>.
     */
    id: string;
    /**
     * Ordered list of port-of-call names (excluding sea days). Embarkation/return ports may or
     * may not be repeated here; consumers should not assume.
     */
    itineraryPorts: string[];
    /**
     * ISO date the record was last manually verified against the source page.
     */
    lastVerified: string;
    /**
     * Number of nights aboard.
     */
    nights: number;
    /**
     * Required field; may be empty at launch. Lat/lng for berth or port. ShipSafe SDK consumes
     * this; missing entries should be tracked in PORT_COORDINATES_TODO.md and backfilled.
     */
    portCoordinates: PortCoordinate[];
    /**
     * How startingPrice is quoted. 'unspecified' is permitted only when the source page does
     * not state a basis.
     */
    priceBasis: PriceBasis;
    /**
     * ISO date (YYYY-MM-DD) of disembarkation.
     */
    returnDate: string;
    /**
     * Disembarkation port name. Equal to departurePort for round-trip sailings.
     */
    returnPort: string;
    /**
     * Itinerary or voyage name as published by the cruise line, e.g. 'Eastern Caribbean from
     * Miami'.
     */
    sailingName: string;
    /**
     * Human-readable ship name as marketed by the cruise line.
     */
    shipName: string;
    source:   SourceMetadata;
    /**
     * Canonical URL of the page used to verify this record. Should match source.sourceUrl; held
     * at top level for query/dedup convenience.
     */
    sourceUrl: string;
    /**
     * Cruise line's lowest advertised fare under priceBasis. Null only when the source page
     * does not publish a starting price.
     */
    startingPrice: number | null;
    /**
     * True if startingPrice already includes taxes and port fees as published; false if those
     * are quoted separately.
     */
    taxesAndFeesIncluded: boolean;
    /**
     * ISO 8601 timestamp the record was last modified (any field).
     */
    updatedAt: string;
}

/**
 * Trust tier. Records with 'internal_do_not_publish' MUST be filtered before render.
 */
export enum Confidence {
    EditorialOnly = "editorial_only",
    InternalDoNotPublish = "internal_do_not_publish",
    ItineraryVerifiedPriceCheckRequired = "itinerary_verified_price_check_required",
    VerifiedFromCruiseLine = "verified_from_cruise_line",
}

/**
 * Canonical cruise line slug.
 */
export enum CruiseLine {
    Carnival = "carnival",
    Celebrity = "celebrity",
    Disney = "disney",
    HollandAmerica = "holland-america",
    Msc = "msc",
    Norwegian = "norwegian",
    Princess = "princess",
    RoyalCaribbean = "royal-caribbean",
    VirginVoyages = "virgin-voyages",
}

/**
 * Primary marketing region for the itinerary.
 */
export enum DestinationRegion {
    Alaska = "alaska",
    Asia = "asia",
    Bahamas = "bahamas",
    Bermuda = "bermuda",
    CaliforniaCoast = "california-coast",
    Caribbean = "caribbean",
    Hawaii = "hawaii",
    Mediterranean = "mediterranean",
    MexicanRiviera = "mexican-riviera",
    Mexico = "mexico",
    MiddleEast = "middle-east",
    NorthernEurope = "northern-europe",
    Other = "other",
    SouthPacific = "south-pacific",
    Transatlantic = "transatlantic",
}

export interface PortCoordinate {
    /**
     * Optional berth or terminal name. ShipSafe SDK uses this when a single port has multiple
     * terminals (e.g. Manhattan Pier 88 vs Pier 90).
     */
    berth?:    null | string;
    latitude:  number;
    longitude: number;
    /**
     * Must match a value in itineraryPorts (case-sensitive) or be the embarkation/return port.
     */
    portName: string;
    /**
     * Optional citation for the coordinate (e.g. 'cruise-line port guide', 'OpenStreetMap').
     */
    source?: null | string;
}

/**
 * How startingPrice is quoted. 'unspecified' is permitted only when the source page does
 * not state a basis.
 */
export enum PriceBasis {
    PerCabin = "per-cabin",
    PerPersonDoubleOccupancy = "per-person-double-occupancy",
    PerPersonQuadOccupancy = "per-person-quad-occupancy",
    PerPersonSolo = "per-person-solo",
    Unspecified = "unspecified",
}

export interface SourceMetadata {
    advertiserName?: null | string;
    /**
     * Awin, CJ, Impact, etc. Null when sourceType is not 'affiliate-feed'.
     */
    affiliateNetwork?: null | string;
    confidence:        Confidence;
    lastImported: string;
    lastVerified: string;
    /**
     * Origin of the data, e.g. 'royalcaribbean.com', 'CJ:Norwegian', 'Awin:GoToSea'.
     */
    provider:   string;
    sourceType: SourceType;
    sourceUrl:  string;
    /**
     * Free-text reminder of source-specific ToS constraints (e.g. 'CJ feed: 24h cache TTL').
     */
    termsNotes?: null | string;
}

export enum SourceType {
    AffiliateFeed = "affiliate-feed",
    CruiseLineWebsite = "cruise-line-website",
    ManualEditorial = "manual-editorial",
    PressRelease = "press-release",
}
