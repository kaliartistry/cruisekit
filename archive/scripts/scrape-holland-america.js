/**
 * CruiseKit — Holland America Line Fare Scraper
 *
 * Holland America is a Carnival Corporation subsidiary.
 * Testing if they share the same API pattern as Carnival.
 *
 * Run quarterly: node scripts/scrape-holland-america.js
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

function fetchPage(dest, pageNumber, pageSize = 50) {
  return new Promise((resolve, reject) => {
    // Try the Carnival-style API on HAL's domain
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

    const url = `https://www.hollandamerica.com/cruisesearch/api/search?${params}`;

    https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "application/json",
        "Referer": "https://www.hollandamerica.com/",
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        console.log(`  Status: ${res.statusCode}`);
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: null, raw: data.substring(0, 300) });
        }
      });
    }).on("error", reject);
  });
}

async function scrapeHAL() {
  console.log("🚢 CruiseKit — Testing Holland America API...\n");

  // Try Carnival-style endpoint
  console.log("  Trying Carnival-style API on HAL domain...");
  const result = await fetchPage("C", 1, 10);

  if (result.status === 200 && result.data?.results?.itineraries) {
    console.log("  ✅ HAL uses same API as Carnival!");
    const itineraries = result.data.results.itineraries;
    console.log(`  Found ${itineraries.length} itineraries`);

    // Scrape all pages
    const allSailings = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 10) {
      const pageResult = await fetchPage("C", page, 50);
      const itins = pageResult.data?.results?.itineraries || [];
      if (itins.length === 0) { hasMore = false; break; }

      for (const itin of itins) {
        const lead = itin.leadSailing;
        const ports = lead.schedule
          ?.filter((p) => !p.port?.includes("At Sea"))
          .map((p) => ({ name: p.port, code: p.portCode }));

        allSailings.push({
          cruiseLine: "holland-america",
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
          itineraryUrl: itin.itineraryURL
            ? `https://www.hollandamerica.com${itin.itineraryURL}`
            : null,
        });
      }

      console.log(`  Page ${page}: ${itins.length} itineraries (total: ${allSailings.length})`);
      page++;
      await new Promise((r) => setTimeout(r, 1500));
    }

    // Save
    const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
    fs.mkdirSync(outputDir, { recursive: true });

    const output = {
      scrapedAt: new Date().toISOString(),
      source: "hollandamerica.com/cruisesearch/api",
      totalSailings: allSailings.length,
      sailings: allSailings,
    };

    const outputPath = path.join(outputDir, "hal-sailings.json");
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`\n✅ Saved ${allSailings.length} HAL sailings`);
    const ships = [...new Set(allSailings.map((s) => s.shipName))];
    const prices = allSailings.filter((s) => s.fromPrice > 0).map((s) => s.fromPrice);
    console.log(`   Ships: ${ships.join(", ")}`);
    if (prices.length > 0) {
      console.log(`   Price range: $${Math.min(...prices)} - $${Math.max(...prices)}`);
    }
  } else {
    console.log("  ❌ HAL doesn't use Carnival's API pattern");
    console.log("  Response:", result.raw || JSON.stringify(result.data).substring(0, 300));
  }
}

scrapeHAL().catch(console.error);
