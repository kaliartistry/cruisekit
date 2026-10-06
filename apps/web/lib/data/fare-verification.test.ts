import { describe, expect, it } from "vitest";
import { fareCheckLabel, verifiedFareCheck, type FareCheck } from "./fare-verification";
import type { Sailing } from "../../../../shared/models/ts/sailing";
const s = { id: "fixture", startingPrice: 500.25, currency: "USD", sourceUrl: "https://www.carnival.com/test", shipName: "Fixture", departureDate: "2026-11-01", returnDate: "2026-11-06", nights: 5, priceBasis: "per-person-double-occupancy", taxesAndFeesIncluded: true } as Sailing;
const checked = "2026-10-05T12:00:00Z";
const e: FareCheck = { price: 500.25, currency: s.currency, sourceUrl: s.sourceUrl, cabinType: "inside", quoteBasis: "2 adults, 0 children, 1 cabin; inside category 4A; PUBLIC rate; NONE package; US market", lastSuccessfulVerification: checked, nextCheckAt: "2026-10-12T12:00:00Z", context: { shipName: s.shipName, departureDate: s.departureDate, returnDate: s.returnDate, nights: s.nights, priceBasis: s.priceBasis, taxesAndFeesIncluded: s.taxesAndFeesIncluded } };
describe("actual price provenance", () => {
  it("never converts a record/promotion date into a fare observation", () => {
    expect(verifiedFareCheck(s, {})).toBeNull();
    expect(fareCheckLabel(null, "2026-08-26", null, new Date(checked))).toBe("Price check date unverified. Record reviewed Aug 26, 2026.");
  });
  it("shows the exact checked date, age and weekly due date with UTC dates", () => {
    expect(fareCheckLabel(checked, "2026-08-26", e.nextCheckAt, new Date("2026-10-07T00:00:00Z"))).toBe("Price checked on Oct 5, 2026 (2 days ago). Recheck due Oct 12, 2026.");
    expect(fareCheckLabel(checked, "2026-08-26", e.nextCheckAt, new Date("2026-10-06T00:00:00Z"))).toContain("1 day ago");
  });
  it("retains checked-on for old quotes without a fresh badge", () => expect(fareCheckLabel(checked, "2026-08-26", e.nextCheckAt, new Date("2026-11-01"))).toContain("27 days ago"));
  it("accepts a matching complete public quote context", () => expect(verifiedFareCheck(s, { fixture: e })).toEqual(e));
  it.each([{ price: 501 }, { currency: "EUR" }, { sourceUrl: "https://other.example" }, { nextCheckAt: "2026-10-15" }, { context: { ...e.context, nights: 6 } }])("rejects provenance for a different fare/context %j", change => expect(verifiedFareCheck(s, { fixture: { ...e, ...change } })).toBeNull());
});
