/**
 * A deliberately source-neutral true-cost calculator.
 *
 * Cruise prices vary by sailing and the user may already have a quote. This
 * utility only adds amounts the traveler explicitly enters. It deliberately
 * does not manufacture a suggested fare, tax, gratuity, or add-on amount.
 */
export const TRUE_COST_CATEGORIES = [
  "advertisedFare",
  "taxesAndPortFees",
  "gratuities",
  "travelToPort",
  "preCruiseHotel",
  "parkingOrTransfers",
  "travelInsurance",
  "drinkPackages",
  "wifi",
  "specialtyDining",
  "excursions",
  "shopping",
  "casinoOrEntertainment",
  "otherCosts",
] as const;

export type TrueCostCategory = (typeof TRUE_COST_CATEGORIES)[number];

export type TrueCostInputs = Record<TrueCostCategory, number> & {
  travelers: number;
  cruiseDays: number;
};

export type TrueCostResult = {
  advertisedFare: number;
  additionalCosts: number;
  estimatedTotal: number;
  totalPerTraveler: number | null;
  totalPerCruiseDay: number | null;
  percentageDifference: number | null;
  lineItems: Record<TrueCostCategory, number>;
};

function safeMoney(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function safePositiveInteger(value: number) {
  return Number.isInteger(value) && value > 0 ? value : 0;
}

export function calculateTrueCruiseCost(inputs: TrueCostInputs): TrueCostResult {
  const lineItems = Object.fromEntries(
    TRUE_COST_CATEGORIES.map((category) => [category, safeMoney(inputs[category])]),
  ) as Record<TrueCostCategory, number>;

  const advertisedFare = lineItems.advertisedFare;
  const additionalCosts = TRUE_COST_CATEGORIES
    .filter((category) => category !== "advertisedFare")
    .reduce((total, category) => total + lineItems[category], 0);
  const estimatedTotal = advertisedFare + additionalCosts;
  const travelers = safePositiveInteger(inputs.travelers);
  const cruiseDays = safePositiveInteger(inputs.cruiseDays);

  return {
    advertisedFare,
    additionalCosts,
    estimatedTotal,
    totalPerTraveler: travelers ? estimatedTotal / travelers : null,
    totalPerCruiseDay: cruiseDays ? estimatedTotal / cruiseDays : null,
    percentageDifference:
      advertisedFare > 0 ? (additionalCosts / advertisedFare) * 100 : null,
    lineItems,
  };
}
