import type {
  CalculatorInputs,
  CruiseLineCosts,
  CostBreakdown,
} from "../types";

/**
 * Calculate the full cost breakdown for a cruise based on user inputs
 * and the cruise line's published cost data.
 */
export function calculateCosts(
  inputs: CalculatorInputs,
  costs: CruiseLineCosts
): CostBreakdown {
  const { adults, children, duration, baseFare } = inputs;
  const totalGuests = adults + children;

  // Gratuities
  const gratuities =
    costs.gratuityPerPersonPerDay * totalGuests * duration;

  // Drink package — only adults get drink packages
  let drinkPackage = 0;
  if (inputs.drinkPackage) {
    const selectedTier = costs.drinkPackages.tiers.find(
      (t) => t.name === inputs.drinkPackage
    );
    if (selectedTier) {
      drinkPackage = selectedTier.pricePerDay * adults * duration;
    }
  }

  // WiFi — all guests
  let wifi = 0;
  if (inputs.wifiPackage) {
    const selectedTier = costs.wifiPackages.tiers.find(
      (t) => t.name === inputs.wifiPackage
    );
    if (selectedTier) {
      wifi = selectedTier.pricePerDay * totalGuests * duration;
    }
  }

  // Specialty dining
  const specialtyDining =
    costs.specialtyDining.averagePerMeal *
    inputs.specialtyDiningMeals *
    totalGuests;

  // Excursions
  const excursions =
    inputs.excursionBudgetPerPort * inputs.numberOfPorts * totalGuests;

  // Travel insurance
  const travelInsurance = inputs.addTravelInsurance
    ? (baseFare * costs.travelInsurancePercent) / 100
    : 0;

  // Port fees
  const portFees =
    costs.portFeesPerPersonPerDay * totalGuests * duration;

  // Parking
  const parking = inputs.addParking
    ? inputs.parkingDays * inputs.parkingCostPerDay
    : 0;

  // Photography — not explicitly in inputs, default to 0
  const photography = 0;

  // Totals
  const totalAdditional =
    gratuities +
    drinkPackage +
    wifi +
    specialtyDining +
    excursions +
    travelInsurance +
    portFees +
    parking +
    photography;

  const grandTotal = baseFare + totalAdditional;
  const percentAboveAdvertised = ((grandTotal - baseFare) / baseFare) * 100;
  const perPersonPerDay = grandTotal / totalGuests / duration;

  return {
    baseFare,
    gratuities,
    drinkPackage,
    wifi,
    specialtyDining,
    excursions,
    travelInsurance,
    portFees,
    parking,
    photography,
    totalAdditional,
    grandTotal,
    percentAboveAdvertised,
    perPersonPerDay,
  };
}
