/**
 * CruiseKit — Discover cruise line search APIs
 * Tests each cruise line's website for open JSON APIs
 */

const { chromium } = require("playwright");

const LINES_TO_CHECK = [
  {
    name: "Royal Caribbean",
    url: "https://www.royalcaribbean.com/cruises?destinationIds=a]CARIB&sailingLengths=7",
  },
  {
    name: "Norwegian",
    url: "https://www.ncl.com/vacations?destinations=CARIBBEAN&numberOfGuests=2",
  },
  {
    name: "MSC",
    url: "https://www.msccruisesusa.com/cruise-deals",
  },
  {
    name: "Celebrity",
    url: "https://www.celebritycruises.com/cruises?destinationIds=CARIB",
  },
  {
    name: "Princess",
    url: "https://www.princess.com/find-a-cruise/?region=caribbean",
  },
  {
    name: "Holland America",
    url: "https://www.hollandamerica.com/en/us/find-a-cruise?icid=hd_findacruise_t4_hm_r_20190205&destination=C",
  },
  {
    name: "Virgin Voyages",
    url: "https://www.virginvoyages.com/book/voyage-planner/find-a-voyage",
  },
];

async function checkLine(lineConfig) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Checking: ${lineConfig.name}`);
  console.log(`${"=".repeat(60)}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const apiCalls = [];

  // Intercept all JSON responses
  page.on("response", async (response) => {
    const url = response.url();
    const contentType = response.headers()["content-type"] || "";

    if (contentType.includes("json") && response.status() === 200) {
      // Filter for likely search/price/cruise data endpoints
      const isRelevant =
        url.includes("search") ||
        url.includes("cruise") ||
        url.includes("price") ||
        url.includes("sailing") ||
        url.includes("itinerar") ||
        url.includes("voyage") ||
        url.includes("availab") ||
        url.includes("product") ||
        url.includes("offer") ||
        url.includes("result") ||
        url.includes("find") ||
        url.includes("api");

      if (isRelevant && !url.includes("analytics") && !url.includes("tracking") && !url.includes("cookie") && !url.includes("consent") && !url.includes("tag") && !url.includes("pixel")) {
        try {
          const body = await response.json();
          const bodyStr = JSON.stringify(body);
          const hasPrice = bodyStr.includes("price") || bodyStr.includes("Price") || bodyStr.includes("fare") || bodyStr.includes("Fare") || bodyStr.includes("$");
          const hasShip = bodyStr.includes("ship") || bodyStr.includes("Ship") || bodyStr.includes("vessel");

          if (hasPrice || hasShip || bodyStr.length > 5000) {
            apiCalls.push({
              url: url.substring(0, 250),
              size: bodyStr.length,
              hasPrice,
              hasShip,
              preview: bodyStr.substring(0, 400),
            });
          }
        } catch {}
      }
    }
  });

  try {
    await page.goto(lineConfig.url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Wait for dynamic content
    await page.waitForTimeout(12000);

    // Scroll to trigger lazy loading
    await page.evaluate(() => window.scrollBy(0, 3000));
    await page.waitForTimeout(5000);

    if (apiCalls.length === 0) {
      console.log("  No relevant API calls detected.");

      // Check if blocked
      const text = await page.evaluate(() => document.body.innerText);
      if (text.includes("Cloudflare") || text.includes("security verification")) {
        console.log("  ⛔ BLOCKED by Cloudflare/bot protection");
      } else if (text.includes("Access Denied")) {
        console.log("  ⛔ ACCESS DENIED");
      } else {
        console.log("  Page loaded but no JSON API calls with price/ship data found");
        console.log("  Title:", await page.title());
      }
    } else {
      console.log(`  ✅ Found ${apiCalls.length} relevant API endpoint(s):`);
      apiCalls.forEach((call, i) => {
        console.log(`\n  [${i + 1}] ${call.url}`);
        console.log(`      Size: ${(call.size / 1024).toFixed(1)}KB | Has price: ${call.hasPrice} | Has ship: ${call.hasShip}`);
        console.log(`      Preview: ${call.preview.substring(0, 200)}`);
      });
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
  }

  await browser.close();
}

(async () => {
  console.log("🔍 CruiseKit — Discovering cruise line APIs\n");

  for (const line of LINES_TO_CHECK) {
    await checkLine(line);
    // Brief pause between lines
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log("\n\n" + "=".repeat(60));
  console.log("Discovery complete.");
  console.log("=".repeat(60));
})();
