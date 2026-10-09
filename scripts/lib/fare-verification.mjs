import { createHash } from "node:crypto";
import { manifestProblems, observationBindingProblems } from "./fare-run.mjs";

const DAY = 86400000;
const bases = new Map([["per-person-double-occupancy", 2], ["per-person-quad-occupancy", 4], ["per-person-solo", 1]]);
const text = (v) => typeof v === "string" && v.trim().length > 0;
const contextKey = c => JSON.stringify(Object.fromEntries(Object.entries(c ?? {}).sort(([a], [b]) => a.localeCompare(b))));
export const digest = (v) => createHash("sha256").update(typeof v === "string" ? v : JSON.stringify(v)).digest("hex");
export function validInstant(v) {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(v)) return false;
  const n = Date.parse(v);
  return Number.isFinite(n) && new Date(n).toISOString().slice(0, 19) === v.slice(0, 19);
}
function date(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && validInstant(`${v}T00:00:00Z`);
}
function money(v) { return Number.isFinite(v) && v > 0 && Math.abs(v * 100 - Math.round(v * 100)) < 1e-7; }
function safeUrl(v, origin) {
  try { const u = new URL(v); return u.origin === origin && !u.username && !u.password && !u.hash; } catch { return false; }
}

/** Complete, reviewed quote tuple. A ship/date match alone never verifies a fare. */
export function contextProblems(c, record, provider) {
  if (!c || !provider) return ["missing-quote-context"];
  const problems = [];
  for (const key of ["provider", "shipName", "departureDate", "returnDate", "nights", "departurePort", "returnPort", "currency", "priceBasis", "taxesAndFeesIncluded"]) {
    const expected = key === "provider" ? record.cruiseLine : record[key];
    if (c[key] !== expected) problems.push(`context-${key}`);
  }
  if (!date(c.departureDate) || !date(c.returnDate) || (Date.parse(c.returnDate) - Date.parse(c.departureDate)) / DAY !== c.nights) problems.push("nights-date-mismatch");
  if (!Array.isArray(c.itineraryPorts) || c.itineraryPorts.length < 2 || !c.itineraryPorts.every(text) || JSON.stringify(c.itineraryPorts) !== JSON.stringify(record.itineraryPorts)) problems.push("context-itinerary");
  if (!["sourceSailingId", "cabinCategory", "rateCode", "packageCode", "market", "contractVersion"].every(k => text(c[k]))) problems.push("incomplete-cabin-rate-package-market");
  if (!["inside", "oceanview", "balcony", "suite"].includes(c.cabinType)) problems.push("unknown-cabin-mapping");
  if (c.contractVersion !== provider.contractVersion) problems.push("unreviewed-source-contract");
  if (c.market !== "US" || c.currency !== "USD") problems.push("unsupported-market-currency");
  if (!Number.isInteger(c.adults) || c.adults < 1 || !Number.isInteger(c.children) || c.children < 0 || c.children !== 0 || c.cabins !== 1) problems.push("unsupported-occupancy");
  if (c.priceBasis === "per-cabin" ? c.adults < 1 : bases.get(c.priceBasis) !== c.adults) problems.push("unit-occupancy-mismatch");
  if (typeof c.taxesAndFeesIncluded !== "boolean") problems.push("unknown-taxes");
  if (!safeUrl(c.sourceUrl, provider.origin) || c.sourceUrl !== record.sourceUrl) problems.push("source-url-mismatch");
  return problems;
}

