/**
 * CruiseKit — Royal Caribbean Fare Scraper
 *
 * Royal Caribbean's API requires auth tokens.
 * We use Playwright to load the search page and intercept API responses.
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function scrapeRCI() {
  console.log("🚢 CruiseKit — Scraping Royal Caribbean...\n");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const apiResponses = [];

  page.on("response", async (response) => {
    const url = response.url();
    const ct = response.headers()["content-type"] || "";

    if (ct.includes("json") && response.status() === 200) {
      if (
        url.includes("cruise") || url.includes("search") ||
        url.includes("sailing") || url.includes("itinerar") ||
        url.includes("product") || url.includes("availab")
      ) {
        if (!url.includes("analytics") && !url.includes("tracking") && !url.includes("tag")) {
          try {
            const body = await response.json();
            const str = JSON.stringify(body);
            if (str.length > 5000 && (str.includes("price") || str.includes("Price") || str.includes("ship") || str.includes("Ship"))) {
              apiResponses.push({ url: url.substring(0, 250), size: str.length, data: body });
              console.log(`  ✅ Intercepted: ${url.substring(0, 100)}... (${(str.length/1024).toFixed(1)}KB)`);
            }
          } catch {}
        }
      }
    }
  });

  try {
    console.log("  Loading Royal Caribbean cruise search...");
    await page.goto("https://www.royalcaribbean.com/cruises?destinationIds=CARIB", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    console.log("  Waiting for API calls...");
    await page.waitForTimeout(15000);

    // Scroll to trigger lazy loading
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 1500));
      await page.waitForTimeout(3000);
    }

    console.log(`\n  Total API responses captured: ${apiResponses.length}`);

    if (apiResponses.length > 0) {
      // Process the largest response (likely the main search results)
      const largest = apiResponses.sort((a, b) => b.size - a.size)[0];
      console.log(`  Largest response: ${largest.url}`);
      console.log(`  Size: ${(largest.size/1024).toFixed(1)}KB`);

      // Save raw data for analysis
      const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(
        path.join(outputDir, "rci-raw-response.json"),
        JSON.stringify(largest.data, null, 2).substring(0, 200000)
      );
      console.log("  Saved raw response for analysis");

      // Try to extract sailing data
      const data = largest.data;
      const sailings = extractSailings(data);

      if (sailings.length > 0) {
        const output = {
          scrapedAt: new Date().toISOString(),
          source: "royalcaribbean.com (intercepted API)",
          totalSailings: sailings.length,
          sailings,
        };
        fs.writeFileSync(
          path.join(outputDir, "rci-sailings.json"),
          JSON.stringify(output, null, 2)
        );
        console.log(`\n✅ Saved ${sailings.length} Royal Caribbean sailings`);
        const ships = [...new Set(sailings.map(s => s.shipName))];
        const prices = sailings.filter(s => s.fromPrice > 0).map(s => s.fromPrice);
        console.log(`   Ships: ${ships.join(", ")}`);
        if (prices.length > 0) console.log(`   Price range: $${Math.min(...prices)} - $${Math.max(...prices)}`);
      }
    } else {
      console.log("  ❌ No API responses captured");

      // Check if page loaded
      const title = await page.title();
      const text = await page.evaluate(() => document.body.innerText.substring(0, 300));
      console.log("  Title:", title);
      console.log("  Content:", text.substring(0, 200));
    }
  } catch (e) {
    console.error("  Error:", e.message);
  }

  await browser.close();
}

function extractSailings(data) {
  const sailings = [];

  // Try different data structures
  const items = data.results || data.sailings || data.itineraries || data.products || data.cruises || [];

  if (Array.isArray(items)) {
    for (const item of items) {
      sailings.push({
        cruiseLine: "royal-caribbean",
        shipName: item.shipName || item.ship?.name || item.ship || "Unknown",
        duration: item.duration || item.nights || item.sailingLength || 0,
        departurePort: item.departurePort || item.homePort || item.embarkPort || "",
        itineraryTitle: item.title || item.name || item.itineraryName || "",
        fromPrice: item.price || item.startingPrice || item.lowestPrice || item.fromPrice || 0,
        currency: "USD",
        departureDate: item.departureDate || item.sailDate || null,
        ports: item.ports || item.portsOfCall || [],
        imageUrl: item.image || item.imageUrl || null,
      });
    }
  } else if (typeof items === "object") {
    // Maybe it's nested differently
    for (const key of Object.keys(data)) {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        const first = data[key][0];
        if (first.price || first.ship || first.duration) {
          console.log(`  Found array at key "${key}" with ${data[key].length} items`);
          return extractSailings({ results: data[key] });
        }
      }
    }
  }

  return sailings;
}

scrapeRCI().catch(console.error);
