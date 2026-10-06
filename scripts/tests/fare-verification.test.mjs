import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdtemp, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { assessFares, boundedReader, robotsAllows, digest, ledgerProblems } from "../lib/fare-verification.mjs";
import { recheck } from "../run-fare-recheck.mjs";
import { freshnessIssueBody } from "../create-data-freshness-issue.mjs";

const now = new Date("2026-10-05T12:01:00Z");
const r = { id: "carnival-test", cruiseLine: "carnival", shipName: "Test Ship", departureDate: "2026-11-01", returnDate: "2026-11-06", nights: 5, departurePort: "Miami", returnPort: "Miami", itineraryPorts: ["Nassau"], currency: "USD", priceBasis: "per-person-double-occupancy", taxesAndFeesIncluded: true, sourceUrl: "https://www.carnival.com/test-sailing", startingPrice: 500.25, lastVerified: "2026-08-26", confidence: "verified_from_cruise_line" };
const c = { provider: r.cruiseLine, shipName: r.shipName, departureDate: r.departureDate, returnDate: r.returnDate, nights: r.nights, departurePort: r.departurePort, returnPort: r.returnPort, itineraryPorts: r.itineraryPorts, currency: r.currency, priceBasis: r.priceBasis, taxesAndFeesIncluded: true, sourceUrl: r.sourceUrl, sourceSailingId: "ship-20261101", cabinCategory: "4A", cabinType: "inside", rateCode: "PUBLIC", packageCode: "NONE", market: "US", contractVersion: "fixture-only-not-live", adults: 2, children: 0, cabins: 1 };
const p = { publicationMode: "review-only", cadenceDays: 7, largeChangeFraction: 0.15, maxTargets: 400, providers: { carnival: { origin: "https://www.carnival.com", access: "approved", contractVersion: c.contractVersion } } };
const e = { price: r.startingPrice, observedAt: "2026-09-28T12:00:00Z", lastSuccessfulVerification: "2026-09-28T12:00:00Z", nextCheckAt: "2026-10-05T12:00:00.000Z", contextApprovedAt: "2026-09-28T11:00:00Z", reviewedBy: "owner-fixture", quoteContext: c, evidenceSha256: digest("old quote fixture"), evidenceRef: "old-fixture.json" };
const o = { targetId: r.id, price: 505.25, observedAt: "2026-10-05T12:00:30Z", sourceTimestamp: null, responseAgeSeconds: 0, evidenceSha256: digest("new quote fixture"), evidenceRef: "new-fixture.json", quoteContext: c, availability: "available" };
const run = (observation = o, ledger = { schemaVersion: 1, entries: { [r.id]: e } }, policy = p) => assessFares({ seed: [r], ledger, policy, observations: observation == null ? [] : Array.isArray(observation) ? observation : [observation], runStartedAt: "2026-10-05T12:00:00Z", now });

