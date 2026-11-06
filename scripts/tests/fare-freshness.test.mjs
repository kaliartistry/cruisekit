import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { summarizePublicFareFreshness } from "../lib/fare-freshness.mjs";

// Synthetic complete provenance only; no collected quote, source grant or data review.
const DAY = 86400000;
const now = new Date("2026-11-06T12:00:00.000Z");
const policy = {
  cadenceDays: 7,
  providers: Object.fromEntries(["fixture-a", "fixture-b"].map(provider => [provider, {
    origin: "https://fixture.invalid", contractVersion: "synthetic-not-live", access: "approved",
  }])),
};

function fixture(id, ageMs, cruiseLine = "fixture-a") {
  const record = {
    id, cruiseLine, shipName: "Fixture Ship", departureDate: "2027-01-05", returnDate: "2027-01-10",
    nights: 5, departurePort: "Fixture departure", returnPort: "Fixture return",
    itineraryPorts: ["Fixture call A", "Fixture call B"], currency: "USD",
    priceBasis: "per-person-double-occupancy", taxesAndFeesIncluded: true,
    sourceUrl: `https://fixture.invalid/${id}`, startingPrice: 500.25, lastVerified: "2026-08-26",
  };
  const checked = new Date(now.getTime() - ageMs).toISOString();
  const entry = {
    price: record.startingPrice, observedAt: checked, lastSuccessfulVerification: checked,
    nextCheckAt: new Date(Date.parse(checked) + 7 * DAY).toISOString(),
    contextApprovedAt: now.toISOString(), reviewedBy: "synthetic-review",
    evidenceSha256: "a".repeat(64), evidenceRef: "synthetic-evidence.txt",
    quoteContext: {
      provider: cruiseLine, shipName: record.shipName, departureDate: record.departureDate,
      returnDate: record.returnDate, nights: record.nights, departurePort: record.departurePort,
      returnPort: record.returnPort, itineraryPorts: record.itineraryPorts, currency: record.currency,
      priceBasis: record.priceBasis, taxesAndFeesIncluded: record.taxesAndFeesIncluded, sourceUrl: record.sourceUrl,
      sourceSailingId: `synthetic-${id}`, cabinCategory: "FIXTURE", cabinType: "inside",
      rateCode: "FIXTURE", packageCode: "FIXTURE", market: "US", contractVersion: "synthetic-not-live",
      adults: 2, children: 0, cabins: 1,
    },
  };
  return { record, entry };
}

function summarize(fixtures, entries = Object.fromEntries(fixtures.map(f => [f.record.id, f.entry]))) {
  const records = fixtures.map(f => f.record);
  return summarizePublicFareFreshness({ publicSailings: records, seed: records, ledger: { schemaVersion: 1, entries }, policy, now });
}

function assertAllUnverified(result, records) {
  assert.equal(result.blockers.filter(f => f.unverifiedFare).length, records);
  assert.equal(result.byCruiseLine.reduce((sum, row) => sum + row.unverifiedPublicFares, 0), records);
  assert.equal(result.byCruiseLine.reduce((sum, row) => sum + row.stalePublicSailings, 0), 0);
  assert.ok(result.byCruiseLine.every(row => row.latestPriceCheck === null));
}

test("valid checks use one evaluation instant at the exact seven-day boundary", () => {
  const fresh = fixture("fresh", 0);
  const boundary = fixture("boundary", 7 * DAY);
  const stale = fixture("stale", 7 * DAY + 1);
  const result = summarize([fresh, boundary, stale]);
  assert.equal(result.blockers.length, 1);
  assert.equal(result.blockers[0].id, "stale");
  assert.equal(result.blockers[0].ageDays, 7 + 1 / DAY);
  assert.deepEqual(result.byCruiseLine, [{
    cruiseLine: "fixture-a", publicSailings: 3, stalePublicSailings: 1, unverifiedPublicFares: 0,
    latestPriceCheck: fresh.entry.lastSuccessfulVerification,
    oldestLastVerified: "2026-08-26", latestLastVerified: "2026-08-26",
  }]);
});

test("one future observation fails the whole ledger closed across cruise-line totals", () => {
  const valid = fixture("valid", DAY);
  const future = fixture("future", -1, "fixture-b");
  const result = summarize([valid, future]);
  assert.match(result.blockers.find(f => f.id === "fare-provenance").message, /invalid-observation-time/);
  assertAllUnverified(result, 2);
});

test("mixed malformed and valid dates cannot retain a displayed latest price check", () => {
  const valid = fixture("valid", 8 * DAY);
  const malformed = fixture("malformed", DAY, "fixture-b");
  malformed.entry.observedAt = malformed.entry.lastSuccessfulVerification = "not-a-time";
  const result = summarize([valid, malformed]);
  assert.ok(result.blockers.some(f => f.id === "fare-provenance"));
  assertAllUnverified(result, 2);
});

test("a non-date provenance error also hides all otherwise valid check dates", () => {
  const valid = fixture("valid", DAY);
  const invalid = fixture("invalid", DAY, "fixture-b");
  invalid.entry.quoteContext.taxesAndFeesIncluded = false;
  const result = summarize([valid, invalid]);
  assert.match(result.blockers.find(f => f.id === "fare-provenance").message, /context-taxesAndFeesIncluded/);
  assertAllUnverified(result, 2);
});

test("a missing baseline counts as unverified without invalidating legitimate existing provenance", () => {
  const valid = fixture("valid", DAY);
  const missing = fixture("missing", DAY);
  const result = summarize([valid, missing], { valid: valid.entry });
  assert.equal(result.blockers.length, 1);
  assert.equal(result.blockers[0].id, "missing");
  assert.equal(result.blockers[0].unverifiedFare, true);
  assert.equal(result.byCruiseLine[0].unverifiedPublicFares, 1);
  assert.equal(result.byCruiseLine[0].latestPriceCheck, valid.entry.lastSuccessfulVerification);
});

