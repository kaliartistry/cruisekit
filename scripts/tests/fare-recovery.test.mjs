import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import childProcess from "node:child_process";
import { syncBuiltinESMExports } from "node:module";
import { digest } from "../lib/fare-verification.mjs";
import { makeRunManifest, makeResearchArtifact, stableDigest } from "../lib/fare-run.mjs";
import { fareCodeSha256, recheck, reviewBaselineAudit } from "../run-fare-recheck.mjs";
import { runVirginPilot } from "../run-virgin-fare-pilot.mjs";

// Hard failure guards are stronger than removing tokens: no child command or
// accidental default transport may run in these synthetic lifecycle tests.
const fetchGuard = mock.method(globalThis, "fetch", () => { throw new Error("Offline test attempted network"); });
const writerGuard = mock.method(childProcess, "execFile", () => { throw new Error("Offline test attempted child/external writer"); });
syncBuiltinESMExports();
const { freshnessIssueBody } = await import("../create-data-freshness-issue.mjs?offline-guard");
const json = value => `${JSON.stringify(value, null, 2)}\n`;
const instant = "2026-10-09T12:00:00Z", now = new Date("2026-10-09T12:01:00Z");
const record = { id: "synthetic-carnival", cruiseLine: "carnival", shipName: "Fixture Ship", departureDate: "2026-11-01", returnDate: "2026-11-06", nights: 5, departurePort: "Miami", returnPort: "Miami", itineraryPorts: ["Miami", "Nassau", "Miami"], sourceUrl: "https://www.carnival.com/fixture-only", currency: "USD", priceBasis: "per-person-double-occupancy", taxesAndFeesIncluded: true, startingPrice: 500, lastVerified: "2026-08-01", confidence: "verified_from_cruise_line" };
const context = { provider: record.cruiseLine, shipName: record.shipName, departureDate: record.departureDate, returnDate: record.returnDate, nights: record.nights, departurePort: record.departurePort, returnPort: record.returnPort, itineraryPorts: record.itineraryPorts, sourceUrl: record.sourceUrl, currency: "USD", priceBasis: record.priceBasis, taxesAndFeesIncluded: true, sourceSailingId: "fixture-sailing", cabinCategory: "4A", cabinType: "inside", rateCode: "PUBLIC", packageCode: "NONE", market: "US", contractVersion: "synthetic-only", adults: 2, children: 0, cabins: 1 };
const policy = { publicationMode: "review-only", cadenceDays: 7, largeChangeFraction: 0.15, maxTargets: 400, transport: { maxBytes: 2000000 }, providers: { carnival: { origin: "https://www.carnival.com", access: "approved", contractVersion: "synthetic-only", reason: "test fixture only" } } };
const quote = { runId: "fixture-initial", collectionEventId: "event-initial", targetId: record.id, observedAt: "2026-10-09T12:00:30Z", availability: "available", price: 505, quoteContext: context, sourceTimestamp: null, responseAgeSeconds: 0, evidenceSha256: digest("identical quote fixture"), evidenceRef: "raw.txt" };

async function fixture(seed = [record], ledger = { schemaVersion: 1, entries: {} }) {
  const dir = await mkdtemp(resolve(tmpdir(), "cruisekit-offline-recovery-"));
  await mkdir(resolve(dir, "data/seed"), { recursive: true });
  for (const [file, value] of Object.entries({ "data/seed/sailings.json": seed, "data/seed/fare-verifications.json": ledger, "data/fare-verification-policy.json": policy })) await writeFile(resolve(dir, file), json(value));
  await writeFile(resolve(dir, "raw.txt"), "identical quote fixture");
  return { dir, seed, ledger };
}
async function capture(f, observations = [quote], startedAt = instant, targetIds = [record.id], name = "capture") {
  const observationsFile = resolve(f.dir, `${name}.json`), manifestFile = resolve(f.dir, `${name}-manifest.json`);
  await writeFile(observationsFile, json(observations));
  await writeFile(manifestFile, json(makeRunManifest({ runId: observations[0]?.runId ?? "fixture-empty", startedAt, targetIds, seed: f.seed, ledger: f.ledger, policy, codeSha256: await fareCodeSha256(), observations: observations.filter(o => targetIds.includes(o.targetId)) })));
  return { observationsFile, manifestFile, runId: observations[0]?.runId ?? "fixture-empty", startedAt, targetIds };
}
const terminal = async output => JSON.parse(await readFile(resolve(output, "terminal.json")));

