/**
 * Export loyalty program data to JSON for CruiseKit-Mobile.
 * Usage: npx tsx tools/export_loyalty_data.ts [output-dir]
 */
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { LOYALTY_PROGRAMS } from '../apps/web/lib/data/loyalty-programs';

const outputDir = process.argv[2] || resolve(dirname(fileURLToPath(import.meta.url)), '../../CruiseKit-Mobile/assets/data');

writeFileSync(
  resolve(outputDir, 'loyalty_programs.json'),
  JSON.stringify(LOYALTY_PROGRAMS, null, 2)
);

console.log(`loyalty_programs.json (${LOYALTY_PROGRAMS.length} programs)`);