export function ledgerProblems(seed, ledger, policy, now = new Date()) {
  if (ledger?.schemaVersion !== 1 || !ledger.entries || Array.isArray(ledger.entries)) return ["Invalid fare ledger"];
  const records = new Map(seed.map(r => [r.id, r]));
  const errors = [];
  const usedEvents = new Set();
  for (const [id, e] of Object.entries(ledger.entries)) {
    const r = records.get(id);
    if (!r) { errors.push(`${id}: unknown sailing`); continue; }
    const p = policy.providers[r.cruiseLine];
    const problems = contextProblems(e.quoteContext, r, p);
    if (!text(e.reviewedBy) || !validInstant(e.contextApprovedAt) || Date.parse(e.contextApprovedAt) > now.getTime()) problems.push("missing-context-approval");
    if (!validInstant(e.observedAt) || e.observedAt !== e.lastSuccessfulVerification || Date.parse(e.observedAt) > now.getTime()) problems.push("invalid-observation-time");
    if (!money(e.price) || e.price !== r.startingPrice) problems.push("price-not-published-value");
    if (!/^[a-f0-9]{64}$/.test(e.evidenceSha256 ?? "") || !text(e.evidenceRef)) problems.push("missing-evidence");
    if (!validInstant(e.observedAt) || e.nextCheckAt !== new Date(Date.parse(e.observedAt) + policy.cadenceDays * DAY).toISOString()) problems.push("invalid-next-check");
    if (["collectionRunId", "collectionEventId", "usedCollectionEventIds"].some(key => Object.hasOwn(e, key))) {
      const events = e.usedCollectionEventIds;
      if (!text(e.collectionRunId) || !text(e.collectionEventId) || !Array.isArray(events) || !events.length || events.length > 1024 || !events.every(text) || new Set(events).size !== events.length || events.at(-1) !== e.collectionEventId) problems.push("invalid-collection-event-history");
      else for (const event of events) { if (usedEvents.has(event)) problems.push("reused-ledger-collection-event"); usedEvents.add(event); }
      if (!Number.isFinite(e.responseAgeSeconds) || e.responseAgeSeconds < 0 || e.responseAgeSeconds > 300) problems.push("unknown-or-cached-response-age");
    }
    if (problems.length) errors.push(`${id}: ${problems.join(", ")}`);
  }
  return errors;
}

