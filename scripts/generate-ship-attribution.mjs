#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const shipImageReviewPath = resolve(
  repoRoot,
  "data/ship-image-review.json",
);
export const shipAttributionPath = resolve(
  repoRoot,
  "apps/web/public/assets/ships/ATTRIBUTION.txt",
);

export function renderShipAttribution(review) {
  const entries = Object.entries(review?.verified ?? {}).sort(([left], [right]) =>
    left.localeCompare(right),
  );
  const lines = [
    "CruiseKit ship image credits",
    `Registry updated: ${review.updatedAt}`,
    "",
    "CruiseKit serves transformed copies of the source photographs listed below.",
    "Files may be cropped, resized, and compressed from their originals. These",
    "credits do not imply that any photographer, cruise line, or rights holder",
    "endorses CruiseKit.",
    "",
    "CruiseKit's transformed copies of CC BY-SA sources are offered under the",
    "same license version listed for each file.",
    "",
    "Generated from data/ship-image-review.json. Do not edit by hand.",
    "",
  ];

  for (const [shipId, source] of entries) {
    lines.push(
      `${shipId}.jpg`,
      `  Photo: ${source.attribution || source.author}`,
      `  Source name: ${source.sourceName}`,
      `  Source: ${source.sourceUrl}`,
      `  License: ${source.license}`,
      `  License URL: ${source.licenseUrl}`,
      "",
    );
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

async function main() {
  const review = JSON.parse(await readFile(shipImageReviewPath, "utf8"));
  await writeFile(shipAttributionPath, renderShipAttribution(review));
  console.log(
    `Wrote ${Object.keys(review.verified ?? {}).length} ship image credits to ${shipAttributionPath}`,
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
