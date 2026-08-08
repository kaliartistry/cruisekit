import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { renderShipAttribution } from "../generate-ship-attribution.mjs";
import {
  COMMERCIAL_SHIP_IMAGE_LICENSES,
  hasCanonicalShipImageLicenseUrl,
  isCommercialShipImageLicense,
} from "../lib/ship-image-licenses.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const shipAssetDir = resolve(repoRoot, "apps/web/public/assets/ships");
const licensedHeroIds = [
  "grand-princess",
  "coral-princess",
  "sapphire-princess",
  "diamond-princess",
  "norwegian-epic",
  "norwegian-dawn",
  "azamara-journey",
  "norwegian-jewel",
  "msc-poesia",
  "viking-star",
  "carnival-vista",
  "mardi-gras",
  "icon-of-the-seas",
  "carnival-firenze",
  "celebrity-reflection",
  "allure-of-the-seas",
  "celebrity-equinox",
  "norwegian-joy",
  "eurodam",
  "celebrity-constellation",
  "msc-meraviglia",
  "msc-seashore",
  "pride-of-america",
  "radiance-of-the-seas",
  "serenade-of-the-seas",
  "westerdam",
];
const fallbackShipIds = [
  "brilliant-lady",
  "norwegian-aura",
  "carnival-festivale",
];

function jpegDimensions(bytes) {
  assert.deepEqual([...bytes.subarray(0, 3)], [0xff, 0xd8, 0xff]);

  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);
    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);
    if (isStartOfFrame) {
      return {
        width: bytes.readUInt16BE(offset + 7),
        height: bytes.readUInt16BE(offset + 5),
      };
    }
    if (length < 2) break;
    offset += 2 + length;
  }
  return null;
}

test("commercial-use policy rejects the prior ambiguous and unaudited values", () => {
  assert.equal(isCommercialShipImageLicense("Attribution"), false);
  assert.equal(
    isCommercialShipImageLicense(
      "Official source image; reuse rights not audited",
    ),
    false,
  );
  assert.equal(
    hasCanonicalShipImageLicenseUrl(
      "CC BY 4.0",
      "https://creativecommons.org/licenses/by-sa/4.0/",
    ),
    false,
  );
});

test("licensed hero additions and replacements meet the JPEG dimensions and size budget", async () => {
  for (const shipId of licensedHeroIds) {
    const assetPath = resolve(shipAssetDir, `${shipId}.jpg`);
    const [bytes, details] = await Promise.all([
      readFile(assetPath),
      stat(assetPath),
    ]);
    assert.deepEqual(jpegDimensions(bytes), { width: 1600, height: 900 });
    assert.ok(details.size >= 100_000, `${shipId}.jpg is below 100KB`);
    assert.ok(details.size <= 250_000, `${shipId}.jpg exceeds 250KB`);
  }
});

test("source records cover shipped assets and intentional fallbacks", async () => {
  const [review, attribution] = await Promise.all([
    readFile(resolve(repoRoot, "data/ship-image-review.json"), "utf8").then(
      JSON.parse,
    ),
    readFile(resolve(shipAssetDir, "ATTRIBUTION.txt"), "utf8"),
  ]);

  for (const shipId of [...licensedHeroIds, "celebrity-ascent"]) {
    assert.ok(
      review.verified?.[shipId]?.sourceUrl,
      `${shipId} lacks a source URL`,
    );
    assert.ok(
      review.verified?.[shipId]?.license,
      `${shipId} lacks a license record`,
    );
    assert.match(attribution, new RegExp(`^${shipId}\\.jpg$`, "m"));
  }

  for (const shipId of fallbackShipIds) {
    await assert.rejects(access(resolve(shipAssetDir, `${shipId}.jpg`)));
    assert.equal(review.blocked?.[shipId]?.allowMissing, true);
    assert.ok(review.blocked?.[shipId]?.reason);
  }
});

test("every ship JPG has one commercially reusable verified record", async () => {
  const [review, assetNames] = await Promise.all([
    readFile(resolve(repoRoot, "data/ship-image-review.json"), "utf8").then(
      JSON.parse,
    ),
    readdir(shipAssetDir),
  ]);
  const assetIds = new Set(
    assetNames
      .filter((name) => name.toLowerCase().endsWith(".jpg"))
      .map((name) => name.slice(0, -4)),
  );
  assert.deepEqual(
    assetNames
      .filter((name) => !name.toLowerCase().endsWith(".jpg"))
      .sort(),
    ["ATTRIBUTION.txt"],
    "The ship asset directory may contain only reviewed JPGs and generated attribution",
  );
  const verifiedIds = new Set(Object.keys(review.verified ?? {}));
  const blockedIds = new Set(Object.keys(review.blocked ?? {}));

  assert.deepEqual(
    [...assetIds].filter((id) => !verifiedIds.has(id)).sort(),
    [],
    "Every ship JPG must have a verified provenance record",
  );
  assert.deepEqual(
    [...verifiedIds].filter((id) => !assetIds.has(id)).sort(),
    [],
    "Every verified provenance record must have a ship JPG",
  );
  assert.deepEqual(
    [...blockedIds].filter((id) => assetIds.has(id)).sort(),
    [],
    "Blocked ship records must use the designed fallback and have no JPG",
  );
  assert.deepEqual(
    [...verifiedIds].filter((id) => blockedIds.has(id)).sort(),
    [],
    "A ship cannot be both verified and blocked",
  );

  for (const [shipId, blocked] of Object.entries(review.blocked ?? {})) {
    assert.equal(
      blocked.allowMissing,
      true,
      `${shipId} must explicitly allow the designed fallback`,
    );
    for (const field of ["reason", "sourceUrl", "reviewedAt", "reviewer"]) {
      assert.ok(
        typeof blocked[field] === "string" && blocked[field].trim(),
        `${shipId} blocked record must have a non-empty ${field}`,
      );
    }
  }
});

test("verified ship records use an explicit commercial-use license and URL", async () => {
  const review = JSON.parse(
    await readFile(resolve(repoRoot, "data/ship-image-review.json"), "utf8"),
  );

  for (const [shipId, source] of Object.entries(review.verified ?? {})) {
    assert.ok(
      isCommercialShipImageLicense(source.license),
      `${shipId} has disallowed license ${JSON.stringify(source.license)}; allowed values: ${[...COMMERCIAL_SHIP_IMAGE_LICENSES].join(", ")}`,
    );
    assert.ok(
      hasCanonicalShipImageLicenseUrl(source.license, source.licenseUrl),
      `${shipId} must have the canonical licenseUrl for ${JSON.stringify(source.license)}`,
    );
    for (const field of [
      "sourceUrl",
      "sourceName",
      "sourceDescription",
      "author",
      "attribution",
      "reviewedAt",
      "reviewer",
    ]) {
      assert.ok(
        typeof source[field] === "string" && source[field].trim(),
        `${shipId} must have a non-empty ${field}`,
      );
    }
  }
});

test("public attribution is generated from every verified ship record", async () => {
  const [review, attribution] = await Promise.all([
    readFile(resolve(repoRoot, "data/ship-image-review.json"), "utf8").then(
      JSON.parse,
    ),
    readFile(resolve(shipAssetDir, "ATTRIBUTION.txt"), "utf8"),
  ]);
  assert.equal(attribution, renderShipAttribution(review));
});
