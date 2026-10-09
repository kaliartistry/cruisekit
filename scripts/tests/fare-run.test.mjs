import { test } from "node:test";
import assert from "node:assert/strict";
import { stableDigest, makeRunManifest, manifestProblems, observationBindingProblems, makeResearchArtifact, terminalProblems, terminalMatchesAudit, withTerminalResult } from "../lib/fare-run.mjs";

const runId = "synthetic-run-1", startedAt = "2026-10-05T12:00:00Z";
const seed = [{ id: "fixture-one", startingPrice: 500.25 }, { id: "unselected", startingPrice: 800.50 }];
const ledger = { schemaVersion: 1, entries: {} }, policy = { maxTargets: 400, publicationMode: "review-only" };
const codeSha256 = stableDigest("synthetic-code-not-a-production-fingerprint");
const observation = {
  runId, collectionEventId: "synthetic-event-1", targetId: seed[0].id, observedAt: "2026-10-05T12:00:30Z",
  quoteContext: { sourceUrl: "https://fixture.invalid/offer", currency: "USD", cabinCategory: "4A" },
  price: 505.25, responseAgeSeconds: 0, sourceTimestamp: null, evidenceSha256: stableDigest("synthetic-response"), evidenceRef: "capture.txt",
};
const args = { runId, startedAt, targetIds: [seed[0].id], seed, ledger, policy, codeSha256 };
const make = (observations = [observation], changes = {}) => makeRunManifest({ ...args, observations, ...changes });
const clock = () => new Date("2026-10-05T12:01:00Z");

test("logical hashes ignore nested object key order but preserve array order", () => {
  assert.equal(stableDigest({ a: { x: 1, y: 2 }, b: [3, 4] }), stableDigest({ b: [3, 4], a: { y: 2, x: 1 } }));
  assert.notEqual(stableDigest([3, 4]), stableDigest([4, 3]));
});

test("manifest binds exact run, code, targets and current logical inputs without changing them", () => {
  const before = structuredClone({ seed, ledger, policy, observation });
  const manifest = make();
  assert.deepEqual(manifestProblems(manifest, args), []);
  assert.deepEqual(observationBindingProblems(observation, manifest), []);
  assert.equal(manifest.inputs.seedSha256, stableDigest(seed));
  for (const change of [{ runId: "another-run" }, { startedAt: "2026-10-05T11:59:00Z" }, { targetIds: ["unselected"] }, { seed: [{ ...seed[0], startingPrice: 1 }] }, { ledger: { schemaVersion: 1, entries: { changed: {} } } }, { policy: { ...policy, publicationMode: "changed" } }, { codeSha256: stableDigest("changed-code") }]) assert.ok(manifestProblems(manifest, { ...args, ...change }).length > 0);
  assert.deepEqual({ seed, ledger, policy, observation }, before);
});

test("legacy observations never receive invented run or collection identities", () => {
  const { runId: _run, collectionEventId: _event, ...legacy } = observation;
  const manifest = make([legacy]);
  assert.equal(manifest.receipts[0].runId, undefined);
  assert.equal(manifest.receipts[0].collectionEventId, undefined);
  assert.ok(manifestProblems(manifest).length > 0);
  assert.ok(observationBindingProblems(legacy, manifest).includes("missing-observation-collection-identity"));
  assert.equal(Object.hasOwn(legacy, "runId"), false);
});

test("missing, malformed, duplicate and unbounded manifests fail closed", () => {
  for (const manifest of [null, undefined, {}, [], { ...make(), inputs: null }, { ...make(), targetIds: {} }, { ...make(), receipts: null }, { ...make(), receipts: [null] }, { ...make(), targetIds: [seed[0].id, seed[0].id] }, { ...make(), targetIds: Array.from({ length: 401 }, (_, i) => `target-${i}`) }, { ...make(), receipts: Array(1601).fill(make().receipts[0]) }]) assert.ok(manifestProblems(manifest).length > 0);
  assert.deepEqual(manifestProblems(make([], { targetIds: [] }), { ...args, targetIds: [] }), []);
  assert.ok(manifestProblems(make([observation], { targetIds: [] })).includes("empty-run-targets-with-collection-receipts"));
  assert.throws(() => make(Array(1601).fill(observation)), /unbounded/);
  assert.ok(manifestProblems(make(), { ...args, policy: { ...policy, maxTargets: 0 } }).includes("run-policy-target-bound-exceeded"));
});

