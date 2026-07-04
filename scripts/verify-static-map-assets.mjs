#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const portsSourcePath = path.join(rootDir, 'apps/web/lib/data/ports.ts');
const outputDir = path.join(rootDir, 'apps/web/public/assets/maps/static');

function parsePorts(source) {
  const matches = source.matchAll(/\bslug: "([^"]+)",[\s\S]*?\bregion: "([^"]+)",/g);
  return [...matches].map((match) => ({
    slug: match[1],
    region: match[2],
  }));
}

function parseRegionLabels(source) {
  const regionLabels = source.match(/REGION_LABELS: Record<PortRegion, string> = \{([\s\S]*?)\};/);
  if (!regionLabels) {
    throw new Error('Unable to parse REGION_LABELS from ports.ts');
  }
  const matches = regionLabels[1].matchAll(/(?:"([^"]+)"|([a-zA-Z][a-zA-Z0-9]*)):/g);
  return [...matches].map((match) => match[1] ?? match[2]);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const source = await readFile(portsSourcePath, 'utf8');
const ports = parsePorts(source);
const regions = parseRegionLabels(source);

if (ports.length < 20) {
  throw new Error(`Parsed only ${ports.length} ports from ${portsSourcePath}`);
}
if (regions.length < 8) {
  throw new Error(`Parsed only ${regions.length} regions from REGION_LABELS`);
}

const missingPorts = [];
for (const port of ports) {
  const assetPath = path.join(outputDir, `port-${port.slug}.webp`);
  if (!(await exists(assetPath))) {
    missingPorts.push(port.slug);
  }
}

const missingRegions = [];
for (const region of ['all', ...regions]) {
  const assetPath = path.join(outputDir, `explore-${region}.webp`);
  if (!(await exists(assetPath))) {
    missingRegions.push(region);
  }
}

if (missingPorts.length || missingRegions.length) {
  if (missingPorts.length) {
    console.error(`Missing ${missingPorts.length} port map asset(s): ${missingPorts.join(', ')}`);
  }
  if (missingRegions.length) {
    console.error(`Missing ${missingRegions.length} region map asset(s): ${missingRegions.join(', ')}`);
  }
  process.exit(1);
}

const uniqueRegions = new Set(ports.map((port) => port.region));
const undeclaredRegions = [...uniqueRegions].filter((region) => !regions.includes(region));
if (undeclaredRegions.length) {
  console.error(`Port data uses undeclared region(s): ${undeclaredRegions.join(', ')}`);
  process.exit(1);
}

console.log(`Verified ${ports.length} port map WebP assets and ${regions.length + 1} region atlas WebP assets.`);
