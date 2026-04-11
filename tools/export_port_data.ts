/**
 * Export port data to JSON for CruiseKit-Mobile.
 *
 * Usage: npx tsx tools/export_port_data.ts [output-dir]
 * Default output: ../CruiseKit-Mobile/assets/data/
 */
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { PORTS } from '../apps/web/lib/data/ports';

const outputDir = process.argv[2] || resolve(dirname(fileURLToPath(import.meta.url)), '../../CruiseKit-Mobile/assets/data');

// Flatten nested structures for simpler Dart json_serializable
const flattenedPorts = PORTS.map(port => ({
  slug: port.slug,
  name: port.name,
  country: port.country,
  lat: port.coordinates.lat,
  lng: port.coordinates.lng,
  timezone: port.timezone,
  safetyRating: port.safetyRating,
  walkabilityRating: port.walkabilityRating,
  isTenderPort: port.isTenderPort,
  typicalPortHours: port.typicalPortHours,
  walkingDistanceToTown: port.walkingDistanceToTown,
  currency: port.currency,
  usdAccepted: port.usdAccepted,
  wifiAvailability: port.wifiAvailability,
  cellularCoverage: port.cellularCoverage,
  overview: port.overview,
  timeZoneAlert: port.timeZoneAlert ?? null,
  excursionCategories: port.excursionCategories.map(exc => ({
    name: exc.name,
    priceMin: exc.priceRange.min,
    priceMax: exc.priceRange.max,
    typicalDuration: exc.typicalDuration,
  })),
  freeActivities: port.freeActivities,
  restaurants: port.restaurants,
  gettingAround: port.gettingAround,
  emergencyInfo: port.emergencyInfo,
  region: port.region,
  imageUrl: port.imageUrl,
}));

writeFileSync(
  resolve(outputDir, 'port_guides.json'),
  JSON.stringify(flattenedPorts, null, 2)
);

// Count by region
const regionCounts: Record<string, number> = {};
for (const port of flattenedPorts) {
  regionCounts[port.region] = (regionCounts[port.region] || 0) + 1;
}

const regionSummary = Object.entries(regionCounts)
  .map(([r, c]) => `${c} ${r}`)
  .join(', ');

console.log(`port_guides.json (${flattenedPorts.length} ports: ${regionSummary})`);
console.log(`Written to: ${outputDir}`);