test("record review dates remain historical metadata and cannot manufacture a price check", () => {
  const legacy = fixture("legacy", DAY);
  legacy.record.lastVerified = now.toISOString().slice(0, 10);
  const before = JSON.stringify(legacy);
  const result = summarize([legacy], {});
  assertAllUnverified(result, 1);
  assert.equal(result.byCruiseLine[0].latestLastVerified, "2026-11-06");
  assert.equal(JSON.stringify(legacy), before);
});

test("a valid seed and ledger cannot certify a public row with a different displayed fare or exact context", () => {
  const valid = fixture("valid", DAY);
  const args = { seed: [valid.record], ledger: { schemaVersion: 1, entries: { valid: valid.entry } }, policy, now };
  assert.equal(summarizePublicFareFreshness({ ...args, publicSailings: [valid.record] }).blockers.length, 0);
  for (const changes of [
    { startingPrice: 500.26 }, { currency: "EUR" }, { sourceUrl: "https://fixture.invalid/other" },
    { taxesAndFeesIncluded: false }, { priceBasis: "per-cabin" }, { shipName: "Another Ship" },
    { departureDate: "2027-01-06" }, { returnDate: "2027-01-11" }, { nights: 6 },
    { departurePort: "Another departure" }, { returnPort: "Another return" }, { cruiseLine: "fixture-b" },
    { itineraryPorts: ["Fixture call B", "Fixture call A"] }, { itineraryPorts: ["Another call"] },
  ]) {
    const report = summarizePublicFareFreshness({ ...args, publicSailings: [{ ...valid.record, ...changes }] });
    assertAllUnverified(report, 1);
    assert.match(report.blockers[0].message, /Published fare amount\/context differs/);
  }
});

test("invalid evaluation clocks and weaker freshness thresholds are rejected", () => {
  const args = { publicSailings: [], seed: [], ledger: { schemaVersion: 1, entries: {} }, policy, now };
  assert.throws(() => summarizePublicFareFreshness({ ...args, now: new Date(NaN) }), /evaluation time/);
  assert.throws(() => summarizePublicFareFreshness({ ...args, maxPublicAgeDays: 8 }), /exactly seven days/);
  assert.deepEqual(summarizePublicFareFreshness(args), { blockers: [], byCruiseLine: [] });
});

test("latest confirmed check compares actual instants with optional fractional seconds", () => {
  const earlier = fixture("earlier", 1000), later = fixture("later", 999);
  earlier.entry.observedAt = earlier.entry.lastSuccessfulVerification = earlier.entry.observedAt.replace(".000Z", "Z");
  assert.equal(summarize([earlier, later]).byCruiseLine[0].latestPriceCheck, later.entry.observedAt);
});

test("the actual report CLI exits nonzero and emits consistent JSON/Markdown for a future ledger entry", async () => {
  // Copy only the CLI and its local modules into an isolated fixture root.
  // No source requests, real seed writes, feed builds or production CLI run.
  const root = await mkdtemp(resolve(tmpdir(), "cruisekit-freshness-cli-"));
  for (const path of ["scripts/data-freshness-report.mjs", "scripts/lib/date.mjs", "scripts/lib/fare-verification.mjs", "scripts/lib/fare-run.mjs", "scripts/lib/fare-freshness.mjs"]) {
    const destination = resolve(root, path);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, await readFile(new URL(`../../${path}`, import.meta.url)));
  }
  const valid = fixture("valid", DAY), future = fixture("future", -DAY, "fixture-b");
  const evaluated = Date.now();
  for (const [entry, age] of [[valid.entry, DAY], [future.entry, -DAY]]) {
    entry.observedAt = entry.lastSuccessfulVerification = new Date(evaluated - age).toISOString();
    entry.nextCheckAt = new Date(evaluated - age + 7 * DAY).toISOString();
    entry.contextApprovedAt = new Date(evaluated - DAY).toISOString();
  }
  const records = [valid.record, future.record];
  const inputs = {
    "data/bundles/manifest.json": { generatedAt: new Date(evaluated).toISOString() },
    "data/bundles/canonical/sailings.json": records,
    "data/source-watchlist.json": [],
    "data/seed/sailings.json": records,
    "data/seed/fare-verifications.json": { schemaVersion: 1, entries: { valid: valid.entry, future: future.entry } },
    "data/fare-verification-policy.json": policy,
  };
  for (const [path, value] of Object.entries(inputs)) {
    await mkdir(dirname(resolve(root, path)), { recursive: true });
    await writeFile(resolve(root, path), JSON.stringify(value));
  }
  const run = spawnSync(process.execPath, [resolve(root, "scripts/data-freshness-report.mjs")], { encoding: "utf8", env: { ...process.env, CRUISEKIT_MAX_PUBLIC_DATA_AGE_DAYS: "7", CRUISEKIT_MAX_INGEST_AGE_DAYS: "7" } });
  assert.equal(run.status, 1, run.stderr);
  const report = JSON.parse(await readFile(resolve(root, "data/reports/latest-data-freshness.json"), "utf8"));
  assert.equal(report.counts.unverifiedPublicFares, 2);
  assertAllUnverified(report, 2);
  const markdown = await readFile(resolve(root, "data/reports/latest-data-freshness.md"), "utf8");
  assert.match(markdown, /invalid-observation-time/);
  assert.match(markdown, /\| fixture-a \| 1 \| 0 \| 1 \| 2026-08-26 \| 2026-08-26 \| unverified \|/);
  for (const [path, value] of Object.entries(inputs)) assert.equal(await readFile(resolve(root, path), "utf8"), JSON.stringify(value));
});
