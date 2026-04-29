#!/usr/bin/env node
/**
 * Validates seed records against the canonical JSON Schemas.
 * Fails (non-zero exit) on any schema violation. Warns (exit 0) on:
 *   - record older than 90 days (lastVerified stale)
 *   - record with confidence != "internal_do_not_publish" but no directLink AND no affiliateLink
 *
 * Wired into apps/web/package.json as `prebuild`, so CI/deploys break on bad data.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function loadJson(relPath) {
  const buf = await readFile(resolve(repoRoot, relPath), "utf8");
  return JSON.parse(buf);
}

const sailingSchema = await loadJson("data/schema/sailing.schema.json");
const dealSchema = await loadJson("data/schema/deal.schema.json");
const sailings = await loadJson("data/seed/sailings.json");
const deals = await loadJson("data/seed/deals.json");

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateSailing = ajv.compile(sailingSchema);
const validateDeal = ajv.compile(dealSchema);

let errors = 0;
let warnings = 0;
const ninetyDaysAgo = new Date();
ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

function checkRecord(label, record, validator) {
  const ok = validator(record);
  if (!ok) {
    errors++;
    console.error(`\n[FAIL] ${label} (id=${record?.id ?? "<unknown>"}):`);
    for (const err of validator.errors ?? []) {
      console.error(`  ${err.instancePath || "/"} ${err.message}`);
    }
    return;
  }
  if (record.confidence !== "internal_do_not_publish") {
    if (!record.directLink && !record.affiliateLink) {
      warnings++;
      console.warn(`[WARN] ${label} ${record.id}: no directLink or affiliateLink — CTA will be hidden.`);
    }
  }
  if (record.lastVerified) {
    const verifiedAt = new Date(record.lastVerified);
    if (!Number.isNaN(verifiedAt.getTime()) && verifiedAt < ninetyDaysAgo) {
      warnings++;
      console.warn(`[WARN] ${label} ${record.id}: lastVerified=${record.lastVerified} is older than 90 days.`);
    }
  }
}

for (const s of sailings) checkRecord("sailing", s, validateSailing);
for (const d of deals) checkRecord("deal", d, validateDeal);

const summary = `\nValidated ${sailings.length} sailing(s) + ${deals.length} deal(s) — ${errors} error(s), ${warnings} warning(s).`;
if (errors > 0) {
  console.error(summary);
  process.exit(1);
}
console.log(summary);
