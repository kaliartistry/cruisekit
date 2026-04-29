/**
 * CruiseKit — Princess + Holland America Scraper (Intercept)
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function scrapeLine(name, url, outputName, waitMs = 15000) {
  console.log(`\n🚢 Scraping ${name}...\n`);

  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  });
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
        if (str.length > 2000) {
          const hasPrice = /price|fare|cost|rate/i.test(str);
          const hasCruise = /ship|cruise|itinerar|voyage|sailing|cabin|stateroom/i.test(str);
          if (hasPrice || hasCruise) {
            responses.push({
              url: rUrl.substring(0, 200),
              size: str.length,
              hasPrice,
              hasCruise,
              data: body,
            });
            if (str.length > 5000) {
              console.log(`  ✅ ${(str.length/1024).toFixed(1)}KB (price:${hasPrice} cruise:${hasCruise}): ${rUrl.substring(0, 120)}`);
            }
          }
        }
      } catch {}
    }
  });

  try {
    console.log(`  Loading ${url}...`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(waitMs);

    // Scroll
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);
    }

    const title = await page.title();
    console.log(`  Title: ${title}`);
    console.log(`  Total responses: ${responses.length}`);

    const priceCruise = responses.filter(r => r.hasPrice && r.hasCruise);
    console.log(`  Price+Cruise responses: ${priceCruise.length}`);

    if (priceCruise.length > 0) {
      const best = priceCruise.sort((a, b) => b.size - a.size)[0];
      const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(
        path.join(outputDir, `${outputName}-intercepted.json`),
        JSON.stringify(best.data, null, 2)
      );
      console.log(`  Saved ${(best.size/1024).toFixed(1)}KB to ${outputName}-intercepted.json`);
      console.log(`  Top-level keys:`, Object.keys(best.data).join(", "));
      console.log(`  Preview:`, JSON.stringify(best.data).substring(0, 500));
    } else if (responses.length > 0) {
      console.log(`\n  All responses:`);
      responses.forEach((r, i) => {
        console.log(`  [${i}] ${(r.size/1024).toFixed(1)}KB price:${r.hasPrice} cruise:${r.hasCruise} ${r.url.substring(0, 100)}`);
      });
      // Save the largest anyway
      const best = responses.sort((a, b) => b.size - a.size)[0];
      const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
      fs.writeFileSync(
        path.join(outputDir, `${outputName}-intercepted.json`),
        JSON.stringify(best.data, null, 2)
      );
      console.log(`  Saved largest response (${(best.size/1024).toFixed(1)}KB)`);
    } else {
      const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 300));
      console.log(`  ❌ No responses. Page text: ${bodyText.substring(0, 200)}`);
    }
  } catch (e) {
    console.error(`  Error: ${e.message}`);
  }
  await browser.close();
}

(async () => {
  await scrapeLine(
    "Princess Cruises",
    "https://www.princess.com/cruise-search/#caribbean",
    "princess"
  );
  await scrapeLine(
    "Holland America Line",
    "https://www.hollandamerica.com/en/us/find-a-cruise?destinationType=caribbean",
    "hal"
  );
})();
