import { test } from "node:test";
import assert from "node:assert/strict";
import { inspectCarnivalDiscovery } from "../lib/carnival-fare-discovery.mjs";
import { assessFares } from "../lib/fare-verification.mjs";

// Synthetic discovery-shape fixtures, never live evidence or a source grant.
const target = { cruiseLine: "carnival", shipName: "Carnival Valor", departureDate: "2026-11-09", returnDate: "2026-11-14", nights: 5, sourceUrl: "https://www.carnival.com/book?sailingId=22102" };
const selection = { sailingId: "22102", roomKey: "oceanview" };
function fixture() {
  return { results: { itineraries: [{ shipName: target.shipName, dur: 5, leadSailing: { fromPrice: 99, fromPriceCurrency: "USD", schedule: [{ port: "Unrelated lead port" }] }, sailings: [
    { sailingId: 99999, departureDate: "2026-11-14", arrivalDate: "2026-11-19", rooms: { oceanview: { price: 40, priceCurrency: "USD", soldOut: false } } },
    { sailingId: 22102, departureDate: "2026-11-09T00:00:00", arrivalDate: "2026-11-14T00:00:00Z", sailingURL: "/book?sailingId=22102", rooms: {
      interior: { price: 150, priceCurrency: "USD", soldOut: true, categoryCode: "4A", rateCode: "SOLD" },
      balcony: { price: 200, priceCurrency: "AUD", soldOut: false, categoryCode: "8A", rateCode: "OTHER" },
      oceanview: { price: 731.25, priceCurrency: "USD", soldOut: false, categoryCode: "6A", rateCode: "SELECTED" },
    } },
  ] }] } };
}
const sailing = page => page.results.itineraries[0].sailings[1];

test("explicit sailing/room keeps cents, currency, category and rate together without choosing a cheaper headline", () => {
  const page = fixture(), before = structuredClone(page);
  const report = inspectCarnivalDiscovery(page, target, selection);
  assert.equal(report.matches, 1);
  assert.deepEqual(report.observed.selectedRoom, { roomKey: "oceanview", sourcePath: "/results/itineraries/0/sailings/1/rooms/oceanview", amount: 731.25, currency: "USD", categoryCode: "6A", rateCode: "SELECTED", availability: "available" });
  assert.equal(report.observed.rooms.find(room => room.roomKey === "interior").availability, "sold-out");
  assert.equal(report.observed.rooms.find(room => room.roomKey === "balcony").currency, "AUD");
  assert.equal(report.observed.departureDate, target.departureDate);
  assert.deepEqual(page, before);
});

test("old discovery cannot supply quote semantics, itinerary, actual collection time or verifier observations", () => {
  const report = inspectCarnivalDiscovery(fixture(), target, selection);
  for (const key of ["sourceContract", "collectionEvent", "observedAt", "responseAgeSeconds", "cabinType", "packageCode", "adults", "children", "cabins", "market", "priceBasis", "taxesAndFeesIncluded", "itineraryPorts"]) assert.ok(report.missing.includes(key), key);
  assert.equal(report.observed.selectedSchedulePortNames, null);
  assert.equal(report.observed.taxesAndFeesIncluded, undefined);
  assert.equal(report.observed.observedAt, undefined);
  assert.equal(report.observed.responseAgeSeconds, undefined);
  assert.deepEqual(report.observations, []);
  // The diagnostic object cannot be accidentally accepted as an observation batch.
  assert.throws(() => assessFares({ seed: [], ledger: { schemaVersion: 1, entries: {} }, observations: report, policy: { publicationMode: "review-only", cadenceDays: 7, largeChangeFraction: 0.15, providers: {}, maxTargets: 500 }, runStartedAt: "2026-11-06T12:00:00Z", now: new Date("2026-11-06T12:01:00Z") }));
});

