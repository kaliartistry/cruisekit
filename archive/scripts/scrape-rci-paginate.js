/**
 * CruiseKit — Royal Caribbean scraper with pagination
 * Captures all GraphQL responses as the user scrolls/paginates
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const SHIP_CODES = {
  WN: "Wonder of the Seas", IC: "Icon of the Seas", ST: "Star of the Seas",
  UT: "Utopia of the Seas", AL: "Allure of the Seas", OA: "Oasis of the Seas",
  HM: "Harmony of the Seas", SY: "Symphony of the Seas", AN: "Anthem of the Seas",
  QN: "Quantum of the Seas", OV: "Ovation of the Seas", SP: "Spectrum of the Seas",
  FR: "Freedom of the Seas", LB: "Liberty of the Seas", IN: "Independence of the Seas",
  NV: "Navigator of the Seas", MR: "Mariner of the Seas", EX: "Explorer of the Seas",
  VY: "Voyager of the Seas", AD: "Adventure of the Seas", JW: "Jewel of the Seas",
  BR: "Brilliance of the Seas", SR: "Serenade of the Seas", RD: "Radiance of the Seas",
  VI: "Vision of the Seas", GR: "Grandeur of the Seas", RH: "Rhapsody of the Seas",
  EN: "Enchantment of the Seas",
};

async function scrapeRCI() {
  console.log("🚢 Royal Caribbean — paginated scrape\n");

  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  const allCruises = new Map(); // dedup by ID

  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("graph") && url.includes("royalcaribbean") && response.status() === 200) {
      try {
        const body = await response.json();
        const cruises = body?.data?.cruiseSearch?.results?.cruises || [];
        if (cruises.length > 0) {
          for (const c of cruises) {
            if (!allCruises.has(c.id)) {
              allCruises.set(c.id, c);
            }
          }
          console.log(`  +${cruises.length} cruises (total unique: ${allCruises.size})`);
        }
      } catch {}
    }
  });

  try {
    await page.goto("https://www.royalcaribbean.com/cruises", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForTimeout(10000);
    console.log("  Page loaded. Scrolling to trigger pagination...");

    // Scroll aggressively to trigger infinite scroll / load more
    for (let i = 0; i < 30; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);

      // Try clicking "Show More" or similar buttons
      try {
        const btn = await page.$('button:has-text("Show More"), button:has-text("Load More"), button:has-text("View More"), [data-testid="show-more"]');
        if (btn) {
          await btn.click();
          console.log("  Clicked load more button");
          await page.waitForTimeout(3000);
        }
      } catch {}

      if (allCruises.size >= 100) {
        console.log("  Got 100+ cruises, stopping scroll");
        break;
      }
    }

    console.log(`\n  Final count: ${allCruises.size} unique cruise itineraries`);

    // Parse all
    const sailings = [];
    for (const [, cruise] of allCruises) {
      const ms = cruise.masterSailing;
      const itin = ms?.itinerary;
      const shipCode = itin?.code?.substring(0, 2) || "";
      const shipName = SHIP_CODES[shipCode] || shipCode;
      const ports = itin?.days?.filter(d => d.type === "PORT")
        .flatMap(d => d.ports?.map(p => p.port?.name).filter(Boolean) || []) || [];
      const uniquePorts = [...new Set(ports)];
      const duration = itin?.days?.length ? itin.days.length - 1 : 0;
      const image = itin?.media?.images?.[0]?.path
        ? "https://www.royalcaribbean.com" + itin.media.images[0].path
        : null;
      const departurePort = itin?.days?.[0]?.ports?.[0]?.port?.name || "";
      const lps = cruise.lowestPriceSailing;
      const price = lps?.lowestStateroomClassPrice?.price?.value || 0;

      sailings.push({
        cruiseLine: "royal-caribbean",
        shipName, shipCode, duration, departurePort,
        itineraryTitle: itin?.name || "",
        fromPrice: Math.round(price),
        currency: "USD",
        departureDate: lps?.sailDate || "",
        ports: uniquePorts.filter(p => p !== departurePort),
        imageUrl: image,
        bookingUrl: lps?.bookingLink ? "https://www.royalcaribbean.com" + lps.bookingLink : null,
        totalSailingDates: cruise.sailings?.length || 0,
      });
    }

    const withPrice = sailings.filter(s => s.fromPrice > 0);
    console.log(`  ${withPrice.length} sailings with prices`);

    const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
    fs.writeFileSync(path.join(outputDir, "rci-sailings.json"), JSON.stringify({
      scrapedAt: new Date().toISOString(),
      source: "royalcaribbean.com (GraphQL intercepted, paginated)",
      totalSailings: withPrice.length,
      sailings: withPrice,
    }, null, 2));
    console.log("  Saved rci-sailings.json");

  } catch (e) {
    console.error("  Error:", e.message);
  }

  await browser.close();
}

scrapeRCI().catch(console.error);
