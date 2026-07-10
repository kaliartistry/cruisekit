#!/usr/bin/env node
import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const rootDir = process.cwd();
const portsSourcePath = path.join(rootDir, 'apps/web/lib/data/ports.ts');
const extraPortsPath = path.join(rootDir, 'scripts/static-map-extra-ports.json');
const outputDir = path.join(rootDir, 'apps/web/public/assets/maps/static');
const width = 2400;
const height = 1560;
const openFreeMapStyleUrl = 'https://tiles.openfreemap.org/styles/positron';
const mapLibreScriptUrl = 'https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js';
const mapLibreCssUrl = 'https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css';
const args = process.argv.slice(2);
const shouldRenderPorts = !args.includes('--regions-only');
const shouldRenderRegions = !args.includes('--ports-only') && !args.some((arg) => arg.startsWith('--only-port='));
const onlyPortSlugs = args
  .filter((arg) => arg.startsWith('--only-port='))
  .map((arg) => arg.split('=').at(1))
  .filter(Boolean);

const regionAssets = [
  { id: 'all', label: 'CruiseKit Port Atlas', filter: () => true },
  { id: 'western', label: 'Western Caribbean', filter: (port) => port.region === 'western' },
  { id: 'eastern', label: 'Eastern Caribbean', filter: (port) => port.region === 'eastern' },
  { id: 'southern', label: 'Southern Caribbean', filter: (port) => port.region === 'southern' },
  { id: 'bahamas', label: 'Bahamas', filter: (port) => port.region === 'bahamas' },
  { id: 'private-island', label: 'Private Islands', filter: (port) => port.region === 'private-island' },
  { id: 'homeport', label: 'Homeports', filter: (port) => port.region === 'homeport' },
  { id: 'alaska', label: 'Alaska', filter: (port) => port.region === 'alaska' },
  { id: 'europe-med', label: 'Mediterranean', filter: (port) => port.region === 'europe-med' },
  { id: 'europe-north', label: 'Northern Europe', filter: (port) => port.region === 'europe-north' },
  { id: 'mexico-pacific', label: 'Pacific Mexico & West Coast', filter: (port) => port.region === 'mexico-pacific' },
  { id: 'canada-new-england', label: 'Canada & New England', filter: (port) => port.region === 'canada-new-england' },
  { id: 'asia', label: 'Asia-Pacific', filter: (port) => port.region === 'asia' },
];

const palette = {
  water: '#BFE4EA',
  waterDeep: '#9BD2DD',
  land: '#EDF0E4',
  landAlt: '#E5EBD9',
  park: '#BFE3C5',
  road: '#FFFFFF',
  roadMajor: '#D8C9AA',
  route: '#78C7B8',
  label: '#637083',
  labelDark: '#243349',
  border: '#DCE3E8',
  harbor: '#A7DAE3',
};

