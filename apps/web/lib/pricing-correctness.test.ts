import { describe, expect, it } from "vitest";
import { calculateCosts } from "../../../packages/shared/utils/cost-calculator";
import type { CalculatorInputs } from "../../../packages/shared/types/calculator";
import { CRUISE_LINE_COSTS } from "./data/cruise-costs";
import { getFareEstimate } from "./data/fare-estimates";
import { fareFreshness } from "./format/confidence";

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
    expect(result.drinkPackage).toBe(1400);
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
describe("fare evidence", () => {
  const now = new Date("2026-10-05T00:00:00Z");
  it("excludes the historical fare table", () => expect(getFareEstimate("carnival", 6, "balcony", undefined, now)).toBeNull());
  it.each([["2026-09-28", "recent"], ["2026-09-27", "stale"], ["2026-08-26", "stale"], ["2026-10-06", "unverified"], ["2026-02-30", "unverified"], ["bad", "unverified"]])("classifies %s as %s", (date, status) => expect(fareFreshness(date, now)).toBe(status));
});