test("receipt permits evidence relocation, binds every other observation field and preserves nested key equivalence", () => {
  const manifest = make();
  assert.deepEqual(observationBindingProblems({ ...observation, evidenceRef: "evidence/hash.txt" }, manifest), []);
  assert.deepEqual(observationBindingProblems({ ...observation, quoteContext: Object.fromEntries(Object.entries(observation.quoteContext).reverse()) }, manifest), []);
  for (const change of [{ price: 505.26 }, { observedAt: "2026-10-05T12:00:31Z" }, { responseAgeSeconds: null }, { extraAssertion: true }, { evidenceSha256: stableDigest("tampered") }, { quoteContext: { ...observation.quoteContext, sourceUrl: "https://fixture.invalid/different" } }]) assert.ok(observationBindingProblems({ ...observation, ...change }, manifest).includes("observation-receipt-mismatch"));
});

test("prior-run, out-of-scope, pre-run and absent receipts cannot bind", () => {
  const manifest = make();
  for (const change of [{ runId: "prior-run" }, { targetId: "unselected" }, { observedAt: "2026-10-05T11:59:59Z" }, { observedAt: "2026-02-30T12:00:30Z" }, { collectionEventId: "absent-event" }]) assert.ok(observationBindingProblems({ ...observation, ...change }, manifest).length > 0);
  assert.ok(manifestProblems({ ...manifest, receipts: [{ ...manifest.receipts[0], runId: "prior-run" }] }).includes("invalid-collection-receipt"));
});

test("duplicate or previously consumed event identities reject even after restamping", () => {
  const restamped = { ...observation, observedAt: "2026-10-05T12:00:45Z" };
  assert.ok(observationBindingProblems(restamped, make()).includes("observation-receipt-mismatch"));
  assert.ok(observationBindingProblems(restamped, make([restamped]), { usedEventIds: [observation.collectionEventId] }).includes("reused-collection-event"));
  const duplicate = make([observation, restamped]);
  assert.ok(manifestProblems(duplicate).includes("duplicate-collection-event"));
  assert.ok(observationBindingProblems(observation, duplicate).includes("missing-or-ambiguous-collection-receipt"));
});

test("distinct evidenced events may return equal raw body hashes", () => {
  const second = { ...observation, collectionEventId: "synthetic-event-2", observedAt: "2026-10-05T12:00:45Z" };
  const manifest = make([observation, second]);
  assert.equal(observation.evidenceSha256, second.evidenceSha256);
  assert.deepEqual(manifestProblems(manifest, args), []);
  assert.deepEqual(observationBindingProblems(second, manifest, { usedEventIds: [observation.collectionEventId] }), []);
});

test("research artifact preserves unknown ages separately and cannot masquerade as verified state", () => {
  const capture = { ...observation, responseAgeSeconds: null, responseAgeReason: "human_not_measured" };
  const artifact = makeResearchArtifact([capture]);
  assert.deepEqual(Object.keys(artifact), ["schemaVersion", "kind", "observations"]);
  assert.equal(artifact.kind, "research-observations");
  assert.ok(manifestProblems(artifact).length > 0);
  for (const key of ["entries", "lastSuccessfulVerification", "nextCheckAt", "scopeReady", "ready", "verificationEligibility"]) assert.throws(() => makeResearchArtifact([{ ...capture, [key]: false }]), /verified-ledger/);
  artifact.observations[0].price = 1;
  assert.equal(capture.price, observation.price);
  assert.throws(() => makeRunManifest({ ...args, observations: artifact }), /observations/);
});

test("completed terminals require actual schema, kind, run, timing, stage and exact audit binding", async () => {
  const audit = { runId, runStartedAt: startedAt, generatedAt: clock().toISOString(), ready: false }, written = [];
  await withTerminalResult({ runId, startedAt, clock, persist: async terminal => written.push(terminal) }, async () => audit);
  const terminal = written[0];
  assert.deepEqual(terminalProblems(terminal, { runId, startedAt, audit }), []);
  assert.equal(terminalMatchesAudit(terminal, audit, { runId, startedAt }), true);
  for (const change of [{ schemaVersion: 2 }, { kind: "research-observations" }, { runId: "foreign-run" }, { startedAt: "2026-10-05T11:59:00Z" }, { completedAt: null }, { completedAt: "2026-10-05T11:59:59Z" }, { stage: undefined }, { error: null }, { clockError: null }, { auditSha256: stableDigest("tampered") }, { publicationEnabled: true }]) assert.equal(terminalMatchesAudit({ ...terminal, ...change }, audit), false);
  assert.equal(terminalMatchesAudit({ runId, executionStatus: "completed", auditSha256: stableDigest(audit) }, audit), false);
  assert.equal(terminalMatchesAudit(terminal, { ...audit, ready: true }), false);
  assert.equal(terminalMatchesAudit(terminal, audit, { runId: "foreign-run" }), false);
});