test("file lifecycle stays pending until specific review, then checks a later week with the same raw body", async () => {
  const productionFiles = ["data/seed/sailings.json", "data/seed/fare-verifications.json", "data/fare-verification-policy.json"];
  const originals = await Promise.all(productionFiles.map(p => readFile(new URL(`../../${p}`, import.meta.url))));
  const f = await fixture([record, { ...record, id: "outside-scope" }]);
  const output = resolve(f.dir, "initial-audit");
  const audit = await recheck({ dataDirectory: f.dir, output, ...await capture(f), clock: () => now, now });
  assert.equal(audit.counts.initialBaselines, 1);
  assert.equal(audit.counts.eligible, 0);
  assert.equal(audit.scopeReady, false);
  assert.equal(audit.ready, false);
  const completed = await terminal(output);
  assert.equal(completed.executionStatus, "completed");
  assert.equal(completed.auditSha256, stableDigest(audit));
  const terminalBytes = await readFile(resolve(output, "terminal.json"));
  await assert.rejects(recheck({ dataDirectory: f.dir, output, ...await capture(f), clock: () => now, now }), /EEXIST/);
  assert.ok(terminalBytes.equals(await readFile(resolve(output, "terminal.json"))));
  const proposals = JSON.parse(await readFile(resolve(output, "initial-baselines.pending.json")));
  const reviewsFile = resolve(f.dir, "reviews.json");
  await writeFile(reviewsFile, json([{ targetId: record.id, proposalSha256: proposals[0].proposalSha256, reviewedBy: "explicit-fixture-review-not-real-approval", contextApprovedAt: now.toISOString() }]));
  const reviewed = resolve(f.dir, "reviewed");
  await reviewBaselineAudit({ auditDirectory: output, reviewsFile, output: reviewed, dataDirectory: f.dir, now });
  await writeFile(resolve(output, "terminal.json"), json({ ...completed, auditSha256: digest("unrelated audit") }));
  await assert.rejects(reviewBaselineAudit({ auditDirectory: output, reviewsFile, output: resolve(f.dir, "invalid-review"), dataDirectory: f.dir, now }), /terminal binding invalid/);
  await writeFile(resolve(output, "terminal.json"), terminalBytes);
  const seed = JSON.parse(await readFile(resolve(reviewed, "sailings.candidate.json")));
  const ledger = JSON.parse(await readFile(resolve(reviewed, "fare-verifications.candidate.json")));
  assert.deepEqual(ledger.entries[record.id].usedCollectionEventIds, [quote.collectionEventId]);
  // Only temporary fixture inputs adopt candidates; repository inputs stay intact.
  const next = await fixture(seed, ledger);
  const nextStart = "2026-10-16T12:00:00Z", nextNow = new Date("2026-10-16T12:01:00Z");
  const later = { ...quote, runId: "fixture-next", collectionEventId: "event-next", observedAt: "2026-10-16T12:00:30Z" };
  const nextOutput = resolve(next.dir, "next-audit");
  const checked = await recheck({ dataDirectory: next.dir, output: nextOutput, ...await capture(next, [later], nextStart), clock: () => nextNow, now: nextNow });
  assert.equal(checked.counts.eligible, 1);
  assert.equal(checked.scopeReady, true);
  assert.equal(checked.ready, false);
  assert.equal(checked.coverage.outsideScope, 1);
  const candidate = JSON.parse(await readFile(resolve(nextOutput, "fare-verifications.candidate.json"))).entries[record.id];
  assert.equal(candidate.lastSuccessfulVerification, later.observedAt);
  assert.equal(candidate.nextCheckAt, "2026-10-23T12:00:30.000Z");
  assert.equal(candidate.evidenceSha256, quote.evidenceSha256);
  assert.deepEqual(candidate.usedCollectionEventIds, ["event-initial", "event-next"]);
  const restamped = { ...later, collectionEventId: quote.collectionEventId };
  const replay = await recheck({ dataDirectory: next.dir, output: resolve(next.dir, "replay"), ...await capture(next, [restamped], nextStart, [record.id], "replay"), clock: () => nextNow, now: nextNow });
  assert.equal(replay.counts.eligible, 0);
  assert.match(replay.decisions[0].reasons.join(), /reused|replay/);
  assert.deepEqual(JSON.parse(await readFile(resolve(next.dir, "replay/fare-verifications.candidate.json"))), ledger);
  const after = await Promise.all(productionFiles.map(p => readFile(new URL(`../../${p}`, import.meta.url))));
  originals.forEach((bytes, i) => assert.ok(bytes.equals(after[i])));
});

test("unknown cache age and an unselected second record cannot create or extend verified dates", async () => {
  const f = await fixture([record, { ...record, id: "unselected" }]);
  const observations = [{ ...quote, responseAgeSeconds: null }, { ...quote, targetId: "unselected", collectionEventId: "event-unselected" }];
  const output = resolve(f.dir, "unknown");
  const audit = await recheck({ dataDirectory: f.dir, output, ...await capture(f, observations), clock: () => now, now });
  assert.equal(audit.counts.initialBaselines, 0);
  assert.equal(audit.counts.quarantined, 1);
  assert.equal(audit.counts.eligible, 0);
  assert.deepEqual(JSON.parse(await readFile(resolve(output, "fare-verifications.candidate.json"))), f.ledger);
  assert.match(audit.decisions.find(d => d.id === record.id).reasons.join(), /unknown-or-cached-response-age/);
});

