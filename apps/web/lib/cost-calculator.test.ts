import { describe, expect, it } from "vitest";
import type { CalculatorInputs } from "@cruise/shared/types";
import {
  calculateCosts,
  partyFareFromPerPerson,
} from "@cruise/shared/utils";
import { CRUISE_LINE_COSTS } from "./data/cruise-costs";

const baseInputs: CalculatorInputs = {
  cruiseLineId: "carnival",
  duration: 7,
  adults: 2,
  children: 0,
  cabinType: "balcony",
  region: "caribbean",
  baseFare: 2000,
  drinkPackage: null,
  wifiPackage: null,
  specialtyDiningMeals: 0,
  excursionBudgetPerPort: 0,
  numberOfPorts: 0,
  addTravelInsurance: false,
  addParking: false,
  parkingDays: 0,
  parkingCostPerDay: 0,
};

describe("true-cost calculator arithmetic", () => {
  it("converts an advertised per-person fare to the party total exactly once", () => {
    expect(partyFareFromPerPerson(1_250, 2)).toBe(2_500);
    expect(partyFareFromPerPerson(1_250, 4)).toBe(5_000);
  });

  it("uses the suite gratuity rate when Suite is selected", () => {
    const costs = CRUISE_LINE_COSTS["royal-caribbean"];
    const standard = calculateCosts(baseInputs, costs);
    const suite = calculateCosts({ ...baseInputs, cabinType: "suite" }, costs);

    expect(standard.gratuities).toBe(18.5 * 2 * 7);
    expect(suite.gratuities).toBe(21 * 2 * 7);
  });

  it.each([
    [0, 2],
    [1, 1],
    [2, 0],
  ])("supports %i exempt minors without changing other party costs", (exempt, charged) => {
    const result = calculateCosts(
      {
        ...baseInputs,
        adults: 2,
        children: 2,
        gratuityGuestCountOverride: 2 + charged,
      },
      CRUISE_LINE_COSTS.carnival,
    );
    expect(result.gratuities).toBe(17 * (2 + charged) * 7);
    expect(exempt + charged).toBe(2);
  });

  it("keeps Virgin legacy, current prepaid, and current onboard cohorts separate", () => {
    const costs = CRUISE_LINE_COSTS["virgin-voyages"];
    const gratuities = [0, 20, 22].map((rate) =>
      calculateCosts({ ...baseInputs, gratuityRateOverride: rate }, costs)
        .gratuities,
    );
    expect(gratuities).toEqual([0, 280, 308]);
  });

  it("keeps current NCL and legacy More at Sea selections distinct", () => {
    const costs = CRUISE_LINE_COSTS.norwegian;
    const current = calculateCosts(
      { ...baseInputs, drinkPackage: "Free at Sea — current booking cohort" },
      costs,
    );
    const legacy = calculateCosts(
      { ...baseInputs, drinkPackage: "More at Sea — legacy eligible booking" },
      costs,
    );
    expect(current.drinkPackage).toBe(28.5 * 2 * 7);
    expect(legacy.drinkPackage).toBe(21.8 * 2 * 7);
  });

  it("does not double-count Princess bundle gratuity or Wi-Fi", () => {
    const result = calculateCosts(
      {
        ...baseInputs,
        cruiseLineId: "princess",
        drinkPackage: "Premier Beverage Package",
        wifiPackage: "Princess Premier WiFi",
      },
      CRUISE_LINE_COSTS.princess,
    );
    expect(result.drinkPackage).toBe(100 * 2 * 7);
    expect(result.gratuities).toBe(0);
    expect(result.wifi).toBe(0);
  });

  it("requires a user-entered quote for a dynamic Royal Caribbean package", () => {
    const costs = CRUISE_LINE_COSTS["royal-caribbean"];
    const withoutQuote = calculateCosts(
      { ...baseInputs, drinkPackage: "Deluxe Beverage Package" },
      costs,
    );
    const withQuote = calculateCosts(
      {
        ...baseInputs,
        drinkPackage: "Deluxe Beverage Package",
        drinkPackagePricePerPersonPerDay: 92.5,
      },
      costs,
    );
    expect(withoutQuote.drinkPackage).toBe(0);
    expect(withQuote.drinkPackage).toBe(92.5 * 2 * 7);
  });

  it("uses the selected Carnival CHEERS timing and exposes the full voyage premium", () => {
    const costs = CRUISE_LINE_COSTS.carnival;
    const prePurchase = calculateCosts(
      {
        ...baseInputs,
        drinkPackage: "CHEERS! Beverage Program",
        drinkPackagePurchaseTiming: "pre-purchase",
      },
      costs,
    );
    const onboard = calculateCosts(
      {
        ...baseInputs,
        drinkPackage: "CHEERS! Beverage Program",
        drinkPackagePurchaseTiming: "onboard",
      },
      costs,
    );

    expect(prePurchase.drinkPackage).toBeCloseTo(1_175.16);
    expect(onboard.drinkPackage).toBeCloseTo(1_259.16);
    expect(onboard.drinkPackage - prePurchase.drinkPackage).toBeCloseTo(84);
  });

  it("calculates Wi-Fi by selected plan count and purchase timing instead of every guest", () => {
    const costs = CRUISE_LINE_COSTS.carnival;
    const prePurchase = calculateCosts(
      {
        ...baseInputs,
        adults: 2,
        children: 2,
        wifiPackage: "Premium WiFi",
        wifiPackageQuantity: 1,
        wifiPackagePurchaseTiming: "pre-purchase",
      },
      costs,
    );
    const onboard = calculateCosts(
      {
        ...baseInputs,
        adults: 2,
        children: 2,
        wifiPackage: "Premium WiFi",
        wifiPackageQuantity: 2,
        wifiPackagePurchaseTiming: "onboard",
      },
      costs,
    );

    expect(prePurchase.wifi).toBeCloseTo(25.5 * 7);
    expect(onboard.wifi).toBeCloseTo(28 * 2 * 7);
  });

  it("requires traveler-entered package and Wi-Fi quotes for Celebrity", () => {
    const costs = CRUISE_LINE_COSTS.celebrity;
    const withoutQuotes = calculateCosts(
      {
        ...baseInputs,
        drinkPackage: "Classic Beverage Package",
        wifiPackage: "Basic WiFi",
        wifiPackageQuantity: 1,
      },
      costs,
    );
    const withQuotes = calculateCosts(
      {
        ...baseInputs,
        drinkPackage: "Classic Beverage Package",
        drinkPackagePricePerPersonPerDay: 82.5,
        wifiPackage: "Basic WiFi",
        wifiPackagePricePerDay: 19.25,
        wifiPackageQuantity: 1,
      },
      costs,
    );

    expect(withoutQuotes.drinkPackage).toBe(0);
    expect(withoutQuotes.wifi).toBe(0);
    expect(withQuotes.drinkPackage).toBeCloseTo(82.5 * 2 * 7);
    expect(withQuotes.wifi).toBeCloseTo(19.25 * 7);
  });
});
