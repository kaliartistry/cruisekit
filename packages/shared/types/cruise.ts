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

/**
 * Canonical Sailing type — generated from `/data/schema/sailing.schema.json`.
 * Re-exported here so legacy `import { Sailing } from "@cruise/shared/types"`
 * keeps resolving while internal code migrates to the canonical model.
 */
export type { Sailing } from "../../../shared/models/ts/sailing";
