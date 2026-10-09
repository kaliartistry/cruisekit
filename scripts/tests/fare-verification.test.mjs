import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdtemp, symlink, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { assessFares, boundedReader, robotsAllows, digest, ledgerProblems, reviewInitialBaselines } from "../lib/fare-verification.mjs";
import { recheck, reviewBaselineAudit, fareCodeSha256 } from "../run-fare-recheck.mjs";
import { freshnessIssueBody } from "../create-data-freshness-issue.mjs";

const now = new Date("2026-10-05T12:01:00Z");
const r = { id: "carnival-test", cruiseLine: "carnival", shipName: "Test Ship", departureDate: "2026-11-01", returnDate: "2026-11-06", nights: 5, departurePort: "Miami", returnPort: "Miami", itineraryPorts: ["Miami", "Nassau", "Miami"], currency: "USD", priceBasis: "per-person-double-occupancy", taxesAndFeesIncluded: true, sourceUrl: "https://www.carnival.com/test-sailing", startingPrice: 500.25, lastVerified: "2026-08-26", confidence: "verified_from_cruise_line" };
const c = { provider: r.cruiseLine, shipName: r.shipName, departureDate: r.departureDate, returnDate: r.returnDate, nights: r.nights, departurePort: r.departurePort, returnPort: r.returnPort, itineraryPorts: r.itineraryPorts, currency: r.currency, priceBasis: r.priceBasis, taxesAndFeesIncluded: true, sourceUrl: r.sourceUrl, sourceSailingId: "ship-20261101", cabinCategory: "4A", cabinType: "inside", rateCode: "PUBLIC", packageCode: "NONE", market: "US", contractVersion: "fixture-only-not-live", adults: 2, children: 0, cabins: 1 };
const p = { publicationMode: "review-only", cadenceDays: 7, largeChangeFraction: 0.15, maxTargets: 400, providers: { carnival: { origin: "https://www.carnival.com", access: "approved", contractVersion: c.contractVersion } } };
const e = { price: r.startingPrice, observedAt: "2026-09-28T12:00:00Z", lastSuccessfulVerification: "2026-09-28T12:00:00Z", nextCheckAt: "2026-10-05T12:00:00.000Z", contextApprovedAt: "2026-09-28T11:00:00Z", reviewedBy: "owner-fixture", quoteContext: c, evidenceSha256: digest("old quote fixture"), evidenceRef: "old-fixture.json" };
const o = { runId: "fixture-run", collectionEventId: "fixture-event", targetId: r.id, price: 505.25, observedAt: "2026-10-05T12:00:30Z", sourceTimestamp: null, responseAgeSeconds: 0, evidenceSha256: digest("new quote fixture"), evidenceRef: "new-fixture.json", quoteContext: c, availability: "available" };
import { makeRunManifest, stableDigest } from "../lib/fare-run.mjs";
function assessFixture(args) {
  const targetIds = args.targetIds ?? args.seed.filter(r => r.confidence !== "internal_do_not_publish" && r.departureDate >= args.now.toISOString().slice(0, 10)).map(r => r.id);
  const codeSha256 = digest("fixture-code");
  const runManifest = args.runManifest ?? makeRunManifest({ runId: args.observations[0]?.runId ?? "fixture-run", startedAt: args.runStartedAt, targetIds, seed: args.seed, ledger: args.ledger, policy: args.policy, codeSha256, observations: args.observations });
  return assessFares({ ...args, codeSha256, runManifest });
}
const completeTerminal = audit => ({ schemaVersion: 1, kind: "fare-run-terminal", runId: audit.runId, startedAt: audit.runStartedAt, completedAt: audit.generatedAt, stage: "fixture-complete", executionStatus: "completed", auditSha256: stableDigest(audit), scopeReady: false, ready: false });
const run = (observation = o, ledger = { schemaVersion: 1, entries: { [r.id]: e } }, policy = p) => assessFixture({ seed: [r], ledger, policy, observations: observation == null ? [] : Array.isArray(observation) ? observation : [observation], runStartedAt: "2026-10-05T12:00:00Z", now });

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
  assert.throws(() => assessFixture({ seed: [r], ledger: { schemaVersion: 1, entries: { [r.id]: e } }, policy: p, observations: [o], runStartedAt: "2026-10-01T00:00:00Z", now }), /expired run/);
});
test("replayed successful observation is rejected; wrong ledger amount blocks build", () => {
  const first = run();
  const second = assessFixture({ seed: first.candidateSeed, ledger: first.candidateLedger, policy: p, observations: [o], runStartedAt: "2026-10-05T12:00:00Z", now });
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
  await assert.rejects(recheck({ output: resolve(dir, "escaped-candidate"), observationsFile: resolve(dir, "observations.json") }), /escapes/);
});
test("valid raw evidence is preserved in the immutable audit even when its quote is quarantined", async () => {
  const dir = await mkdtemp(resolve(tmpdir(), "cruisekit-fare-raw-audit-"));
  await writeFile(resolve(dir, "raw.json"), "new quote fixture");
  await writeFile(resolve(dir, "observations.json"), JSON.stringify([{ ...o, observedAt: new Date().toISOString(), evidenceRef: "raw.json" }]));
  const output = resolve(dir, "audit");
  const seed = JSON.parse(await readFile(new URL("../../data/seed/sailings.json", import.meta.url)));
  const ledger = JSON.parse(await readFile(new URL("../../data/seed/fare-verifications.json", import.meta.url)));
  const policy = JSON.parse(await readFile(new URL("../../data/fare-verification-policy.json", import.meta.url)));
  const current = new Date(), startedAt = current.toISOString();
  const manifestFile = resolve(dir, "run-manifest.json");
  await writeFile(manifestFile, JSON.stringify(makeRunManifest({ runId: o.runId, startedAt, targetIds: seed.filter(r => r.confidence !== "internal_do_not_publish" && r.departureDate >= startedAt.slice(0,10)).map(r => r.id), seed, ledger, policy, codeSha256: await fareCodeSha256(), observations: [] })));
  const a = await recheck({ output, observationsFile: resolve(dir, "observations.json"), manifestFile, runId: o.runId, startedAt, clock: () => current, now: current });
  assert.equal(a.counts.eligible, 0); assert.equal(a.inputsUnchanged, true);
  assert.equal((await readFile(resolve(output, "evidence", `${o.evidenceSha256}.txt`))).toString(), "new quote fixture");
  const rows = JSON.parse(await readFile(resolve(output, "observations.json")));
  assert.equal(rows[0].evidenceRef, `evidence/${o.evidenceSha256}.txt`);
});
test("existing failure alert includes current exact-quote blockers and excludes old run reports", () => {
  const report = { generatedAt: "2026-10-06T12:00:00Z", currentDate: "2026-10-06", counts: { blockers: 361, warnings: 0, unverifiedPublicFares: 361 }, thresholds: { maxPublicAgeDays: 7 }, blockers: [], byCruiseLine: [] };
  const verification = { runId: "fixture-alert", runStartedAt: "2026-10-06T10:00:00Z", generatedAt: "2026-10-06T11:00:00Z", counts: { eligible: 0, retained: 361, quarantined: 0 }, providerReadiness: [{ provider: "norwegian", access: "blocked", reason: "robots-denied" }], paths: { audit: "dated-audit" } };
  const body = freshnessIssueBody(report, verification, null, { runId: "fixture-alert", verificationTerminal: completeTerminal(verification) });
  assert.match(body, /robots-denied/); assert.match(body, /Publication is disabled/); assert.match(body, /361 fares without confirmed/);
  assert.doesNotMatch(freshnessIssueBody(report, { ...verification, generatedAt: "2026-10-05T11:00:00Z" }), /Exact Quote Recheck/);
});

