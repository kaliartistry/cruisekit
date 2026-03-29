import type { CruiseLineId, CabinType, CruiseRegion } from "./cruise";

/** Pricing tiers for packages */
export interface PackageTier {
  name: string;
  pricePerDay: number;
  description: string;
}

/** Drink package options for a cruise line */
export interface DrinkPackageOptions {
  tiers: PackageTier[];
  includedFree: boolean;
  notes?: string;
}

/** WiFi package options */
export interface WifiPackageOptions {
  tiers: PackageTier[];
  includedFree: boolean;
  notes?: string;
}

/** Specialty dining info */
export interface SpecialtyDining {
  restaurants: {
    name: string;
    pricePerPerson: number;
    cuisine: string;
  }[];
  averagePerMeal: number;
}

/** Bundle package (e.g., Princess Plus/Premier, NCL Free at Sea, Celebrity All Included) */
export interface BundlePackage {
  name: string;
  pricePerDay: number;
  includes: string[];
  description: string;
}

/** Full cost data for a cruise line */
export interface CruiseLineCosts {
  cruiseLineId: CruiseLineId;
  lastUpdated: string;
  gratuityPerPersonPerDay: number;
  suiteGratuityPerPersonPerDay: number;
  serviceChargePercent: number;
  drinkPackages: DrinkPackageOptions;
  wifiPackages: WifiPackageOptions;
  specialtyDining: SpecialtyDining;
  averageExcursionCostPerPort: number;
  photographyPackages: PackageTier[];
  spaAverageTreatment: number;
  travelInsurancePercent: number;
  portFeesPerPersonPerDay: number;
  kidsClubFree: boolean;
  kidsClubCost?: number;
  includedFree: string[];
  bundlePackages?: BundlePackage[];
  notes?: string;
}

/** User inputs for the cost calculator */
export interface CalculatorInputs {
  cruiseLineId: CruiseLineId;
  duration: number;
  adults: number;
  children: number;
  cabinType: CabinType;
  region: CruiseRegion;
  baseFare: number;
  drinkPackage: string | null;
  wifiPackage: string | null;
  specialtyDiningMeals: number;
  excursionBudgetPerPort: number;
  numberOfPorts: number;
  addTravelInsurance: boolean;
  addParking: boolean;
  parkingDays: number;
  parkingCostPerDay: number;
}

/** Cost breakdown result */
export interface CostBreakdown {
  baseFare: number;
  gratuities: number;
  drinkPackage: number;
  wifi: number;
  specialtyDining: number;
  excursions: number;
  travelInsurance: number;
  portFees: number;
  parking: number;
  photography: number;
  totalAdditional: number;
  grandTotal: number;
  percentAboveAdvertised: number;
  perPersonPerDay: number;
}
