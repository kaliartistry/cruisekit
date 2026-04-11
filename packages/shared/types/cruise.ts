/** Core cruise line identifiers */
export type CruiseLineId =
  | "royal-caribbean"
  | "carnival"
  | "norwegian"
  | "msc"
  | "celebrity"
  | "princess"
  | "holland-america"
  | "disney"
  | "virgin-voyages";

/** Cabin categories */
export type CabinType = "inside" | "ocean-view" | "balcony" | "suite";

/** Cruise regions */
export type CruiseRegion =
  | "caribbean"
  | "mediterranean"
  | "alaska"
  | "northern-europe"
  | "asia"
  | "south-pacific"
  | "transatlantic"
  | "bahamas"
  | "bermuda"
  | "hawaii"
  | "mexican-riviera"
  | "california-coast"
  | "europe-north"
  | "middle-east";

/** Base cruise line information */
export interface CruiseLine {
  id: CruiseLineId;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  website: string;
  loyaltyProgram: string;
}

/** A specific ship */
export interface Ship {
  name: string;
  cruiseLine: CruiseLineId;
  class: string;
  capacity: number;
  yearBuilt: number;
}

/** A sailing/itinerary */
export interface Sailing {
  cruiseLine: CruiseLineId;
  ship: string;
  departureDate: string;
  returnDate: string;
  duration: number;
  region: CruiseRegion;
  departurePort: string;
  ports: PortStop[];
}

/** A port stop within a sailing */
export interface PortStop {
  portSlug: string;
  portName: string;
  arrivalTime: string;
  departureTime: string;
  isTender: boolean;
  isSeaDay: boolean;
}
