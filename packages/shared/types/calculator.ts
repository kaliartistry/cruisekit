import type { CruiseLineId, CabinType, CruiseRegion } from "./cruise";

/** Pricing tiers for packages */
export interface PackageTier {
  name: string;
  /** Default/pre-purchase price used when a stable public amount exists. */
  pricePerDay: number;
  /** Official onboard price when the line publishes both purchase timings. */
  onboardPricePerDay?: number;
  description: string;
  /** A zero price means the traveler must enter the live price they were quoted. */
  priceEntryRequired?: boolean;
  /** Prevents bundle components from being counted twice. */
  includesGratuities?: boolean;
  includesWifi?: boolean;
  /** Makes the displayed number's evidence quality explicit. */
  verificationStatus?: "official" | "corroborated" | "estimate";
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
  /** Optional live per-person/day quote for dynamically priced packages. */
  drinkPackagePricePerPersonPerDay?: number;
  /** Purchase timing used when a package publishes a separate onboard price. */
  drinkPackagePurchaseTiming?: PurchaseTiming;
  /** Optional cohort-specific daily gratuity override. */
  gratuityRateOverride?: number;
  /** Lets travelers exclude guests who are exempt under their booking terms. */
  gratuityGuestCountOverride?: number;
  drinkPackage: string | null;
  wifiPackage: string | null;
  /** Optional live per-plan/day Wi-Fi quote for dynamically priced packages. */
  wifiPackagePricePerDay?: number;
  /** Number of Wi-Fi plans or simultaneous-user packages to budget. */
  wifiPackageQuantity?: number;
  /** Purchase timing used when a Wi-Fi plan publishes a separate onboard price. */
  wifiPackagePurchaseTiming?: PurchaseTiming;
  specialtyDiningMeals: number;
  excursionBudgetPerPort: number;
  numberOfPorts: number;
  addTravelInsurance: boolean;
  addParking: boolean;
  parkingDays: number;
  parkingCostPerDay: number;
}

export type PurchaseTiming = "pre-purchase" | "onboard";

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
