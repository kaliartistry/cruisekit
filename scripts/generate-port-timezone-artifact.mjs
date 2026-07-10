#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(repoRoot, "data/reference/port-timezones.json");
const outputPath = resolve(
  repoRoot,
  "data/bundles/mobile/port-timezones.json",
);

const contract = JSON.parse(await readFile(sourcePath, "utf8"));
const concrete = {
  ...contract.timeZones,
  ...contract.externalTimeZones,
};

for (const slug of Object.keys(contract.externalTimeZones)) {
  if (Object.hasOwn(contract.timeZones, slug)) {
    throw new Error(`External port collides with current port: ${slug}`);
  }
}

for (const [alias, target] of Object.entries(contract.aliases)) {
  if (Object.hasOwn(concrete, alias)) {
    throw new Error(`Alias collides with concrete port: ${alias}`);
  }
  if (!Object.hasOwn(concrete, target)) {
    throw new Error(`Alias ${alias} targets unknown port ${target}`);
  }
  if (Object.hasOwn(contract.aliases, target)) {
    throw new Error(`Alias chains are not allowed: ${alias} -> ${target}`);
  }
}

const portTimeZones = { ...concrete };
for (const [alias, target] of Object.entries(contract.aliases)) {
  portTimeZones[alias] = concrete[target];
}

const artifact = {
  schemaVersion: contract.schemaVersion,
  catalogRevision: contract.catalogRevision,
  ianaDatabaseVersion: contract.ianaDatabaseVersion,
  generatedFrom: "data/reference/port-timezones.json",
  portTimeZones: Object.fromEntries(
    Object.entries(portTimeZones).sort(([left], [right]) =>
      left.localeCompare(right),
    ),
  ),
  aliases: contract.aliases,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(
  `Generated ${Object.keys(artifact.portTimeZones).length} mobile port time-zone assignments at ${outputPath}`,
);