test("terminal binding crosses midnight without relying on UTC-day equality", async () => {
  const start = "2026-10-05T23:59:30Z", end = "2026-10-06T00:00:30Z", audit = { runId, runStartedAt: start, generatedAt: end }, written = [];
  await withTerminalResult({ runId, startedAt: start, clock: () => end, persist: async terminal => written.push(terminal) }, async () => audit);
  assert.equal(terminalMatchesAudit(written[0], audit), true);
});

test("pre-report failure emits failed terminal evidence and preserves exact original error", async () => {
  const original = new Error("synthetic parsing failure"), written = [];
  await assert.rejects(withTerminalResult({ runId, startedAt, clock, persist: async terminal => written.push(terminal) }, async setStage => { setStage("parse-observations"); throw original; }), error => error === original);
  assert.equal(written.length, 1);
  assert.equal(written[0].executionStatus, "failed");
  assert.equal(written[0].stage, "parse-observations");
  assert.equal(written[0].completedAt, clock().toISOString());
  assert.equal(written[0].error.message, original.message);
  assert.equal(written[0].publicationEnabled, false);
  assert.equal(Object.hasOwn(written[0], "auditSha256"), false);
  assert.deepEqual(terminalProblems(written[0], { runId, startedAt }), []);
  assert.equal(terminalMatchesAudit(written[0], { runId, runStartedAt: startedAt }), false);
});

test("terminal writer failure attaches to the original operation error without replacing it", async () => {
  const original = new Error("original failure"), writeFailure = new Error("terminal write failure");
  await assert.rejects(withTerminalResult({ runId, startedAt, clock, persist: async () => { throw writeFailure; } }, async () => { throw original; }), error => error === original);
  assert.equal(original.terminalWriteError, writeFailure);
});

test("invalid or backwards completion clocks persist failure and cannot certify readiness", async () => {
  for (const value of ["not-a-time", "2026-10-05T11:59:59Z", new Date(NaN)]) {
    const written = [];
    await assert.rejects(withTerminalResult({ runId, startedAt, clock: () => value, persist: async terminal => written.push(terminal) }, async () => ({ ready: true, scopeReady: true })));
    assert.equal(written.length, 1);
    assert.equal(written[0].executionStatus, "failed");
    assert.equal(written[0].completedAt, null);
    assert.equal(written[0].ready, false);
    assert.equal(written[0].scopeReady, false);
    assert.ok(written[0].clockError);
    assert.equal(Object.hasOwn(written[0], "auditSha256"), false);
    assert.deepEqual(terminalProblems(written[0], { runId, startedAt }), []);
    assert.ok(terminalProblems({ ...written[0], clockError: {} }).includes("invalid-terminal-completion"));
  }
});

test("throwing completion clock preserves its error and an earlier operation failure", async () => {
  const clockFailure = new Error("synthetic clock failure"), original = new Error("earlier parse failure"), written = [];
  const settings = { runId, startedAt, clock: () => { throw clockFailure; }, persist: async terminal => written.push(terminal) };
  await assert.rejects(withTerminalResult(settings, async () => ({ ready: true })), error => error === clockFailure);
  await assert.rejects(withTerminalResult(settings, async () => { throw original; }), error => error === original);
  assert.equal(written[1].error.message, original.message);
  assert.equal(written[1].clockError.message, clockFailure.message);
  assert.ok(written.every(terminal => terminal.executionStatus === "failed" && terminal.ready === false));
});

test("completed execution preserves blocked/partial readiness and binds the exact returned audit", async () => {
  const audit = { scopeReady: true, ready: false, coverage: { selectedTargets: 1, outsideScope: 1, globalCoverage: false }, counts: { eligible: 1 } }, written = [];
  const result = await withTerminalResult({ runId, startedAt, clock, persist: async terminal => written.push(terminal) }, async setStage => { setStage("candidate-audit"); return audit; });
  assert.equal(result, audit);
  assert.equal(written[0].kind, "fare-run-terminal");
  assert.equal(written[0].executionStatus, "completed");
  assert.equal(written[0].ready, false);
  assert.equal(written[0].scopeReady, true);
  assert.equal(written[0].auditSha256, stableDigest(audit));
  assert.deepEqual(written[0].coverage, audit.coverage);
  assert.notEqual(written[0].coverage, audit.coverage);
});

test("failure writing a completed terminal propagates once, without cleanup clobber", async () => {
  const writeFailure = new Error("completed terminal unavailable"), written = [];
  await assert.rejects(withTerminalResult({ runId, startedAt, clock, persist: async terminal => { written.push(terminal); throw writeFailure; } }, async () => ({ ready: false, scopeReady: false })), error => error === writeFailure);
  assert.equal(written.length, 1);
  assert.equal(written[0].executionStatus, "completed");
});
