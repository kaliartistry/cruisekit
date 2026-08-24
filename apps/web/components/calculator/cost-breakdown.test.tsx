import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { CalculatorInputs, CostBreakdown } from "@cruise/shared/types";
import {
  buildTotalCruiseComparisonShareText,
  buildTotalCruiseShareText,
  ComparisonBreakdown,
  DeltaHero,
} from "./cost-breakdown";

const inputs: CalculatorInputs = {
  cruiseLineId: "disney",
  duration: 7,
  adults: 2,
  children: 0,
  cabinType: "balcony",
  region: "caribbean",
  baseFare: 3640,
  drinkPackage: null,
  wifiPackage: null,
  specialtyDiningMeals: 0,
  excursionBudgetPerPort: 0,
  numberOfPorts: 5,
  addTravelInsurance: false,
  addParking: false,
  parkingDays: 0,
  parkingCostPerDay: 0,
};

const breakdown = (grandTotal: number): CostBreakdown => ({
  baseFare: 3640,
  gratuities: 224,
  drinkPackage: 0,
  wifi: 0,
  specialtyDining: 0,
  excursions: 0,
  travelInsurance: 0,
  portFees: 308,
  parking: 0,
  photography: 0,
  totalAdditional: grandTotal - 3640,
  grandTotal,
  perPersonPerDay: grandTotal / 14,
  percentAboveAdvertised: ((grandTotal - 3640) / 3640) * 100,
});

describe("Total Cruise Cost result sharing", () => {
  it("renders a clearly named share control", () => {
    const html = renderToStaticMarkup(
      <DeltaHero
        lineName="Royal Caribbean"
        cruiseLineId="royal-caribbean"
        advertised={2400}
        real={3150}
        percentOver={31}
      />,
    );

    expect(html).toContain("Share result");
    expect(html).not.toContain("Share this gap");
  });

  it("shares a useful result summary without itinerary or party details", () => {
    const text = buildTotalCruiseShareText({ advertised: 2400, real: 3150 });

    expect(text).toContain("Fare: $2,400");
    expect(text).toContain("Estimated real total: $3,150");
    expect(text).toContain("https://cruisekit.app/calculator/");
    expect(text).not.toMatch(/ship|departure|itinerary|children|passenger/i);
  });

  it("renders the share control in a side-by-side comparison result", () => {
    const html = renderToStaticMarkup(
      <ComparisonBreakdown
        breakdown={breakdown(4172)}
        cruiseLineId="disney"
        comparisonBreakdown={breakdown(4228)}
        comparisonCruiseLineId="norwegian"
        inputs={inputs}
      />,
    );

    expect(html).toContain("Side-by-side comparison");
    expect(html).toContain("Share result");
  });

  it("shares broad comparison totals without detailed trip information", () => {
    const text = buildTotalCruiseComparisonShareText({
      primaryLineName: "Disney Cruise Line",
      primaryTotal: 4172,
      comparisonLineName: "Norwegian Cruise Line",
      comparisonTotal: 4228,
    });

    expect(text).toContain("Disney Cruise Line $4,172");
    expect(text).toContain("Norwegian Cruise Line $4,228");
    expect(text).toContain("https://cruisekit.app/calculator/");
    expect(text).not.toMatch(/ship|departure|itinerary|children|passenger|guest|cabin|night|month/i);
  });
});
