#!/usr/bin/env node
/**
 * Audits CruiseKit ship hero assets across the website and mobile app.
 *
 * Checks:
 * - every web/app ship catalog entry has a matching site asset
 * - every site ship JPG is referenced by a ship catalog entry
 * - image files have valid JPG bytes and useful dimensions
 * - known bad images from data/ship-image-review.json block the audit
 * - verified source metadata exists when available
 * - optional live CDN checks for the mobile app image URLs
 *
 * This script intentionally does not try to "prove" image identity from pixels.
 * It creates a contact sheet and requires source/reviewer metadata for that.
 */
import { access, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildShipCodeIndex,
  loadShipCodeReference,
  resolveShipName,
} from "./lib/ship-code-names.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const webShipDataPath = "apps/web/lib/data/ships.ts";
const shipAssetDir = "apps/web/public/assets/ships";
const reviewManifestPath = "data/ship-image-review.json";
const defaultCdnBaseUrl = "https://cruisekit.app/assets/ships";
const siteReferenceDirs = ["apps/web/app", "apps/web/components", "apps/web/lib"];

export function parseArgs(argv) {
  const args = {
    checkCdn: false,
    cdnBaseUrl: defaultCdnBaseUrl,
    failOnUnverified: false,
    mobileRoot: process.env.CRUISEKIT_MOBILE_ROOT ?? null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") {
      continue;
    } else if (arg === "--check-cdn") {
      args.checkCdn = true;
    } else if (arg === "--fail-on-unverified") {
      args.failOnUnverified = true;
    } else if (arg === "--mobile-root") {
      const value = argv[i + 1];
      if (!value || value === "--" || value.startsWith("--")) {
        throw new Error("--mobile-root requires a path.");
      }
      args.mobileRoot = value;
      i += 1;
    } else if (arg === "--cdn-base-url") {
      const value = argv[i + 1];
      if (!value || value === "--" || value.startsWith("--")) {
        throw new Error("--cdn-base-url requires a URL.");
      }
      args.cdnBaseUrl = value;
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

async function fileExists(absPath) {
  try {
    await access(absPath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonIfExists(relPath, fallback) {
  const absPath = resolve(repoRoot, relPath);
  if (!(await fileExists(absPath))) return fallback;
  return JSON.parse(await readFile(absPath, "utf8"));
}

function add(list, severity, id, message, extra = {}) {
  list.push({ severity, id, message, ...extra });
}

function reportPath(absPath) {
  return relative(repoRoot, absPath);
}

function markdownList(findings) {
  if (findings.length === 0) return "- None\n";
  return (
    findings
      .map((finding) => `- ${finding.severity}: ${finding.id} - ${finding.message}`)
      .join("\n") + "\n"
  );
}

function normalizeShip(entry, source) {
  return {
    id: String(entry.id),
    name: String(entry.name),
    cruiseLineId: String(entry.cruiseLineId),
    source,
  };
}

function shipAssetIdForName(name) {
  return String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function loadWebShips() {
  const source = await readFile(resolve(repoRoot, webShipDataPath), "utf8");
  const matches = [
    ...source.matchAll(
      /id:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"\s*,\s*cruiseLineId:\s*"([^"]+)"/gs,
    ),
  ];
  return matches.map((match) =>
    normalizeShip(
      {
        id: match[1],
        name: match[2],
        cruiseLineId: match[3],
      },
      "web",
    ),
  );
}

export async function resolveMobileRoot(explicitRoot) {
  if (explicitRoot) {
    const resolvedRoot = resolve(explicitRoot);
    const shipsPath = resolve(resolvedRoot, "assets/data/ships.json");
    if (await fileExists(shipsPath)) return resolvedRoot;
    throw new Error(
      `Explicit mobile root does not contain assets/data/ships.json: ${resolvedRoot}`,
    );
  }

  const candidates = [
    resolve(repoRoot, "../CruiseKit-Mobile"),
    resolve(repoRoot, "../CruiseKit-Mobile-analytics-tracking"),
  ];

  for (const candidate of candidates) {
    const shipsPath = resolve(candidate, "assets/data/ships.json");
    if (await fileExists(shipsPath)) {
      return candidate;
    }
  }
  return null;
}

export async function loadMobileShips(mobileRoot) {
  if (!mobileRoot) {
    return {
      root: null,
      ships: [],
      available: false,
      sailingCatalogAvailable: false,
      shipCatalogCount: 0,
      sailingCatalogRowCount: 0,
      sailingCatalogShipCount: 0,
      unresolvedBareCodeRows: 0,
      unresolvedBareCodes: {},
    };
  }
  const shipsPath = resolve(mobileRoot, "assets/data/ships.json");
  const shipCatalog = JSON.parse(await readFile(shipsPath, "utf8")).map((ship) =>
    normalizeShip(ship, "mobile"),
  );
  const sailingCatalogPath = resolve(
    mobileRoot,
    "assets/data/sailing_catalog.json",
  );
  if (!(await fileExists(sailingCatalogPath))) {
    return {
      root: mobileRoot,
      ships: shipCatalog,
      available: true,
      sailingCatalogAvailable: false,
      shipCatalogCount: shipCatalog.length,
      sailingCatalogRowCount: 0,
      sailingCatalogShipCount: 0,
      unresolvedBareCodeRows: 0,
      unresolvedBareCodes: {},
    };
  }

  const [payload, reference] = await Promise.all([
    readFile(sailingCatalogPath, "utf8").then(JSON.parse),
    loadShipCodeReference(),
  ]);
  const sailings = Array.isArray(payload) ? payload : payload?.sailings;
  if (!Array.isArray(sailings)) {
    throw new TypeError(
      "Mobile sailing catalog must be an array or an object with a sailings array.",
    );
  }
  const shipCodeIndex = buildShipCodeIndex(reference);
  const sailingShipById = new Map();
  const unresolvedBareCodes = new Map();
  const sailingRows = sailings;
  for (const entry of sailingRows) {
    const mapped = resolveShipName(entry, shipCodeIndex);
    const name = mapped?.shipName ?? String(entry?.shipName ?? "").trim();
    if (!name) continue;
    if (/^[A-Za-z]{2}$/.test(name)) {
      const cruiseLineId = String(
        entry?.cruiseLineId ?? entry?.cruiseLine ?? "unknown",
      )
        .trim()
        .toLowerCase();
      const key = `${cruiseLineId}:${name.toUpperCase()}`;
      unresolvedBareCodes.set(key, (unresolvedBareCodes.get(key) ?? 0) + 1);
      continue;
    }
    const id = shipAssetIdForName(name);
    if (!id || sailingShipById.has(id)) continue;
    sailingShipById.set(
      id,
      normalizeShip(
        {
          id,
          name,
          cruiseLineId: entry?.cruiseLineId ?? entry?.cruiseLine,
        },
        "mobile-sailing-catalog",
      ),
    );
  }

  return {
    root: mobileRoot,
    ships: [...shipCatalog, ...sailingShipById.values()],
    available: true,
    sailingCatalogAvailable: true,
    shipCatalogCount: shipCatalog.length,
    sailingCatalogRowCount: sailingRows.length,
    sailingCatalogShipCount: sailingShipById.size,
    unresolvedBareCodeRows: [...unresolvedBareCodes.values()].reduce(
      (sum, count) => sum + count,
      0,
    ),
    unresolvedBareCodes: Object.fromEntries(
      [...unresolvedBareCodes.entries()].sort(([left], [right]) =>
        left.localeCompare(right),
      ),
    ),
  };
}

function buildCatalog(webShips, mobileShips) {
  const catalog = new Map();
  for (const ship of [...webShips, ...mobileShips]) {
    const existing = catalog.get(ship.id);
    if (existing) {
      existing.sources.add(ship.source);
      if (existing.name !== ship.name) existing.nameMismatches.add(ship.name);
      if (existing.cruiseLineId !== ship.cruiseLineId) {
        existing.lineMismatches.add(ship.cruiseLineId);
      }
    } else {
      catalog.set(ship.id, {
        id: ship.id,
        name: ship.name,
        cruiseLineId: ship.cruiseLineId,
        sources: new Set([ship.source]),
        nameMismatches: new Set(),
        lineMismatches: new Set(),
      });
    }
  }
  return catalog;
}

async function listShipAssets() {
  const absDir = resolve(repoRoot, shipAssetDir);
  const files = await readdir(absDir);
  return files
    .filter((file) => extname(file).toLowerCase() === ".jpg")
    .map((file) => ({
      id: file.replace(/\.jpg$/i, ""),
      file,
      relPath: `${shipAssetDir}/${file}`,
      absPath: resolve(absDir, file),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

async function walkFiles(absDir, files = []) {
  if (!(await fileExists(absDir))) return files;
  for (const entry of await readdir(absDir)) {
    const absPath = resolve(absDir, entry);
    const info = await stat(absPath);
    if (info.isDirectory()) {
      if (entry === ".next" || entry === "node_modules") continue;
      await walkFiles(absPath, files);
    } else if (/\.(tsx?|jsx?|mdx?)$/i.test(entry)) {
      files.push(absPath);
    }
  }
  return files;
}

function lineNumberForIndex(text, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (text.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

async function findHardcodedShipReferences() {
  const files = [];
  for (const dir of siteReferenceDirs) {
    await walkFiles(resolve(repoRoot, dir), files);
  }

  const references = [];
  for (const absPath of files) {
    const text = await readFile(absPath, "utf8");
    for (const match of text.matchAll(/\/assets\/ships\/([a-z0-9-]+\.jpg)/g)) {
      const file = match[1];
      references.push({
        id: file.replace(/\.jpg$/i, ""),
        assetPath: `assets/ships/${file}`,
        sourcePath: absPath.replace(`${repoRoot}/`, ""),
        line: lineNumberForIndex(text, match.index ?? 0),
      });
    }
  }

  return references.sort(
    (a, b) => a.sourcePath.localeCompare(b.sourcePath) || a.line - b.line || a.id.localeCompare(b.id),
  );
}

function imageFormatForBytes(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}

function jpegDimensions(bytes) {
  if (imageFormatForBytes(bytes) !== "jpg") return null;

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

async function inspectImage(asset) {
  const bytes = await readFile(asset.absPath);
  return {
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    format: imageFormatForBytes(bytes),
    dimensions: jpegDimensions(bytes),
  };
}

function verifiedSourceIsComplete(source) {
  return Boolean(source?.sourceUrl && source?.sourceName && source?.reviewedAt && source?.reviewer);
}

async function checkCdnAsset(id, baseUrl) {
  const url = `${baseUrl.replace(/\/+$/, "")}/${id}.jpg`;
  try {
    const response = await fetch(url, { method: "HEAD" });
    return {
      url,
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

function lineLabel(lineId) {
  return lineId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function statusForShip(ship, assetById, reviewManifest) {
  const allowedMissing =
    !assetById.has(ship.id) &&
    reviewManifest.blocked?.[ship.id]?.allowMissing === true;
  if (allowedMissing) return ["fallback"];

  const statuses = [];
  if (!assetById.has(ship.id)) statuses.push("missing");
  if (reviewManifest.blocked?.[ship.id]) statuses.push("blocked");
  if (!reviewManifest.verified?.[ship.id]) statuses.push("unverified");
  return statuses.length > 0 ? statuses : ["verified"];
}

async function writeContactSheet(catalogRows, assetById, reviewManifest) {
  const grouped = new Map();
  for (const ship of catalogRows) {
    const group = grouped.get(ship.cruiseLineId) ?? [];
    group.push(ship);
    grouped.set(ship.cruiseLineId, group);
  }

  const sections = [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([lineId, ships]) => {
      const cards = ships
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((ship) => {
          const asset = assetById.get(ship.id);
          const statuses = statusForShip(ship, assetById, reviewManifest);
          const badgeHtml = statuses
            .map((status) => `<span class="badge ${escapeHtml(status)}">${escapeHtml(status)}</span>`)
            .join("");
          const imageHtml = asset
            ? `<img src="../../${escapeHtml(asset.relPath)}" alt="${escapeHtml(ship.name)}">`
            : `<div class="placeholder">Missing</div>`;

          return `<article class="card ${statuses.map(escapeHtml).join(" ")}">
  <div class="thumb">${imageHtml}</div>
  <div class="meta">
    <h3>${escapeHtml(ship.name)}</h3>
    <p>${escapeHtml(ship.id)}</p>
    <div class="badges">${badgeHtml}</div>
  </div>
</article>`;
        })
        .join("\n");

      return `<section>
  <h2>${escapeHtml(lineLabel(lineId))}</h2>
  <div class="grid">${cards}</div>
</section>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CruiseKit Ship Asset Contact Sheet</title>
  <style>
    body { margin: 0; font-family: Inter, system-ui, sans-serif; color: #10213d; background: #f6f8fb; }
    header { position: sticky; top: 0; z-index: 1; padding: 18px 24px; background: #ffffff; border-bottom: 1px solid #d9e2ec; }
    h1 { margin: 0 0 6px; font-size: 24px; }
    p { margin: 0; color: #5c6b82; }
    section { padding: 24px; }
    h2 { margin: 0 0 14px; font-size: 18px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; }
    .card { overflow: hidden; border: 1px solid #d9e2ec; border-radius: 8px; background: #ffffff; }
    .card.blocked { border-color: #d14545; box-shadow: 0 0 0 2px rgba(209, 69, 69, 0.12); }
    .card.missing { border-style: dashed; }
    .card.fallback { border-style: dashed; border-color: #6f56a8; }
    .thumb { aspect-ratio: 16 / 9; display: grid; place-items: center; background: #d9e2ec; }
    img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .placeholder { color: #6c7b91; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .meta { padding: 10px; }
    h3 { margin: 0 0 4px; font-size: 14px; line-height: 1.25; }
    .meta p { margin-bottom: 8px; font-size: 12px; overflow-wrap: anywhere; }
    .badges { display: flex; flex-wrap: wrap; gap: 4px; }
    .badge { border-radius: 999px; padding: 3px 7px; font-size: 11px; font-weight: 700; background: #edf2f7; color: #475569; }
    .badge.blocked { background: #ffe4e4; color: #a92828; }
    .badge.missing { background: #fff2bf; color: #7a4f00; }
    .badge.fallback { background: #eee8ff; color: #56368a; }
    .badge.unverified { background: #e7f0ff; color: #235aa6; }
    .badge.verified { background: #ddf6e8; color: #11643a; }
  </style>
</head>
<body>
  <header>
    <h1>CruiseKit Ship Asset Contact Sheet</h1>
    <p>Generated by scripts/audit-ship-assets.mjs. Review every blocked, missing, and unverified card before shipping.</p>
  </header>
  ${sections}
</body>
</html>
`;

  await writeFile(resolve(reportDir, "ship-asset-contact-sheet.html"), html);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const [webShips, reviewManifest, assets] = await Promise.all([
    loadWebShips(),
    readJsonIfExists(reviewManifestPath, { verified: {}, blocked: {} }),
    listShipAssets(),
  ]);
  const hardcodedRefs = await findHardcodedShipReferences();
  const mobileRoot = await resolveMobileRoot(args.mobileRoot);
  const mobile = await loadMobileShips(mobileRoot);
  const catalog = buildCatalog(webShips, mobile.ships);
  const assetById = new Map(assets.map((asset) => [asset.id, asset]));

  const blockers = [];
  const warnings = [];
  const info = [];
  const assetDetails = {};
  const missing = [];
  const orphaned = [];
  const unverified = [];
  const blocked = [];
  const hardcodedReferenceIssues = [];

  if (webShips.length === 0) {
    add(blockers, "blocker", "web-catalog", `Could not parse ships from ${webShipDataPath}.`);
  }
  if (!mobile.available) {
    add(
      warnings,
      "warning",
      "mobile-catalog",
      "Mobile ship catalog not found. Pass --mobile-root or set CRUISEKIT_MOBILE_ROOT for app-wide audit.",
    );
  } else if (!mobile.sailingCatalogAvailable) {
    add(
      warnings,
      "warning",
      "mobile-sailing-catalog",
      "Mobile rich sailing catalog not found; sailing-only ship photo coverage was not audited.",
    );
  } else if (mobile.unresolvedBareCodeRows > 0) {
    const details = Object.entries(mobile.unresolvedBareCodes)
      .map(([key, count]) => `${key}=${count}`)
      .join(", ");
    add(
      warnings,
      "warning",
      "mobile-sailing-catalog-bare-codes",
      `${mobile.unresolvedBareCodeRows} rich-catalog row(s) use bare ship codes outside the audited website reference; they were reported instead of silently omitted from sailing-derived ship IDs: ${details}.`,
    );
  }

  for (const ship of catalog.values()) {
    if (ship.nameMismatches.size > 0) {
      add(
        warnings,
        "warning",
        ship.id,
        `Ship name differs across catalogs: ${[ship.name, ...ship.nameMismatches].join(" | ")}`,
      );
    }
    if (ship.lineMismatches.size > 0) {
      add(
        warnings,
        "warning",
        ship.id,
        `Cruise line id differs across catalogs: ${[ship.cruiseLineId, ...ship.lineMismatches].join(" | ")}`,
      );
    }
  }

  for (const ship of [...catalog.values()].sort((a, b) => a.id.localeCompare(b.id))) {
    const asset = assetById.get(ship.id);
    const blockedReview = reviewManifest.blocked?.[ship.id];
    if (!asset) {
      missing.push({
        id: ship.id,
        name: ship.name,
        cruiseLineId: ship.cruiseLineId,
        allowMissing: blockedReview?.allowMissing === true,
      });
      if (blockedReview?.allowMissing === true) {
        blocked.push({
          id: ship.id,
          name: ship.name,
          cruiseLineId: ship.cruiseLineId,
          ...blockedReview,
        });
        add(
          info,
          "info",
          ship.id,
          blockedReview.reason ?? "Ship intentionally uses the designed fallback.",
        );
        continue;
      }
      add(blockers, "blocker", ship.id, `Missing ship asset: ${shipAssetDir}/${ship.id}.jpg`);
      continue;
    }

    const detail = await inspectImage(asset);
    assetDetails[ship.id] = {
      path: asset.relPath,
      ...detail,
    };

    if (detail.format !== "jpg") {
      add(blockers, "blocker", ship.id, `Ship asset has invalid JPG bytes: ${asset.relPath}`);
    }

    if (detail.bytes < 10000) {
      add(warnings, "warning", ship.id, `Ship asset is unusually small (${detail.bytes} bytes): ${asset.relPath}`);
    }

    if (!detail.dimensions) {
      add(warnings, "warning", ship.id, `Could not read JPG dimensions: ${asset.relPath}`);
    } else if (detail.dimensions.width < 320 || detail.dimensions.height < 180) {
      add(
        warnings,
        "warning",
        ship.id,
        `Ship asset is low resolution (${detail.dimensions.width}x${detail.dimensions.height}): ${asset.relPath}`,
      );
    }

    if (blockedReview) {
      blocked.push({ id: ship.id, name: ship.name, cruiseLineId: ship.cruiseLineId, ...blockedReview });
      add(blockers, "blocker", ship.id, blockedReview.reason ?? "Ship asset is manually blocked.");
    }

    const verified = reviewManifest.verified?.[ship.id];
    if (!verified) {
      unverified.push({ id: ship.id, name: ship.name, cruiseLineId: ship.cruiseLineId });
      const message = `Ship asset lacks verified source metadata in ${reviewManifestPath}.`;
      add(args.failOnUnverified ? blockers : warnings, args.failOnUnverified ? "blocker" : "warning", ship.id, message);
    } else if (!verifiedSourceIsComplete(verified)) {
      add(
        warnings,
        "warning",
        ship.id,
        `Verified source metadata is incomplete in ${reviewManifestPath}.`,
      );
    }
  }

  for (const asset of assets) {
    if (!catalog.has(asset.id)) {
      orphaned.push({ id: asset.id, path: asset.relPath });
      add(warnings, "warning", asset.id, `Ship asset has no matching web/app catalog entry: ${asset.relPath}`);
    }
  }

  for (const reference of hardcodedRefs) {
    if (!assetById.has(reference.id)) {
      hardcodedReferenceIssues.push(reference);
      add(
        blockers,
        "blocker",
        `${reference.sourcePath}:${reference.line}`,
        `Hardcoded site ship image points to a missing asset: /${reference.assetPath}`,
      );
    } else if (!catalog.has(reference.id)) {
      hardcodedReferenceIssues.push(reference);
      add(
        warnings,
        "warning",
        `${reference.sourcePath}:${reference.line}`,
        `Hardcoded site ship image has no matching web/app catalog entry: /${reference.assetPath}`,
      );
    }
  }

  let cdnResults = [];
  if (args.checkCdn) {
    const ships = [...catalog.values()]
      .filter(
        (ship) =>
          assetById.has(ship.id) || reviewManifest.blocked?.[ship.id]?.allowMissing !== true,
      )
      .sort((a, b) => a.id.localeCompare(b.id));
    cdnResults = await mapWithConcurrency(ships, 8, (ship) =>
      checkCdnAsset(ship.id, args.cdnBaseUrl),
    );
    for (let i = 0; i < ships.length; i += 1) {
      const ship = ships[i];
      const result = cdnResults[i];
      if (!result.ok) {
        add(
          blockers,
          "blocker",
          ship.id,
          `Live CDN ship asset failed: ${result.status ?? result.error} ${result.url}`,
        );
      } else if (!String(result.contentType ?? "").startsWith("image/")) {
        add(
          blockers,
          "blocker",
          ship.id,
          `Live CDN ship asset is not an image (${result.contentType}): ${result.url}`,
        );
      }
    }
  }

  const catalogRows = [...catalog.values()].map((ship) => ({
    id: ship.id,
    name: ship.name,
    cruiseLineId: ship.cruiseLineId,
    sources: [...ship.sources].sort(),
  }));

  await mkdir(reportDir, { recursive: true });
  await writeContactSheet(catalogRows, assetById, reviewManifest);

  const report = {
    generatedAt: new Date().toISOString(),
    inputs: {
      webShipDataPath,
      mobileShipDataPath: mobile.root
        ? reportPath(resolve(mobile.root, "assets/data/ships.json"))
        : null,
      mobileSailingCatalogPath:
        mobile.root && mobile.sailingCatalogAvailable
          ? reportPath(resolve(mobile.root, "assets/data/sailing_catalog.json"))
          : null,
      shipAssetDir,
      reviewManifestPath,
      cdnBaseUrl: args.checkCdn ? args.cdnBaseUrl : null,
    },
    counts: {
      webCatalogShips: webShips.length,
      mobileCatalogShips: mobile.shipCatalogCount,
      mobileSailingCatalogRows: mobile.sailingCatalogRowCount,
      mobileSailingCatalogShips: mobile.sailingCatalogShipCount,
      mobileSailingCatalogUnresolvedBareCodeRows:
        mobile.unresolvedBareCodeRows,
      expectedShipIds: catalog.size,
      siteShipAssets: assets.length,
      missingAssets: missing.length,
      orphanedAssets: orphaned.length,
      blockedAssets: blocked.length,
      unverifiedAssets: unverified.length,
      cdnChecked: cdnResults.length,
      cdnFailures: cdnResults.filter((result) => !result.ok).length,
      hardcodedSiteReferences: hardcodedRefs.length,
      hardcodedSiteReferenceIssues: hardcodedReferenceIssues.length,
    },
    missing,
    orphaned,
    blocked,
    unverified,
    assetDetails,
    hardcodedSiteReferences: hardcodedRefs,
    hardcodedReferenceIssues,
    mobileSailingCatalogUnresolvedBareCodes: mobile.unresolvedBareCodes,
    cdnResults,
    blockers,
    warnings,
    info,
  };

  const missingMarkdown =
    missing.length === 0
      ? "- None"
      : missing
          .map((ship) => `- ${ship.id} (${ship.name}, ${lineLabel(ship.cruiseLineId)})`)
          .join("\n");
  const blockedMarkdown =
    blocked.length === 0
      ? "- None"
      : blocked.map((ship) => `- ${ship.id} (${ship.name}) - ${ship.reason}`).join("\n");
  const orphanedMarkdown =
    orphaned.length === 0
      ? "- None"
      : orphaned.map((asset) => `- ${asset.id} - ${asset.path}`).join("\n");
  const hardcodedMarkdown =
    hardcodedRefs.length === 0
      ? "- None"
      : hardcodedRefs
          .map((ref) => `- ${ref.sourcePath}:${ref.line} - /${ref.assetPath}`)
          .join("\n");

  const markdown = `# CruiseKit Ship Asset Audit

Generated: ${report.generatedAt}

## Scope

- Site assets: \`${shipAssetDir}\`
- Web ship catalog: \`${webShipDataPath}\`
- Mobile ship catalog: ${mobile.root ? `\`${reportPath(resolve(mobile.root, "assets/data/ships.json"))}\`` : "not found"}
- Mobile rich sailing catalog: ${
    mobile.root && mobile.sailingCatalogAvailable
      ? `\`${reportPath(resolve(mobile.root, "assets/data/sailing_catalog.json"))}\``
      : "not found"
  }
- Review manifest: \`${reviewManifestPath}\`
- Contact sheet: \`data/reports/ship-asset-contact-sheet.html\`

## Counts

| Metric | Count |
| --- | ---: |
| Web catalog ships | ${report.counts.webCatalogShips} |
| Mobile catalog ships | ${report.counts.mobileCatalogShips} |
| Mobile rich-catalog rows | ${report.counts.mobileSailingCatalogRows} |
| Mobile rich-catalog resolved ship IDs | ${report.counts.mobileSailingCatalogShips} |
| Mobile rich-catalog unresolved bare-code rows | ${report.counts.mobileSailingCatalogUnresolvedBareCodeRows} |
| Expected ship IDs | ${report.counts.expectedShipIds} |
| Site ship JPG assets | ${report.counts.siteShipAssets} |
| Missing assets | ${report.counts.missingAssets} |
| Orphaned assets | ${report.counts.orphanedAssets} |
| Manually blocked assets | ${report.counts.blockedAssets} |
| Assets without verified source metadata | ${report.counts.unverifiedAssets} |
| CDN assets checked | ${report.counts.cdnChecked} |
| CDN failures | ${report.counts.cdnFailures} |
| Hardcoded site ship references | ${report.counts.hardcodedSiteReferences} |
| Hardcoded site reference issues | ${report.counts.hardcodedSiteReferenceIssues} |

## Missing Ship Assets

${missingMarkdown}

## Manually Blocked Assets

${blockedMarkdown}

## Orphaned Site Assets

${orphanedMarkdown}

## Hardcoded Site Ship References

${hardcodedMarkdown}

## Blockers

${markdownList(blockers)}
## Warnings

${markdownList(warnings)}
## Info

${markdownList(info)}
`;
  const normalizedMarkdown = `${markdown.trimEnd()}\n`;

  await Promise.all([
    writeFile(resolve(reportDir, "latest-ship-asset-audit.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-ship-asset-audit.md"), normalizedMarkdown),
  ]);

  console.log(
    `Ship asset audit: ${blockers.length} blocker(s), ${warnings.length} warning(s), ${info.length} info.`,
  );
  console.log("Report written to data/reports/latest-ship-asset-audit.md");
  console.log("Contact sheet written to data/reports/ship-asset-contact-sheet.html");
  if (blockers.length > 0) process.exit(1);
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