/** Only returns candidate files. Never writes seed, commits, pushes or publishes. */
export function assessFares({ seed, ledger, observations, policy, runStartedAt, targetIds = null, runManifest = null, codeSha256, now = new Date() }) {
  if (policy.publicationMode !== "review-only" || policy.cadenceDays !== 7 || policy.largeChangeFraction !== 0.15) throw new Error("Unapproved verification policy");
  if (!validInstant(runStartedAt) || Date.parse(runStartedAt) > now.getTime() || now.getTime() - Date.parse(runStartedAt) > 45 * 60000) throw new Error("Invalid or expired run start");
  const ledgerErrors = ledgerProblems(seed, ledger, policy, now);
  if (ledgerErrors.length) throw new Error(ledgerErrors.join("\n"));
  const publicTargets = seed.filter(r => r.confidence !== "internal_do_not_publish" && r.departureDate >= now.toISOString().slice(0, 10));
  if (targetIds !== null && (!Array.isArray(targetIds) || !targetIds.length || new Set(targetIds).size !== targetIds.length || targetIds.some(id => !publicTargets.some(r => r.id === id)))) throw new Error("Invalid or expired pilot targets");
  const targets = targetIds === null ? publicTargets : publicTargets.filter(r => targetIds.includes(r.id));
  if (targets.length > policy.maxTargets || observations.length > policy.maxTargets * 4) throw new Error("Batch bound exceeded");
  const candidateSeed = structuredClone(seed);
  const candidateLedger = structuredClone(ledger);
  const index = new Map(candidateSeed.map((r, i) => [r.id, i]));
  const decisions = [];
  const initialBaselines = [];
  const selectedIds = new Set(targets.map(r => r.id));
  const bindingErrors = observations.length ? manifestProblems(runManifest, { startedAt: runStartedAt, targetIds: [...selectedIds], seed, ledger, policy, ...(codeSha256 === undefined ? {} : { codeSha256 }) }) : [];
  const usedEventIds = Object.values(ledger.entries).flatMap(entry => entry.usedCollectionEventIds ?? (entry.collectionEventId ? [entry.collectionEventId] : []));
  for (const o of observations) if (!selectedIds.has(o.targetId)) decisions.push({ id: o.targetId ?? null, status: "quarantined", reasons: ["unmatched-or-new-sailing"] });
  for (const r of targets) {
    const prior = ledger.entries[r.id];
    const p = policy.providers[r.cruiseLine];
    const rows = observations.filter(o => o.targetId === r.id);
    let reasons = [];
    if (p?.access !== "approved" || !text(p?.contractVersion)) reasons.push("source-access-or-contract-unapproved");
    if (!prior) reasons.push("initial-quote-context-needs-owner-review");
    if (rows.length !== 1) reasons.push(rows.length ? "ambiguous-observations" : "not-observed-in-this-run");
    const o = rows[0];
    if (rows.length === 1) {
      reasons.push(...bindingErrors, ...observationBindingProblems(o, runManifest, { usedEventIds }));
      if ((prior?.usedCollectionEventIds?.length ?? 0) >= 1024) reasons.push("collection-event-history-bound-review-required");
      if (o.availability !== "available") reasons.push(`availability-${o.availability ?? "unknown"}-not-cancellation`);
      if (!validInstant(o.observedAt) || Date.parse(o.observedAt) < Date.parse(runStartedAt) || Date.parse(o.observedAt) > now.getTime()) reasons.push("not-a-current-run-observation");
      if (o.sourceTimestamp != null && (!validInstant(o.sourceTimestamp) || Date.parse(o.sourceTimestamp) > Date.parse(o.observedAt) || Date.parse(o.observedAt) - Date.parse(o.sourceTimestamp) > 300000)) reasons.push("stale-or-invalid-source-timestamp");
      if (!Number.isFinite(o.responseAgeSeconds) || o.responseAgeSeconds < 0 || o.responseAgeSeconds > 300) reasons.push("unknown-or-cached-response-age");
      if (!/^[a-f0-9]{64}$/.test(o.evidenceSha256 ?? "") || !text(o.evidenceRef)) reasons.push("missing-raw-evidence");
      if (!money(o.price)) reasons.push("invalid-price-or-rounding");
      // First observations may correct legacy unit/tax metadata, only in a
      // separately reviewed proposal. Sailing/itinerary identity must still match.
      const contextRecord = prior ? r : { ...r, priceBasis: o.quoteContext?.priceBasis, taxesAndFeesIncluded: o.quoteContext?.taxesAndFeesIncluded };
      reasons.push(...contextProblems(o.quoteContext, contextRecord, p));
      if (prior && contextKey(prior.quoteContext) !== contextKey(o.quoteContext)) reasons.push("changed-quote-context");
      if (prior && validInstant(o.observedAt) && Date.parse(o.observedAt) <= Date.parse(prior.lastSuccessfulVerification)) reasons.push("replayed-observation");
      if (!money(r.startingPrice)) reasons.push("initial-price-needs-owner-review");
      else if (money(o.price) && Math.abs(o.price - r.startingPrice) / r.startingPrice >= policy.largeChangeFraction - 1e-12) reasons.push("large-price-change-needs-owner-review");
    }
    reasons = [...new Set(reasons)];
    const baselineReviewReasons = ["initial-quote-context-needs-owner-review", "initial-price-needs-owner-review", "large-price-change-needs-owner-review"];
    if (!prior && rows.length === 1 && reasons.every(reason => baselineReviewReasons.includes(reason))) {
      const proposal = { schemaVersion: 1, targetId: r.id, beforeSeedSha256: digest(seed), beforeLedgerSha256: digest(ledger), runManifest: structuredClone(runManifest), record: { ...r, startingPrice: o.price, priceBasis: o.quoteContext.priceBasis, taxesAndFeesIncluded: o.quoteContext.taxesAndFeesIncluded }, observation: structuredClone(o) };
      initialBaselines.push({ ...proposal, proposalSha256: digest(proposal), status: "pending-specific-data-review" });
    }
    if (reasons.length) {
      decisions.push({ id: r.id, provider: r.cruiseLine, status: "retained", reasons, lastSuccessfulVerification: prior?.lastSuccessfulVerification ?? null, lastRecordReview: r.lastVerified });
      continue;
    }
    candidateSeed[index.get(r.id)].startingPrice = o.price;
    candidateLedger.entries[r.id] = { ...prior, price: o.price, observedAt: o.observedAt, lastSuccessfulVerification: o.observedAt, nextCheckAt: new Date(Date.parse(o.observedAt) + policy.cadenceDays * DAY).toISOString(), sourceTimestamp: o.sourceTimestamp ?? null, documentLastModified: o.documentLastModified ?? null, responseAgeSeconds: o.responseAgeSeconds, collectionRunId: o.runId, collectionEventId: o.collectionEventId, usedCollectionEventIds: [...(prior.usedCollectionEventIds ?? (prior.collectionEventId ? [prior.collectionEventId] : [])), o.collectionEventId], evidenceSha256: o.evidenceSha256, evidenceRef: o.evidenceRef };
    decisions.push({ id: r.id, provider: r.cruiseLine, status: "eligible-candidate", previousPrice: r.startingPrice, price: o.price, observedAt: o.observedAt, sourceTimestamp: o.sourceTimestamp ?? null, responseAgeSeconds: o.responseAgeSeconds, evidenceSha256: o.evidenceSha256, evidenceRef: o.evidenceRef, nextCheckAt: candidateLedger.entries[r.id].nextCheckAt, reasons: [] });
  }
  return { schemaVersion: 1, generatedAt: now.toISOString(), runId: runManifest?.runId ?? null, runManifest: structuredClone(runManifest), runStartedAt, mode: "review-only-no-public-writes", before: { seedSha256: digest(seed), ledgerSha256: digest(ledger) }, after: { seedSha256: digest(candidateSeed), ledgerSha256: digest(candidateLedger) }, coverage: { publicTargets: publicTargets.length, selectedTargets: targets.length, outsideScope: publicTargets.length - targets.length, globalCoverage: targets.length === publicTargets.length }, counts: { targets: targets.length, eligible: decisions.filter(d => d.status === "eligible-candidate").length, initialBaselines: initialBaselines.length, retained: decisions.filter(d => d.status === "retained").length, quarantined: decisions.filter(d => d.status === "quarantined").length }, decisions, initialBaselines, candidateSeed, candidateLedger };
}

