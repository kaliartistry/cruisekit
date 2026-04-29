/**
 * CruiseKit — Celebrity Cruises + MSC Scraper (Intercept)
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function scrapeLine(name, url, outputName) {
  console.log(`\n🚢 Scraping ${name}...\n`);

  const browser = await chromium.launch({ headless: false, args: ["--disable-blink-features=AutomationControlled"] });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const responses = [];

  page.on("response", async (response) => {
    const rUrl = response.url();
    const ct = response.headers()["content-type"] || "";
    if (ct.includes("json") && response.status() === 200) {
      try {
        const body = await response.json();
        const str = JSON.stringify(body);
        if (str.length > 5000 && (str.includes("price") || str.includes("Price")) && (str.includes("ship") || str.includes("Ship") || str.includes("cruise") || str.includes("itinerar"))) {
          responses.push({ url: rUrl.substring(0, 200), size: str.length, data: body });
          console.log(`  ✅ ${(str.length/1024).toFixed(1)}KB: ${rUrl.substring(0, 100)}`);
        }
      } catch {}
    }
  });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(15000);
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 1000));
      await page.waitForTimeout(3000);
    }

    console.log(`  Responses captured: ${responses.length}`);
    if (responses.length > 0) {
      const best = responses.sort((a, b) => b.size - a.size)[0];
      const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(path.join(outputDir, `${outputName}-intercepted.json`), JSON.stringify(best.data, null, 2));
      console.log(`  Saved ${(best.size/1024).toFixed(1)}KB to ${outputName}-intercepted.json`);
      console.log(`  Keys:`, Object.keys(best.data).join(", "));
    } else {
      const title = await page.title();
      console.log(`  No data. Title: ${title}`);
    }
  } catch (e) {
    console.error(`  Error: ${e.message}`);
  }
  await browser.close();
}

(async () => {
  await scrapeLine("Celebrity Cruises", "https://www.celebritycruises.com/cruises?destinationIds=CARIB", "celebrity");
  await scrapeLine("MSC Cruises", "https://www.msccruisesusa.com/cruise/destinations/caribbean", "msc-full");
})();
