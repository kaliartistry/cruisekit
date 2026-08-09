import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const defaultShipCodeReferencePath = resolve(
  repoRoot,
  "data/reference/ship-code-names.json",
);

function normalizedLineId(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizedShipCode(value) {
  return String(value ?? "").trim().toUpperCase();
}

function mappingKey(cruiseLineId, shipCode) {
  return `${normalizedLineId(cruiseLineId)}:${normalizedShipCode(shipCode)}`;
}

export async function loadShipCodeReference(
  path = defaultShipCodeReferencePath,
) {
  return JSON.parse(await readFile(path, "utf8"));
}

export function buildShipCodeIndex(reference) {
  if (!reference || !Array.isArray(reference.mappings)) {
    throw new TypeError("Ship-code reference must contain a mappings array.");
  }

  const index = new Map();
  for (const mapping of reference.mappings) {
    const cruiseLineId = normalizedLineId(mapping.cruiseLineId);
    const shipCode = normalizedShipCode(mapping.shipCode);
    const shipName = String(mapping.shipName ?? "").trim();
    if (!cruiseLineId || !/^[A-Z]{2}$/.test(shipCode) || !shipName) {
      throw new TypeError(
        `Invalid ship-code mapping: ${JSON.stringify(mapping)}`,
      );
    }

    const key = mappingKey(cruiseLineId, shipCode);
    if (index.has(key)) {
      throw new TypeError(`Duplicate ship-code mapping: ${key}`);
    }
    index.set(key, { ...mapping, cruiseLineId, shipCode, shipName });
  }
  return index;
}

export function resolveShipName(entry, index) {
  const cruiseLineId = normalizedLineId(
    entry?.cruiseLineId ?? entry?.cruiseLine,
  );
  const currentShipName = String(entry?.shipName ?? "").trim();
  const explicitCode = normalizedShipCode(entry?.shipCode);
  const shipCode = explicitCode || normalizedShipCode(currentShipName);
  const mapping = index.get(mappingKey(cruiseLineId, shipCode));

  if (!mapping) return null;

  const shipNameIsCode =
    currentShipName.length === 0 ||
    normalizedShipCode(currentShipName) === mapping.shipCode;
  if (!shipNameIsCode || currentShipName === mapping.shipName) return null;

  return mapping;
}

export function normalizeSailingCatalogShipNames(payload, index) {
  const sailings = Array.isArray(payload) ? payload : payload?.sailings;
  if (!Array.isArray(sailings)) {
    throw new TypeError(
      "Sailing catalog must be an array or an object with a sailings array.",
    );
  }

  const changedByMapping = new Map();
  const unresolvedBareCodes = new Map();
  const normalizedSailings = sailings.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      return entry;
    }

    const mapping = resolveShipName(entry, index);
    if (mapping) {
      const key = mappingKey(mapping.cruiseLineId, mapping.shipCode);
      changedByMapping.set(key, (changedByMapping.get(key) ?? 0) + 1);
      return { ...entry, shipName: mapping.shipName };
    }

    const cruiseLineId = normalizedLineId(
      entry.cruiseLineId ?? entry.cruiseLine,
    );
    const shipName = normalizedShipCode(entry.shipName);
    if (/^[A-Z]{2}$/.test(shipName)) {
      const key = mappingKey(cruiseLineId, shipName);
      unresolvedBareCodes.set(key, (unresolvedBareCodes.get(key) ?? 0) + 1);
    }
    return entry;
  });

  const changed = [...changedByMapping.values()].reduce(
    (sum, count) => sum + count,
    0,
  );
  const unresolved = [...unresolvedBareCodes.values()].reduce(
    (sum, count) => sum + count,
    0,
  );

  return {
    payload: Array.isArray(payload)
      ? normalizedSailings
      : { ...payload, sailings: normalizedSailings },
    stats: {
      total: sailings.length,
      changed,
      changedByMapping: Object.fromEntries(
        [...changedByMapping.entries()].sort(([left], [right]) =>
          left.localeCompare(right),
        ),
      ),
      unresolvedBareCodes: unresolved,
      unresolvedByCode: Object.fromEntries(
        [...unresolvedBareCodes.entries()].sort(([left], [right]) =>
          left.localeCompare(right),
        ),
      ),
    },
  };
}