test("missing or duplicate sailing IDs cannot use a neighboring sailing", () => {
  assert.equal(inspectCarnivalDiscovery(fixture(), target, { ...selection, sailingId: "absent" }).matches, 0);
  const page = fixture(); page.results.itineraries.push(structuredClone(page.results.itineraries[0]));
  const report = inspectCarnivalDiscovery(page, target, selection);
  assert.equal(report.matches, 2);
  assert.equal(report.observed.selectedRoom, undefined);
  assert.ok(report.missing.includes("unambiguous-sailing"));
});

test("missing room/amount/currency never falls back to another room, requested USD or lead price", () => {
  const page = fixture(); delete sailing(page).rooms.oceanview.price; delete sailing(page).rooms.oceanview.priceCurrency;
  const report = inspectCarnivalDiscovery(page, target, selection);
  assert.equal(report.observed.selectedRoom.amount, null);
  assert.equal(report.observed.selectedRoom.currency, null);
  assert.ok(report.missing.includes("amount")); assert.ok(report.missing.includes("currency"));
  assert.ok(inspectCarnivalDiscovery(page, target, { ...selection, roomKey: "suite" }).missing.includes("selected-room"));
  assert.ok(inspectCarnivalDiscovery(page, target, { ...selection, roomKey: "balcony" }).missing.includes("unsupported-returned-currency"));
});

test("sold-out, unknown and malformed availability stay distinct and do not imply cancellation", () => {
  for (const [value, expected] of [[true, "sold-out"], [undefined, "unknown"], ["false", "unknown"], [0, "unknown"]]) {
    const page = fixture(); sailing(page).rooms.oceanview.soldOut = value;
    const report = inspectCarnivalDiscovery(page, target, selection);
    assert.equal(report.observed.selectedRoom.availability, expected);
    assert.ok(report.missing.includes(`availability-${expected}-not-cancellation`));
    assert.deepEqual(report.observations, []);
  }
});

test("fractional cents, strings and nonpositive or nonfinite amounts are incomplete", () => {
  for (const value of [731.251, "731.25", 0, -1, NaN, Infinity]) {
    const page = fixture(); sailing(page).rooms.oceanview.price = value;
    assert.equal(inspectCarnivalDiscovery(page, target, selection).observed.selectedRoom.amount, null);
  }
});

test("duration accepts only a positive safe integer or its explicit integer string", () => {
  const page = fixture(); page.results.itineraries[0].dur = "5";
  assert.equal(inspectCarnivalDiscovery(page, target, selection).observed.nights, 5);
  for (const value of [true, false, "", " 5 ", "5.0", "5 nights", "05", "-5", 0, 5.5, "9007199254740992"]) {
    page.results.itineraries[0].dur = value;
    assert.equal(inspectCarnivalDiscovery(page, target, selection).observed.nights, null);
  }
});

test("invalid dates, changed ship/duration and another booking URL remain mismatches", () => {
  const page = fixture(); sailing(page).departureDate = "2026-02-30";
  assert.ok(inspectCarnivalDiscovery(page, target, selection).missing.includes("departureDate"));
  sailing(page).departureDate = "2026-11-10";
  page.results.itineraries[0].shipName = "Carnival Paradise";
  sailing(page).sailingURL = "/book?sailingId=99999";
  const report = inspectCarnivalDiscovery(page, target, selection);
  for (const key of ["mismatched-departureDate", "mismatched-shipName", "mismatched-sourceUrl", "nights-date-mismatch"]) assert.ok(report.missing.includes(key), key);
});

test("unsafe source URLs and absent explicit selection fail without collection", () => {
  for (const sourceUrl of ["https://other.example/book", "https://user:secret@www.carnival.com/book", "https://www.carnival.com/book#fragment"]) assert.throws(() => inspectCarnivalDiscovery(fixture(), { ...target, sourceUrl }, selection), /Valid Carnival/);
  assert.throws(() => inspectCarnivalDiscovery(fixture(), target), /Explicit/);
  assert.throws(() => inspectCarnivalDiscovery([], target, selection), /response/);
  const page = fixture(); sailing(page).sailingURL = "https://other.example/book";
  assert.ok(inspectCarnivalDiscovery(page, target, selection).missing.includes("sourceUrl"));
});
