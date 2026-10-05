import type {
  CalculatorInputs,
  CruiseLineCosts,
  CostBreakdown,
  PackageTier,
  PurchaseTiming,
} from "../types";

export function packagePriceNeedsQuote(tier: PackageTier, today = new Date().toISOString().slice(0, 10)) {
  return Boolean(tier.priceEntryRequired || (tier.recheckBy && tier.recheckBy < today));
}

export function resolvePackageDailyPrice(
  tier: PackageTier,
  timing: PurchaseTiming = "pre-purchase",
  userEnteredPrice = 0,
  nights = 7,
) {
  if (nights < (tier.minimumNights ?? 1)) throw new RangeError("Package not verified for this sailing length.");
  if (packagePriceNeedsQuote(tier)) {
    if (!Number.isFinite(userEnteredPrice) || userEnteredPrice <= 0) {
      throw new RangeError("Enter a current package quote; an unavailable rate is not free.");
    }
    return userEnteredPrice;
  }
  if (timing === "onboard" && tier.onboardPricePerDay !== undefined) {
    return tier.onboardPricePerDay;
  }
  return tier.shortCruisePricePerDay !== undefined && nights <= (tier.shortCruiseMaxNights ?? 0)
    ? tier.shortCruisePricePerDay : tier.pricePerDay;
}

export function calculateDrinkPackageCost(tier: PackageTier, inputs: Pick<CalculatorInputs,
  "adults" | "duration" | "drinkPackageQuantity" | "drinkPackagePurchaseTiming" | "drinkPackagePricePerPersonPerDay">) {
  if (tier.billingUnit === "purchase") {
    if (packagePriceNeedsQuote(tier) || !Number.isFinite(tier.pricePerPurchase) || (tier.pricePerPurchase ?? 0) <= 0) {
      throw new RangeError("Fixed-credit rate unavailable; confirm the current offer.");
    }
    return tier.pricePerPurchase! * (inputs.drinkPackageQuantity ?? 1);
  }
  return resolvePackageDailyPrice(tier, inputs.drinkPackagePurchaseTiming,
    inputs.drinkPackagePricePerPersonPerDay, inputs.duration) * inputs.adults * inputs.duration;
}

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
    inputs.parkingCostPerDay, inputs.taxesAndFees ?? 0, inputs.drinkPackagePricePerPersonPerDay ?? 0, inputs.wifiPackagePricePerDay ?? 0, inputs.gratuityRateOverride ?? 0];
  const counts = [adults, children, duration, inputs.numberOfPorts,
    inputs.specialtyDiningMeals, inputs.parkingDays, inputs.cabins ?? 1, inputs.wifiPackageQuantity ?? 1, inputs.drinkPackageQuantity ?? 1, inputs.gratuityGuestCountOverride ?? (adults + children)];
  if (amounts.some(v => !Number.isFinite(v) || v < 0 || v > 1e9) ||
      counts.some(v => !Number.isInteger(v) || v < 0 || v > 1000) ||
      adults < 1 || duration < 1 || (inputs.cabins ?? 1) < 1 ||
      (inputs.drinkPackageQuantity ?? 1) < 1 ||
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
  const chargedGratuityGuests = selectedTier?.includesGratuities ? Math.max(0, gratuityGuests - adults) : gratuityGuests;
  const gratuities = dailyGratuity * chargedGratuityGuests * duration;

  // Drink package — only adults get drink packages
  let drinkPackage = 0;
  if (inputs.drinkPackage) {
    if (selectedTier) {
      drinkPackage = calculateDrinkPackageCost(selectedTier, inputs);
    }
  }

  // WiFi — all guests
  let wifi = 0;
  if (inputs.wifiPackage && !selectedTier?.includesWifi) {
    const selectedTier = costs.wifiPackages.tiers.find(
      (t) => t.name === inputs.wifiPackage
    );
    if (selectedTier) {
      const quantity = Math.max(
        0,
        Math.round(inputs.wifiPackageQuantity ?? totalGuests),
      );
      const dailyPrice = resolvePackageDailyPrice(
        selectedTier,
        inputs.wifiPackagePurchaseTiming,
        inputs.wifiPackagePricePerDay,
      );
      wifi = dailyPrice * quantity * duration;
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
  const portFees = inputs.taxTreatment === "excluded" ? money(inputs.taxesAndFees ?? 0) : 0;

  // Parking
  const parking = inputs.addParking
    ? inputs.parkingDays * inputs.parkingCostPerDay
    : 0;

  // Photography — not explicitly in inputs, default to 0
  const photography = 0;

  // Totals
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

/** Converts the explicitly per-person fare input into the party-level anchor. */
export function partyFareFromPerPerson(perPersonFare: number, guests: number) {
  return Math.max(0, perPersonFare) * Math.max(0, Math.round(guests));
}
