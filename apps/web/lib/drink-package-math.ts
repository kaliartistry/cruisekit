export type DrinkPackageMathInput = {
  cruiseNights: number;
  packageDays: number;
  packagePricePerPerson: number;
  packageServiceChargeRate: number;
  packageBuyers: number;
  minorPackagePricePerPerson?: number;
  minorPackageServiceChargeRate?: number;
  minorPackageBuyers?: number;
  paygoDailySubtotal: number;
  paygoServiceChargeRate: number;
  bundleValuePerCoveredDay?: number;
};

export type DrinkPackageMathResult = {
  packageDailyPerAdult: number;
  adultPackageTripCost: number;
  minorPackageTripCost: number;
  cabinPackageTripCost: number;
  paygoDailyWithService: number;
  paygoTripCost: number;
  breakEvenTripValue: number;
  breakEvenDaily: number;
  dailyDifference: number;
  tripDifference: number;
};

function finiteNonNegative(value: number | undefined) {
  return Number.isFinite(value) ? Math.max(0, Number(value)) : 0;
}

/**
 * Compares the whole-trip package cost with the whole-trip pay-as-you-go
 * estimate. Keeping packageDays separate from cruiseNights covers delayed
 * activations and other partial-sailing cases without pretending the package
 * applies to days when it does not.
 */
export function calculateDrinkPackage(
  input: DrinkPackageMathInput,
): DrinkPackageMathResult {
  const cruiseNights = Math.max(1, Math.round(finiteNonNegative(input.cruiseNights)));
  const packageDays = Math.min(
    cruiseNights,
    Math.max(1, Math.round(finiteNonNegative(input.packageDays))),
  );
  const packageBuyers = Math.round(finiteNonNegative(input.packageBuyers));
  const minorPackageBuyers = Math.round(
    finiteNonNegative(input.minorPackageBuyers),
  );
  const packageDailyPerAdult =
    finiteNonNegative(input.packagePricePerPerson) *
    (1 + finiteNonNegative(input.packageServiceChargeRate));
  const minorPackageDaily =
    finiteNonNegative(input.minorPackagePricePerPerson) *
    (1 + finiteNonNegative(input.minorPackageServiceChargeRate));
  const adultPackageTripCost =
    packageDailyPerAdult * packageBuyers * packageDays;
  const minorPackageTripCost =
    minorPackageDaily * minorPackageBuyers * packageDays;
  const cabinPackageTripCost = adultPackageTripCost + minorPackageTripCost;
  const paygoDailyWithService =
    finiteNonNegative(input.paygoDailySubtotal) *
    (1 + finiteNonNegative(input.paygoServiceChargeRate));
  const paygoTripCost = paygoDailyWithService * cruiseNights;
  const bundleTripValue =
    finiteNonNegative(input.bundleValuePerCoveredDay) * packageDays;
  const breakEvenTripValue = Math.max(cabinPackageTripCost - bundleTripValue, 0);
  const breakEvenDaily = breakEvenTripValue / cruiseNights;
  const tripDifference = paygoTripCost - breakEvenTripValue;

  return {
    packageDailyPerAdult,
    adultPackageTripCost,
    minorPackageTripCost,
    cabinPackageTripCost,
    paygoDailyWithService,
    paygoTripCost,
    breakEvenTripValue,
    breakEvenDaily,
    dailyDifference: tripDifference / cruiseNights,
    tripDifference,
  };
}

export function calculatePrepaidCredit({
  availableCredit,
  cruiseNights,
  paygoDailySubtotal,
  paygoServiceChargeRate,
}: {
  availableCredit: number;
  cruiseNights: number;
  paygoDailySubtotal: number;
  paygoServiceChargeRate: number;
}) {
  const paygoDailyWithService =
    finiteNonNegative(paygoDailySubtotal) *
    (1 + finiteNonNegative(paygoServiceChargeRate));
  const expectedSpend =
    paygoDailyWithService *
    Math.max(1, Math.round(finiteNonNegative(cruiseNights)));

  return {
    paygoDailyWithService,
    expectedSpend,
    surplus: finiteNonNegative(availableCredit) - expectedSpend,
  };
}

export function partySizeRange(size: number) {
  if (size <= 1) return "1";
  if (size === 2) return "2";
  if (size <= 4) return "3-4";
  return "5+";
}

export function sailingLengthRange(nights: number) {
  if (nights <= 3) return "1-3";
  if (nights <= 6) return "4-6";
  if (nights <= 9) return "7-9";
  if (nights <= 14) return "10-14";
  return "15+";
}

export function resultBucket(
  resultType: string,
  difference: number | undefined,
) {
  if (resultType === "blocked") return "price_needed";
  if (resultType === "covered") return "credit_covers_plan";
  if (resultType === "shortfall") return "credit_shortfall";

  const amount = Number.isFinite(difference) ? Number(difference) : 0;
  if (Math.abs(amount) <= 10) return "borderline";
  if (amount > 25) return "package_saves_25_plus_daily";
  if (amount > 10) return "package_saves_11_25_daily";
  if (amount < -25) return "paygo_saves_25_plus_daily";
  return "paygo_saves_11_25_daily";
}

export function safeDrinkCalculatorAnalytics({
  cruiseLine,
  partySize,
  nights,
  resultType,
  difference,
  completion,
}: {
  cruiseLine: string;
  partySize: number;
  nights: number;
  resultType?: string;
  difference?: number;
  completion: boolean;
}) {
  return {
    cruise_line: cruiseLine,
    party_size_range: partySizeRange(partySize),
    sailing_length_range: sailingLengthRange(nights),
    result_bucket:
      resultType == null ? undefined : resultBucket(resultType, difference),
    completion,
  };
}
