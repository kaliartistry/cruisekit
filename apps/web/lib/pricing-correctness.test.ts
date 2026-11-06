import { describe, expect, it, vi } from "vitest";
import { calculateCosts, packagePriceNeedsQuote } from "../../../packages/shared/utils/cost-calculator";
import type { CalculatorInputs } from "../../../packages/shared/types/calculator";
import { CRUISE_LINE_COSTS } from "./data/cruise-costs";
import { getFareEstimate } from "./data/fare-estimates";
import { fareFreshness } from "./format/confidence";
import { PRICE_FACTS } from "./data/price-facts";

const quote: CalculatorInputs = {
  cruiseLineId: "carnival", duration: 7, adults: 2, children: 0,
  cabinType: "balcony", region: "caribbean", baseFare: 2000,
  fareUnit: "booking", currency: "USD", taxTreatment: "included",
  drinkPackage: null, wifiPackage: null, specialtyDiningMeals: 0,
  excursionBudgetPerPort: 0, numberOfPorts: 0, addTravelInsurance: false,
  addParking: false, parkingDays: 7, parkingCostPerDay: 0,
};
const cost = (changes: Partial<CalculatorInputs> = {}) => calculateCosts({ ...quote, ...changes }, CRUISE_LINE_COSTS.carnival);