function parsePorts(source) {
  const matches = source.matchAll(
    /\{\s*slug: "([^"]+)",[\s\S]*?name: "([^"]+)",[\s\S]*?country: "([^"]+)",[\s\S]*?coordinates: \{ lat: ([0-9.-]+), lng: ([0-9.-]+) \},[\s\S]*?walkabilityRating: ([0-9.]+),[\s\S]*?isTenderPort: (true|false),[\s\S]*?region: "([^"]+)",/g,
  );
  return [...matches].map((match) => ({
    slug: match[1],
    name: match[2],
    country: match[3],
    lat: Number(match[4]),
    lng: Number(match[5]),
    walkabilityRating: Number(match[6]),
    isTenderPort: match[7] === 'true',
    region: match[8],
  }));
}

function boundsFor(ports, padding = 0.12) {
  const valid = ports.filter((port) => Number.isFinite(port.lat) && Number.isFinite(port.lng));
  const lats = valid.map((port) => port.lat);
  const lngs = valid.map((port) => port.lng);
  let minLat = Math.min(...lats);
  let maxLat = Math.max(...lats);
  let minLng = Math.min(...lngs);
  let maxLng = Math.max(...lngs);

  if (!Number.isFinite(minLat) || !Number.isFinite(minLng)) {
    minLat = 18;
    maxLat = 26;
    minLng = -88;
    maxLng = -62;
  }

  if (Math.abs(maxLat - minLat) < 0.6) {
    minLat -= 0.3;
    maxLat += 0.3;
  }
  if (Math.abs(maxLng - minLng) < 0.6) {
    minLng -= 0.3;
    maxLng += 0.3;
  }

  const latPad = (maxLat - minLat) * padding;
  const lngPad = (maxLng - minLng) * padding;
  return {
    minLat: minLat - latPad,
    maxLat: maxLat + latPad,
    minLng: minLng - lngPad,
    maxLng: maxLng + lngPad,
  };
}

function project(bounds, lat, lng, inset = 58) {
  const usableWidth = width - inset * 2;
  const usableHeight = height - inset * 2;
  const x = inset + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * usableWidth;
  const y = inset + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * usableHeight;
  return { x, y };
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function stableNumber(seed, index, min, max) {
  let value = 0;
  for (const char of `${seed}:${index}`) {
    value = (value * 31 + char.charCodeAt(0)) % 9973;
  }
  return min + (value / 9973) * (max - min);
}

function blobPath(cx, cy, rx, ry, seed) {
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 12;
    const radius = stableNumber(seed, index, 0.78, 1.12);
    return {
      x: cx + Math.cos(angle) * rx * radius,
      y: cy + Math.sin(angle) * ry * radius,
    };
  });
  const [first, ...rest] = points;
  return `M ${first.x.toFixed(1)} ${first.y.toFixed(1)} ${rest
    .map((point) => `L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ')} Z`;
}

function baseDefs() {
  return `
  <defs>
    <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.water}"/>
      <stop offset="1" stop-color="${palette.waterDeep}"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#23445A" flood-opacity="0.10"/>
    </filter>
  </defs>`;
}

function drawGrid(bounds) {
  const lines = [];
  for (let i = 0; i <= 8; i += 1) {
    const x = 58 + ((width - 116) * i) / 8;
    lines.push(`<line x1="${x.toFixed(1)}" y1="58" x2="${x.toFixed(1)}" y2="${height - 58}" stroke="#ffffff" stroke-opacity="0.22" stroke-width="1"/>`);
  }
  for (let i = 0; i <= 5; i += 1) {
    const y = 58 + ((height - 116) * i) / 5;
    lines.push(`<line x1="58" y1="${y.toFixed(1)}" x2="${width - 58}" y2="${y.toFixed(1)}" stroke="#ffffff" stroke-opacity="0.22" stroke-width="1"/>`);
  }
  const label = `${bounds.minLat.toFixed(1)}° to ${bounds.maxLat.toFixed(1)}°`;
  lines.push(`<text x="${width - 72}" y="${height - 32}" fill="#ffffff" fill-opacity="0.58" font-size="24" font-family="Helvetica" text-anchor="end">${label}</text>`);
  return lines.join('\n');
}

function drawOverviewLand(ports, bounds, assetId) {
  const groups = new Map();
  for (const port of ports) {
    const bucket = assetId === 'all' ? port.region : `${Math.round(port.lat)}:${Math.round(port.lng)}`;
    const list = groups.get(bucket) ?? [];
    list.push(port);
    groups.set(bucket, list);
  }

  const land = [];
  let index = 0;
  for (const [bucket, list] of groups) {
    const avgLat = list.reduce((sum, port) => sum + port.lat, 0) / list.length;
    const avgLng = list.reduce((sum, port) => sum + port.lng, 0) / list.length;
    const center = project(bounds, avgLat, avgLng, 46);
    const rx = Math.max(80, Math.min(220, 72 + list.length * 13));
    const ry = Math.max(52, Math.min(150, 44 + list.length * 8));
    land.push(`<path d="${blobPath(center.x, center.y, rx, ry, bucket)}" fill="${index % 2 ? palette.landAlt : palette.land}" stroke="${palette.border}" stroke-width="2" filter="url(#softShadow)"/>`);
    if (list.length > 2) {
      land.push(`<path d="${blobPath(center.x + rx * 0.18, center.y - ry * 0.1, rx * 0.35, ry * 0.32, `${bucket}:park`)}" fill="${palette.park}" fill-opacity="0.55"/>`);
    }
    index += 1;
  }
  return land.join('\n');
}

