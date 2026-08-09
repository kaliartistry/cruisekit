import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import {
  loadMobileShips,
  parseArgs,
  resolveMobileRoot,
} from "../audit-ship-assets.mjs";
import {
  buildShipCodeIndex,
  loadShipCodeReference,
  normalizeSailingCatalogShipNames,
} from "../lib/ship-code-names.mjs";

test("authoritative reference resolves the five reported ship codes", async () => {
  const reference = await loadShipCodeReference();
  const index = buildShipCodeIndex(reference);

  assert.equal(index.get("virgin-voyages:RS")?.shipName, "Resilient Lady");
  assert.equal(index.get("celebrity:AX")?.shipName, "Celebrity Apex");
  assert.equal(
    index.get("celebrity:CS")?.shipName,
    "Celebrity Constellation",
  );
  assert.equal(index.get("celebrity:EC")?.shipName, "Celebrity Eclipse");
  assert.equal(index.get("celebrity:EG")?.shipName, "Celebrity Edge");
});

test("all 110 observed rows normalize without changing shipCode", async () => {
  const reference = await loadShipCodeReference();
  const sourceRows = reference.mappings.flatMap((mapping) =>
    Array.from({ length: mapping.observedAffectedRows }, (_, index) => ({
      id: `${mapping.cruiseLineId}-${mapping.shipCode}-${index}`,
      cruiseLineId: mapping.cruiseLineId,
      shipCode: mapping.shipCode,
      shipName: mapping.shipCode,
    })),
  );
  const { payload, stats } = normalizeSailingCatalogShipNames(
    { sailings: sourceRows },
    buildShipCodeIndex(reference),
  );

  assert.equal(stats.changed, 110);
  assert.deepEqual(stats.changedByMapping, {
    "celebrity:AX": 7,
    "celebrity:CS": 5,
    "celebrity:EC": 5,
    "celebrity:EG": 2,
    "virgin-voyages:RS": 91,
  });

  const targetCodes = new Set(["AX", "CS", "EC", "EG", "RS"]);
  const normalizedRows = payload.sailings.filter((row) =>
    targetCodes.has(row.shipCode),
  );
  assert.equal(normalizedRows.length, 110);
  assert.ok(
    normalizedRows.every(
      (row) => row.shipCode !== row.shipName && !targetCodes.has(row.shipName),
    ),
  );

  const secondPass = normalizeSailingCatalogShipNames(
    payload,
    buildShipCodeIndex(reference),
  );
  assert.equal(secondPass.stats.changed, 0);
});

test("mobile rich-catalog audit reports unresolved codes and honors an explicit root", async () => {
  const mobileRoot = await mkdtemp(resolve(tmpdir(), "cruisekit-mobile-audit-"));
  const dataDir = resolve(mobileRoot, "assets/data");
  await mkdir(dataDir, { recursive: true });

  try {
    await Promise.all([
      writeFile(
        resolve(dataDir, "ships.json"),
        JSON.stringify([
          {
            id: "celebrity-ascent",
            name: "Celebrity Ascent",
            cruiseLineId: "celebrity",
          },
        ]),
      ),
      writeFile(
        resolve(dataDir, "sailing_catalog.json"),
        JSON.stringify([
          {
            cruiseLineId: "virgin-voyages",
            shipCode: "RS",
            shipName: "RS",
          },
          {
            cruiseLineId: "test-line",
            shipName: "Custom Ship",
          },
          { cruiseLineId: "celebrity", shipCode: "AT", shipName: "AT" },
          {
            cruiseLineId: "virgin-voyages",
            shipCode: "BR",
            shipName: "BR",
          },
        ]),
      ),
    ]);

    assert.equal(await resolveMobileRoot(mobileRoot), mobileRoot);
    const mobile = await loadMobileShips(mobileRoot);
    assert.equal(mobile.shipCatalogCount, 1);
    assert.equal(mobile.sailingCatalogRowCount, 4);
    assert.equal(mobile.sailingCatalogShipCount, 2);
    assert.equal(mobile.unresolvedBareCodeRows, 2);
    assert.deepEqual(mobile.unresolvedBareCodes, {
      "celebrity:AT": 1,
      "virgin-voyages:BR": 1,
    });
    assert.ok(mobile.ships.some((ship) => ship.id === "resilient-lady"));
    assert.ok(mobile.ships.some((ship) => ship.id === "custom-ship"));
  } finally {
    await rm(mobileRoot, { recursive: true, force: true });
  }

  await assert.rejects(
    resolveMobileRoot(resolve(tmpdir(), "cruisekit-missing-mobile-root")),
    /does not contain assets\/data\/ships\.json/,
  );
});

test("ship asset audit rejects options with missing values", () => {
  assert.throws(() => parseArgs(["--mobile-root"]), /requires a path/);
  assert.throws(
    () => parseArgs(["--mobile-root", "--check-cdn"]),
    /requires a path/,
  );
  assert.throws(() => parseArgs(["--cdn-base-url"]), /requires a URL/);
});
