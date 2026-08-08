import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const shipAssetDir = resolve(repoRoot, "apps/web/public/assets/ships");
const addedShipIds = [
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
];
const fallbackShipIds = ["brilliant-lady", "norwegian-aura"];

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

test("ten licensed hero additions meet the JPEG dimensions and size budget", async () => {
  for (const shipId of addedShipIds) {
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

  for (const shipId of [...addedShipIds, "celebrity-ascent"]) {
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