test("complete first observations produce reviewable baselines, never silent certification", () => {
  const empty = { schemaVersion: 1, entries: {} };
  const seed = [{ ...r, taxesAndFeesIncluded: false }];
  const a = assessFixture({ seed, ledger: empty, policy: p, observations: [o], runStartedAt: "2026-10-05T12:00:00Z", now });
  assert.equal(a.initialBaselines.length, 1);
  assert.equal(a.initialBaselines[0].record.taxesAndFeesIncluded, true);
  assert.equal(a.initialBaselines[0].record.lastVerified, r.lastVerified);
  assert.equal(a.initialBaselines[0].observation.price, 505.25);
  assert.equal(a.counts.eligible, 0);
  assert.deepEqual(a.candidateSeed, seed);
  assert.deepEqual(a.candidateLedger, empty);
});

test("specific baseline review adopts only candidates and preserves actual observation time", () => {
  const empty = { schemaVersion: 1, entries: {} };
  const proposals = run(o, empty).initialBaselines;
  const reviews = [{ targetId: r.id, proposalSha256: proposals[0].proposalSha256, reviewedBy: "explicit-owner-fixture-not-real-approval", contextApprovedAt: now.toISOString() }];
  const a = reviewInitialBaselines({ seed: [r], ledger: empty, proposals, reviews, policy: p, now });
  assert.equal(a.candidateSeed[0].startingPrice, 505.25);
  assert.equal(a.candidateSeed[0].lastVerified, "2026-08-26");
  assert.equal(a.candidateLedger.entries[r.id].lastSuccessfulVerification, o.observedAt);
  assert.equal(a.candidateLedger.entries[r.id].nextCheckAt, "2026-10-12T12:00:30.000Z");
  assert.deepEqual(ledgerProblems(a.candidateSeed, a.candidateLedger, p, now), []);
  assert.equal(r.startingPrice, 500.25);
  assert.deepEqual(empty.entries, {});
});