function drawOverviewRoadTexture(ports, bounds) {
  const roads = [];
  for (let i = 0; i < ports.length; i += 1) {
    const point = project(bounds, ports[i].lat, ports[i].lng, 46);
    const x1 = point.x - stableNumber(ports[i].slug, 1, 35, 82);
    const y1 = point.y + stableNumber(ports[i].slug, 2, -26, 38);
    const x2 = point.x + stableNumber(ports[i].slug, 3, 50, 120);
    const y2 = point.y + stableNumber(ports[i].slug, 4, -30, 36);
    roads.push(`<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${point.x.toFixed(1)} ${(point.y - 28).toFixed(1)} ${(point.x + 28).toFixed(1)} ${(point.y + 30).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${palette.road}" stroke-width="5" stroke-linecap="round" stroke-opacity="0.72"/>`);
    if (i % 3 === 0) {
      roads.push(`<path d="M ${(point.x - 42).toFixed(1)} ${(point.y - 20).toFixed(1)} L ${(point.x + 54).toFixed(1)} ${(point.y + 32).toFixed(1)}" fill="none" stroke="${palette.roadMajor}" stroke-width="3" stroke-linecap="round" stroke-opacity="0.72"/>`);
    }
  }
  return roads.join('\n');
}

function renderOverviewSvg({ id, label, ports }) {
  const bounds = boundsFor(ports, id === 'all' ? 0.18 : 0.28);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(label)} static cruise map">
${baseDefs()}
<rect width="${width}" height="${height}" fill="${palette.water}"/>
${drawGrid(bounds)}
${drawOverviewLand(ports, bounds, id)}
${drawOverviewRoadTexture(ports, bounds)}
<path d="M 86 ${height - 126} C 250 ${height - 230} 362 ${height - 162} 520 ${height - 255} S 840 ${height - 346} 1105 ${height - 232}" fill="none" stroke="#FFFFFF" stroke-opacity="0.42" stroke-width="5" stroke-dasharray="18 18" stroke-linecap="round"/>
<text x="56" y="64" fill="${palette.labelDark}" font-size="34" font-family="Helvetica" font-weight="800">${escapeXml(label)}</text>
<text x="56" y="102" fill="${palette.label}" font-size="22" font-family="Helvetica">Static CruiseKit planning basemap</text>
<text x="${width - 56}" y="${height - 56}" fill="${palette.label}" font-size="20" font-family="Helvetica" text-anchor="end">CruiseKit static map</text>
</svg>`;
}

function renderPortSvg(port) {
  const label = `${port.name} port snapshot`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(label)}">
${baseDefs()}
<rect width="${width}" height="${height}" fill="${palette.water}"/>
<path d="M -30 500 C 135 390 228 470 348 320 C 470 168 620 156 775 235 C 918 307 980 240 1230 285 L 1230 830 L -30 830 Z" fill="${palette.land}" stroke="${palette.border}" stroke-width="3" filter="url(#softShadow)"/>
<path d="M 72 600 C 230 535 338 590 514 500 C 676 418 765 436 922 384 C 1030 348 1112 352 1200 306" fill="none" stroke="${palette.roadMajor}" stroke-width="9" stroke-linecap="round" stroke-opacity="0.82"/>
<path d="M 170 666 C 314 595 452 616 594 550 S 880 500 1060 444" fill="none" stroke="${palette.road}" stroke-width="16" stroke-linecap="round"/>
<path d="M 220 706 L 295 602 M 374 648 L 428 548 M 530 612 L 590 510 M 706 564 L 780 460 M 880 512 L 930 420" fill="none" stroke="${palette.road}" stroke-width="9" stroke-linecap="round" stroke-opacity="0.86"/>
<path d="M 110 448 C 180 420 260 430 315 472 S 412 550 530 508" fill="none" stroke="${palette.route}" stroke-width="6" stroke-linecap="round" stroke-dasharray="16 14"/>
<path d="${blobPath(835, 296, 74, 46, `${port.slug}:park`)}" fill="${palette.park}" fill-opacity="0.74"/>
<path d="M 110 445 L 64 390 L 136 390 Z" fill="${palette.harbor}" stroke="#8BCAD5" stroke-width="3"/>
<text x="56" y="64" fill="${palette.labelDark}" font-size="34" font-family="Helvetica" font-weight="800">${escapeXml(port.name)}</text>
<text x="56" y="102" fill="${palette.label}" font-size="22" font-family="Helvetica">${escapeXml(port.country)} · ${escapeXml(port.region)}</text>
<text x="90" y="372" fill="${palette.label}" font-size="20" font-family="Helvetica">Cruise pier area</text>
<text x="806" y="284" fill="${palette.label}" font-size="20" font-family="Helvetica">Town / beach area</text>
<text x="${width - 56}" y="${height - 56}" fill="${palette.label}" font-size="20" font-family="Helvetica" text-anchor="end">CruiseKit static map</text>
</svg>`;
}

