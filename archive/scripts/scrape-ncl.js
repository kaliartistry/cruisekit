/**
 * CruiseKit — Norwegian Cruise Line Fare Scraper
 *
 * Pulls real sailing data from NCL's public search API.
 * Run quarterly: node scripts/scrape-ncl.js
 * Output: apps/web/lib/data/scraped/ncl-sailings.json
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const API_URL = "https://www.ncl.com/api/v2/vacations/search";

function fetchPage(offset, limit = 50) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      destinations: "CARIBBEAN",
      numberOfGuests: "2",
      filterConfig: "search-filters-configuration",
      limit: String(limit),
      offset: String(offset),
    });

    const url = `${API_URL}?${params}`;

    https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "application/json",
        "Referer": "https://www.ncl.com/",
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`Failed to parse: ${data.substring(0, 200)}`));
        }
      });
    }).on("error", reject);
  });
}

async function scrapeNCL() {
  console.log("🚢 CruiseKit — Scraping Norwegian Cruise Line Caribbean sailings...\n");

  const allSailings = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore && offset < 500) {
    console.log(`  Fetching offset ${offset}...`);

    try {
      const data = await fetchPage(offset, 50);
      const itineraries = data.itineraries || [];

      if (itineraries.length === 0) {
        hasMore = false;
        break;
      }

      for (const itin of itineraries) {
        const ports = itin.portsOfCall?.map((p) => ({
          name: p.title,
          code: p.code,
        })) || [];

        allSailings.push({
          cruiseLine: "norwegian",
          shipName: itin.ship?.title || "Unknown",
          shipCode: itin.ship?.code || "",
          duration: itin.duration?.days || 0,
          durationText: itin.duration?.text || "",
          departurePort: itin.embarkationPort?.title || "",
          departurePortCode: itin.embarkationPort?.code || "",
          region: itin.destinations?.[0]?.title || "Caribbean",
          itineraryTitle: itin.title,
          imageUrl: itin.image?.src
            ? `https://www.ncl.com${itin.image.src}`
            : null,
          combinedPrice: itin.combinedPrice || null,
          basePrice: itin.basePrice || null,
          currency: itin.currencyCode || "USD",
          ports,
          packageId: itin.packageId,
          code: itin.code,
          startingLocation: itin.startingLocation,
        });
      }

      console.log(`    Found ${itineraries.length} itineraries (total: ${allSailings.length})`);
      offset += itineraries.length;

      // Rate limiting
      await new Promise((r) => setTimeout(r, 1500));
    } catch (e) {
      console.error(`    Error at offset ${offset}:`, e.message);
      hasMore = false;
    }
  }

  // Save
  const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
  fs.mkdirSync(outputDir, { recursive: true });

  const output = {
    scrapedAt: new Date().toISOString(),
    source: "ncl.com/api/v2/vacations/search",
    totalSailings: allSailings.length,
    sailings: allSailings,
  };

  const outputPath = path.join(outputDir, "ncl-sailings.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\n✅ Saved ${allSailings.length} NCL sailings to ${outputPath}`);

  const ships = [...new Set(allSailings.map((s) => s.shipName))];
  const prices = allSailings.filter((s) => s.combinedPrice).map((s) => s.combinedPrice);
  console.log(`   Ships: ${ships.join(", ")}`);
  if (prices.length > 0) {
    console.log(`   Price range: $${Math.min(...prices)} - $${Math.max(...prices)}`);
  }
}

scrapeNCL().catch(console.error);
