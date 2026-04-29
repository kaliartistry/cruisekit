const { chromium } = require("playwright");

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Intercept API calls to find where prices come from
  const apiCalls = [];
  page.on("response", async (response) => {
    const url = response.url();
    if (
      url.includes("api") ||
      url.includes("search") ||
      url.includes("price") ||
      url.includes("sailing") ||
      url.includes("itinerar")
    ) {
      const status = response.status();
      const contentType = response.headers()["content-type"] || "";
      if (contentType.includes("json")) {
        try {
          const body = await response.json();
          apiCalls.push({
            url: url.substring(0, 200),
            status,
            dataPreview: JSON.stringify(body).substring(0, 500),
          });
        } catch {
          apiCalls.push({ url: url.substring(0, 200), status, dataPreview: "could not parse" });
        }
      }
    }
  });

  try {
    console.log("Loading Carnival Caribbean search...");
    await page.goto(
      "https://www.carnival.com/cruise-to/caribbean-cruises?numGuests=2&pageNumber=1&pageSize=10&sort=priceLow&dur=6to9",
      { waitUntil: "domcontentloaded", timeout: 30000 }
    );

    console.log("Waiting for API calls...");
    await page.waitForTimeout(12000);

    // Scroll down to trigger lazy loading
    await page.evaluate(() => window.scrollBy(0, 2000));
    await page.waitForTimeout(5000);

    console.log("\n--- API calls intercepted (" + apiCalls.length + ") ---");
    apiCalls.forEach((call, i) => {
      console.log(`\n[${i}] ${call.url}`);
      console.log(`    Status: ${call.status}`);
      console.log(`    Data: ${call.dataPreview}`);
    });

  } catch (e) {
    console.error("Error:", e.message);
  }

  await browser.close();
  console.log("\nDone.");
})();
