#!/usr/bin/env node
/** Weekly verification stage. Emits audit/candidate files only; there is no apply mode. */
import { readFile, mkdir, writeFile, realpath } from "node:fs/promises";
import { dirname, resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { assessFares, boundedReader, robotsAllows, digest, validInstant, reviewInitialBaselines } from "./lib/fare-verification.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function recheck({ output = resolve(root, "data/ingest/reports/fare-verification", new Date().toISOString().replace(/[:.]/g, "-")), probeProvider = null, observationsFile = null, targetIds = null, startedAt = new Date().toISOString(), latest = false, dataDirectory = root, now = new Date() } = {}) {
  // Dependency seams for isolated fixture integration; CLI has no data/clock override.
  const load = async p => JSON.parse(await readFile(resolve(dataDirectory, p), "utf8"));
  const [seed, ledger, policy] = await Promise.all([load("data/seed/sailings.json"), load("data/seed/fare-verifications.json"), load("data/fare-verification-policy.json")]);
  const inputBytes = await Promise.all([readFile(resolve(dataDirectory, "data/seed/sailings.json")), readFile(resolve(dataDirectory, "data/seed/fare-verifications.json"))]);
  const sourceChecks = [];
  const rawEvidence = new Map();
  let observations = [];
  // One compliance probe is sufficient to demonstrate an honest blocked source.
  // A probe never requests a price endpoint, even if robots allows the URL.
  if (probeProvider) {
    if (probeProvider !== "norwegian") throw new Error("Only the bounded NCL rules probe is implemented; no quote collection is authorized");
    const p = policy.providers[probeProvider];
    const reader = boundedReader(p.origin, { ...policy.transport, maxRequests: 2 });
    try {
      const result = await reader.read(`${p.origin}/robots.txt`);
      const target = `${p.origin}/vacation-builder/api/v2/itinerary/EXAMPLE/sailings?numberOfGuests=2`;
      sourceChecks.push({ provider: probeProvider, checkedAt: result.observedAt, rulesUrl: `${p.origin}/robots.txt`, rulesSha256: result.evidenceSha256, requests: reader.requests, fareRequests: 0, status: robotsAllows(result.body, target) ? "reuse-and-contract-review-required" : "robots-denied", targetPath: new URL(target).pathname });
      await mkdir(output, { recursive: true });
      await writeFile(resolve(output, "norwegian-robots.txt"), result.body, { flag: "wx" });
    } catch (error) {
      sourceChecks.push({ provider: probeProvider, checkedAt: new Date().toISOString(), requests: reader.requests, fareRequests: 0, status: "rules-unavailable-fail-closed", reason: error.message });
    }
  }
  // Future approved adapters must produce one dated, hashed, fully specified quote
  // per target. Historical staging lastVerified/generatedAt are NEVER converted.
  if (observationsFile) {
    const input = await realpath(observationsFile);
    const evidenceRoot = await realpath(dirname(input));
    observations = JSON.parse(await readFile(input, "utf8"));
    if (!Array.isArray(observations) || observations.length > policy.maxTargets * 4) throw new Error("Invalid observation batch");
    for (const o of observations) {
      if (!validInstant(o.observedAt)) continue;
      if (typeof o.evidenceRef !== "string" || isAbsolute(o.evidenceRef)) throw new Error("Evidence must be a local relative file");
      const evidencePath = await realpath(resolve(evidenceRoot, o.evidenceRef));
      const rel = relative(evidenceRoot, evidencePath);
      if (rel.startsWith("..") || isAbsolute(rel)) throw new Error("Evidence escapes the audit directory");
      const raw = await readFile(evidencePath);
      if (raw.length > policy.transport.maxBytes || digest(raw.toString("utf8")) !== o.evidenceSha256) throw new Error("Raw quote evidence does not match its hash");
      rawEvidence.set(o.evidenceSha256, raw);
      if ([...rawEvidence.values()].reduce((sum, b) => sum + b.length, 0) > 20 * 1024 * 1024) throw new Error("Batch evidence byte bound exceeded");
      o.evidenceRef = `evidence/${o.evidenceSha256}.txt`;
    }
  }
  const assessment = assessFares({ seed, ledger, observations, policy, targetIds, runStartedAt: startedAt, now });
  const { candidateSeed, candidateLedger, initialBaselines, ...audit } = assessment;
  audit.sourceChecks = sourceChecks;
  audit.providerReadiness = Object.entries(policy.providers).map(([provider, p]) => ({ provider, access: p.access, reason: p.reason, policyRulesCheckedAt: p.rulesCheckedAt ?? null, contractVersion: p.contractVersion }));
  audit.scopeReady = audit.counts.retained === 0 && audit.counts.quarantined === 0 && audit.counts.eligible > 0;
  audit.ready = audit.scopeReady && audit.coverage.globalCoverage;
  audit.publicationEnabled = false;
  audit.paths = { audit: relative(root, output), candidateSeed: "sailings.candidate.json", candidateLedger: "fare-verifications.candidate.json", rollbackSeed: "sailings.before.json", rollbackLedger: "fare-verifications.before.json" };
  const afterBytes = await Promise.all([readFile(resolve(dataDirectory, "data/seed/sailings.json")), readFile(resolve(dataDirectory, "data/seed/fare-verifications.json"))]);
  if (inputBytes.some((b, i) => !b.equals(afterBytes[i]))) throw new Error("Input changed during verification; discard candidate");
  audit.inputsUnchanged = true;
  await mkdir(output, { recursive: true });
  if (rawEvidence.size) {
    await mkdir(resolve(output, "evidence"), { recursive: true });
    for (const [hash, raw] of rawEvidence) await writeFile(resolve(output, "evidence", `${hash}.txt`), raw, { flag: "wx" });
  }
  const json = v => `${JSON.stringify(v, null, 2)}\n`;
  const markdown = `# Weekly fare verification\n\nRun: ${audit.generatedAt}\n\nMode: review only; publication disabled. Weekly is a check cadence, not a price guarantee.\n\nTargets: ${audit.counts.targets}; eligible candidates: ${audit.counts.eligible}; retained: ${audit.counts.retained}; unmatched quarantine: ${audit.counts.quarantined}.\n\n${audit.providerReadiness.map(p => `- ${p.provider}: ${p.access}. ${p.reason}`).join("\n")}\n\nBlocked, missing, sold-out or changed itineraries never imply cancellation. Last successful price checks advance only for complete exact-context observations. Import/build/promotion timestamps do not verify prices.\n\nSee this run's audit.json and before/candidate files for exact diff and rollback. Seed inputs unchanged: ${audit.inputsUnchanged}.\n`;
  for (const [name, value] of Object.entries({ "audit.json": json(audit), "audit.md": markdown, "observations.json": json(observations), "initial-baselines.pending.json": json(initialBaselines), "sailings.candidate.json": json(candidateSeed), "fare-verifications.candidate.json": json(candidateLedger), "sailings.before.json": inputBytes[0], "fare-verifications.before.json": inputBytes[1] })) await writeFile(resolve(output, name), value, { flag: "wx" });
  if (latest) {
    await mkdir(resolve(root, "data/reports"), { recursive: true });
    await writeFile(resolve(root, "data/reports/latest-fare-verification.json"), json(audit));
    await writeFile(resolve(root, "data/reports/latest-fare-verification.md"), markdown);
  }
  return audit;
}

