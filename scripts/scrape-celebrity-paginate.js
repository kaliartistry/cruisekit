/**
 * CruiseKit — Celebrity Cruises scraper with pagination
 * Same GraphQL structure as Royal Caribbean (same parent company RCG)
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const CELEBRITY_SHIPS = {
  RF: "Celebrity Reflection", SL: "Celebrity Solstice", EQ: "Celebrity Equinox",
  SI: "Celebrity Silhouette", ED: "Celebrity Edge", AP: "Celebrity Apex",
  BY: "Celebrity Beyond", AS: "Celebrity Ascent", ML: "Celebrity Millennium",
  IN: "Celebrity Infinity", SM: "Celebrity Summit", CO: "Celebrity Constellation",
  XC: "Celebrity Xcel", FL: "Celebrity Flora",
};

async function scrapeCelebrity() {
  console.log("🚢 Celebrity Cruises — paginated scrape\n");

  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  const allCruises = new Map();

  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("graph") && url.includes("celebritycruises") && response.status() === 200) {
      try {
        const body = await response.json();
        const cruises = body?.data?.cruiseSearch?.results?.cruises || [];
        if (cruises.length > 0) {
          for (const c of cruises) {
            if (!allCruises.has(c.id)) allCruises.set(c.id, c);
          }
          console.log(`  +${cruises.length} cruises (total unique: ${allCruises.size})`);
        }
      } catch {}
    }
  });

  try {
    await page.goto("https://www.celebritycruises.com/cruises", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForTimeout(10000);
    console.log("  Page loaded. Scrolling...");

    for (let i = 0; i < 30; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);
      try {
        const btn = await page.$('button:has-text("Show More"), button:has-text("Load More"), button:has-text("View More"), [data-testid="show-more"]');
        if (btn) {
          await btn.click();
          console.log("  Clicked load more");
          await page.waitForTimeout(3000);
        }
      } catch {}
      if (allCruises.size >= 100) break;
    }

    console.log(`\n  Final: ${allCruises.size} itineraries`);

    const sailings = [];
    for (const [, cruise] of allCruises) {
      const ms = cruise.masterSailing;
      const itin = ms?.itinerary;
      const shipCode = itin?.code?.substring(0, 2) || "";
      const shipName = CELEBRITY_SHIPS[shipCode] || shipCode;
      const ports = itin?.days?.filter(d => d.type === "PORT")
        .flatMap(d => d.ports?.map(p => p.port?.name).filter(Boolean) || []) || [];
      const uniquePorts = [...new Set(ports)];
      const duration = itin?.days?.length ? itin.days.length - 1 : 0;
      const image = itin?.media?.images?.[0]?.path
        ? "https://www.celebritycruises.com" + itin.media.images[0].path
        : null;
      const departurePort = itin?.days?.[0]?.ports?.[0]?.port?.name || "";
      const lps = cruise.lowestPriceSailing;
      const price = lps?.lowestStateroomClassPrice?.price?.value || 0;

      sailings.push({
        cruiseLine: "celebrity",
        shipName, shipCode, duration, departurePort,
        itineraryTitle: itin?.name || "",
        fromPrice: Math.round(price),
        currency: "USD",
        departureDate: lps?.sailDate || "",
        ports: uniquePorts.filter(p => p !== departurePort),
        imageUrl: image,
        bookingUrl: lps?.bookingLink ? "https://www.celebritycruises.com" + lps.bookingLink : null,
      });
    }

    const withPrice = sailings.filter(s => s.fromPrice > 0);
    console.log(`  ${withPrice.length} with prices`);

    const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
    fs.writeFileSync(path.join(outputDir, "celebrity-sailings.json"), JSON.stringify({
      scrapedAt: new Date().toISOString(),
      source: "celebritycruises.com (GraphQL intercepted, paginated)",
      totalSailings: withPrice.length,
      sailings: withPrice,
    }, null, 2));
    console.log("  Saved celebrity-sailings.json");
  } catch (e) {
    console.error("  Error:", e.message);
  }
  await browser.close();
}

scrapeCelebrity().catch(console.error);
