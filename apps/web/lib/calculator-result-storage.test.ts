import { afterEach, describe, expect, it, vi } from "vitest";
import type { CalculatorInputs, CostBreakdown } from "@cruise/shared/types";
import {
  SAVED_CALCULATOR_RESULT_KEY,
  loadCalculatorResult,
  saveCalculatorResult,
} from "./calculator-result-storage";

const inputs: CalculatorInputs = {
  cruiseLineId: "carnival",
  duration: 7,
  adults: 2,
  children: 0,
  cabinType: "balcony",
  region: "caribbean",
  baseFare: 2499,
  drinkPackage: null,
  wifiPackage: null,
  specialtyDiningMeals: 0,
  excursionBudgetPerPort: 0,
  numberOfPorts: 4,
  addTravelInsurance: false,
  addParking: false,
  parkingDays: 7,
  parkingCostPerDay: 0,
};

const breakdown = {
  baseFare: 2499,
  gratuities: 238,
  drinkPackage: 0,
  wifi: 0,
  specialtyDining: 0,
  excursions: 0,
  travelInsurance: 0,
  portFees: 350,
  parking: 0,
  photography: 0,
  totalAdditional: 588,
  grandTotal: 3087,
  percentAboveAdvertised: 23.5,
  perPersonPerDay: 220.5,
} satisfies CostBreakdown;

const originalWindow = globalThis.window;

afterEach(() => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: originalWindow,
  });
  vi.restoreAllMocks();
});

describe("local calculator result storage", () => {
  it("saves and restores a result without an account", () => {
    const storage = installStorage();

    saveCalculatorResult(inputs, breakdown);

    expect(storage.has(SAVED_CALCULATOR_RESULT_KEY)).toBe(true);
    expect(loadCalculatorResult()?.inputs).toEqual(inputs);
  });

  it("removes expired result data", () => {
    const storage = installStorage();
    storage.set(
      SAVED_CALCULATOR_RESULT_KEY,
      JSON.stringify({
        version: 1,
        expiresAt: Date.now() - 1,
        inputs,
        breakdown,
      }),
    );

    expect(loadCalculatorResult()).toBeNull();
    expect(storage.has(SAVED_CALCULATOR_RESULT_KEY)).toBe(false);
  });
});

function installStorage() {
  const storage = new Map<string, string>();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    },
  });
  return storage;
}