test("parse failures and research inputs produce failure envelopes before audit creation", async () => {
  for (const [name, value] of [["malformed", "{"], ["research", json(makeResearchArtifact([quote]))]]) {
    const f = await fixture(), observationsFile = resolve(f.dir, "observations.json"), output = resolve(f.dir, name);
    await writeFile(observationsFile, value);
    await assert.rejects(recheck({ dataDirectory: f.dir, output, observationsFile, runId: `fixture-${name}`, startedAt: instant, clock: () => now, now }));
    const failed = await terminal(output);
    assert.equal(failed.executionStatus, "failed");
    assert.equal(failed.stage, "load-observations-and-evidence");
    assert.equal(failed.runId, `fixture-${name}`);
    assert.notEqual(failed.scopeReady, true);
    await assert.rejects(readFile(resolve(output, "audit.json")), { code: "ENOENT" });
    assert.deepEqual(JSON.parse(await readFile(resolve(f.dir, "data/seed/fare-verifications.json"))), f.ledger);
  }
});

test("expired pilot fails before any source call and preserves original failure", async () => {
  const output = await mkdtemp(resolve(tmpdir(), "cruisekit-expired-pilot-"));
  let calls = 0;
  await assert.rejects(runVirginPilot({ output, runId: "fixture-expired-pilot", clock: () => new Date("2026-11-01T00:00:00Z"), reader: { requests: 0, read() { calls++; throw new Error("No source call authorized"); } } }), /target absent\/expired/);
  assert.equal(calls, 0);
  const failed = await terminal(output);
  assert.equal(failed.executionStatus, "failed");
  assert.equal(failed.stage, "load-pilot-target");
  assert.match(failed.error.message, /target absent\/expired/);
});

test("quote batches cannot mint run bindings automatically or reuse a foreign manifest", async () => {
  const f = await fixture();
  const captureArgs = await capture(f);
  for (const [name, options] of [["missing", { ...captureArgs, manifestFile: null }], ["foreign", { ...captureArgs, runId: "foreign-run" }]]) {
    const output = resolve(f.dir, name);
    await assert.rejects(recheck({ dataDirectory: f.dir, output, ...options, clock: () => now, now }), /manifest|run-id-mismatch/);
    assert.equal((await terminal(output)).executionStatus, "failed");
    await assert.rejects(readFile(resolve(output, "sailings.candidate.json")), { code: "ENOENT" });
  }
});

test("seed or policy changed after capture cannot be reported as unchanged", async () => {
  for (const file of ["data/seed/sailings.json", "data/fare-verification-policy.json"]) {
    const f = await fixture(), output = resolve(f.dir, "changed-input");
    let altered = false;
    const readInput = async path => {
      const bytes = await readFile(path);
      if (path === resolve(f.dir, file) && !altered) {
        altered = true;
        await writeFile(path, `${bytes.toString()}\n`);
      }
      return bytes;
    };
    await assert.rejects(recheck({ dataDirectory: f.dir, output, readInput, runId: "fixture-input-race", startedAt: instant, clock: () => now, now }), /Input changed/);
    assert.equal((await terminal(output)).stage, "validate-unchanged-inputs");
    assert.equal((await terminal(output)).executionStatus, "failed");
    await assert.rejects(readFile(resolve(output, "audit.json")), { code: "ENOENT" });
  }
});

test("alert correlation rejects same-day foreign or incomplete audits and reports bound failure", () => {
  const report = { runId: "expected-run", generatedAt: now.toISOString(), currentDate: "2026-10-09", counts: { blockers: 1, warnings: 0, unverifiedPublicFares: 1 }, thresholds: { maxPublicAgeDays: 7 }, blockers: [], byCruiseLine: [] };
  const audit = { runId: report.runId, runStartedAt: instant, generatedAt: now.toISOString(), counts: { eligible: 0, retained: 1, quarantined: 0 }, providerReadiness: [], paths: { audit: "fixture-audit" } };
  const done = { schemaVersion: 1, kind: "fare-run-terminal", runId: report.runId, startedAt: instant, completedAt: now.toISOString(), stage: "fixture-complete", executionStatus: "completed", auditSha256: stableDigest(audit), scopeReady: false, ready: false };
  assert.match(freshnessIssueBody(report, audit, null, { verificationTerminal: done }), /Exact Quote Recheck/);
  for (const [candidate, ending] of [[{ ...audit, runId: "foreign-run" }, done], [audit, null], [audit, { ...done, auditSha256: digest("wrong") }]]) {
    const body = freshnessIssueBody(report, candidate, null, { verificationTerminal: ending });
    assert.match(body, /Audit unavailable/);
    assert.doesNotMatch(body, /Exact Quote Recheck/);
  }
  const failed = { schemaVersion: 1, kind: "fare-run-terminal", runId: report.runId, startedAt: instant, completedAt: now.toISOString(), scopeReady: false, ready: false, executionStatus: "failed", stage: "parse-input", error: { name: "SyntaxError", message: "Malformed JSON" } };
  assert.match(freshnessIssueBody(report, null, null, { verificationTerminal: failed }), /failed at parse-input: Malformed JSON/);
  const partial = freshnessIssueBody(report, audit, null, { verificationTerminal: done, pilotTerminal: failed });
  assert.match(partial, /Exact Quote Recheck/);
  assert.match(partial, /failed at parse-input: Malformed JSON/);
  assert.equal(writerGuard.mock.callCount(), 0);
  assert.equal(fetchGuard.mock.callCount(), 0);
});
