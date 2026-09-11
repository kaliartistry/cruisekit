import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getDrinkPackagePurchasePricePair,
  getWifiPurchasePricePair,
  MATERIAL_PRICE_FACTS,
  PRICE_FACTS,
  PURCHASE_PRICE_PAIRS,
  priceFactIsStale,
  purchasePricePairSavings,
} from "./price-facts";

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

  it("keeps official pre-purchase and onboard facts paired without duplicating amounts in UI code", () => {
    expect(PURCHASE_PRICE_PAIRS.carnivalCheers.prePurchase.amount).toBe(83.94);
    expect(PURCHASE_PRICE_PAIRS.carnivalCheers.onboard.amount).toBe(89.94);
    expect(purchasePricePairSavings(PURCHASE_PRICE_PAIRS.carnivalCheers, 2, 7)).toBeCloseTo(84);
    expect(purchasePricePairSavings(PURCHASE_PRICE_PAIRS.virginGratuity, 2, 7)).toBe(28);
    expect(
      getDrinkPackagePurchasePricePair("carnival", "CHEERS! Beverage Program"),
    ).toBe(PURCHASE_PRICE_PAIRS.carnivalCheers);
  });

  it("registers all three Carnival Wi-Fi timing pairs as official facts", () => {
    expect(getWifiPurchasePricePair("carnival", "Social WiFi")).toBe(
      PURCHASE_PRICE_PAIRS.carnivalWifiSocial,
    );
    expect(getWifiPurchasePricePair("carnival", "Value WiFi")).toBe(
      PURCHASE_PRICE_PAIRS.carnivalWifiValue,
    );
    expect(getWifiPurchasePricePair("carnival", "Premium WiFi")).toBe(
      PURCHASE_PRICE_PAIRS.carnivalWifiPremium,
    );
    expect(PRICE_FACTS.carnivalWifiPremiumOnboard.category).toBe("wifi");
    expect(PRICE_FACTS.carnivalWifiPremiumOnboard.status).toBe("official");
  });
});

describe("prose does not reintroduce retired price figures", () => {
  // Figures that were verified wrong or stale in the 2026-09 price audit.
  // Prose must interpolate PRICE_FACTS (see usd/usdRounded) instead.
  const retired = [
    "$82.54",
    "$68.78",
    "$21.80",
    "$152.60",
    "$305.20",
    "$585.20",
    "$41.80",
    "$165.08",
    "$1,155",
    "$1,156",
    "Always Included",
    "unbundled in 2026",
    "early 2026",
    "18% service charge on bar purchases",
    "$60.95/day",
    "$65.95/day",
    "$17.50 for balcony",
  ];
  for (const file of ["blog-posts.ts", "guides.ts"]) {
    it(`keeps ${file} free of retired figures`, () => {
      const text = readFileSync(resolve(__dirname, file), "utf8");
      const found = retired.filter((token) => text.includes(token));
      expect(found).toEqual([]);
    });
  }
});
