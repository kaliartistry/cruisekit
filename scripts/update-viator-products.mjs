/**
 * Fetches Viator products for all CruiseKit ports and writes them
 * as static JSON files to public/data/viator/{port-slug}.json.
 *
 * Run periodically (CI cron or manually) to keep prices/products fresh:
 *   VIATOR_API_KEY=xxx node scripts/update-viator-products.js
 *
 * The client-side ViatorExcursions component reads from these files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../apps/web/public/data/viator');

const VIATOR_API_KEY = process.env.VIATOR_API_KEY;
const BASE_URL = process.env.VIATOR_API_BASE_URL || 'https://api.sandbox.viator.com/partner';

const DESTINATIONS = {
  'cozumel': 4383,
  'grand-cayman': 4242,
  'roatan': 22288,
  'key-west': 4279,
  'costa-maya': 22302,
  'progreso': 26037,
  'belize-city': 4172,
  'falmouth': 24095,
  'ocho-rios': 4423,
  'montego-bay': 4376,
  'port-royal': 4292,
  'nassau': 4197,
  'st-thomas': 4537,
  'st-maarten': 4524,
  'san-juan': 4470,
  'grand-turk': 28826,
  'bermuda': 4173,
  'puerto-plata': 4459,
  'tortola': 4551,
  'antigua': 4155,
  'st-lucia': 4526,
  'barbados': 4167,
  'amber-cove': 4459,
  'cartagena': 4184,
  'curacao': 4211,
  'aruba': 4157,
  'bonaire': 4174,
  'grenada': 4243,
};

// Private islands — write empty arrays
const PRIVATE_ISLANDS = [
  'harvest-caye', 'cococay', 'labadee', 'great-stirrup-cay', 'celebration-key',
];

async function fetchProducts(slug, destId) {
  const res = await fetch(`${BASE_URL}/products/search`, {
    method: 'POST',
    headers: {
      'exp-api-key': VIATOR_API_KEY,
      'Accept': 'application/json;version=2.0',
      'Accept-Language': 'en-US',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filtering: { destination: destId },
      sorting: { sort: 'TOP_SELLERS', order: 'DESCENDING' },
      pagination: { start: 1, count: 8 },
      currency: 'USD',
    }),
  });

  if (!res.ok) {
    console.warn(`  ⚠ ${slug}: API returned ${res.status}`);
    return [];
  }

  const data = await res.json();
  const products = data?.products ?? [];

  return products.map((p) => ({
    productCode: p.productCode ?? '',
    title: p.title ?? '',
    description: p.description ?? p.shortDescription ?? '',
    thumbnailUrl: extractThumbnail(p.images),
    rating: p.reviews?.combinedAverageRating ?? 0,
    reviewCount: p.reviews?.totalReviews ?? 0,
    duration: formatDuration(p.duration),
    pricingFrom: p.pricing?.summary?.fromPrice ?? null,
    currency: p.pricing?.currency ?? 'USD',
    productUrl: p.productUrl ?? '',
  }));
}

function extractThumbnail(images) {
  if (!images || !images.length) return null;
  const variants = images[0]?.variants ?? [];
  const medium = variants.find((v) => v.width >= 400 && v.width <= 800);
  return medium?.url ?? variants[0]?.url ?? null;
}

function formatDuration(duration) {
  if (!duration) return null;
  if (duration.fixedDurationInMinutes) {
    const mins = duration.fixedDurationInMinutes;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const rem = mins % 60;
      return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
    }
    return `${mins}m`;
  }
  return null;
}

async function main() {
  if (!VIATOR_API_KEY) {
    console.error('Missing VIATOR_API_KEY environment variable.');
    console.log('Usage: VIATOR_API_KEY=xxx node scripts/update-viator-products.mjs');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Private islands → empty
  for (const slug of PRIVATE_ISLANDS) {
    const outPath = path.join(OUT_DIR, `${slug}.json`);
    fs.writeFileSync(outPath, JSON.stringify({ products: [], totalCount: 0 }));
    console.log(`✓ ${slug} → 0 products (private island)`);
  }

  // Fetch real destinations
  const slugs = Object.keys(DESTINATIONS);
  let success = 0;
  let failed = 0;

  for (const slug of slugs) {
    try {
      const products = await fetchProducts(slug, DESTINATIONS[slug]);
      const outPath = path.join(OUT_DIR, `${slug}.json`);
      fs.writeFileSync(
        outPath,
        JSON.stringify({ products, totalCount: products.length }, null, 2)
      );
      console.log(`✓ ${slug} → ${products.length} products`);
      success++;

      // Rate limiting — be gentle
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`✗ ${slug}: ${err.message}`);
      // Write empty so the app doesn't break
      const outPath = path.join(OUT_DIR, `${slug}.json`);
      fs.writeFileSync(outPath, JSON.stringify({ products: [], totalCount: 0 }));
      failed++;
    }
  }

  console.log(`\nDone: ${success} succeeded, ${failed} failed, ${PRIVATE_ISLANDS.length} private islands.`);
}

main();
