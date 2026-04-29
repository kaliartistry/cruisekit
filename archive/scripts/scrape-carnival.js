/**
 * CruiseKit — Carnival Cruise Line Fare Scraper
 *
 * Pulls real sailing data from Carnival's public search API.
 * Run quarterly: node scripts/scrape-carnival.js
 * Output: apps/web/lib/data/scraped/carnival-sailings.json
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const API_URL = "https://www.carnival.com/cruisesearch/api/search";

function fetchPage(dest, pageNumber, pageSize = 50) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      dest,
      numAdults: "2",
      pageNumber: String(pageNumber),
      pageSize: String(pageSize),
      showBest: "true",
      excludeResults: "false",
      currency: "USD",
      locality: "1",
    });

    const url = `${API_URL}?${params}`;

    https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "application/json",
        "Referer": "https://www.carnival.com/",
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`Failed to parse response: ${data.substring(0, 200)}`));
        }
      });
    }).on("error", reject);
  });
}

async function scrapeAllCaribbean() {
  console.log("🚢 CruiseKit — Scraping Carnival Caribbean sailings...\n");

  const allSailings = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 10) {
    console.log(`  Fetching page ${page}...`);

    try {
      const data = await fetchPage("C", page, 50);
      const itineraries = data.results?.itineraries || [];

      if (itineraries.length === 0) {
        hasMore = false;
        break;
      }

      for (const itin of itineraries) {
        const lead = itin.leadSailing;
        const ports = lead.schedule
          ?.filter((p) => !p.port?.includes("Fun Day") && !p.port?.includes("Sea Day"))
          .map((p) => ({
            name: p.port,
            code: p.portCode,
            arrive: p.arriveTimeHMmTt,
            depart: p.departTimeHMmTt,
            date: p.dateDayOfWeekFull,
          }));

        // Get all available sailing dates for this itinerary
        const sailingDates = itin.sailings?.map((s) => ({
          departureDate: s.departureDate,
          fromPrice: s.fromPrice,
          departureMmmDdYyyy: s.departureMmmDdYyyy,
        })) || [];

        allSailings.push({
          cruiseLine: "carnival",
          shipName: itin.shipName,
          shipCode: itin.shipCode,
          duration: itin.dur,
          departurePort: itin.departurePortName,
          departurePortCode: itin.departurePortCode,
          region: itin.regionName,
          itineraryTitle: itin.itineraryTitle,
          imageUrl: itin.imageUrl || itin.image,
          fromPrice: lead.fromPrice,
          currency: lead.fromPriceCurrency || "USD",
          departureDate: lead.departureMmmDdYyyy,
          arrivalDate: lead.arrivalMmmDdYyyy,
          ports,
          allSailingDates: sailingDates.slice(0, 10), // keep first 10 dates
          itineraryUrl: itin.itineraryURL
            ? `https://www.carnival.com${itin.itineraryURL}`
            : null,
        });
      }

      console.log(`    Found ${itineraries.length} itineraries (total: ${allSailings.length})`);
      page++;

      // Rate limiting — be nice to their servers
      await new Promise((r) => setTimeout(r, 1500));
    } catch (e) {
      console.error(`    Error on page ${page}:`, e.message);
      hasMore = false;
    }
  }

  // Save to JSON
  const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
  fs.mkdirSync(outputDir, { recursive: true });

  const output = {
    scrapedAt: new Date().toISOString(),
    source: "carnival.com/cruisesearch/api",
    totalSailings: allSailings.length,
    sailings: allSailings,
  };

  const outputPath = path.join(outputDir, "carnival-sailings.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\n✅ Saved ${allSailings.length} Carnival sailings to ${outputPath}`);

  // Print summary
  const ships = [...new Set(allSailings.map((s) => s.shipName))];
  const priceRange = {
    min: Math.min(...allSailings.map((s) => s.fromPrice)),
    max: Math.max(...allSailings.map((s) => s.fromPrice)),
  };
  console.log(`   Ships: ${ships.join(", ")}`);
  console.log(`   Price range: $${priceRange.min} - $${priceRange.max}`);
  console.log(`   Date range: ${allSailings[0]?.departureDate} to ${allSailings[allSailings.length - 1]?.departureDate}`);
}

scrapeAllCaribbean().catch(console.error);
