/**
 * CruiseKit — Royal Caribbean Fare Scraper (Intercept Method)
 *
 * Loads the actual search page and intercepts ALL API responses
 * to find cruise pricing data.
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function scrapeRCI() {
  console.log("🚢 CruiseKit — Scraping Royal Caribbean (intercept method)...\n");

  const browser = await chromium.launch({
    headless: false,  // Use headed mode — may help avoid bot detection
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
  });

  const page = await context.newPage();
  const allResponses = [];

  // Capture EVERYTHING
  page.on("response", async (response) => {
    const url = response.url();
    const ct = response.headers()["content-type"] || "";
    const status = response.status();

    if (ct.includes("json") && status === 200 && url.includes("royalcaribbean")) {
      try {
        const body = await response.json();
        const str = JSON.stringify(body);

        if (str.length > 1000) {
          allResponses.push({
            url: url.substring(0, 300),
            size: str.length,
            hasPrice: str.includes("price") || str.includes("Price") || str.includes("fare") || str.includes("Fare"),
            hasCruise: str.includes("cruise") || str.includes("ship") || str.includes("itinerar") || str.includes("sailing"),
            data: body,
          });

          if (str.length > 5000 && (str.includes("price") || str.includes("Price"))) {
            console.log(`  ✅ Large JSON with pricing: ${url.substring(0, 100)}... (${(str.length/1024).toFixed(1)}KB)`);
          }
        }
      } catch {}
    }
  });

  try {
    // Try the cruises search page
    console.log("  Loading Royal Caribbean search page...");
    await page.goto("https://www.royalcaribbean.com/cruises", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    console.log("  Waiting for page to fully load...");
    await page.waitForTimeout(10000);

    // Check if we got through
    const title = await page.title();
    console.log("  Title:", title);

    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
    if (bodyText.includes("VACATION") || bodyText.includes("OOPS")) {
      console.log("  ⚠️  Got the 'on vacation' page. Trying alternative URL...");

      // Try a specific itinerary search
      await page.goto("https://www.royalcaribbean.com/cruises?destinationIds=CARIB&sailingLengths=6,7,8", {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      await page.waitForTimeout(10000);
    }

    // Scroll to trigger lazy loading
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
    }

    console.log(`\n  Total API responses captured: ${allResponses.length}`);

    // Filter to the most promising responses
    const pricingResponses = allResponses.filter(r => r.hasPrice && r.hasCruise);
    console.log(`  Pricing+Cruise responses: ${pricingResponses.length}`);

    if (pricingResponses.length > 0) {
      // Save the largest one
      const best = pricingResponses.sort((a, b) => b.size - a.size)[0];
      console.log(`\n  Best response: ${best.url}`);
      console.log(`  Size: ${(best.size/1024).toFixed(1)}KB`);

      const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(
        path.join(outputDir, "rci-intercepted.json"),
        JSON.stringify(best.data, null, 2)
      );
      console.log("  Saved intercepted data");

      // Try to extract sailings
      console.log("\n  Data structure keys:", Object.keys(best.data).join(", "));
      console.log("  Preview:", JSON.stringify(best.data).substring(0, 500));
    } else if (allResponses.length > 0) {
      console.log("\n  All captured responses:");
      allResponses.forEach((r, i) => {
        console.log(`  [${i}] ${r.url.substring(0, 100)} | ${(r.size/1024).toFixed(1)}KB | price:${r.hasPrice} cruise:${r.hasCruise}`);
      });
    } else {
      console.log("  ❌ No API responses captured at all");
      console.log("  Page content:", bodyText.substring(0, 300));
    }

  } catch (e) {
    console.error("  Error:", e.message);
  }

  await browser.close();
  console.log("\nDone.");
}

scrapeRCI().catch(console.error);