test("baseline reviews reject broad, altered, expired, duplicate or mismatched approval receipts", () => {
  const empty = { schemaVersion: 1, entries: {} }, proposals = run(o, empty).initialBaselines;
  const review = { targetId: r.id, proposalSha256: proposals[0].proposalSha256, reviewedBy: "owner-fixture", contextApprovedAt: now.toISOString() };
  const args = { seed: [r], ledger: empty, proposals, reviews: [review], policy: p, now };
  for (const changed of [{ reviews: [] }, { reviews: [review, review] }, { reviews: [{ ...review, proposalSha256: digest("wrong") }] }, { reviews: [{ ...review, reviewedBy: "" }] }, { reviews: [{ ...review, contextApprovedAt: "2026-10-06T00:00:00Z" }] }, { reviews: [{ ...review, contextApprovedAt: "2026-10-05T11:59:00Z" }] }, { seed: [{ ...r, startingPrice: 501 }] }, { now: new Date("2026-10-13T12:01:00Z") }, { proposals: [{ ...proposals[0], record: { ...r, startingPrice: 1 } }] }]) assert.throws(() => reviewInitialBaselines({ ...args, ...changed }));
});

test("incomplete, ambiguous and restricted first observations do not even create baseline proposals", () => {
  const empty = { schemaVersion: 1, entries: {} };
  for (const observation of [{ ...o, quoteContext: { ...c, cabinCategory: null } }, { ...o, quoteContext: { ...c, taxesAndFeesIncluded: null } }, { ...o, quoteContext: { ...c, nights: 6 } }, { ...o, quoteContext: { ...c, adults: null } }, { ...o, responseAgeSeconds: 301 }, { ...o, price: 505.251 }, [o, o]]) assert.equal(run(observation, empty).initialBaselines.length, 0);
  assert.equal(run(o, empty, { ...p, providers: { carnival: { ...p.providers.carnival, access: "blocked" } } }).initialBaselines.length, 0);
});

test("pilot scope cannot certify unchecked public sailings and rejects hidden/expired/unknown IDs", () => {
  const seed = [r, { ...r, id: "unchecked" }];
  const a = assessFixture({ seed, ledger: { schemaVersion: 1, entries: { [r.id]: e } }, policy: p, observations: [o], targetIds: [r.id], runStartedAt: "2026-10-05T12:00:00Z", now });
  assert.equal(a.counts.eligible, 1);
  assert.deepEqual(a.coverage, { publicTargets: 2, selectedTargets: 1, outsideScope: 1, globalCoverage: false });
  for (const ids of [[], [r.id, r.id], ["unknown"]]) assert.throws(() => assessFixture({ seed, ledger: { schemaVersion: 1, entries: {} }, policy: p, observations: [], targetIds: ids, runStartedAt: "2026-10-05T12:00:00Z", now }), /pilot targets/);
});

test("reviewed first baseline supports a later weekly check without manufacturing dates", () => {
  const empty = { schemaVersion: 1, entries: {} }, proposals = run(o, empty).initialBaselines;
  const first = reviewInitialBaselines({ seed: [r], ledger: empty, proposals, reviews: [{ targetId: r.id, proposalSha256: proposals[0].proposalSha256, reviewedBy: "explicit-owner-fixture", contextApprovedAt: now.toISOString() }], policy: p, now });
  const nextNow = new Date("2026-10-12T12:01:00Z"), next = { ...o, runId: "fixture-next-week", collectionEventId: "next-week-event", price: 505.75, observedAt: "2026-10-12T12:00:30Z", evidenceSha256: digest("next-week fixture") };
  const second = assessFixture({ seed: first.candidateSeed, ledger: first.candidateLedger, observations: [next], policy: p, runStartedAt: "2026-10-12T12:00:00Z", now: nextNow });
  assert.equal(second.counts.eligible, 1); assert.equal(second.candidateSeed[0].startingPrice, 505.75);
  assert.equal(second.candidateLedger.entries[r.id].nextCheckAt, "2026-10-19T12:00:30.000Z");
  assert.equal(second.candidateSeed[0].lastVerified, r.lastVerified);
});

