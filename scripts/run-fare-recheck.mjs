#!/usr/bin/env node
/** Weekly verification stage. Emits audit/candidate files only; there is no apply mode. */
import { readFile, mkdir, writeFile, realpath } from "node:fs/promises";
import { dirname, resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { assessFares, boundedReader, robotsAllows, digest, validInstant } from "./lib/fare-verification.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const load = async p => JSON.parse(await readFile(resolve(root, p), "utf8"));

export async function recheck({ output = resolve(root, "data/ingest/reports/fare-verification", new Date().toISOString().replace(/[:.]/g, "-")), probeProvider = null, observationsFile = null, startedAt = new Date().toISOString(), latest = false } = {}) {
  const [seed, ledger, policy] = await Promise.all([load("data/seed/sailings.json"), load("data/seed/fare-verifications.json"), load("data/fare-verification-policy.json")]);
  const inputBytes = await Promise.all([readFile(resolve(root, "data/seed/sailings.json")), readFile(resolve(root, "data/seed/fare-verifications.json"))]);
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
  const assessment = assessFares({ seed, ledger, observations, policy, runStartedAt: startedAt });
  const { candidateSeed, candidateLedger, ...audit } = assessment;
  audit.sourceChecks = sourceChecks;
  audit.providerReadiness = Object.entries(policy.providers).map(([provider, p]) => ({ provider, access: p.access, reason: p.reason, policyRulesCheckedAt: p.rulesCheckedAt ?? null, contractVersion: p.contractVersion }));
  audit.ready = audit.counts.retained === 0 && audit.counts.quarantined === 0 && audit.counts.eligible > 0;
  audit.publicationEnabled = false;
  audit.paths = { audit: relative(root, output), candidateSeed: "sailings.candidate.json", candidateLedger: "fare-verifications.candidate.json", rollbackSeed: "sailings.before.json", rollbackLedger: "fare-verifications.before.json" };
  const afterBytes = await Promise.all([readFile(resolve(root, "data/seed/sailings.json")), readFile(resolve(root, "data/seed/fare-verifications.json"))]);
  if (inputBytes.some((b, i) => !b.equals(afterBytes[i]))) throw new Error("Input changed during verification; discard candidate");
  audit.inputsUnchanged = true;
  await mkdir(output, { recursive: true });
  if (rawEvidence.size) {
    await mkdir(resolve(output, "evidence"), { recursive: true });
    for (const [hash, raw] of rawEvidence) await writeFile(resolve(output, "evidence", `${hash}.txt`), raw, { flag: "wx" });
  }
  const json = v => `${JSON.stringify(v, null, 2)}\n`;
  const markdown = `# Weekly fare verification\n\nRun: ${audit.generatedAt}\n\nMode: review only; publication disabled. Weekly is a check cadence, not a price guarantee.\n\nTargets: ${audit.counts.targets}; eligible candidates: ${audit.counts.eligible}; retained: ${audit.counts.retained}; unmatched quarantine: ${audit.counts.quarantined}.\n\n${audit.providerReadiness.map(p => `- ${p.provider}: ${p.access}. ${p.reason}`).join("\n")}\n\nBlocked, missing, sold-out or changed itineraries never imply cancellation. Last successful price checks advance only for complete exact-context observations. Import/build/promotion timestamps do not verify prices.\n\nSee this run's audit.json and before/candidate files for exact diff and rollback. Seed inputs unchanged: ${audit.inputsUnchanged}.\n`;
  for (const [name, value] of Object.entries({ "audit.json": json(audit), "audit.md": markdown, "observations.json": json(observations), "sailings.candidate.json": json(candidateSeed), "fare-verifications.candidate.json": json(candidateLedger), "sailings.before.json": inputBytes[0], "fare-verifications.before.json": inputBytes[1] })) await writeFile(resolve(output, name), value, { flag: "wx" });
  if (latest) {
    await mkdir(resolve(root, "data/reports"), { recursive: true });
    await writeFile(resolve(root, "data/reports/latest-fare-verification.json"), json(audit));
    await writeFile(resolve(root, "data/reports/latest-fare-verification.md"), markdown);
  }
  return audit;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === "--output") options.output = resolve(process.argv[++i]);
    else if (arg === "--probe-provider") options.probeProvider = process.argv[++i];
    else if (arg === "--observations") options.observationsFile = resolve(process.argv[++i]);
    else if (arg === "--run-started-at") options.startedAt = process.argv[++i];
    else if (arg === "--latest") options.latest = true;
    else throw new Error(`Unknown argument: ${arg}; no apply/publication mode exists`);
  }
  recheck(options).then(a => { console.log(JSON.stringify({ mode: a.mode, counts: a.counts, sourceChecks: a.sourceChecks, ready: a.ready, publicationEnabled: false, inputsUnchanged: a.inputsUnchanged }, null, 2)); if (!a.ready) process.exitCode = 1; }).catch(e => { console.error(e.message); process.exitCode = 1; });
}
