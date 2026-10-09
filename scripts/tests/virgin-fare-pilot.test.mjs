import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { digest } from "../lib/fare-verification.mjs";
import { VIRGIN_TERMS_URL, VIRGIN_PILOT_ID, virginTermsRestriction, inspectVirginDiscovery } from "../lib/virgin-fare-pilot.mjs";
import { runVirginPilot } from "../run-virgin-fare-pilot.mjs";

const seed = JSON.parse(await readFile(new URL("../../data/seed/sailings.json", import.meta.url)));
const target = seed.find(r => r.id === VIRGIN_PILOT_ID);
// Synthetic old-importer capture shape, not live evidence or a provider contract.
const fixture = [{ packageCode: "5NLAH", title: target.sailingName, shipName: target.shipName, ports: target.itineraryPorts, nights: 5, price: "$999", priceBasis: "per cabin", sailings: [{ voyageId: "BR2610245NLAH", href: target.sourceUrl, year: "2026", start: "Oct 24", end: "Oct 29", price: "$1,192.25" }] }];
const termsFixture = '<p>You shall not harvest or otherwise collect any data, information or content from the Website, including manual or automated processes to &quot;crawl,&quot; &quot;scrape&quot; or &quot;spider&quot; any page.</p>';
const clock = () => new Date("2026-10-06T00:46:58Z");

