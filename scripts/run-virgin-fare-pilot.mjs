#!/usr/bin/env node
/** One-sailing public-access pilot. Stop on terms restrictions; never publish. */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { boundedReader } from "./lib/fare-verification.mjs";
import { VIRGIN_ORIGIN, VIRGIN_TERMS_URL, VIRGIN_PILOT_ID, virginTermsRestriction } from "./lib/virgin-fare-pilot.mjs";
import { recheck } from "./run-fare-recheck.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export async function runVirginPilot({ output = resolve(root, "data/ingest/reports/virgin-fare-pilot", new Date().toISOString().replace(/[:.]/g, "-")), latest = false, reader = null, verify = recheck, clock = () => new Date() } = {}) {
  const startedAt = clock().toISOString();
  const seed = JSON.parse(await readFile(resolve(root, "data/seed/sailings.json"), "utf8"));
  const target = seed.find(r => r.id === VIRGIN_PILOT_ID);
  if (!target || target.cruiseLine !== "virgin-voyages" || target.departureDate < startedAt.slice(0, 10)) throw new Error("Pilot target absent/expired; select and review another exact sailing");
  const policy = JSON.parse(await readFile(resolve(root, "data/fare-verification-policy.json"), "utf8"));
  const source = reader ?? boundedReader(VIRGIN_ORIGIN, { ...policy.transport, maxRequests: 2 });
  await mkdir(output, { recursive: true });
  let access;
  try {
    const result = await source.read(VIRGIN_TERMS_URL);
    await writeFile(resolve(output, "virgin-terms.html"), result.body, { flag: "wx" });
    access = { ...virginTermsRestriction(result.body), checkedAt: result.observedAt, evidenceSha256: result.evidenceSha256, evidenceRef: "virgin-terms.html" };
  } catch (e) { access = { status: "terms-unavailable", checkedAt: new Date().toISOString(), url: VIRGIN_TERMS_URL, reason: e.message }; }
  // Even changed/unclear terms cannot invent a source contract or authorize a
  // fallback collector. This pilot has no permitted exact-quote source yet.
  const observationsFile = resolve(output, "observations.json");
  await writeFile(observationsFile, "[]\n", { flag: "wx" });
  const verification = await verify({ output: resolve(output, "verification"), observationsFile, targetIds: [target.id], startedAt, latest, now: clock() });
  const report = { schemaVersion: 1, generatedAt: new Date().toISOString(), runStartedAt: startedAt, targetId: target.id, sourceSailingId: new URL(target.sourceUrl).searchParams.get("voyageId"), mode: "one-sailing-access-pilot-no-public-writes", access, requests: source.requests, fareRequests: 0, completeQuotes: 0, missingEvidence: ["current-sailing-availability", "exact-cabin-category", "rate-plan", "guest-and-cabin-counts", "US-market-and-USD-response", "required-tax-inclusion", "exact-ordered-itinerary", "current-price-and-cache-age"], observationsFile, verification: { coverage: verification.coverage, counts: verification.counts, ready: verification.ready, scopeReady: verification.scopeReady }, inputsUnchanged: verification.inputsUnchanged, publicationEnabled: false };
  await writeFile(resolve(output, "pilot.json"), `${JSON.stringify(report, null, 2)}\n`, { flag: "wx" });
  if (latest) await writeFile(resolve(root, "data/reports/latest-virgin-fare-pilot.json"), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = {};
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--output") options.output = resolve(process.argv[++i]);
    else if (process.argv[i] === "--latest") options.latest = true;
    else throw new Error(`Unknown pilot option: ${process.argv[i]}`);
  }
  runVirginPilot(options).then(r => { console.log(JSON.stringify(r, null, 2)); if (!r.verification.scopeReady) process.exitCode = 1; }).catch(e => { console.error(e.message); process.exitCode = 1; });
}
