const { chromium } = require("playwright");

async function checkLine(name, url) {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`Checking: ${name}`);
  console.log(`${"=".repeat(50)}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const apiCalls = [];

  page.on("response", async (response) => {
    const rUrl = response.url();
    const ct = response.headers()["content-type"] || "";
    if (ct.includes("json") && response.status() === 200) {
      if (
        !rUrl.includes("analytics") && !rUrl.includes("tracking") &&
        !rUrl.includes("cookie") && !rUrl.includes("consent") &&
        !rUrl.includes("tag") && !rUrl.includes("pixel") &&
        !rUrl.includes("mpulse") && !rUrl.includes("optimizely") &&
        !rUrl.includes("teads") && !rUrl.includes("google")
      ) {
        try {
          const body = await response.json();
          const str = JSON.stringify(body);
          if (str.length > 2000 && (str.includes("price") || str.includes("Price") || str.includes("ship") || str.includes("Ship") || str.includes("sailing") || str.includes("itinerar"))) {
            apiCalls.push({
              url: rUrl.substring(0, 200),
              size: str.length,
              preview: str.substring(0, 400),
            });
          }
        } catch {}
      }
    }
  });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(10000);
    await page.evaluate(() => window.scrollBy(0, 2000));
    await page.waitForTimeout(5000);

    if (apiCalls.length === 0) {
      const text = await page.evaluate(() => document.body.innerText);
      if (text.includes("Cloudflare") || text.includes("security")) {
        console.log("  ⛔ Blocked by bot protection");
      } else {
        console.log("  No pricing API found. Title:", await page.title());
      }
    } else {
      apiCalls.forEach((call, i) => {
        console.log(`\n  ✅ [${i + 1}] ${call.url}`);
        console.log(`     Size: ${(call.size / 1024).toFixed(1)}KB`);
        console.log(`     Preview: ${call.preview.substring(0, 300)}`);
      });
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
  }
  await browser.close();
}

(async () => {
  await checkLine("Royal Caribbean", "https://www.royalcaribbean.com/cruises?destinationIds=CARIB");
  await checkLine("Princess", "https://www.princess.com/find-a-cruise/");
  await checkLine("Disney", "https://disneycruise.disney.go.com/cruises-destinations/list/#caribbean");
})();
