/**
 * CruiseKit — Princess Cruises Scraper (Intercept)
 * Captures the gw.api.princess.com API responses
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function scrapePrincess() {
  console.log("🚢 Scraping Princess Cruises...\n");

  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const apiResponses = [];

  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("gw.api.princess.com") && response.status() === 200) {
      try {
        const ct = response.headers()["content-type"] || "";
        if (ct.includes("json")) {
          const body = await response.json();
          const str = JSON.stringify(body);
          apiResponses.push({ url, size: str.length, data: body });
          console.log(`  ✅ Princess API: ${(str.length/1024).toFixed(1)}KB - ${url.substring(0, 120)}`);
        }
      } catch {}
    }
  });

  try {
    await page.goto("https://www.princess.com/cruise-search/#caribbean", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    console.log("  Waiting for page + API calls...");
    await page.waitForTimeout(20000);

    // Scroll to trigger more
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
    }

    console.log(`\n  Total Princess API responses: ${apiResponses.length}`);

    // Save all of them
    const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
    apiResponses.forEach((r, i) => {
      if (r.size > 10000) {
        const filename = `princess-api-${i}.json`;
        fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(r.data, null, 2));
        console.log(`  Saved ${filename} (${(r.size/1024).toFixed(1)}KB) - ${r.url.substring(0, 100)}`);
      }
    });

    // Find the products endpoint
    const products = apiResponses.find(r => r.url.includes("/products"));
    if (products) {
      console.log("\n  Products endpoint found!");
      const data = products.data;
      if (Array.isArray(data)) {
        console.log(`  ${data.length} products`);
        if (data[0]) {
          console.log("  First product keys:", Object.keys(data[0]).join(", "));
          console.log("  Preview:", JSON.stringify(data[0]).substring(0, 500));
        }
      } else {
        console.log("  Keys:", Object.keys(data).join(", "));
      }
    }
  } catch (e) {
    console.error("  Error:", e.message);
  }

  await browser.close();
}

scrapePrincess().catch(console.error);
