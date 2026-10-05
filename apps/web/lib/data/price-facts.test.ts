import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getDrinkPackagePurchasePricePair,
  getWifiPurchasePricePair,
  MATERIAL_PRICE_FACTS,
  PRICE_FACTS,
  UNAVAILABLE_PRICE_FACTS,
  PURCHASE_PRICE_PAIRS,
  priceFactIsStale,
  purchasePricePairSavings,
} from "./price-facts";
import { CRUISE_LINE_COSTS } from "./cruise-costs";
import { BLOG_POSTS, getBlogPostBySlug } from "./blog-posts";
import { usd } from "./price-facts";

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

  it("uses the rechecked official MSC schedule with the booking cohort", () => {
    expect(PRICE_FACTS.mscStandardCaribbean.status).toBe("official");
    expect(PRICE_FACTS.mscStandardCaribbean.sourceUrl).toBe("https://www.msccruisesusa.com/service-charges");
    expect(PRICE_FACTS.mscStandardCaribbean.conditions).toContain("May 11, 2026");
  });

  it("archives an unverifiable legacy fact without treating a recheck attempt as verification", () => {
    const fact = UNAVAILABLE_PRICE_FACTS.nclMoreAtSeaLegacy;
    expect(fact.status).toBe("unavailable");
    expect(fact.retrievedAt).toBe("2026-09-04");
    expect(fact.recheckBy).toBe("2026-10-04");
    expect(MATERIAL_PRICE_FACTS.some(f => f.id === fact.id)).toBe(false);
    expect(CRUISE_LINE_COSTS.norwegian.drinkPackages.tiers.find(t => t.name.startsWith("More at Sea"))).toMatchObject({pricePerDay: 0, priceEntryRequired: true});
  });

  it("still fails freshness for any active fact after its exact recheck boundary", () => {
    expect(priceFactIsStale(PRICE_FACTS.nclFreeAtSeaAdult, "2026-11-04")).toBe(false);
    expect(priceFactIsStale(PRICE_FACTS.nclFreeAtSeaAdult, "2026-11-05")).toBe(true);
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

// Comparison FAQs previously bypassed the canonical fact register.
// Guard customer-facing prose in that consumer as well as guides/articles.
describe("comparison pricing prose", () => {
  it("does not republish the unavailable legacy rate as current", () => {
    const text = readFileSync(resolve(__dirname, "../../app/compare/compare-content.tsx"), "utf8");
    expect(text).not.toContain("$21.80");
    expect(text).not.toContain("MSC is close behind at $16.00");
    expect(text).toContain('getDrinkPrice("norwegian")');
  });
});

describe("published pricing article contracts", () => {
  it("keeps included and explicitly extra tax examples conditional", () => {
    for (const slug of ["how-much-does-caribbean-cruise-cost-2026", "how-much-does-a-cruise-really-cost-2026"]) {
      const post = getBlogPostBySlug(slug)!;
      const text = post.content.flatMap(section => section.paragraphs).join(" ");
      expect(text).toContain("$2,000 + $238 = $2,238");
      expect(text).toContain("$2,000 + $308 + $238 = $2,546");
      expect(text).toContain("explicitly excludes");
      expect(text).toContain("subtotal");
      expect(text).not.toMatch(/\$\d+ (?:to \$\d+ )?per person per day.*port fees|added at checkout on top|verified 2026 pricing/i);
    }
  });

  it("discloses the historical basis in monetary article previews and metadata", () => {
    const monetaryPosts = BLOG_POSTS.filter(post => post.excerpt.includes("$"));
    expect(monetaryPosts.length).toBeGreaterThan(0);
    expect(monetaryPosts.every(post => post.excerpt.startsWith("Historical USD planning reference:"))).toBe(true);
    expect(BLOG_POSTS.some(post => post.excerpt.includes("real and current"))).toBe(false);
  });

  it("does not reintroduce retired arithmetic or double-charge the CHEERS service fee", () => {
    const ncl = getBlogPostBySlug("msc-vs-norwegian")!.content.flatMap(section => section.paragraphs).join(" ");
    expect(ncl).toContain(usd(PRICE_FACTS.nclFreeAtSeaAdult.amount * 14));
    expect(ncl).not.toContain("$305");
    const comparison = getBlogPostBySlug("carnival-vs-royal-caribbean-comparison")!.content.flatMap(section => section.paragraphs).join(" ");
    expect(comparison).toContain(usd(PRICE_FACTS.carnivalCheersOnboardAllIn.amount));
    expect(comparison).not.toContain("$90.60");
    expect(comparison).not.toContain("unlimited alcoholic");
  });

  it("preserves existing cost-hub fragments after correcting misleading headings", () => {
    const post = getBlogPostBySlug("hidden-cruise-costs")!;
    const section = post.content.find(section => section.anchorId === "2-port-taxes-and-fees-280-to-308-added-at-checkout")!;
    expect(section.heading).toContain("Confirm Your Quoted Inclusions");
    expect(section.paragraphs.join(" ")).toMatch(/(?:confirmed|quoted) extra/);
    for (const post of BLOG_POSTS) {
      const anchors = post.content.map(section => section.anchorId ?? section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
      expect(new Set(anchors).size).toBe(anchors.length);
    }
  });
});
