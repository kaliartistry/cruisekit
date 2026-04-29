/**
 * CruiseKit — Princess Cruises scraper
 * Uses page.evaluate to call pricing API from within the authenticated browser session
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function scrapePrincess() {
  console.log("🚢 Princess Cruises — in-page API scrape\n");

  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  // Capture the appid header for reuse
  let appIdHeader = null;
  let clientIdHeader = null;

  page.on("request", (req) => {
    if (req.url().includes("gw.api.princess.com")) {
      const h = req.headers();
      if (h.appid) appIdHeader = h.appid;
      if (h["pcl-client-id"]) clientIdHeader = h["pcl-client-id"];
    }
  });

  try {
    console.log("  Loading search page (domcontentloaded only)...");
    await page.goto("https://www.princess.com/cruise-search/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    // Wait for API calls to happen
    await page.waitForTimeout(20000);

    console.log("  appId captured:", !!appIdHeader);
    console.log("  clientId captured:", clientIdHeader);

    if (!appIdHeader || !clientIdHeader) {
      console.log("  ❌ No credentials captured");
      await browser.close();
      return;
    }

    // Now call the products endpoint from within the page
    console.log("\n  Fetching products from within page context...");
    const products = await page.evaluate(async ({ appId, clientId }) => {
      const resp = await fetch("https://gw.api.princess.com/pcl-web/internal/resdb/p1.0/products?agencyCountry=US&cruiseType=C&voyageStatus=A&webDisplayOnly=true", {
        headers: {
          "appid": appId,
          "pcl-client-id": clientId,
          "Accept": "application/json",
        }
      });
      return await resp.json();
    }, { appId: appIdHeader, clientId: clientIdHeader });

    const prods = products?.products || [];
    console.log(`  Got ${prods.length} products`);

    // Filter to Caribbean
    const caribbean = prods.filter(p =>
      p.trades?.some(t => ["C", "W", "E", "S"].includes(t.id))
    );
    console.log(`  Caribbean products: ${caribbean.length}`);

    // Fetch ships for name mapping
    const shipsData = await page.evaluate(async ({ appId, clientId }) => {
      const resp = await fetch("https://gw.api.princess.com/pcl-web/internal/resdb/p1.0/ships", {
        headers: { "appid": appId, "pcl-client-id": clientId, "Accept": "application/json" }
      });
      return await resp.json();
    }, { appId: appIdHeader, clientId: clientIdHeader });

    const shipMap = {};
    if (shipsData?.ships) {
      for (const s of shipsData.ships) {
        shipMap[s.id] = s.name;
      }
    }
    console.log("  Ships:", Object.values(shipMap).join(", "));

    // Fetch ports for name mapping
    const portsData = await page.evaluate(async ({ appId, clientId }) => {
      const resp = await fetch("https://gw.api.princess.com/pcl-web/internal/resdb/p1.0/ports", {
        headers: { "appid": appId, "pcl-client-id": clientId, "Accept": "application/json" }
      });
      return await resp.json();
    }, { appId: appIdHeader, clientId: clientIdHeader });

    const portMap = {};
    if (portsData?.ports) {
      for (const p of portsData.ports) {
        portMap[p.id] = p.name;
      }
    }

    // Now fetch pricing for each Caribbean product (batch of 20)
    const sailings = [];
    const batch = caribbean.slice(0, 30); // First 30 Caribbean products

    for (let i = 0; i < batch.length; i++) {
      const prod = batch[i];
      const ship = prod.ships?.[0];
      if (!ship?.sailDates?.[0]) continue;

      const sailDate = ship.sailDates[0];
      const voyageCode = `${ship.id}${prod.id}${sailDate}`;

      try {
        const pricing = await page.evaluate(async ({ appId, clientId, prodId, shipId, sd }) => {
          // Try the pricing/availability endpoint
          const url = `https://gw.api.princess.com/pcl-web/internal/resdb/p1.0/pricing?cruiseId=${prodId}&sailDate=${sd}&shipId=${shipId}&agencyCountry=US&numGuests=2`;
          const resp = await fetch(url, {
            headers: { "appid": appId, "pcl-client-id": clientId, "Accept": "application/json" }
          });
          if (resp.ok) return await resp.json();
          return { error: resp.status };
        }, { appId: appIdHeader, clientId: clientIdHeader, prodId: prod.id, shipId: ship.id, sd: sailDate });

        if (pricing && !pricing.error) {
          const str = JSON.stringify(pricing);
          // Extract lowest price
          let lowestPrice = Infinity;
          const priceMatches = str.match(/"(?:price|fare|amount|total)":\s*(\d+(?:\.\d+)?)/gi) || [];
          for (const m of priceMatches) {
            const val = parseFloat(m.split(":")[1]);
            if (val > 50 && val < lowestPrice) lowestPrice = val;
          }

          const embark = prod.embkDbkPortIds?.[0] || "";
          sailings.push({
            cruiseLine: "princess",
            shipName: shipMap[ship.id] || ship.id,
            duration: prod.cruiseDuration || 0,
            departurePort: portMap[embark] || embark,
            itineraryTitle: prod.id,
            fromPrice: lowestPrice === Infinity ? 0 : Math.round(lowestPrice),
            currency: "USD",
            departureDate: sailDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"),
            ports: [],
            imageUrl: null,
          });

          if (lowestPrice < Infinity) {
            console.log(`  [${i+1}/${batch.length}] ${shipMap[ship.id] || ship.id} | ${prod.cruiseDuration}nt | $${Math.round(lowestPrice)} | ${portMap[embark] || embark}`);
          } else {
            console.log(`  [${i+1}/${batch.length}] ${prod.id} — no price in response (${(str.length/1024).toFixed(1)}KB)`);
          }
        } else {
          console.log(`  [${i+1}/${batch.length}] ${prod.id} — error ${pricing?.error || "unknown"}`);
        }
      } catch (e) {
        console.log(`  [${i+1}/${batch.length}] ${prod.id} — ${e.message.substring(0, 60)}`);
      }

      // Small delay to not overwhelm
      await page.waitForTimeout(500);
    }

    const withPrice = sailings.filter(s => s.fromPrice > 0);
    console.log(`\n  Total with prices: ${withPrice.length}`);

    if (withPrice.length > 0) {
      const outputDir = path.join(__dirname, "..", "apps", "web", "lib", "data", "scraped");
      fs.writeFileSync(path.join(outputDir, "princess-sailings.json"), JSON.stringify({
        scrapedAt: new Date().toISOString(),
        source: "princess.com (API with captured credentials)",
        totalSailings: withPrice.length,
        sailings: withPrice,
      }, null, 2));
      console.log("  Saved princess-sailings.json");
    }

  } catch (e) {
    console.error("  Error:", e.message);
  }

  await browser.close();
  console.log("\nDone.");
}

scrapePrincess().catch(console.error);
