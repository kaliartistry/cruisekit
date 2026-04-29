/**
 * CruiseKit — Princess Cruises pricing scraper
 * Step 1: Load search page to get auth/API key
 * Step 2: Call pricing API with captured credentials
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function scrapePrincess() {
  console.log("🚢 Princess Cruises — pricing scrape\n");

  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  const allResponses = [];
  let apiKey = null;

  // Capture ALL responses, especially those with pricing
  page.on("response", async (response) => {
    const url = response.url();
    const ct = response.headers()["content-type"] || "";
    const status = response.status();

    // Capture API key from request headers
    if (url.includes("gw.api.princess.com")) {
      const req = response.request();
      const headers = req.headers();
      if (headers["x-api-key"] && !apiKey) {
        apiKey = headers["x-api-key"];
        console.log(`  🔑 API Key captured: ${apiKey.substring(0, 20)}...`);
      }
    }

    if (status === 200 && ct.includes("json")) {
      try {
        const body = await response.json();
        const str = JSON.stringify(body);

        if (str.length > 2000 && (str.includes("price") || str.includes("Price") || str.includes("fare") || str.includes("cabin") || str.includes("stateroom"))) {
          allResponses.push({
            url,
            size: str.length,
            data: body,
          });
          console.log(`  ✅ ${(str.length/1024).toFixed(1)}KB: ${url.substring(0, 120)}`);
        }
      } catch {}
    }
  });

  try {
    // Load the cruise search page with Caribbean filter
    console.log("  Loading Princess search page...");
    await page.goto("https://www.princess.com/cruise-search/#caribbean", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(15000);

    const title = await page.title();
    console.log("  Title:", title);
    console.log("  API Key:", apiKey ? "captured" : "not found");

    // Wait for search results to render
    console.log("  Waiting for search results...");
    await page.waitForTimeout(10000);

    // Try scrolling to trigger lazy loading
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
    }

    // Look for cruise cards in the DOM
    const cards = await page.$$('[class*="cruise"], [class*="voyage"], [class*="itinerary"], [data-testid*="cruise"]');
    console.log(`  Found ${cards.length} cruise-related elements`);

    // Try clicking on a cruise card to trigger pricing
    if (cards.length > 0) {
      console.log("  Clicking first cruise card...");
      try {
        await cards[0].click();
        await page.waitForTimeout(5000);
      } catch {}
    }

    // Check for visible price data on the page
    const priceTexts = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="price"], [class*="fare"], [class*="cost"]');
      return Array.from(elements).slice(0, 10).map(el => ({
        text: el.innerText?.substring(0, 100),
        class: el.className?.substring(0, 100),
      }));
    });
    console.log("\n  Price elements found:", priceTexts.length);
    priceTexts.forEach(p => console.log(`    "${p.text}" (${p.class})`));

    // Extract all visible cruise data from the rendered page
    const pageData = await page.evaluate(() => {
      // Try to find React state or global data
      const win = window;
      const dataKeys = Object.keys(win).filter(k =>
        k.includes("cruise") || k.includes("voyage") || k.includes("__NEXT") || k.includes("__DATA")
      );

      // Try to scrape visible cards
      const results = [];
      const cardEls = document.querySelectorAll('[class*="card"], [class*="result"], [class*="itinerary"]');
      for (const card of Array.from(cardEls).slice(0, 20)) {
        const text = card.innerText;
        if (text && text.includes("$") && text.length > 50) {
          results.push(text.substring(0, 300));
        }
      }

      return { dataKeys, results: results.slice(0, 10) };
    });

    console.log("\n  Window data keys:", pageData.dataKeys.join(", ") || "none");
    console.log("  Visible card data:", pageData.results.length);
    pageData.results.forEach((r, i) => console.log(`\n  [Card ${i}]`, r));

    console.log(`\n  Total API responses: ${allResponses.length}`);

    // Save everything
    const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
    if (allResponses.length > 0) {
      allResponses.forEach((r, i) => {
        if (r.size > 5000) {
          const name = `princess-resp-${i}.json`;
          fs.writeFileSync(path.join(outputDir, name), JSON.stringify(r.data, null, 2));
          console.log(`  Saved ${name} (${(r.size/1024).toFixed(1)}KB)`);
        }
      });
    }

    // If we got the API key, try direct API calls for pricing
    if (apiKey) {
      console.log("\n  Trying direct API pricing calls with captured key...");
      // Get the products list we already have
      const products = require(path.join(outputDir, "princess-api-7.json"));
      const caribbeanProducts = products.products
        .filter(p => p.trades?.some(t => ["C", "W", "E", "S"].includes(t.id)))
        .slice(0, 5);

      for (const prod of caribbeanProducts) {
        const ship = prod.ships?.[0];
        if (!ship?.sailDates?.[0]) continue;

        const pricingUrl = `https://gw.api.princess.com/pcl-web/internal/resdb/p1.0/pricing?cruiseId=${prod.id}&sailDate=${ship.sailDates[0]}&shipId=${ship.id}&country=US`;
        console.log(`  Trying: ${prod.id} on ${ship.sailDates[0]}...`);

        try {
          const resp = await page.evaluate(async (url) => {
            const r = await fetch(url);
            if (r.ok) return await r.json();
            return { status: r.status, statusText: r.statusText };
          }, pricingUrl);

          const str = JSON.stringify(resp);
          console.log(`    Response: ${(str.length/1024).toFixed(1)}KB`);
          if (str.length > 100) {
            console.log(`    Preview: ${str.substring(0, 300)}`);
          }
        } catch (e) {
          console.log(`    Error: ${e.message.substring(0, 100)}`);
        }
      }
    }

  } catch (e) {
    console.error("  Error:", e.message);
  }

  await browser.close();
  console.log("\nDone.");
}

scrapePrincess().catch(console.error);
