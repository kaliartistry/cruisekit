import { describe, expect, it } from "vitest";
import { calculateTrueCruiseCost } from "./true-cost";

describe("calculateTrueCruiseCost", () => {
  it("adds only values supplied by the traveler", () => {
    const result = calculateTrueCruiseCost({
      advertisedFare: 1200,
      taxesAndPortFees: 240,
      gratuities: 224,
      travelToPort: 180,
      preCruiseHotel: 0,
      parkingOrTransfers: 75,
      travelInsurance: 0,
      drinkPackages: 0,
      wifi: 0,
      specialtyDining: 0,
      excursions: 300,
      shopping: 0,
      casinoOrEntertainment: 0,
      otherCosts: 25,
      travelers: 2,
      cruiseDays: 7,
    });

    expect(result.additionalCosts).toBe(1044);
    expect(result.estimatedTotal).toBe(2244);
    expect(result.totalPerTraveler).toBe(1122);
    expect(result.totalPerCruiseDay).toBeCloseTo(320.5714, 4);
    expect(result.percentageDifference).toBe(87);
  });

  it("keeps an incomplete estimate safe and does not divide by zero", () => {
    const result = calculateTrueCruiseCost({
      advertisedFare: -10,
      taxesAndPortFees: Number.NaN,
      gratuities: 0,
      travelToPort: 0,
      preCruiseHotel: 0,
      parkingOrTransfers: 0,
      travelInsurance: 0,
      drinkPackages: 0,
      wifi: 0,
      specialtyDining: 0,
      excursions: 0,
      shopping: 0,
      casinoOrEntertainment: 0,
      otherCosts: 0,
      travelers: 0,
      cruiseDays: 0,
    });

    expect(result.estimatedTotal).toBe(0);
    expect(result.totalPerTraveler).toBeNull();
    expect(result.totalPerCruiseDay).toBeNull();
    expect(result.percentageDifference).toBeNull();
  });
});
