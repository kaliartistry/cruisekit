#!/usr/bin/env node
/**
 * Publishes generated data bundles into the Next.js public directory.
 *
 * This makes bundles deploy with the web app at:
 *   /data/bundles/manifest.json
 *   /data/bundles/mobile/sailings.json
 *   /data/bundles/mobile/deals.json
 *   /data/bundles/canonical/sailings.json
 *   /data/bundles/canonical/deals.json
 */
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(repoRoot, "data/bundles");
const publicRoot = resolve(repoRoot, "apps/web/public/data/bundles");

async function loadJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function publicManifest(manifest) {
  const nextManifest = structuredClone(manifest);
  for (const bundle of Object.values(nextManifest.bundles ?? {})) {
    if (typeof bundle.path === "string") {
      bundle.path = bundle.path.replace(/^data\/bundles\//, "");
    }
  }
  nextManifest.publishedFor = "web-public-assets";
  nextManifest.publicBasePath = "/data/bundles/";
  nextManifest.manifestUrl = "/data/bundles/manifest.json";
  return nextManifest;
}

async function main() {
  await rm(publicRoot, { recursive: true, force: true });
  await mkdir(publicRoot, { recursive: true });

  await Promise.all([
    cp(resolve(sourceRoot, "canonical"), resolve(publicRoot, "canonical"), { recursive: true }),
    cp(resolve(sourceRoot, "mobile"), resolve(publicRoot, "mobile"), { recursive: true }),
  ]);

  const manifest = await loadJson(resolve(sourceRoot, "manifest.json"));
  await writeFile(
    resolve(publicRoot, "manifest.json"),
    `${JSON.stringify(publicManifest(manifest), null, 2)}\n`,
  );

  console.log(`Published data bundles to ${publicRoot}`);
  console.log("Manifest URL after web deploy: /data/bundles/manifest.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