/** Materialize only specifically reviewed baseline proposals, still outside seed.
 * Review receipts are supplied by a human-approved data review, never generated.
 */
export function reviewInitialBaselines({ seed, ledger, proposals, reviews, policy, now = new Date() }) {
  if (!Array.isArray(proposals) || !Array.isArray(reviews) || !reviews.length || new Set(reviews.map(r => r.targetId)).size !== reviews.length) throw new Error("Specific baseline review receipts required");
  if (policy.publicationMode !== "review-only" || policy.cadenceDays !== 7 || policy.largeChangeFraction !== 0.15) throw new Error("Unapproved verification policy");
  const candidateSeed = structuredClone(seed), candidateLedger = structuredClone(ledger);
  for (const review of reviews) {
    const matches = proposals.filter(p => p.targetId === review.targetId);
    if (matches.length !== 1) throw new Error("Missing or ambiguous baseline proposal");
    const { proposalSha256, status, ...proposal } = matches[0];
    if (status !== "pending-specific-data-review" || digest(proposal) !== proposalSha256 || proposalSha256 !== review.proposalSha256 || !text(review.reviewedBy) || !validInstant(review.contextApprovedAt) || Date.parse(review.contextApprovedAt) > now.getTime()) throw new Error("Invalid or mismatched baseline review");
    if (proposal.beforeSeedSha256 !== digest(seed) || proposal.beforeLedgerSha256 !== digest(ledger)) throw new Error("Baseline inputs changed; review again");
    if (ledger.entries[proposal.targetId]) throw new Error("Existing baseline cannot be overwritten");
    const index = seed.findIndex(r => r.id === proposal.targetId), o = proposal.observation;
    if (index < 0 || seed[index].departureDate < now.toISOString().slice(0, 10) || proposal.record.lastVerified !== seed[index].lastVerified) throw new Error("Invalid baseline identity or historical date");
    const assessment = assessFares({ seed, ledger, observations: [o], policy, runManifest: proposal.runManifest, targetIds: proposal.runManifest?.targetIds, runStartedAt: proposal.runManifest?.startedAt, now: new Date(o.observedAt) });
    if (assessment.initialBaselines.length !== 1 || assessment.initialBaselines[0].proposalSha256 !== proposalSha256 || now.getTime() - Date.parse(o.observedAt) > policy.cadenceDays * DAY || Date.parse(review.contextApprovedAt) < Date.parse(o.observedAt)) throw new Error("Incomplete, expired or altered baseline evidence");
    candidateSeed[index] = proposal.record;
    candidateLedger.entries[proposal.targetId] = { price: o.price, quoteContext: o.quoteContext, observedAt: o.observedAt, lastSuccessfulVerification: o.observedAt, nextCheckAt: new Date(Date.parse(o.observedAt) + policy.cadenceDays * DAY).toISOString(), sourceTimestamp: o.sourceTimestamp ?? null, documentLastModified: o.documentLastModified ?? null, responseAgeSeconds: o.responseAgeSeconds, collectionRunId: o.runId, collectionEventId: o.collectionEventId, usedCollectionEventIds: [o.collectionEventId], evidenceSha256: o.evidenceSha256, evidenceRef: o.evidenceRef, reviewedBy: review.reviewedBy, contextApprovedAt: review.contextApprovedAt };
  }
  const errors = ledgerProblems(candidateSeed, candidateLedger, policy, now);
  if (errors.length) throw new Error(errors.join("\n"));
  return { candidateSeed, candidateLedger };
}

