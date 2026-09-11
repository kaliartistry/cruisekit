import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, expect, it } from "vitest";
import { CRUISE_LINE_COSTS } from "../lib/data/cruise-costs";
import { MATERIAL_PRICE_FACTS } from "../lib/data/price-facts";

/**
 * Exports the calculator's cruise-line cost table (already resolved against
 * PRICE_FACTS) as the JSON the CruiseKit mobile app bundles at
 * assets/data/cruise_costs.json, so the app never carries a second,
 * hand-maintained copy of the same numbers.
 *
 * Runs only when EXPORT_MOBILE_CRUISE_COSTS points at the output path:
 *   pnpm --filter web run export:mobile-cruise-costs
 */
const target = process.env.EXPORT_MOBILE_CRUISE_COSTS;

describe("mobile cruise-cost export", () => {
  it.skipIf(!target)("writes cruise_costs.json for the mobile app", () => {
    const latestRetrieval = MATERIAL_PRICE_FACTS.map((fact) => fact.retrievedAt)
      .sort()
      .at(-1)!;
    const out: Record<string, unknown> = {};
    for (const [id, costs] of Object.entries(CRUISE_LINE_COSTS)) {
      out[id] = { ...costs, lastUpdated: latestRetrieval };
    }
    mkdirSync(dirname(target!), { recursive: true });
    writeFileSync(target!, `${JSON.stringify(out, null, 2)}\n`);
    expect(Object.keys(out)).toHaveLength(Object.keys(CRUISE_LINE_COSTS).length);
  });
});
