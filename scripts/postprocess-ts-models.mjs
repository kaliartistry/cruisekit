#!/usr/bin/env node
/**
 * Quicktype's TS output emits `Date` for fields with format=date or format=date-time.
 * We import the seed JSON literally, so those values arrive as strings — `Date`
 * misrepresents runtime shape. This post-process coerces date-typed fields to `string`.
 *
 * Run automatically by `pnpm run schema:gen:ts`.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targets = [
  resolve(repoRoot, "shared/models/ts/sailing.ts"),
  resolve(repoRoot, "shared/models/ts/deal.ts"),
];

for (const file of targets) {
  const before = await readFile(file, "utf8");
  const after = before
    // `field: Date;` (with any whitespace before Date — Quicktype aligns columns)
    .replace(/:\s+Date;/g, ": string;")
    // union forms
    .replace(/:\s+(Date \| null|null \| Date);/g, ": string | null;")
    // arrays
    .replace(/:\s+Date\[\];/g, ": string[];");
  await writeFile(file, after, "utf8");
  process.stdout.write(`postprocessed ${file}\n`);
}
