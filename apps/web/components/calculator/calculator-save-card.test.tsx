import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { CalculatorInputs, CostBreakdown } from "@cruise/shared/types";
import CalculatorSaveCard, {
  hasRealSailing,
  resolveDates,
} from "./calculator-save-card";

const inputs: CalculatorInputs = {
  cruiseLineId: "royal-caribbean",
  duration: 7,
  adults: 2,
  children: 0,
  cabinType: "balcony",
  region: "caribbean",
  baseFare: 1200,
  drinkPackage: null,
  wifiPackage: null,
  specialtyDiningMeals: 0,
  excursionBudgetPerPort: 0,
  numberOfPorts: 3,
  addTravelInsurance: false,
  addParking: false,
  parkingDays: 0,
  parkingCostPerDay: 0,
};

const breakdown: CostBreakdown = {
  baseFare: 2400,
  gratuities: 252,
  drinkPackage: 0,
  wifi: 0,
  specialtyDining: 0,
  excursions: 0,
  travelInsurance: 0,
  portFees: 0,
  parking: 0,
  photography: 0,
  totalAdditional: 252,
  grandTotal: 2652,
  percentAboveAdvertised: 10.5,
  perPersonPerDay: 189.43,
};

describe("CalculatorSaveCard", () => {
  it("requires both a ship and departure date before a sailing is saveable", () => {
    expect(hasRealSailing()).toBe(false);
    expect(hasRealSailing({ shipName: "Icon of the Seas" })).toBe(false);
    expect(hasRealSailing({ departureDate: "2026-10-03" })).toBe(false);
    expect(
      hasRealSailing({
        shipName: "Icon of the Seas",
        departureDate: "2026-10-03",
      }),
    ).toBe(true);
  });

  it("derives a return date only from the selected sailing departure", () => {
    expect(
      resolveDates(7, {
        shipName: "Icon of the Seas",
        departureDate: "2026-10-03",
      }),
    ).toEqual({
      departureDate: "2026-10-03",
      returnDate: "2026-10-10",
    });
  });

  it("disables placeholder saves and hides handoff actions before saving", () => {
    const html = renderToStaticMarkup(
      <CalculatorSaveCard inputs={inputs} breakdown={breakdown} />,
    );

    expect(html).toContain("Pick a sailing above to save it.");
    expect(html).toContain('disabled=""');
    expect(html).not.toContain("Open handoff page");
    expect(html).not.toContain("Continue in CruiseKit");
  });

  it("enables saving when a real sailing is selected", () => {
    const html = renderToStaticMarkup(
      <CalculatorSaveCard
        inputs={inputs}
        breakdown={breakdown}
        sailingContext={{
          sailingId: "icon-2026-10-03",
          shipName: "Icon of the Seas",
          departureDate: "2026-10-03",
          departurePort: "Miami, Florida",
        }}
      />,
    );

    expect(html).not.toContain("Pick a sailing above to save it.");
    expect(html).not.toContain('disabled=""');
  });
});
