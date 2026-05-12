/**
 * CruiseKit — Virgin Voyages Fare Scraper
 *
 * Virgin uses a GraphQL API that requires a bearer token.
 * We use Playwright to load their page, intercept the token,
 * then capture the full sailing data from the GraphQL response.
 *
 * Run quarterly: node scripts/scrape-virgin.js
 * Output: apps/web/lib/data/scraped/virgin-sailings.json
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function scrapeVirgin() {
  console.log("🚢 CruiseKit — Scraping Virgin Voyages via GraphQL...\n");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let sailingsData = null;

  // Intercept GraphQL responses
  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("graphql") && response.status() === 200) {
      try {
        const body = await response.json();
        const str = JSON.stringify(body);

        // Look for the allSailings query response
        if (str.includes("allSailings") && str.length > 10000) {
          sailingsData = body;
          console.log("  ✅ Intercepted allSailings GraphQL response:", (str.length / 1024).toFixed(1) + "KB");
        }
      } catch {}
    }
  });

  try {
    console.log("  Loading Virgin Voyages voyage planner...");
    await page.goto(
      "https://www.virginvoyages.com/book/voyage-planner/find-a-voyage",
      { waitUntil: "domcontentloaded", timeout: 45000 }
    );

    console.log("  Waiting for GraphQL data...");
    await page.waitForTimeout(15000);

    // Scroll to trigger more data loading
    await page.evaluate(() => window.scrollBy(0, 2000));
    await page.waitForTimeout(5000);

  } catch (e) {
    console.error("  Page error:", e.message);
  }

  await browser.close();

  if (!sailingsData) {
    console.log("\n  ❌ Could not capture Virgin Voyages sailing data.");
    console.log("  The page may have changed or requires additional interaction.");
    return;
  }

  // Process the data
  const allSailings = [];
  const rawSailings = sailingsData.data?.allSailings || [];

  console.log(`\n  Processing ${rawSailings.length} Virgin sailings...`);

  for (const s of rawSailings) {
    allSailings.push({
      cruiseLine: "virgin-voyages",
      shipCode: s.shipCode || "",
      shipName: getVirginShipName(s.shipCode),
      duration: s.duration || 0,
      departurePort: s.homePort || "",
      region: s.region || "Caribbean",
      departureDate: s.startDate || null,
      arrivalDate: s.endDate || null,
      fromPrice: s.minPrice || 0,
      maxPrice: s.maxPrice || 0,
      currency: "USD",
      packageCode: s.packageCode || "",
      ports: s.ports || [],
    });
  }

  // Filter to Caribbean only
  const caribbeanSailings = allSailings.filter(
    (s) => s.region?.includes("CARIBB") || s.region?.includes("Caribbean") || s.region?.includes("caribb")
  );

  // Save
  const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
  fs.mkdirSync(outputDir, { recursive: true });

  const output = {
    scrapedAt: new Date().toISOString(),
    source: "virginvoyages.com (GraphQL)",
    totalSailings: caribbeanSailings.length,
    allRegionsSailings: allSailings.length,
    sailings: caribbeanSailings.length > 0 ? caribbeanSailings : allSailings,
  };

  const outputPath = path.join(outputDir, "virgin-sailings.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\n✅ Saved ${output.totalSailings || output.allRegionsSailings} Virgin sailings`);
  if (allSailings.length > 0) {
    const ships = [...new Set(allSailings.map((s) => s.shipName))];
    const prices = allSailings.filter((s) => s.fromPrice > 0).map((s) => s.fromPrice);
    console.log(`   Ships: ${ships.join(", ")}`);
    if (prices.length > 0) {
      console.log(`   Price range: $${Math.min(...prices)} - $${Math.max(...prices)}`);
    }
    console.log(`   Regions: ${[...new Set(allSailings.map((s) => s.region))].join(", ")}`);
  }
}

function getVirginShipName(code) {
  const map = {
    SC: "Scarlet Lady",
    VL: "Valiant Lady",
    RL: "Resilient Lady",
    BL: "Brilliant Lady",
  };
  return map[code] || code || "Unknown";
}

scrapeVirgin().catch(console.error);