function portDetailZoom(port) {
  const privateIslandLikePorts = new Set([
    'cococay',
    'celebration-key',
    'great-stirrup-cay',
    'half-moon-cay',
    'harvest-caye',
    'labadee',
    'ocean-cay',
    'princess-cays',
  ]);
  const majorHomeports = new Set([
    'barcelona',
    'fort-lauderdale',
    'galveston',
    'hamburg',
    'lisbon',
    'los-angeles',
    'manhattan',
    'miami',
    'mobile',
    'new-orleans',
    'norfolk',
    'port-canaveral',
    'san-diego',
    'san-francisco',
    'seattle',
    'shanghai',
    'southampton',
    'sydney',
    'tampa',
    'vancouver',
    'yokohama',
  ]);

  if (privateIslandLikePorts.has(port.slug) || port.region === 'private-island') {
    return 14.85;
  }
  if (majorHomeports.has(port.slug) || port.region === 'homeport') {
    return 14.25;
  }
  if (port.isTenderPort) {
    return 14.3;
  }
  return 14.6;
}

async function convertAsset(svgPath, pngPath, webpPath) {
  await execFileAsync('magick', [
    '-font',
    '/System/Library/Fonts/Supplemental/Arial.ttf',
    svgPath,
    '-resize',
    `${width}x${height}`,
    pngPath,
  ]);
  await execFileAsync('magick', [pngPath, '-quality', '86', webpPath]);
}

async function writeAssetSet(fileBase, svg) {
  const svgPath = path.join(outputDir, `${fileBase}.svg`);
  const pngPath = path.join(outputDir, `${fileBase}.png`);
  const webpPath = path.join(outputDir, `${fileBase}.webp`);
  await writeFile(svgPath, svg);
  return { svgPath, pngPath, webpPath };
}