test("exact known quote advances candidate cents, actual observation and seven-day due date only", () => {
  const a = run();
  assert.equal(a.counts.eligible, 1);
  assert.equal(a.candidateSeed[0].startingPrice, 505.25);
  assert.equal(a.candidateSeed[0].lastVerified, "2026-08-26");
  assert.equal(a.candidateLedger.entries[r.id].lastSuccessfulVerification, o.observedAt);
  assert.equal(a.candidateLedger.entries[r.id].nextCheckAt, "2026-10-12T12:00:30.000Z");
  assert.equal(r.startingPrice, 500.25);
  assert.equal(e.lastSuccessfulVerification, "2026-09-28T12:00:00Z");
});
test("unchanged prices still require a new actual check, context property order does not matter", () => {
  assert.equal(run({ ...o, price: r.startingPrice, quoteContext: Object.fromEntries(Object.entries(c).reverse()) }).counts.eligible, 1);
  assert.equal(run({ ...o, price: 575.28 }).counts.eligible, 1);
  assert.equal(run({ ...o, price: 575.29 }).counts.eligible, 0);
});
for (const field of ["shipName", "departureDate", "returnDate", "nights", "itineraryPorts", "sourceSailingId", "cabinCategory", "cabinType", "rateCode", "packageCode", "market", "currency", "priceBasis", "taxesAndFeesIncluded", "adults", "children", "cabins", "sourceUrl", "contractVersion"]) {
  test(`changed ${field} never advances the price or verification date`, () => {
    const a = run({ ...o, quoteContext: { ...c, [field]: field === "itineraryPorts" ? ["Different port"] : "changed" } });
    assert.equal(a.counts.eligible, 0);
    assert.deepEqual(a.candidateSeed, [r]);
    assert.deepEqual(a.candidateLedger.entries[r.id], e);
  });
}
for (const change of [
  { price: r.startingPrice * 1.15 }, { price: 1000 }, { price: 0 }, { price: 505.251 }, { price: null },
  { observedAt: "2026-08-26T12:00:30Z" }, { observedAt: "2026-10-06T12:00:30Z" }, { observedAt: "2026-02-30T12:00:30Z" }, { observedAt: null },
  { responseAgeSeconds: 301 }, { responseAgeSeconds: null }, { sourceTimestamp: "2026-10-01T12:00:00Z" }, { evidenceSha256: null },
]) test(`invalid/stale/large observation is retained: ${JSON.stringify(change)}`, () => {
  const a = run({ ...o, ...change }); assert.equal(a.counts.eligible, 0); assert.deepEqual(a.candidateSeed, [r]); assert.deepEqual(a.candidateLedger.entries[r.id], e);
});
for (const availability of ["sold-out", "not-found", "itinerary-changed", "blocked", "unknown"]) test(`${availability} does not mean cancelled or erase the last successful quote`, () => {
  const a = run({ ...o, availability }); assert.equal(a.counts.retained, 1); assert.deepEqual(a.candidateSeed, [r]); assert.match(a.decisions[0].reasons.join(), /not-cancellation/);
});
test("missing/duplicate results, new IDs and legacy dates cannot manufacture verification", () => {
  assert.equal(run(null).counts.retained, 1);
  assert.equal(run([o, o]).counts.eligible, 0);
  assert.equal(run({ ...o, targetId: "new-id" }).counts.quarantined, 1);
  const legacy = run(o, { schemaVersion: 1, entries: {} });
  assert.equal(legacy.counts.eligible, 0); assert.deepEqual(legacy.candidateLedger.entries, {});
});
test("access hold cannot be overridden by an otherwise exact quote", () => {
  const policy = structuredClone(p); policy.providers.carnival.access = "blocked";
  assert.equal(run(o, undefined, policy).counts.eligible, 0);
});
test("an old job start cannot authorize replay of historical quote evidence", () => {
  assert.throws(() => assessFares({ seed: [r], ledger: { schemaVersion: 1, entries: { [r.id]: e } }, policy: p, observations: [o], runStartedAt: "2026-10-01T00:00:00Z", now }), /expired run/);
});
test("replayed successful observation is rejected; wrong ledger amount blocks build", () => {
  const first = run();
  const second = assessFares({ seed: first.candidateSeed, ledger: first.candidateLedger, policy: p, observations: [o], runStartedAt: "2026-10-05T12:00:00Z", now });
  assert.equal(second.counts.eligible, 0);
  assert.equal(ledgerProblems([r], first.candidateLedger, p, now).length, 1);
});
test("robots uses agent groups, longest match, wildcards and allow precedence", () => {
  const body = "User-agent: *\nDisallow: /vacation-builder/\nAllow: /vacation-builder/help\nDisallow: /*?token=*\nUser-agent: OtherBot\nDisallow: /\n";
  assert.equal(robotsAllows(body, "https://www.ncl.com/vacation-builder/api/v2/itinerary/X/sailings"), false);
  assert.equal(robotsAllows(body, "https://www.ncl.com/vacation-builder/help"), true);
  assert.equal(robotsAllows(body, "https://www.ncl.com/public?token=secret"), false);
  assert.equal(robotsAllows(body, "https://www.ncl.com/public"), true);
});

