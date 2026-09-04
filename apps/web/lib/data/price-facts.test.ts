import { describe, expect, it } from "vitest";
import { MATERIAL_PRICE_FACTS, priceFactIsStale } from "./price-facts";

describe("material price fact governance", () => {
  it("has unique record IDs and source links", () => {
    const ids = MATERIAL_PRICE_FACTS.map((fact) => fact.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(
      MATERIAL_PRICE_FACTS.every((fact) => fact.sourceUrl.startsWith("https://")),
    ).toBe(true);
  });

  it("fails CI when a material fact passes its recheck date", () => {
    expect(MATERIAL_PRICE_FACTS.filter((fact) => priceFactIsStale(fact))).toEqual(
      [],
    );
  });

  it("never labels the MSC fallback as official", () => {
    expect(
      MATERIAL_PRICE_FACTS.find((fact) => fact.cruiseLineId === "msc")?.status,
    ).toBe("corroborated");
  });
});
