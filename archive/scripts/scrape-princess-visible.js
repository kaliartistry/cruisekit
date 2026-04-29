/**
 * CruiseKit — Princess Cruises visible data scraper
 * Waits for search results to render, then scrapes visible cruise cards
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function scrapePrincess() {
  console.log("🚢 Princess Cruises — visible DOM scrape\n");

  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  // Track all API responses with cruise data
  const apiData = [];
  page.on("response", async (resp) => {
    const url = resp.url();
    if (url.includes("gw.api.princess.com") && resp.status() === 200) {
      try {
        const ct = resp.headers()["content-type"] || "";
        if (ct.includes("json")) {
          const body = await resp.json();
          const str = JSON.stringify(body);
          apiData.push({ url: url.substring(0, 200), size: str.length, data: body });
          if (str.length > 1000) {
            console.log(`  API: ${(str.length/1024).toFixed(1)}KB — ${url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('/') + 50)}`);
          }
        }
      } catch {}
    }
  });

  try {
    console.log("  Loading search page...");
    await page.goto("https://www.princess.com/cruise-search/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait a long time for the SPA to fully render
    console.log("  Waiting 30s for full render...");
    await page.waitForTimeout(30000);

    // Check what's visible
    const pageInfo = await page.evaluate(() => {
      const body = document.body.innerText;
      const dollarAmounts = body.match(/\$[\d,]+/g) || [];

      // Look for any cruise result containers
      const allDivs = document.querySelectorAll('div');
      let cruiseCards = [];

      for (const div of allDivs) {
        const text = div.innerText || '';
        // A cruise card likely has: a price ($xxx), a duration (X Night), and a ship/destination
        if (text.includes('$') && /\d+\s*Night/i.test(text) && text.length < 2000 && text.length > 100) {
          // Check it's not a huge container
          const children = div.querySelectorAll('div');
          if (children.length < 30) {
            cruiseCards.push({
              text: text.substring(0, 500),
              tag: div.tagName,
              class: div.className?.substring(0, 100),
            });
          }
        }
      }

      return {
        title: document.title,
        dollarAmounts: [...new Set(dollarAmounts)].slice(0, 20),
        bodyLength: body.length,
        cruiseCards: cruiseCards.slice(0, 20),
        bodyPreview: body.substring(0, 1000),
      };
    });

    console.log("\n  Title:", pageInfo.title);
    console.log("  Body length:", pageInfo.bodyLength);
    console.log("  $ amounts found:", pageInfo.dollarAmounts.join(", ") || "none");
    console.log("  Cruise cards found:", pageInfo.cruiseCards.length);

    if (pageInfo.cruiseCards.length > 0) {
      pageInfo.cruiseCards.forEach((c, i) => {
        console.log(`\n  --- Card ${i + 1} ---`);
        console.log(c.text);
      });
    } else {
      console.log("\n  Page preview:\n", pageInfo.bodyPreview);
    }

    // Save all API data
    console.log(`\n  Total API responses: ${apiData.length}`);
    const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");

    for (const resp of apiData) {
      if (resp.size > 5000) {
        const name = resp.url.split('/').pop().split('?')[0];
        const filename = `princess-${name}.json`;
        fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(resp.data, null, 2));
        console.log(`  Saved ${filename} (${(resp.size/1024).toFixed(1)}KB)`);
      }
    }

    // Try scrolling and waiting more
    console.log("\n  Scrolling to load more...");
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollBy(0, 600));
      await page.waitForTimeout(2000);
    }

    // Final check for prices
    const finalPrices = await page.evaluate(() => {
      const body = document.body.innerText;
      const amounts = body.match(/\$[\d,]+/g) || [];
      return [...new Set(amounts)].slice(0, 30);
    });
    console.log("\n  Final $ amounts:", finalPrices.join(", ") || "none");

  } catch (e) {
    console.error("  Error:", e.message);
  }

  await browser.close();
  console.log("\nDone.");
}

scrapePrincess().catch(console.error);
