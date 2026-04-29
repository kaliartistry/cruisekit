/**
 * CruiseKit — Princess Cruises DOM scraper
 * Extract visible pricing from the rendered search results page
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function scrapePrincess() {
  console.log("🚢 Princess Cruises — DOM scrape\n");

  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  // Intercept ALL network requests
  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("gw.api.princess.com")) {
      const headers = req.headers();
      const apiKey = headers["x-api-key"] || headers["apikey"] || headers["api-key"];
      if (apiKey) console.log(`  🔑 API key from request: ${apiKey}`);
      // Log all custom headers
      for (const [k, v] of Object.entries(headers)) {
        if (!["accept", "user-agent", "referer", "origin", "sec-", "connection", "host", "pragma", "cache-control"].some(h => k.startsWith(h))) {
          if (v && v.length > 5 && v.length < 200) {
            console.log(`  Header ${k}: ${v.substring(0, 80)}`);
          }
        }
      }
    }
  });

  try {
    console.log("  Loading Caribbean search...");
    await page.goto("https://www.princess.com/cruise-search/", {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await page.waitForTimeout(5000);

    // Check __NEXT_REDUX_STORE__
    const storeData = await page.evaluate(() => {
      const store = (window).__NEXT_REDUX_STORE__;
      if (store && store.getState) {
        const state = store.getState();
        return { keys: Object.keys(state), hasProducts: !!state.products, hasPricing: !!state.pricing };
      }
      // Also check __NEXT_DATA__
      const nextData = (window).__NEXT_DATA__;
      if (nextData?.props?.pageProps) {
        return { type: "nextData", keys: Object.keys(nextData.props.pageProps) };
      }
      return null;
    });
    console.log("  Store data:", JSON.stringify(storeData));

    // Click on Caribbean destination
    console.log("  Looking for destination filters...");
    try {
      // Try to select Caribbean
      const caribBtn = await page.$('button:has-text("Caribbean"), [data-value="Caribbean"], label:has-text("Caribbean")');
      if (caribBtn) {
        await caribBtn.click();
        console.log("  Clicked Caribbean filter");
        await page.waitForTimeout(10000);
      }
    } catch {}

    // Now try to extract Redux store cruise data
    const cruiseData = await page.evaluate(() => {
      const store = (window).__NEXT_REDUX_STORE__;
      if (!store?.getState) return null;
      const state = store.getState();
      // Stringify and check size
      const keys = Object.keys(state);
      const result = {};
      for (const key of keys) {
        const val = state[key];
        const str = JSON.stringify(val);
        if (str && str.length > 100) {
          result[key] = { size: str.length, type: typeof val, isArray: Array.isArray(val) };
          if (str.includes("price") || str.includes("Price")) {
            result[key].hasPrice = true;
          }
        }
      }
      return result;
    });
    console.log("\n  Redux store contents:");
    if (cruiseData) {
      for (const [k, v] of Object.entries(cruiseData)) {
        console.log(`    ${k}: ${(v.size / 1024).toFixed(1)}KB ${v.hasPrice ? '💰' : ''}`);
      }
    }

    // Extract the full pricing state
    const pricingState = await page.evaluate(() => {
      const store = (window).__NEXT_REDUX_STORE__;
      if (!store?.getState) return null;
      const state = store.getState();
      // Find keys with pricing data
      for (const key of Object.keys(state)) {
        const str = JSON.stringify(state[key]);
        if (str && str.includes("price") && str.length > 10000) {
          return { key, data: state[key] };
        }
      }
      // Return all keys with their first 200 chars
      const preview = {};
      for (const key of Object.keys(state)) {
        preview[key] = JSON.stringify(state[key]).substring(0, 200);
      }
      return { preview };
    });

    if (pricingState) {
      const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
      fs.writeFileSync(
        path.join(outputDir, "princess-store.json"),
        JSON.stringify(pricingState, null, 2)
      );
      console.log("\n  Saved princess-store.json");
      if (pricingState.preview) {
        console.log("\n  Store previews:");
        for (const [k, v] of Object.entries(pricingState.preview)) {
          console.log(`    ${k}: ${v}`);
        }
      }
    }

    // Also try scraping visible DOM text
    const visiblePrices = await page.evaluate(() => {
      const allText = document.body.innerText;
      const priceMatches = allText.match(/\$[\d,]+/g) || [];
      return {
        prices: [...new Set(priceMatches)].slice(0, 20),
        bodyPreview: allText.substring(0, 3000),
      };
    });
    console.log("\n  Visible prices on page:", visiblePrices.prices.join(", ") || "none");
    if (visiblePrices.prices.length === 0) {
      console.log("  Page text:", visiblePrices.bodyPreview.substring(0, 500));
    }

  } catch (e) {
    console.error("  Error:", e.message);
  }

  await browser.close();
  console.log("\nDone.");
}

scrapePrincess().catch(console.error);