test("alerts distinguish actual scoped source failure from public fare verification", () => {
  const report = { generatedAt: "2026-10-06T12:00:00Z", counts: { blockers: 361, warnings: 0, unverifiedPublicFares: 361 }, thresholds: { maxPublicAgeDays: 7 }, blockers: [], byCruiseLine: [] };
  const pilot = { runId: "fixture-alert", runStartedAt: "2026-10-06T10:00:00Z", generatedAt: "2026-10-06T11:00:00Z", targetId: "pilot", access: { status: "terms-collection-prohibited", checkedAt: "2026-10-06T10:59:00Z", url: "https://www.virginvoyages.com/terms-and-conditions", evidenceSha256: digest("fixture") }, requests: 1, fareRequests: 0, completeQuotes: 0, verification: { coverage: { outsideScope: 360 } }, missingEvidence: ["taxes"] };
  assert.match(freshnessIssueBody(report, null, pilot, { runId: "fixture-alert", pilotTerminal: completeTerminal(pilot) }), /360 public sailings outside this pilot/);
  assert.match(freshnessIssueBody(report, null, pilot, { runId: "fixture-alert", pilotTerminal: completeTerminal(pilot) }), /0 fare requests, 0 complete quotes/);
  assert.doesNotMatch(freshnessIssueBody(report, null, { ...pilot, generatedAt: "2026-10-05T11:00:00Z" }), /Scoped Virgin Pilot/);
});

test("immutable first-observation audit can become reviewed candidates with revalidated raw evidence", async () => {
  const dir = await mkdtemp(resolve(tmpdir(), "cruisekit-baseline-fixture-"));
  const empty = { schemaVersion: 1, entries: {} }, policy = { ...p, transport: { maxBytes: 2000000 } };
  await mkdir(resolve(dir, "data/seed"), { recursive: true });
  for (const [file, value] of Object.entries({ "data/seed/sailings.json": [r], "data/seed/fare-verifications.json": empty, "data/fare-verification-policy.json": policy, "observations.json": [o] })) await writeFile(resolve(dir, file), JSON.stringify(value));
  await writeFile(resolve(dir, "new-fixture.json"), "new quote fixture");
  const auditDirectory = resolve(dir, "audit");
  const manifestFile = resolve(dir, "run-manifest.json");
  await writeFile(manifestFile, JSON.stringify(makeRunManifest({ runId: o.runId, startedAt: "2026-10-05T12:00:00Z", targetIds: [r.id], seed: [r], ledger: empty, policy, codeSha256: await fareCodeSha256(), observations: [o] })));
  const a = await recheck({ dataDirectory: dir, output: auditDirectory, observationsFile: resolve(dir, "observations.json"), manifestFile, runId: o.runId, startedAt: "2026-10-05T12:00:00Z", clock: () => now, now });
  assert.equal(a.counts.initialBaselines, 1); assert.equal(a.ready, false);
  const proposals = JSON.parse(await readFile(resolve(auditDirectory, "initial-baselines.pending.json")));
  const reviewsFile = resolve(dir, "reviews.json");
  await writeFile(reviewsFile, JSON.stringify([{ targetId: r.id, proposalSha256: proposals[0].proposalSha256, reviewedBy: "explicit-owner-fixture-not-live-approval", contextApprovedAt: now.toISOString() }]));
  const output = resolve(dir, "reviewed-candidates");
  const result = await reviewBaselineAudit({ auditDirectory, reviewsFile, output, dataDirectory: dir, now });
  assert.deepEqual(result, { publicationEnabled: false, reviewedCandidates: 1, inputsUnchanged: true });
  assert.equal(JSON.parse(await readFile(resolve(output, "sailings.candidate.json")))[0].startingPrice, 505.25);
  const entry = JSON.parse(await readFile(resolve(output, "fare-verifications.candidate.json"))).entries[r.id];
  assert.equal(entry.observedAt, o.observedAt);
  assert.equal((await readFile(resolve(output, entry.evidenceRef))).toString(), "new quote fixture");
  assert.equal(JSON.parse(await readFile(resolve(dir, "data/seed/sailings.json")))[0].startingPrice, 500.25);
  assert.deepEqual(JSON.parse(await readFile(resolve(dir, "data/seed/fare-verifications.json"))), empty);
  await writeFile(resolve(auditDirectory, proposals[0].observation.evidenceRef), "tampered");
  await assert.rejects(reviewBaselineAudit({ auditDirectory, reviewsFile, output: resolve(dir, "invalid"), dataDirectory: dir, now }), /raw evidence does not match/);
});