describe("quote arithmetic", () => {
  it.each([5, 6, 7])("charges synthetic fixed credit once across %i nights and varying parties", duration => {
    const fixtureCosts = {
      ...CRUISE_LINE_COSTS["virgin-voyages"],
      drinkPackages: {
        includedFree: false,
        tiers: [{ name: "Synthetic fixed credit", pricePerDay: 0, billingUnit: "purchase" as const, pricePerPurchase: 300, description: "Arithmetic fixture; no current source claim." }],
      },
    };
    for (const adults of [1, 2, 4]) {
      const input = { ...quote, cruiseLineId: "virgin-voyages" as const, adults, duration, drinkPackage: "Synthetic fixed credit" };
      expect(calculateCosts(input, fixtureCosts).drinkPackage).toBe(300);
      expect(calculateCosts({ ...input, drinkPackageQuantity: 2 }, fixtureCosts).drinkPackage).toBe(600);
    }
  });
  it("uses the verified NCL six-night price at its recorded retrieval date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(`${PRICE_FACTS.nclFreeAtSeaAdult.retrievedAt}T12:00:00Z`));
    try {
      expect(calculateCosts({ ...quote, cruiseLineId: "norwegian", duration: 6, drinkPackage: "Free at Sea — current booking cohort" }, CRUISE_LINE_COSTS.norwegian).drinkPackage).toBe(342);
    } finally { vi.useRealTimers(); }
  });
  it("does not price an expired package as free or current", () => {
    const tier = CRUISE_LINE_COSTS["virgin-voyages"].drinkPackages.tiers[0];
    const boundary = tier.recheckBy!;
    const nextDay = new Date(Date.parse(`${boundary}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);
    expect(packagePriceNeedsQuote(tier, boundary)).toBe(false);
    expect(packagePriceNeedsQuote(tier, nextDay)).toBe(true);
    const stale = { ...CRUISE_LINE_COSTS["virgin-voyages"], drinkPackages: { tiers: [{ ...tier, recheckBy: "2000-01-01" }], includedFree: false } };
    expect(() => calculateCosts({ ...quote, drinkPackage: tier.name }, stale)).toThrow(/unavailable/);
  });
  it("does not add included required taxes again", () => expect(cost({ taxesAndFees: 308 })).toMatchObject({ baseFare: 2000, gratuities: 238, portFees: 0, grandTotal: 2238 }));
  it("adds only confirmed whole-party extra taxes", () => expect(cost({ taxTreatment: "excluded", taxesAndFees: 308 })).toMatchObject({ portFees: 308, grandTotal: 2546 }));
  it("leaves an unknown basis unresolved and requires an excluded amount", () => {
    expect(cost({ taxTreatment: "unknown" }).portFees).toBe(0);
    expect(() => cost({ taxTreatment: "excluded", taxesAndFees: null })).toThrow();
  });
  it.each([5, 6])("uses exactly %i nights", duration => expect(cost({ duration }).gratuities).toBe(duration * 2 * 17));
  it("normalizes person, cabin and booking quotes once", () => {
    expect(cost({ baseFare: 1000, fareUnit: "person" }).grandTotal).toBe(2238);
    expect(cost({ baseFare: 1000, fareUnit: "cabin", cabins: 2 }).grandTotal).toBe(2238);
    expect(cost({ cabins: 2 }).grandTotal).toBe(2238);
  });
  it("includes children in same-price person quotes", () => expect(cost({ baseFare: 500, fareUnit: "person", children: 1 }).baseFare).toBe(1500));
  it("uses suite gratuities", () => expect(cost({ cabinType: "suite" }).gratuities).toBe(266));
  it("retains current-main bundled adult inclusions without exempting children", () => {
    const result = calculateCosts({ ...quote, cruiseLineId: "princess", children: 1, drinkPackage: "Premier Beverage Package", wifiPackage: "Princess Premier WiFi" }, CRUISE_LINE_COSTS.princess);
    expect(result.drinkPackage).toBe(1470);
    expect(result.gratuities).toBe(126);
    expect(result.wifi).toBe(0);
  });
  it.each([{ drinkPackagePricePerPersonPerDay: -1 }, { wifiPackagePricePerDay: Infinity }, { gratuityGuestCountOverride: 1.5 }])("rejects invalid current-main price/count override %j", invalid => expect(() => cost(invalid)).toThrow());
  it("rounds displayed cents before summing", () => {
    const result = cost({ baseFare: 123.45, fareUnit: "person", addTravelInsurance: true, taxTreatment: "excluded", taxesAndFees: 0.01 });
    const sum = result.baseFare + result.gratuities + result.travelInsurance + result.portFees;
    expect(result.grandTotal).toBe(Math.round(sum * 100) / 100);
    expect(result.baseFare).toBe(246.9);
  });
  it.each([{ baseFare: NaN }, { baseFare: -1 }, { baseFare: 0 }, { adults: 0 }, { duration: 0 }, { duration: 5.5 }, { taxesAndFees: Infinity }, { cabins: 0 }])("rejects invalid input %j", invalid => expect(() => cost(invalid)).toThrow());
});
describe("NCL cohort validity", () => {
  const actualTier = CRUISE_LINE_COSTS.norwegian.drinkPackages.tiers[0];
  // Independently current longer-cohort fixture; this is not a new source check.
  const tier = { ...actualTier, recheckBy: "2099-01-01" };
  const shortDeadline = PRICE_FACTS.nclFreeAtSeaShortAdult.recheckBy;
  const afterShortDeadline = new Date(Date.parse(`${shortDeadline}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);

  it("retains the short fact's own deadline instead of inheriting the longer rate's renewal", () => {
    expect(actualTier.shortCruiseRecheckBy).toBe(shortDeadline);
    expect(actualTier.shortCruiseSourceCheckedAt).toBe(PRICE_FACTS.nclFreeAtSeaShortAdult.retrievedAt);
    expect(packagePriceNeedsQuote(tier, shortDeadline, 5)).toBe(false);
    expect(packagePriceNeedsQuote(tier, afterShortDeadline, 5)).toBe(true);
    expect(packagePriceNeedsQuote(tier, afterShortDeadline, 6)).toBe(false);
  });

  it("requires a current short-cruise quote in arithmetic while preserving the six-night rate", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(`${afterShortDeadline}T12:00:00Z`));
    try {
      const costs = { ...CRUISE_LINE_COSTS.norwegian, drinkPackages: { tiers: [tier], includedFree: false } };
      const inputs = { ...quote, cruiseLineId: "norwegian" as const, duration: 5, drinkPackage: tier.name };
      expect(() => calculateCosts(inputs, costs)).toThrow(/current package quote/);
      expect(calculateCosts({ ...inputs, drinkPackagePricePerPersonPerDay: 31.25 }, costs).drinkPackage).toBe(312.5);
      expect(calculateCosts({ ...inputs, duration: 6 }, costs).drinkPackage).toBe(342);
    } finally { vi.useRealTimers(); }
  });

  it("fails closed for callers without a sailing length or without short-cohort evidence", () => {
    expect(packagePriceNeedsQuote(tier, afterShortDeadline)).toBe(true);
    expect(packagePriceNeedsQuote({ ...tier, shortCruiseRecheckBy: undefined }, shortDeadline, 5)).toBe(true);
    expect(packagePriceNeedsQuote({ ...tier, shortCruiseRecheckBy: undefined }, shortDeadline, 6)).toBe(false);
  });

  it("keeps synthetic independent cohort expiries separate and honors mandatory quote entry", () => {
    const reversed = { ...tier, recheckBy: "2000-01-01", shortCruiseRecheckBy: "2099-01-01" };
    expect(packagePriceNeedsQuote(reversed, afterShortDeadline, 5)).toBe(false);
    expect(packagePriceNeedsQuote(reversed, afterShortDeadline, 6)).toBe(true);
    expect(packagePriceNeedsQuote(reversed, afterShortDeadline)).toBe(true);
    for (const duration of [5, 6]) expect(packagePriceNeedsQuote({ ...tier, priceEntryRequired: true }, shortDeadline, duration)).toBe(true);
  });
});
describe("fare evidence", () => {
  const now = new Date("2026-10-05T00:00:00Z");
  it("excludes the historical fare table", () => expect(getFareEstimate("carnival", 6, "balcony", undefined, now)).toBeNull());
  it.each([["2026-09-28", "recent"], ["2026-09-27", "stale"], ["2026-08-26", "stale"], ["2026-10-06", "unverified"], ["2026-02-30", "unverified"], ["bad", "unverified"]])("classifies %s as %s", (date, status) => expect(fareFreshness(date, now)).toBe(status));
});