const limits = { maxRequests: 3, maxAttempts: 2, timeoutMs: 100, minDelayMs: 10, maxRetryDelayMs: 1000, maxBytes: 100 };
test("transport respects retry-after, bounds, public origin and actual response completion", async () => {
  let calls = 0; const waits = [];
  const reader = boundedReader("https://www.ncl.com", limits, { pause: async ms => waits.push(ms), clock: () => now, fetchImpl: async (_url, options) => {
    assert.equal(options.redirect, "manual"); assert.equal(options.credentials, "omit"); assert.match(options.headers["User-Agent"], /CruiseKitImporter/);
    calls++; return calls === 1 ? new Response("throttled", { status: 429, headers: { "retry-after": "1" } }) : new Response("quote body");
  } });
  const result = await reader.read("https://www.ncl.com/robots.txt");
  assert.equal(calls, 2); assert.deepEqual(waits, [1000, 10]); assert.equal(result.observedAt, now.toISOString()); assert.equal(result.evidenceSha256, digest("quote body"));
  await assert.rejects(reader.read("https://other.example/"), /Unapproved/);
  await assert.rejects(reader.read("https://user:secret@www.ncl.com/"), /Unapproved/);
});
test("denial, redirect, CAPTCHA, long throttle, excessive body and timeout stop without evasion", async () => {
  for (const response of [new Response("denied", { status: 403 }), new Response("", { status: 302, headers: { location: "https://other.example" } }), new Response("captcha"), new Response("throttle", { status: 429, headers: { "retry-after": "60" } }), new Response("x".repeat(101))]) {
    let calls = 0;
    const reader = boundedReader("https://www.ncl.com", limits, { pause: async () => {}, fetchImpl: async () => { calls++; return response; } });
    await assert.rejects(reader.read("https://www.ncl.com/robots.txt")); assert.equal(calls, 1);
  }
  const timeout = boundedReader("https://www.ncl.com", limits, { fetchImpl: async () => { throw Object.assign(new Error(), { name: "TimeoutError" }); } });
  await assert.rejects(timeout.read("https://www.ncl.com/robots.txt"), /TimeoutError/);
});
test("request ceiling holds across retries and repeated flow", async () => {
  const reader = boundedReader("https://www.ncl.com", limits, { pause: async () => {}, fetchImpl: async () => new Response("ok") });
  for (let i = 0; i < 3; i++) await reader.read("https://www.ncl.com/robots.txt");
  await assert.rejects(reader.read("https://www.ncl.com/robots.txt"), /Request bound/);
});
test("offline integration emits immutable audit/rollback and retains every actual seed fare", async () => {
  const output = await mkdtemp(resolve(tmpdir(), "cruisekit-fare-test-"));
  const a = await recheck({ output });
  assert.equal(a.publicationEnabled, false); assert.equal(a.inputsUnchanged, true); assert.equal(a.counts.eligible, 0); assert.ok(a.counts.retained > 0);
  assert.equal((await readFile(resolve(output, "sailings.before.json"))).toString(), (await readFile(new URL("../../data/seed/sailings.json", import.meta.url))).toString());
  assert.equal(a.before.seedSha256, a.after.seedSha256); assert.equal(a.before.ledgerSha256, a.after.ledgerSha256);
  await assert.rejects(recheck({ output }), /EEXIST/);
});
test("raw evidence tampering and symlink escape fail without a candidate or seed write", async () => {
  const dir = await mkdtemp(resolve(tmpdir(), "cruisekit-fare-evidence-"));
  await writeFile(resolve(dir, "raw.json"), "tampered");
  const observations = [{ ...o, observedAt: new Date().toISOString(), evidenceRef: "raw.json" }];
  await writeFile(resolve(dir, "observations.json"), JSON.stringify(observations));
  await assert.rejects(recheck({ output: resolve(dir, "candidate"), observationsFile: resolve(dir, "observations.json") }), /does not match/);
  const outside = await mkdtemp(resolve(tmpdir(), "cruisekit-fare-outside-"));
  await writeFile(resolve(outside, "raw.json"), "new quote fixture");
  await symlink(resolve(outside, "raw.json"), resolve(dir, "escape.json"));
  observations[0].evidenceRef = "escape.json";
  await writeFile(resolve(dir, "observations.json"), JSON.stringify(observations));
  await assert.rejects(recheck({ output: resolve(dir, "candidate"), observationsFile: resolve(dir, "observations.json") }), /escapes/);
});
test("valid raw evidence is preserved in the immutable audit even when its quote is quarantined", async () => {
  const dir = await mkdtemp(resolve(tmpdir(), "cruisekit-fare-raw-audit-"));
  await writeFile(resolve(dir, "raw.json"), "new quote fixture");
  await writeFile(resolve(dir, "observations.json"), JSON.stringify([{ ...o, observedAt: new Date().toISOString(), evidenceRef: "raw.json" }]));
  const output = resolve(dir, "audit");
  const a = await recheck({ output, observationsFile: resolve(dir, "observations.json") });
  assert.equal(a.counts.eligible, 0); assert.equal(a.inputsUnchanged, true);
  assert.equal((await readFile(resolve(output, "evidence", `${o.evidenceSha256}.txt`))).toString(), "new quote fixture");
  const rows = JSON.parse(await readFile(resolve(output, "observations.json")));
  assert.equal(rows[0].evidenceRef, `evidence/${o.evidenceSha256}.txt`);
});
test("existing failure alert includes current exact-quote blockers and excludes old run reports", () => {
  const report = { generatedAt: "2026-10-06T12:00:00Z", currentDate: "2026-10-06", counts: { blockers: 361, warnings: 0, unverifiedPublicFares: 361 }, thresholds: { maxPublicAgeDays: 7 }, blockers: [], byCruiseLine: [] };
  const verification = { generatedAt: "2026-10-06T11:00:00Z", counts: { eligible: 0, retained: 361, quarantined: 0 }, providerReadiness: [{ provider: "norwegian", access: "blocked", reason: "robots-denied" }], paths: { audit: "dated-audit" } };
  const body = freshnessIssueBody(report, verification);
  assert.match(body, /robots-denied/); assert.match(body, /Publication is disabled/); assert.match(body, /361 fares without confirmed/);
  assert.doesNotMatch(freshnessIssueBody(report, { ...verification, generatedAt: "2026-10-05T11:00:00Z" }), /Exact Quote Recheck/);
});
