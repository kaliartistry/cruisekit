import { contextProblems, ledgerProblems } from "./fare-verification.mjs";

const DAY = 86400000;
const latestDate = values => values.filter(Boolean).sort().at(-1) ?? null;
const latestInstant = values => values.filter(Boolean).sort((a, b) => Date.parse(a) - Date.parse(b)).at(-1) ?? null;
const oldestDate = values => values.filter(Boolean).sort().at(0) ?? null;

/** One qualified view feeds both findings and aggregates; invalid ledgers fail closed. */
export function summarizePublicFareFreshness({ publicSailings, seed, ledger, policy, now = new Date(), maxPublicAgeDays = 7 }) {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new Error("Valid fare freshness evaluation time required");
  if (maxPublicAgeDays !== 7) throw new Error("The approved public fare freshness policy is exactly seven days");
  const provenanceErrors = ledgerProblems(seed, ledger, policy, now);
  const blockers = provenanceErrors.map(message => ({ severity: "blocker", id: "fare-provenance", message }));
  const sailingsByLine = new Map();

  for (const sailing of publicSailings) {
    const cruiseLine = sailing.cruiseLine ?? "unknown";
    const entry = provenanceErrors.length ? null : ledger.entries[sailing.id];
    const publishedMismatch = entry && (entry.price !== sailing.startingPrice || contextProblems(entry.quoteContext, sailing, policy.providers[sailing.cruiseLine]).length > 0);
    const checked = entry && !publishedMismatch ? entry.lastSuccessfulVerification : null;
    const ageDays = checked ? (now.getTime() - Date.parse(checked)) / DAY : null;
    const checks = sailingsByLine.get(cruiseLine) ?? [];
    checks.push({ sailing, checked, ageDays });
    sailingsByLine.set(cruiseLine, checks);

    if (ageDays == null) {
      blockers.push({
        severity: "blocker", id: sailing.id ?? "unknown",
        message: publishedMismatch
          ? "Published fare amount/context differs from the verified ledger; no confirmed exact-context price check applies to this public row."
          : `No confirmed exact-context price observation. Legacy record review ${sailing.lastVerified} is not a verified fare check.`,
        cruiseLine, unverifiedFare: true,
      });
    } else if (ageDays > maxPublicAgeDays) {
      blockers.push({
        severity: "blocker", id: sailing.id,
        message: `Price checked ${checked} is ${ageDays.toFixed(2)} days old; max allowed is ${maxPublicAgeDays} days.`,
        cruiseLine, ageDays,
      });
    }
  }

  const byCruiseLine = [...sailingsByLine.entries()]
    .map(([cruiseLine, checks]) => ({
      cruiseLine,
      publicSailings: checks.length,
      stalePublicSailings: checks.filter(check => check.ageDays != null && check.ageDays > maxPublicAgeDays).length,
      unverifiedPublicFares: checks.filter(check => check.ageDays == null).length,
      latestPriceCheck: latestInstant(checks.map(check => check.checked)),
      oldestLastVerified: oldestDate(checks.map(check => check.sailing.lastVerified)),
      latestLastVerified: latestDate(checks.map(check => check.sailing.lastVerified)),
    }))
    .sort((a, b) => b.stalePublicSailings - a.stalePublicSailings || a.cruiseLine.localeCompare(b.cruiseLine));

  return { blockers, byCruiseLine };
}
