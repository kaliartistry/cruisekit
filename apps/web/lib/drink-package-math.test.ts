import { describe, expect, it } from "vitest";
import {
  calculateDrinkPackage,
  calculatePrepaidCredit,
  partySizeRange,
  resultBucket,
  safeDrinkCalculatorAnalytics,
  sailingLengthRange,
} from "./drink-package-math";
import { drinkPackageData } from "./data/drink-package-calculator";

describe("drink package calculations by cruise line", () => {
  const cases = [
    ["Carnival", 69.95, 0.2, 0.2],
    ["Royal Caribbean", 75, 0.18, 0.18],
    ["Norwegian", 49.99, 0, 0.2],
    ["Princess", 64.99, 0.2, 0.2],
    ["MSC", 70, 0, 0.18],
    ["Celebrity", 80, 0.2, 0.2],
    ["Holland America", 55.95, 0.2, 0.2],
    ["Virgin Voyages", 0, 0, 0],
  ] as const;

  it.each(cases)(
    "%s applies the configured package and pay-as-you-go service charges",
    (_line, price, packageRate, paygoRate) => {
      const result = calculateDrinkPackage({
        cruiseNights: 7,
        packageDays: 7,
        packagePricePerPerson: price,
        packageServiceChargeRate: packageRate,
        packageBuyers: price === 0 ? 0 : 1,
        paygoDailySubtotal: 50,
        paygoServiceChargeRate: paygoRate,
      });

      expect(result.packageDailyPerAdult).toBeCloseTo(price * (1 + packageRate));
      expect(result.paygoDailyWithService).toBeCloseTo(50 * (1 + paygoRate));
    },
  );

  it("includes the MSC Minors Package in the cabin cost", () => {
    const result = calculateDrinkPackage({
      cruiseNights: 7,
      packageDays: 7,
      packagePricePerPerson: 70,
      packageServiceChargeRate: 0,
      packageBuyers: 2,
      minorPackagePricePerPerson: 25,
      minorPackageServiceChargeRate: 0,
      minorPackageBuyers: 2,
      paygoDailySubtotal: 100,
      paygoServiceChargeRate: 0.18,
    });

    expect(result.minorPackageTripCost).toBe(350);
    expect(result.cabinPackageTripCost).toBe(1330);
  });

  it("uses NCL's reduced Free at Sea Plus price for eligible under-21 guests", () => {
    const result = calculateDrinkPackage({
      cruiseNights: 7,
      packageDays: 7,
      packagePricePerPerson: 49.99,
      packageServiceChargeRate: 0,
      packageBuyers: 1,
      minorPackagePricePerPerson: 40,
      minorPackageServiceChargeRate: 0,
      minorPackageBuyers: 1,
      paygoDailySubtotal: 100,
      paygoServiceChargeRate: 0.2,
    });

    expect(result.minorPackageTripCost).toBe(280);
    expect(result.cabinPackageTripCost).toBeCloseTo(629.93);
  });

  it("supports a package that covers only part of the sailing", () => {
    const full = calculateDrinkPackage({
      cruiseNights: 7,
      packageDays: 7,
      packagePricePerPerson: 69.95,
      packageServiceChargeRate: 0.2,
      packageBuyers: 2,
      paygoDailySubtotal: 160,
      paygoServiceChargeRate: 0.2,
    });
    const delayed = calculateDrinkPackage({
      cruiseNights: 7,
      packageDays: 6,
      packagePricePerPerson: 69.95,
      packageServiceChargeRate: 0.2,
      packageBuyers: 2,
      paygoDailySubtotal: 160,
      paygoServiceChargeRate: 0.2,
    });

    expect(delayed.cabinPackageTripCost).toBeLessThan(full.cabinPackageTripCost);
    expect(delayed.paygoTripCost).toBe(full.paygoTripCost);
  });

  it("models Virgin Voyages Bar Tab as prepaid credit", () => {
    const result = calculatePrepaidCredit({
      availableCredit: 350,
      cruiseNights: 5,
      paygoDailySubtotal: 60,
      paygoServiceChargeRate: 0,
    });

    expect(result.expectedSpend).toBe(300);
    expect(result.surplus).toBe(50);
  });
});

describe("verified package assumptions", () => {
  it("has a current verified record for every supported cruise line", () => {
    expect(
      new Set(drinkPackageData.packages.map((pkg) => pkg.cruise_line)),
    ).toEqual(
      new Set([
        "Carnival Cruise Line",
        "Royal Caribbean",
        "Norwegian Cruise Line",
        "Princess Cruises",
        "MSC Cruises",
        "Celebrity Cruises",
        "Holland America Line",
        "Virgin Voyages",
      ]),
    );
    expect(
      drinkPackageData.packages.every(
        (pkg) => pkg.last_verified === "2026-08-23",
      ),
    ).toBe(true);
  });

  it("preserves verified child-package and gratuity rules", () => {
    const byName = new Map(
      drinkPackageData.packages.map((pkg) => [pkg.package_name, pkg]),
    );

    expect(byName.get("Deluxe Beverage Package")?.package_service_charge_rate).toBe(
      0.18,
    );
    expect(byName.get("Free at Sea Plus")?.minor_package_default_price).toBe(40);
    expect(byName.get("Premium Extra Package")?.minor_package_name).toBe(
      "Minors Package",
    );
    expect(byName.get("Classic Drink Package")?.package_service_charge_rate).toBe(
      0.2,
    );
    expect(byName.get("Signature Beverage Package")?.default_price).toBe(55.95);
  });
});

describe("privacy-safe analytics buckets", () => {
  it("uses bounded party, sailing, and result categories", () => {
    expect(partySizeRange(4)).toBe("3-4");
    expect(sailingLengthRange(7)).toBe("7-9");
    expect(resultBucket("save", 42.37)).toBe("package_saves_25_plus_daily");
    expect(resultBucket("paygo", -18.22)).toBe("paygo_saves_11_25_daily");
  });

  it("emits only the approved aggregate calculator dimensions", () => {
    const params = safeDrinkCalculatorAnalytics({
      cruiseLine: "Carnival Cruise Line",
      partySize: 2,
      nights: 7,
      resultType: "save",
      difference: 42.37,
      completion: true,
    });

    expect(Object.keys(params).sort()).toEqual(
      [
        "completion",
        "cruise_line",
        "party_size_bucket",
        "result_bucket",
        "nights_bucket",
      ].sort(),
    );
    expect(params.cruise_line).toBe("carnival-cruise-line");
    expect(params.party_size_bucket).toBe("2");
    expect(params.nights_bucket).toBe("7_9");
    expect(JSON.stringify(params)).not.toContain("42.37");
  });
});
