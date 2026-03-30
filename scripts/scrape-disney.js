/**
 * CruiseKit — Disney Cruise Line scraper
 * Their available-products API is open!
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function scrapeDisney() {
  console.log("🚢 Disney Cruise Line — scrape\n");

  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  const productResponses = [];

  page.on("response", async (resp) => {
    const url = resp.url();
    if (url.includes("available-products") && resp.status() === 200) {
      try {
        const body = await resp.json();
        productResponses.push(body);
        console.log(`  ✅ available-products batch: ${JSON.stringify(body).substring(0, 200)}`);
      } catch {}
    }
  });

  try {
    await page.goto("https://disneycruise.disney.go.com/cruises-destinations/list/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(20000);

    // Scroll to trigger all lazy loads
    for (let i = 0; i < 20; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);
      if (productResponses.length >= 5) break;
    }

    console.log(`\n  Product response batches: ${productResponses.length}`);

    // Merge all products
    const allProducts = [];
    for (const batch of productResponses) {
      if (Array.isArray(batch)) {
        allProducts.push(...batch);
      } else if (batch.products) {
        allProducts.push(...batch.products);
      } else if (batch.availableProducts) {
        allProducts.push(...batch.availableProducts);
      } else {
        // Unknown structure — check keys
        const keys = Object.keys(batch);
        console.log("  Batch keys:", keys.join(", "));
        // Try each key that's an array
        for (const k of keys) {
          if (Array.isArray(batch[k]) && batch[k].length > 0) {
            allProducts.push(...batch[k]);
            console.log(`  Added ${batch[k].length} from key '${k}'`);
          }
        }
      }
    }

    console.log(`  Total products merged: ${allProducts.length}`);

    // Save raw data
    const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(
      path.join(outputDir, "disney-raw.json"),
      JSON.stringify(productResponses, null, 2)
    );
    console.log("  Saved disney-raw.json");

    // Examine first product structure
    if (allProducts.length > 0) {
      console.log("\n  First product keys:", Object.keys(allProducts[0]).join(", "));
      console.log("  First product:", JSON.stringify(allProducts[0]).substring(0, 1000));
    } else if (productResponses.length > 0) {
      // Check the raw response structure
      const first = productResponses[0];
      console.log("\n  Raw response type:", typeof first);
      console.log("  Raw keys:", Object.keys(first).join(", "));
      console.log("  Raw preview:", JSON.stringify(first).substring(0, 1000));
    }

    // Also scrape visible text for cruise details
    const visibleData = await page.evaluate(() => {
      const cards = [];
      const allText = document.body.innerText;
      // Find cruise card patterns
      const lines = allText.split('\n').filter(l => l.trim().length > 0);
      let currentCard = [];
      for (const line of lines) {
        if (/\d+-Night/.test(line) && currentCard.length > 0) {
          cards.push(currentCard.join(' | '));
          currentCard = [line];
        } else if (currentCard.length > 0 || /\d+-Night/.test(line)) {
          currentCard.push(line.trim());
        }
        if (currentCard.length > 8) {
          cards.push(currentCard.join(' | '));
          currentCard = [];
        }
      }
      if (currentCard.length > 0) cards.push(currentCard.join(' | '));
      return cards.slice(0, 20);
    });

    console.log("\n  Visible cruise cards:");
    visibleData.forEach((c, i) => console.log(`  [${i}] ${c.substring(0, 200)}`));

  } catch (e) {
    console.error("  Error:", e.message);
  }

  await browser.close();
  console.log("\nDone.");
}

scrapeDisney().catch(console.error);
