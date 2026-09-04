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
  const gratuityGuests = Math.min(
    totalGuests,
    Math.max(0, inputs.gratuityGuestCountOverride ?? totalGuests),
  );

  // Gratuities
  const selectedTier = inputs.drinkPackage
    ? costs.drinkPackages.tiers.find((tier) => tier.name === inputs.drinkPackage)
    : undefined;
  const dailyGratuity =
    inputs.gratuityRateOverride ??
    (inputs.cabinType === "suite"
      ? costs.suiteGratuityPerPersonPerDay
      : costs.gratuityPerPersonPerDay);
  const gratuities = selectedTier?.includesGratuities
    ? 0
    : dailyGratuity * gratuityGuests * duration;

  // Drink package — only adults get drink packages
  let drinkPackage = 0;
  if (inputs.drinkPackage) {
    if (selectedTier) {
      const dailyPrice = selectedTier.priceEntryRequired
        ? Math.max(0, inputs.drinkPackagePricePerPersonPerDay ?? 0)
        : selectedTier.pricePerDay;
      drinkPackage = dailyPrice * adults * duration;
    }
  }

  // WiFi — all guests
  let wifi = 0;
  if (inputs.wifiPackage && !selectedTier?.includesWifi) {
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
  const percentAboveAdvertised =
    baseFare > 0 ? ((grandTotal - baseFare) / baseFare) * 100 : 0;
  const perPersonPerDay =
    totalGuests > 0 && duration > 0 ? grandTotal / totalGuests / duration : 0;

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

/** Converts the explicitly per-person fare input into the party-level anchor. */
export function partyFareFromPerPerson(perPersonFare: number, guests: number) {
  return Math.max(0, perPersonFare) * Math.max(0, Math.round(guests));
}