function mapShellHtml() {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <link href="${mapLibreCssUrl}" rel="stylesheet" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
        background: ${palette.water};
      }
      #frame, #map {
        position: relative;
        width: ${width}px;
        height: ${height}px;
      }
      #map {
        background: ${palette.water};
      }
      #tint {
        position: absolute;
        inset: 0;
        background: rgba(191, 228, 234, 0.18);
        mix-blend-mode: multiply;
        pointer-events: none;
      }
      #attribution {
        position: absolute;
        right: 14px;
        bottom: 10px;
        padding: 4px 7px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.72);
        color: #536173;
        font: 12px/1.2 Arial, sans-serif;
        pointer-events: none;
      }
      .maplibregl-ctrl {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <div id="frame">
      <div id="map"></div>
      <div id="tint"></div>
      <div id="attribution">OpenFreeMap © OpenMapTiles · Data © OpenStreetMap contributors</div>
    </div>
    <script src="${mapLibreScriptUrl}"></script>
    <script>
      window.renderCruiseKitMap = (options) => new Promise((resolve) => {
        if (window.currentMap) {
          window.currentMap.remove();
          window.currentMap = null;
        }
        const map = new maplibregl.Map({
          container: 'map',
          style: options.styleUrl,
          center: options.center || [-78.5, 21.8],
          zoom: options.zoom || 4,
          interactive: false,
          attributionControl: false,
          preserveDrawingBuffer: true,
        });
        window.currentMap = map;
        const finish = () => window.setTimeout(resolve, 450);
        const timeout = window.setTimeout(finish, 14000);
        map.on('error', (event) => {
          console.warn(event && event.error ? event.error.message : 'Map render warning');
        });
        map.once('load', () => {
          if (options.bounds) {
            map.fitBounds(
              [
                [options.bounds.minLng, options.bounds.minLat],
                [options.bounds.maxLng, options.bounds.maxLat],
              ],
              { padding: options.padding || 72, duration: 0 },
            );
          }
          map.resize();
          map.once('idle', () => {
            window.clearTimeout(timeout);
            finish();
          });
        });
      });
    </script>
  </body>
</html>`;
}

async function createOpenFreeMapRenderer() {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--ignore-gpu-blocklist',
      '--enable-unsafe-swiftshader',
      '--disable-gpu-sandbox',
      '--use-gl=swiftshader',
    ],
  });
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  page.setDefaultTimeout(45000);
  await page.setContent(mapShellHtml(), { waitUntil: 'domcontentloaded' });

  return {
    async render(options) {
      await page.evaluate(
        (renderOptions) => window.renderCruiseKitMap(renderOptions),
        { ...options, styleUrl: openFreeMapStyleUrl },
      );
      await page.locator('#frame').screenshot({ path: options.pngPath });
      await execFileAsync('magick', [options.pngPath, '-quality', '86', options.webpPath]);
    },
    async close() {
      await browser.close();
    },
  };
}

await mkdir(outputDir, { recursive: true });
const source = await readFile(portsSourcePath, 'utf8');
let extraPorts = [];
try {
  extraPorts = JSON.parse(await readFile(extraPortsPath, 'utf8'));
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}
const ports = [...parsePorts(source), ...extraPorts].filter(
  (port, index, allPorts) =>
    allPorts.findIndex((candidate) => candidate.slug === port.slug) === index,
);
if (ports.length < 20) {
  throw new Error(`Parsed only ${ports.length} ports from ${portsSourcePath}`);
}

const openFreeMapRenderer = await createOpenFreeMapRenderer();

const written = [];
if (shouldRenderRegions) {
  for (const asset of regionAssets) {
    const selected = ports.filter(asset.filter);
    if (selected.length === 0) continue;
    const fileBase = `explore-${asset.id}`;
    const assetSet = await writeAssetSet(fileBase, renderOverviewSvg({
      id: asset.id,
      label: asset.label,
      ports: selected,
    }));
    if (openFreeMapRenderer) {
      await openFreeMapRenderer.render({
        pngPath: assetSet.pngPath,
        webpPath: assetSet.webpPath,
        bounds: boundsFor(selected, asset.id === 'all' ? 0.18 : 0.28),
        padding: asset.id === 'all' ? 54 : 78,
      });
    }
    written.push(assetSet);
  }
}

if (shouldRenderPorts) {
  const selectedPorts = onlyPortSlugs.length > 0
    ? ports.filter((port) => onlyPortSlugs.includes(port.slug))
    : ports;
  if (onlyPortSlugs.length > 0 && selectedPorts.length !== onlyPortSlugs.length) {
    const found = new Set(selectedPorts.map((port) => port.slug));
    const missing = onlyPortSlugs.filter((slug) => !found.has(slug));
    throw new Error(`No port found for --only-port=${missing.join(',')}`);
  }

  for (const port of selectedPorts) {
    const assetSet = await writeAssetSet(`port-${port.slug}`, renderPortSvg(port));
    await openFreeMapRenderer.render({
      pngPath: assetSet.pngPath,
      webpPath: assetSet.webpPath,
      center: [port.lng, port.lat],
      zoom: portDetailZoom(port),
    });
    written.push(assetSet);
  }
}

await openFreeMapRenderer.close();
console.log(`Generated ${written.length} static map asset set(s) in ${outputDir}`);
