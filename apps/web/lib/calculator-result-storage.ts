import type { CalculatorInputs, CostBreakdown } from "@cruise/shared/types";

export const SAVED_CALCULATOR_RESULT_KEY =
  "cruisekit:calculator-result:v1";
const RESULT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type SavedCalculatorResult = {
  version: 1;
  savedAt: string;
  expiresAt: number;
  inputs: CalculatorInputs;
  breakdown: CostBreakdown;
  comparison?: {
    cruiseLineId: string;
    breakdown: CostBreakdown;
  };
};

export function saveCalculatorResult(
  inputs: CalculatorInputs,
  breakdown: CostBreakdown,
  comparison?: SavedCalculatorResult["comparison"],
) {
  const saved: SavedCalculatorResult = {
    version: 1,
    savedAt: new Date().toISOString(),
    expiresAt: Date.now() + RESULT_TTL_MS,
    inputs,
    breakdown,
    comparison,
  };
  window.localStorage.setItem(SAVED_CALCULATOR_RESULT_KEY, JSON.stringify(saved));
  return saved;
}

export function loadCalculatorResult(): SavedCalculatorResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SAVED_CALCULATOR_RESULT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedCalculatorResult>;
    if (
      parsed.version !== 1 ||
      !parsed.inputs ||
      !parsed.breakdown ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= Date.now()
    ) {
      window.localStorage.removeItem(SAVED_CALCULATOR_RESULT_KEY);
      return null;
    }
    return parsed as SavedCalculatorResult;
  } catch {
    return null;
  }
}

export function clearCalculatorResult() {
  window.localStorage.removeItem(SAVED_CALCULATOR_RESULT_KEY);
}
