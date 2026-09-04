import { describe, expect, it } from "vitest";
import { calculatePlanningDate } from "./deadline-calendar";
import { FINAL_PAYMENT_RULES } from "@/lib/data/deadline-facts";

describe("deadline calendar", () => {
  it("subtracts across leap years without local-time drift", () => {
    expect(calculatePlanningDate("2028-03-01", 1)).toBe("2028-02-29");
  });

  it("keeps Princess booking cohorts separate", () => {
    expect(FINAL_PAYMENT_RULES.find((rule) => rule.id === "princess-new-booking")?.daysBeforeSailing).toBe(120);
    expect(FINAL_PAYMENT_RULES.find((rule) => rule.id === "princess-legacy-short")?.daysBeforeSailing).toBe(90);
  });
});
