import { createHash } from "node:crypto";

const MAX_TARGETS = 400, MAX_RECEIPTS = 1600;
const text = value => typeof value === "string" && value.trim().length > 0 && value.length <= 8192;
const record = value => value !== null && typeof value === "object" && !Array.isArray(value);
const hash = value => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
const unique = values => [...new Set(values)];
function instant(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value)) return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 19) === value.slice(0, 19);
}
const targetsValid = ids => Array.isArray(ids) && ids.length <= MAX_TARGETS && ids.every(text) && new Set(ids).size === ids.length;

/** Hash logical JSON recursively; object key order is immaterial, array order is not. */
export function stableDigest(value) {
  const json = JSON.stringify(value);
  if (json === undefined) throw new TypeError("A JSON value is required for a fare hash");
  const sort = item => Array.isArray(item) ? item.map(sort) : record(item) ? Object.fromEntries(Object.keys(item).sort().map(key => [key, sort(item[key])])) : item;
  return createHash("sha256").update(JSON.stringify(sort(JSON.parse(json)))).digest("hex");
}

function receiptFor(observation) {
  const { evidenceRef: _localPath, ...bound } = record(observation) ? observation : {};
  return {
    runId: observation?.runId, collectionEventId: observation?.collectionEventId,
    targetId: observation?.targetId, observedAt: observation?.observedAt,
    sourceUrl: observation?.quoteContext?.sourceUrl,
    quoteContextSha256: stableDigest(observation?.quoteContext ?? null),
    evidenceSha256: observation?.evidenceSha256, observationSha256: stableDigest(bound),
  };
}

/** No collection identity or time is invented for observations missing those fields. */
export function makeRunManifest({ runId, startedAt, targetIds, seed, ledger, policy, codeSha256, observations = [] }) {
  if (!Array.isArray(observations) || observations.length > MAX_RECEIPTS) throw new Error("Invalid or unbounded fare observations");
  return {
    schemaVersion: 1, kind: "fare-run", runId, startedAt, targetIds: structuredClone(targetIds),
    inputs: { seedSha256: stableDigest(seed), ledgerSha256: stableDigest(ledger), policySha256: stableDigest(policy) },
    codeSha256, receipts: observations.map(receiptFor),
  };
}

export function manifestProblems(manifest, expected = {}) {
  if (!record(manifest) || manifest.schemaVersion !== 1 || manifest.kind !== "fare-run") return ["missing-or-invalid-run-manifest"];
  if (!record(expected)) return ["invalid-run-expectation"];
  const problems = [];
  if (!text(manifest.runId)) problems.push("invalid-run-id");
  if (!instant(manifest.startedAt)) problems.push("invalid-run-start");
  if (!targetsValid(manifest.targetIds)) problems.push("invalid-or-unbounded-run-targets");
  if (!hash(manifest.codeSha256)) problems.push("invalid-run-code-hash");
  for (const name of ["seed", "ledger", "policy"]) {
    const key = `${name}Sha256`;
    if (!hash(manifest.inputs?.[key])) problems.push(`invalid-run-${name}-hash`);
    if (Object.hasOwn(expected, name)) {
      try { if (manifest.inputs?.[key] !== stableDigest(expected[name])) problems.push(`run-${name}-hash-mismatch`); }
      catch { problems.push(`invalid-expected-${name}`); }
    }
  }
  for (const [key, reason] of [["runId", "run-id-mismatch"], ["startedAt", "run-start-mismatch"], ["codeSha256", "run-code-hash-mismatch"]]) {
    if (Object.hasOwn(expected, key) && expected[key] !== manifest[key]) problems.push(reason);
  }
  if (Object.hasOwn(expected, "targetIds") && JSON.stringify(expected.targetIds) !== JSON.stringify(manifest.targetIds)) problems.push("run-targets-mismatch");
  if (Number.isInteger(expected.policy?.maxTargets) && manifest.targetIds?.length > expected.policy.maxTargets) problems.push("run-policy-target-bound-exceeded");
  if (!Array.isArray(manifest.receipts) || manifest.receipts.length > MAX_RECEIPTS) return unique([...problems, "invalid-or-unbounded-collection-receipts"]);
  if (manifest.targetIds?.length === 0 && manifest.receipts.length > 0) problems.push("empty-run-targets-with-collection-receipts");
  const events = new Set();
  for (const receipt of manifest.receipts) {
    if (!record(receipt)) { problems.push("invalid-collection-receipt"); continue; }
    if (!text(receipt.collectionEventId) || receipt.runId !== manifest.runId || !Array.isArray(manifest.targetIds) || !manifest.targetIds.includes(receipt.targetId) || !instant(receipt.observedAt) || Date.parse(receipt.observedAt) < Date.parse(manifest.startedAt) || !text(receipt.sourceUrl) || ![receipt.quoteContextSha256, receipt.evidenceSha256, receipt.observationSha256].every(hash)) problems.push("invalid-collection-receipt");
    if (events.has(receipt.collectionEventId)) problems.push("duplicate-collection-event");
    events.add(receipt.collectionEventId);
  }
  return unique(problems);
}

