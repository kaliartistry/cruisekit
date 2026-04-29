/**
 * CruiseKit — MSC Cruises Fare Scraper
 *
 * MSC uses Algolia for search. We intercept the API call from their page
 * to get the Algolia endpoint + params, then call it directly.
 *
 * Run quarterly: node scripts/scrape-msc.js
 * Output: apps/web/lib/data/scraped/msc-sailings.json
 */

const { chromium } = require("playwright");
const https = require("https");
const fs = require("fs");
const path = require("path");

async function interceptMSCAlgolia() {
  console.log("🚢 CruiseKit — Scraping MSC Cruises via Algolia API...\n");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let algoliaUrl = null;
  let algoliaData = null;

  // Intercept Algolia API calls
  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("algolia") && response.status() === 200) {
      const ct = response.headers()["content-type"] || "";
      if (ct.includes("json")) {
        try {
          const body = await response.json();
          const str = JSON.stringify(body);
          if (str.includes("cruiseID") || str.includes("departureStartDate")) {
            algoliaUrl = url;
            algoliaData = body;
            console.log("  ✅ Intercepted Algolia response:", (str.length / 1024).toFixed(1) + "KB");
          }
        } catch {}
      }
    }
  });

  try {
    console.log("  Loading MSC deals page...");
    await page.goto("https://www.msccruisesusa.com/cruise-deals", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await page.waitForTimeout(12000);
    await page.evaluate(() => window.scrollBy(0, 2000));
    await page.waitForTimeout(5000);

    if (!algoliaData) {
      console.log("  No Algolia data captured from deals page. Trying search...");
      await page.goto(
        "https://www.msccruisesusa.com/cruise/destinations/caribbean",
        { waitUntil: "domcontentloaded", timeout: 30000 }
      );
      await page.waitForTimeout(12000);
    }
  } catch (e) {
    console.error("  Page error:", e.message);
  }

  await browser.close();

  if (!algoliaData) {
    console.log("\n  ❌ Could not capture Algolia data. Trying direct API...");
    return tryDirectAPI();
  }

  return processAlgoliaData(algoliaData);
}

async function tryDirectAPI() {
  // Try MSC's search config API which we found earlier
  return new Promise((resolve) => {
    const url = "https://services.msccruises.com/SearchConfig/Configuration?lang=en-US";
    https.get(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          console.log("  Got MSC SearchConfig:", (data.length / 1024).toFixed(1) + "KB");

          // Extract cruise data from config if available
          const allSailings = [];

          // The config contains market data — check for cruise listings
          if (parsed.C?.SearchItems) {
            const items = parsed.C.SearchItems;
            console.log("  Search items found:", Array.isArray(items) ? items.length : typeof items);
          }

          // Check for destination data
          if (parsed.C?.Destinations) {
            console.log("  Destinations:", Object.keys(parsed.C.Destinations).length);
          }

          // Save raw config for analysis
          const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
          fs.mkdirSync(outputDir, { recursive: true });
          fs.writeFileSync(
            path.join(outputDir, "msc-config-raw.json"),
            JSON.stringify(parsed, null, 2).substring(0, 100000)
          );
          console.log("  Saved MSC config for analysis");

          resolve(allSailings);
        } catch (e) {
          console.error("  Parse error:", e.message);
          resolve([]);
        }
      });
    }).on("error", (e) => {
      console.error("  Error:", e.message);
      resolve([]);
    });
  });
}

function processAlgoliaData(data) {
  const hits = data.hits || [];
  console.log(`\n  Processing ${hits.length} MSC cruise hits...`);

  const allSailings = [];

  for (const hit of hits) {
    allSailings.push({
      cruiseLine: "msc",
      shipName: hit.shipName || hit.ship || "Unknown",
      cruiseId: hit.cruiseID || "",
      duration: hit.duration || hit.numberOfNights || 0,
      departurePort: hit.embarkationPort || hit.embarkPort || "",
      region: hit.commArea?.[0]?.value || "Caribbean",
      departureDate: hit.departureStartDate || null,
      arrivalDate: hit.disembarkationDate || null,
      fromPrice: hit.minPrice || hit.price || 0,
      maxPrice: hit.maxPrice || 0,
      currency: "USD",
      ports: hit.ports?.map((p) => p.value || p) || [],
      imageUrl: hit.imageUrl || null,
      discountCodes: hit.discountCodes || [],
    });
  }

  // Save
  const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
  fs.mkdirSync(outputDir, { recursive: true });

  const output = {
    scrapedAt: new Date().toISOString(),
    source: "msccruises.com (Algolia)",
    totalSailings: allSailings.length,
    sailings: allSailings,
  };

  const outputPath = path.join(outputDir, "msc-sailings.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\n✅ Saved ${allSailings.length} MSC sailings`);
  if (allSailings.length > 0) {
    const ships = [...new Set(allSailings.map((s) => s.shipName))];
    const prices = allSailings.filter((s) => s.fromPrice > 0).map((s) => s.fromPrice);
    console.log(`   Ships: ${ships.join(", ")}`);
    if (prices.length > 0) {
      console.log(`   Price range: $${Math.min(...prices)} - $${Math.max(...prices)}`);
    }
  }

  return allSailings;
}

interceptMSCAlgolia().catch(console.error);
