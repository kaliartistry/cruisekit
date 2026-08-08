#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildShipCodeIndex,
  loadShipCodeReference,
  normalizeSailingCatalogShipNames,
} from "./lib/ship-code-names.mjs";

function parseArgs(argv) {
  const options = { check: false };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--") continue;
    if (value === "--check") {
      options.check = true;
      continue;
    }
    if (value === "--input" || value === "--output") {
      const next = argv[index + 1];
      if (!next) throw new Error(`${value} requires a path.`);
      options[value.slice(2)] = resolve(next);
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${value}`);
  }

  if (!options.input) throw new Error("--input is required.");
  if (!options.check && !options.output) {
    throw new Error("--output is required unless --check is used.");
  }
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const [catalog, reference] = await Promise.all([
    readFile(options.input, "utf8").then(JSON.parse),
    loadShipCodeReference(),
  ]);
  const result = normalizeSailingCatalogShipNames(
    catalog,
    buildShipCodeIndex(reference),
  );

  console.log(JSON.stringify(result.stats, null, 2));

  if (options.check) {
    if (result.stats.changed > 0) {
      throw new Error(
        `${result.stats.changed} sailing rows still need ship-code normalization.`,
      );
    }
    return;
  }

  await writeFile(options.output, `${JSON.stringify(result.payload, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