export function observationBindingProblems(observation, manifest, { usedEventIds = [] } = {}) {
  const problems = manifestProblems(manifest);
  if (!record(observation)) return unique([...problems, "invalid-observation"]);
  if (!text(observation.runId) || !text(observation.collectionEventId)) problems.push("missing-observation-collection-identity");
  if (observation.runId !== manifest?.runId) problems.push("observation-run-mismatch");
  if (!Array.isArray(manifest?.targetIds) || !manifest.targetIds.includes(observation.targetId)) problems.push("observation-outside-selected-targets");
  if (!instant(observation.observedAt) || !instant(manifest?.startedAt) || Date.parse(observation.observedAt) < Date.parse(manifest.startedAt)) problems.push("observation-outside-run-window");
  if (!Array.isArray(usedEventIds)) problems.push("invalid-used-event-history");
  else if (usedEventIds.includes(observation.collectionEventId)) problems.push("reused-collection-event");
  const receipts = Array.isArray(manifest?.receipts) ? manifest.receipts.filter(receipt => receipt?.collectionEventId === observation.collectionEventId) : [];
  if (receipts.length !== 1) problems.push("missing-or-ambiguous-collection-receipt");
  else {
    try {
      const actual = receiptFor(observation);
      if (Object.keys(actual).some(key => actual[key] !== receipts[0][key])) problems.push("observation-receipt-mismatch");
    } catch { problems.push("invalid-observation-hash-input"); }
  }
  return unique(problems);
}

/** Separate research data, never a ledger or a certification of price recency. */
export function makeResearchArtifact(observations) {
  const certification = ["entries", "lastSuccessfulVerification", "nextCheckAt", "scopeReady", "ready", "verificationEligibility"];
  if (!Array.isArray(observations) || observations.length > MAX_RECEIPTS || observations.some(observation => !record(observation) || certification.some(key => Object.hasOwn(observation, key)))) throw new Error("Research observations cannot carry verified-ledger state");
  return { schemaVersion: 1, kind: "research-observations", observations: structuredClone(observations) };
}

const errorDetails = error => ({ name: error?.name ?? "Error", message: typeof error?.message === "string" ? error.message : String(error) });

