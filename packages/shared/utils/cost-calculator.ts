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
  const { adults, children, duration } = inputs;
  const amounts = [inputs.baseFare, inputs.excursionBudgetPerPort,
    inputs.parkingCostPerDay, inputs.taxesAndFees ?? 0];
  const counts = [adults, children, duration, inputs.numberOfPorts,
    inputs.specialtyDiningMeals, inputs.parkingDays, inputs.cabins ?? 1];
  if (amounts.some(v => !Number.isFinite(v) || v < 0 || v > 1e9) ||
      counts.some(v => !Number.isInteger(v) || v < 0 || v > 1000) ||
      adults < 1 || duration < 1 || (inputs.cabins ?? 1) < 1 ||
      inputs.baseFare <= 0 ||
      (inputs.fareUnit && !["booking", "person", "cabin"].includes(inputs.fareUnit)) ||
      (inputs.taxTreatment && !["included", "excluded", "unknown"].includes(inputs.taxTreatment)) ||
      (inputs.taxTreatment === "excluded" && inputs.taxesAndFees == null) ||
      (inputs.currency && inputs.currency !== "USD")) {
    throw new RangeError("Enter valid USD amounts, guests, cabins, and exact nights.");
  }
  const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
  const totalGuests = adults + children;
  const multiplier = inputs.fareUnit === "person" ? totalGuests
    : inputs.fareUnit === "cabin" ? (inputs.cabins ?? 1) : 1;
  const baseFare = money(inputs.baseFare * multiplier);

  // Gratuities
  const gratuities =
    (inputs.cabinType === "suite" ? costs.suiteGratuityPerPersonPerDay
      : costs.gratuityPerPersonPerDay) * totalGuests * duration;

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

  // A daily average cannot establish the required taxes on a booking.
  // Unknown inclusion stays unresolved; the UI must label it as a subtotal.
  const portFees = inputs.taxTreatment === "excluded"
    ? money(inputs.taxesAndFees ?? 0) : 0;

  // Parking
  const parking = inputs.addParking
    ? inputs.parkingDays * inputs.parkingCostPerDay
    : 0;

  // Photography — not explicitly in inputs, default to 0
  const photography = 0;

  // Round each displayed line before summing so the visible rows reconcile.
  const rounded = {
    gratuities: money(gratuities), drinkPackage: money(drinkPackage),
    wifi: money(wifi), specialtyDining: money(specialtyDining),
    excursions: money(excursions), travelInsurance: money(travelInsurance),
    portFees, parking: money(parking), photography,
  };
  const totalAdditional = money(Object.values(rounded).reduce((sum, v) => sum + v, 0));
  const grandTotal = money(baseFare + totalAdditional);
  const percentAboveAdvertised = baseFare > 0 ? totalAdditional / baseFare * 100 : 0;
  const perPersonPerDay = money(grandTotal / totalGuests / duration);

  return {
    baseFare,
    ...rounded,
    totalAdditional,
    grandTotal,
    percentAboveAdvertised,
    perPersonPerDay,
  };
}