test("Virgin restriction detection handles source HTML and never treats absence as permission", () => {
  assert.equal(virginTermsRestriction(termsFixture).status, "terms-collection-prohibited");
  assert.equal(virginTermsRestriction("Terms changed or not loaded").status, "terms-review-inconclusive");
});
test("matched dated card keeps cents but cannot manufacture a complete quote", () => {
  const a = inspectVirginDiscovery(fixture, target);
  assert.equal(a.observed.amount, 1192.25);
  assert.equal(a.observed.departureDate, "2026-10-24");
  assert.equal(a.observed.returnDate, "2026-10-29");
  assert.equal(a.observed.requestedCurrency, "USD");
  for (const field of ["cabinCategory", "rateCode", "adults", "children", "cabins", "market", "returnedCurrency", "taxesAndFeesIncluded", "sourceContract"]) assert.ok(a.missing.includes(field));
  assert.deepEqual(a.observations, []);
  assert.equal(a.observed.taxesAndFeesIncluded, undefined);
});
test("empty sailing price never falls back to cheaper itinerary/card price", () => {
  const cards = structuredClone(fixture); cards[0].sailings[0].price = "";
  const a = inspectVirginDiscovery(cards, target);
  assert.equal(a.observed.amount, null); assert.ok(a.missing.includes("sailingPriceText"));
});
test("unknown cents, wrong nights, ambiguous cards and ship names are rejected without inference", () => {
  const cards = structuredClone(fixture); cards[0].sailings[0].price = "$1,192.251"; cards[0].nights = 6; cards[0].shipName = "Scarlet Lady";
  const a = inspectVirginDiscovery(cards, target);
  assert.equal(a.observed.amount, null); assert.ok(a.missing.includes("nights-date-mismatch")); assert.ok(a.missing.includes("mismatched-shipName"));
  assert.equal(inspectVirginDiscovery([...fixture, ...fixture], target).matches, 2);
  assert.equal(inspectVirginDiscovery([], target).matches, 0);
});
test("invalid source dates and URLs cannot become verified identities", () => {
  const cards = structuredClone(fixture); cards[0].sailings[0].start = "Feb 30";
  assert.ok(inspectVirginDiscovery(cards, target).missing.includes("departureDate"));
  assert.throws(() => inspectVirginDiscovery(fixture, { ...target, sourceUrl: "https://user:password@www.virginvoyages.com/book" }), /Invalid/);
});
test("real recheck wiring consumes scoped observation file; prohibited pilot makes zero fare requests", async () => {
  const output = await mkdtemp(resolve(tmpdir(), "cruisekit-virgin-pilot-"));
  const requests = [];
  const reader = { get requests() { return requests.length; }, async read(url) { requests.push(url); assert.equal(url, VIRGIN_TERMS_URL); return { body: termsFixture, observedAt: new Date().toISOString(), evidenceSha256: digest(termsFixture) }; } };
  const report = await runVirginPilot({ output, reader, clock });
  assert.equal(report.access.status, "terms-collection-prohibited");
  assert.deepEqual(requests, [VIRGIN_TERMS_URL]);
  assert.equal(report.fareRequests, 0); assert.equal(report.completeQuotes, 0); assert.equal(report.inputsUnchanged, true);
  assert.equal(report.verification.counts.targets, 1); assert.equal(report.verification.coverage.globalCoverage, false); assert.ok(report.verification.coverage.outsideScope > 0);
  assert.equal(report.verification.ready, false); assert.equal(report.verification.scopeReady, false);
  assert.deepEqual(JSON.parse(await readFile(resolve(output, "observations.json"))), []);
  const audit = JSON.parse(await readFile(resolve(output, "verification/audit.json")));
  assert.equal(audit.before.seedSha256, audit.after.seedSha256);
  assert.equal(audit.before.ledgerSha256, audit.after.ledgerSha256);
});
test("terms failure and changed terms stop collection rather than activate an unimplemented contract", async () => {
  for (const denied of [true, false]) {
    const output = await mkdtemp(resolve(tmpdir(), "cruisekit-virgin-source-fail-")); let requests = 0;
    const reader = { get requests() { return requests; }, async read() { requests++; if (denied) throw new Error("HTTP 403"); return { body: "Updated terms", observedAt: new Date().toISOString(), evidenceSha256: digest("Updated terms") }; } };
    const report = await runVirginPilot({ output, reader, clock });
    assert.equal(report.access.status, denied ? "terms-unavailable" : "terms-review-inconclusive"); assert.equal(report.fareRequests, 0); assert.equal(requests, 1);
  }
});
test("existing discovery runner and all discovery importers remain identical to production", async () => {
  // SHA-256 of exact production files at c0e6390c; no Git history needed in CI.
  const expected = {
  "scripts/run-weekly-ingest-report.mjs": "229a893b03c6b343d9246084c2a6de7a626111d6e7782e187afa1431b1512bbe",
  "scripts/ingest/azamara.mjs": "406261a98c114b07fef5d5705ab090d3654ea0bd2361c4a4be512c15e0e2abb1",
  "scripts/ingest/carnival.mjs": "00295dc7f8b7cd142a33f7c1b43dc59ef3d1ef252af8ffb2a5949151da545e67",
  "scripts/ingest/holland-america.mjs": "5626610639413881aad68611e3ed92a4405d79cda27891837c73810e130008c2",
  "scripts/ingest/msc.mjs": "07e7fdcd7fdbca6675e9448c926f2b97b2b93b106e0cbf8bd8017042c5a5bb36",
  "scripts/ingest/norwegian.mjs": "0b95e30d5ecd027552358fb606b9a874f02d8ca0cc945e02531faba9e4102d9f",
  "scripts/ingest/princess.mjs": "1f4b7a2685a0a7a9cb89538b4a1e4c2c0c3efc91b77f8e7927a457b47dc9b9e5",
  "scripts/ingest/royal-caribbean.mjs": "61afdf86d57356ca9121166d9e895c27add3951a09a1706dcfde28d4f0604db2",
  "scripts/ingest/viking.mjs": "ec90fc35766d298393a026418f8dc6f45a0c7bf625ebb87bab26bdad364e89b3",
  "scripts/ingest/virgin-voyages.mjs": "04a5d92509e809f37c276315052df043fcd0f8822ee62e2c9ebe352b13f1352b"
};
  for (const [file, hash] of Object.entries(expected)) assert.equal(digest((await readFile(new URL(`../../${file}`, import.meta.url))).toString("utf8")), hash);
});