/** Review an immutable first-observation audit; writes candidates only. */
export async function reviewBaselineAudit({ auditDirectory, reviewsFile, output, dataDirectory = root, now = new Date() }) {
  if (!auditDirectory || !reviewsFile || !output) throw new Error("Audit, specific reviews and separate output required");
  const auditRoot = await realpath(auditDirectory);
  const readAudit = async name => {
    const path = await realpath(resolve(auditRoot, name));
    const rel = relative(auditRoot, path);
    if (rel.startsWith("..") || isAbsolute(rel)) throw new Error("Baseline evidence escapes audit");
    return readFile(path);
  };
  const load = async p => JSON.parse(await readFile(resolve(dataDirectory, p), "utf8"));
  const seed = await load("data/seed/sailings.json"), ledger = await load("data/seed/fare-verifications.json"), policy = await load("data/fare-verification-policy.json");
  const before = JSON.parse(await readAudit("audit.json"));
  if (before.before.seedSha256 !== digest(seed) || before.before.ledgerSha256 !== digest(ledger)) throw new Error("Baseline inputs changed; review again");
  const proposals = JSON.parse(await readAudit("initial-baselines.pending.json"));
  let evidenceBytes = 0;
  for (const p of proposals) {
    if (isAbsolute(p.observation.evidenceRef)) throw new Error("Baseline evidence must be relative");
    const raw = await readAudit(p.observation.evidenceRef);
    evidenceBytes += raw.length;
    if (raw.length > policy.transport.maxBytes || evidenceBytes > 20 * 1024 * 1024 || digest(raw.toString("utf8")) !== p.observation.evidenceSha256) throw new Error("Baseline raw evidence does not match");
  }
  const reviews = JSON.parse(await readFile(reviewsFile, "utf8"));
  const result = reviewInitialBaselines({ seed, ledger, proposals, reviews, policy, now });
  const current = await Promise.all([load("data/seed/sailings.json"), load("data/seed/fare-verifications.json")]);
  if (digest(current[0]) !== digest(seed) || digest(current[1]) !== digest(ledger)) throw new Error("Baseline inputs changed during review");
  await mkdir(output, { recursive: true });
  for (const [name, value] of Object.entries({ "sailings.before.json": seed, "fare-verifications.before.json": ledger, "sailings.candidate.json": result.candidateSeed, "fare-verifications.candidate.json": result.candidateLedger, "reviews.json": reviews, "initial-baselines.pending.json": proposals, "review-receipt.json": { generatedAt: new Date().toISOString(), mode: "reviewed-baseline-candidates-only", publicationEnabled: false, seedUnchanged: true, before: before.before, after: { seedSha256: digest(result.candidateSeed), ledgerSha256: digest(result.candidateLedger) }, sourceAudit: auditRoot } })) await writeFile(resolve(output, name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
  await mkdir(resolve(output, "evidence"), { recursive: true });
  for (const hash of new Set(proposals.map(p => p.observation.evidenceSha256))) await writeFile(resolve(output, "evidence", `${hash}.txt`), await readAudit(`evidence/${hash}.txt`), { flag: "wx" });
  return { publicationEnabled: false, reviewedCandidates: reviews.length, inputsUnchanged: true };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === "--output") options.output = resolve(process.argv[++i]);
    else if (arg === "--probe-provider") options.probeProvider = process.argv[++i];
    else if (arg === "--observations") options.observationsFile = resolve(process.argv[++i]);
    else if (arg === "--target") (options.targetIds ??= []).push(process.argv[++i]);
    else if (arg === "--review-audit") options.auditDirectory = resolve(process.argv[++i]);
    else if (arg === "--reviews") options.reviewsFile = resolve(process.argv[++i]);
    else if (arg === "--run-started-at") options.startedAt = process.argv[++i];
    else if (arg === "--latest") options.latest = true;
    else throw new Error(`Unknown argument: ${arg}; no apply/publication mode exists`);
  }
  if (options.auditDirectory) reviewBaselineAudit(options).then(a => console.log(JSON.stringify(a, null, 2))).catch(e => { console.error(e.message); process.exitCode = 1; });
  else recheck(options).then(a => { console.log(JSON.stringify({ mode: a.mode, counts: a.counts, coverage: a.coverage, scopeReady: a.scopeReady, sourceChecks: a.sourceChecks, ready: a.ready, publicationEnabled: false, inputsUnchanged: a.inputsUnchanged }, null, 2)); if (!a.ready) process.exitCode = 1; }).catch(e => { console.error(e.message); process.exitCode = 1; });
}
