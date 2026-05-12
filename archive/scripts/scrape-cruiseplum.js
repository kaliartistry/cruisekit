/**
 * CruiseKit — CruisePlum Scraper (Playwright headed browser)
 * CruisePlum is behind Cloudflare but headed browser may bypass.
 * Targets Princess + Disney data specifically.
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function scrapeCruisePlum() {
  console.log("🚢 CruiseKit — Scraping CruisePlum (headed browser)...\n");

  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
  });

  const page = await context.newPage();
  const apiResponses = [];

  // Capture all XHR/fetch responses
  page.on("response", async (response) => {
    const url = response.url();
    const ct = response.headers()["content-type"] || "";
    const status = response.status();

    if (status === 200 && (ct.includes("json") || ct.includes("javascript"))) {
      try {
        const text = await response.text();
        if (text.length > 5000 && (text.includes("price") || text.includes("Price") || text.includes("fare") || text.includes("cabin"))) {
          let data;
          try { data = JSON.parse(text); } catch { data = null; }
          apiResponses.push({
            url: url.substring(0, 250),
            size: text.length,
            isJSON: !!data,
            data: data || text.substring(0, 1000),
          });
          console.log(`  ✅ ${(text.length / 1024).toFixed(1)}KB: ${url.substring(0, 120)}`);
        }
      } catch {}
    }
  });

  const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
  fs.mkdirSync(outputDir, { recursive: true });

  try {
    // Step 1: Load homepage and wait for Cloudflare challenge
    console.log("  Loading CruisePlum homepage...");
    await page.goto("https://www.cruiseplum.com", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    console.log("  Waiting for Cloudflare challenge to resolve...");
    await page.waitForTimeout(15000);

    const title = await page.title();
    console.log("  Title:", title);

    if (title.includes("Just a moment") || title.includes("Cloudflare")) {
      console.log("  ⚠️ Still on Cloudflare challenge. Waiting longer...");
      await page.waitForTimeout(15000);
      const title2 = await page.title();
      console.log("  Title now:", title2);
      if (title2.includes("Just a moment")) {
        console.log("  ❌ Cannot bypass Cloudflare. Trying hot deals page directly...");
      }
    }

    // Step 2: Try the hot deals page
    console.log("\n  Loading hot deals page...");
    await page.goto("https://www.cruiseplum.com/hot-deals", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(15000);

    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
    console.log("  Page content preview:", bodyText.substring(0, 500));

    // Step 3: Try the search page
    console.log("\n  Loading search page...");
    await page.goto("https://www.cruiseplum.com/search", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(15000);

    const searchTitle = await page.title();
    console.log("  Search page title:", searchTitle);

    // Try to find and interact with search filters
    const searchBody = await page.evaluate(() => document.body.innerText.substring(0, 2000));
    console.log("  Search page preview:", searchBody.substring(0, 500));

    // Step 4: Try data endpoints directly
    console.log("\n  Trying data endpoints...");
    for (const endpoint of [
      "https://www.cruiseplum.com/data/US/hot_deals",
      "https://www.cruiseplum.com/data/US/price_drops",
    ]) {
      try {
        const response = await page.goto(endpoint, { timeout: 30000 });
        const ct = response?.headers()["content-type"] || "";
        console.log(`  ${endpoint.split("/").pop()}: status=${response?.status()} ct=${ct}`);
        if (ct.includes("json")) {
          const data = await response?.json();
          const str = JSON.stringify(data);
          console.log(`    Size: ${(str.length / 1024).toFixed(1)}KB`);
          fs.writeFileSync(
            path.join(outputDir, `cruiseplum-${endpoint.split("/").pop()}.json`),
            JSON.stringify(data, null, 2)
          );
          console.log(`    Saved!`);
        }
      } catch (e) {
        console.log(`    Error: ${e.message.substring(0, 100)}`);
      }
    }

    console.log(`\n  Total API responses captured: ${apiResponses.length}`);
    if (apiResponses.length > 0) {
      apiResponses.forEach((r, i) => {
        console.log(`  [${i}] ${(r.size / 1024).toFixed(1)}KB json:${r.isJSON} ${r.url.substring(0, 100)}`);
      });

      // Save the largest JSON response
      const jsonResponses = apiResponses.filter(r => r.isJSON);
      if (jsonResponses.length > 0) {
        const best = jsonResponses.sort((a, b) => b.size - a.size)[0];
        fs.writeFileSync(
          path.join(outputDir, "cruiseplum-intercepted.json"),
          JSON.stringify(best.data, null, 2)
        );
        console.log(`\n  Saved best response: ${(best.size / 1024).toFixed(1)}KB`);
      }
    }

  } catch (e) {
    console.error("  Error:", e.message);
  }

  await browser.close();
  console.log("\nDone.");
}

scrapeCruisePlum().catch(console.error);