/** Longest-match robots rules; unknown responses fail closed in the caller. */
export function robotsAllows(body, target, agent = "CruiseKitImporter") {
  const groups = []; let agents = []; let rules = []; let inRules = false;
  const flush = () => { if (agents.length) groups.push({ agents, rules }); agents = []; rules = []; inRules = false; };
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    const match = line.match(/^([^:]+):\s*(.*)$/); if (!match) continue;
    const key = match[1].trim().toLowerCase(), value = match[2].trim();
    if (key === "user-agent") { if (inRules) flush(); agents.push(value.toLowerCase()); }
    else if (["allow", "disallow"].includes(key) && agents.length) { inRules = true; if (value) rules.push({ allow: key === "allow", value }); }
  }
  flush();
  const specificity = g => Math.max(...g.agents.map(a => a === "*" ? 0 : agent.toLowerCase().includes(a) ? a.length : -1));
  const best = Math.max(-1, ...groups.map(specificity));
  const path = new URL(target).pathname + new URL(target).search;
  const matches = groups.filter(g => specificity(g) === best).flatMap(g => g.rules).filter(r => {
    const pattern = r.value.replace(/[.+?^{}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$");
    return new RegExp(`^${pattern}`).test(path);
  }).sort((a, b) => b.value.replaceAll("*", "").length - a.value.replaceAll("*", "").length || Number(b.allow) - Number(a.allow));
  return matches[0]?.allow ?? true;
}

/** Bounded, anonymous HTTP reads; no redirect, cookie, credential or denial bypass. */
export function boundedReader(origin, limits, { fetchImpl = fetch, pause = ms => new Promise(r => setTimeout(r, ms)), clock = () => new Date() } = {}) {
  let requests = 0;
  return {
    get requests() { return requests; },
    async read(url) {
      if (!safeUrl(url, origin)) throw new Error("Unapproved source URL");
      for (let attempt = 0; attempt < limits.maxAttempts; attempt++) {
        if (requests >= limits.maxRequests) throw new Error("Request bound exceeded");
        if (requests) await pause(limits.minDelayMs);
        requests++;
        let response;
        try {
          response = await fetchImpl(url, { redirect: "manual", credentials: "omit", headers: { "User-Agent": "CruiseKitImporter/0.2 (+https://cruisekit.app)", Accept: "application/json, text/plain" }, signal: AbortSignal.timeout(limits.timeoutMs) });
        } catch (e) { throw new Error(`Source read failed: ${e.name}`); }
        if (response.status === 429 || response.status >= 500) {
          const raw = response.headers.get("retry-after");
          const retry = raw == null ? 1000 * (attempt + 1) : /^\d+$/.test(raw) ? Number(raw) * 1000 : Date.parse(raw) - clock().getTime();
          await response.body?.cancel();
          if (attempt + 1 >= limits.maxAttempts || !Number.isFinite(retry) || retry < 0 || retry > limits.maxRetryDelayMs) throw new Error(`Source throttled/unavailable: HTTP ${response.status}; deferred`);
          await pause(retry); continue;
        }
        if (!response.ok) { await response.body?.cancel(); throw new Error(`Source blocked/unavailable: HTTP ${response.status}`); }
        if (Number(response.headers.get("content-length")) > limits.maxBytes) { await response.body?.cancel(); throw new Error("Source body bound exceeded"); }
        const reader = response.body.getReader(); const chunks = []; let size = 0;
        try { while (true) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > limits.maxBytes) throw new Error("Source body bound exceeded"); chunks.push(value); } }
        catch (e) { await reader.cancel(); throw e; }
        const body = Buffer.concat(chunks).toString("utf8");
        if (/captcha|access denied|waiting room|verify you are human/i.test(body)) throw new Error("Source challenge; deferred without bypass");
        const rawAge = response.headers.get("age");
        const parsedAge = rawAge !== null && /^\d+$/.test(rawAge) ? Number(rawAge) : null;
        const validAge = Number.isSafeInteger(parsedAge) && parsedAge >= 0;
        return { body, observedAt: clock().toISOString(), evidenceSha256: digest(body), sourceTimestamp: null, documentLastModified: response.headers.get("last-modified"), responseAgeSeconds: validAge ? parsedAge : null, responseAgeReason: validAge ? "explicit-http-age" : rawAge === null ? "http-age-missing" : "http-age-invalid" };
      }
      throw new Error("Source read exhausted");
    },
  };
}