/** Validate terminal envelopes; failed clocks stay reportable without certifying completion. */
export function terminalProblems(terminal, expected = {}) {
  if (!record(terminal) || terminal.schemaVersion !== 1 || terminal.kind !== "fare-run-terminal") return ["missing-or-invalid-run-terminal"];
  if (!record(expected)) return ["invalid-terminal-expectation"];
  const problems = [];
  if (!text(terminal.runId)) problems.push("invalid-terminal-run-id");
  if (!instant(terminal.startedAt)) problems.push("invalid-terminal-start");
  if (!text(terminal.stage)) problems.push("invalid-terminal-stage");
  if (!["completed", "failed"].includes(terminal.executionStatus)) problems.push("invalid-terminal-execution-status");
  const validCompletion = instant(terminal.completedAt) && instant(terminal.startedAt) && Date.parse(terminal.completedAt) >= Date.parse(terminal.startedAt);
  const validClockError = record(terminal.clockError) && text(terminal.clockError.name) && typeof terminal.clockError.message === "string";
  if (!validCompletion && !(terminal.executionStatus === "failed" && terminal.completedAt === null && validClockError)) problems.push("invalid-terminal-completion");
  if (terminal.publicationEnabled === true) problems.push("terminal-publication-not-disabled");
  if (terminal.executionStatus === "completed") {
    if (Object.hasOwn(terminal, "error") || Object.hasOwn(terminal, "clockError")) problems.push("completed-terminal-has-error");
    if (!hash(terminal.auditSha256)) problems.push("invalid-terminal-audit-hash");
  } else if (terminal.executionStatus === "failed") {
    if (!record(terminal.error) || !text(terminal.error.name) || typeof terminal.error.message !== "string") problems.push("missing-terminal-failure-error");
    if (terminal.ready === true || terminal.scopeReady === true) problems.push("failed-terminal-cannot-be-ready");
  }
  for (const [key, reason] of [["runId", "terminal-run-mismatch"], ["startedAt", "terminal-start-mismatch"]]) {
    if (Object.hasOwn(expected, key) && expected[key] !== terminal[key]) problems.push(reason);
  }
  if (Object.hasOwn(expected, "audit")) {
    const audit = expected.audit;
    if (!record(audit) || terminal.runId !== audit.runId || terminal.startedAt !== audit.runStartedAt) problems.push("terminal-audit-run-mismatch");
    if (terminal.executionStatus === "completed") {
      try { if (terminal.auditSha256 !== stableDigest(audit)) problems.push("terminal-audit-hash-mismatch"); }
      catch { problems.push("invalid-terminal-audit-input"); }
    }
  }
  return unique(problems);
}

export function terminalMatchesAudit(terminal, audit, expected = {}) {
  return terminal?.executionStatus === "completed" && record(audit) && terminalProblems(terminal, { ...expected, audit }).length === 0;
}

/** Persist a terminal outcome without assigning success during error cleanup.
 * operation(setStage) returns its audit/result unchanged; persistence is injected.
 */
export async function withTerminalResult({ runId, startedAt, stage = "incomplete", clock = () => new Date(), persist }, operation) {
  if (!text(runId) || !instant(startedAt) || typeof persist !== "function" || typeof operation !== "function") throw new Error("Run identity, start, operation and terminal writer required");
  let currentStage = stage, result, terminal;
  const setStage = value => { if (!text(value)) throw new Error("Terminal stage required"); currentStage = value; };
  const base = () => {
    let completedAt = null, clockError, clockFailed = false;
    try {
      const value = clock(); completedAt = value instanceof Date ? value.toISOString() : value;
      if (!instant(completedAt)) throw new Error("Invalid terminal clock");
      if (Date.parse(completedAt) < Date.parse(startedAt)) throw new Error("Terminal completion time precedes run start");
    } catch (error) { completedAt = null; clockError = error; clockFailed = true; }
    return {
      terminal: { schemaVersion: 1, kind: "fare-run-terminal", runId, startedAt, completedAt, executionStatus: "failed", stage: currentStage, publicationEnabled: false, scopeReady: false, ready: false, ...(clockFailed ? { clockError: errorDetails(clockError) } : {}) },
      clockError, clockFailed,
    };
  };
  try {
    result = await operation(setStage);
    const completion = base(); terminal = completion.terminal;
    if (completion.clockFailed) throw completion.clockError;
    terminal = { ...terminal, executionStatus: "completed", auditSha256: stableDigest(result), scopeReady: result?.scopeReady === true, ready: result?.ready === true };
    for (const key of ["coverage", "counts"]) if (result?.[key] !== undefined) terminal[key] = structuredClone(result[key]);
  } catch (originalError) {
    terminal = { ...(terminal ?? base().terminal), executionStatus: "failed", scopeReady: false, ready: false, error: errorDetails(originalError) };
    try { await persist(terminal); }
    catch (terminalWriteError) {
      if (record(originalError) || typeof originalError === "function") {
        try { Object.defineProperty(originalError, "terminalWriteError", { value: terminalWriteError, configurable: true }); } catch { /* An immutable thrown object must still be rethrown unchanged. */ }
      }
    }
    throw originalError;
  }
  // A writer failure after completion propagates; never retry by overwriting a
  // possibly persisted successful terminal with a cleanup-generated failure.
  await persist(terminal);
  return result;
}
