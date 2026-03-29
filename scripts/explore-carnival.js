const { chromium } = require("playwright");

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Carnival's cruise search page
    console.log("Loading Carnival Caribbean cruises...");
    await page.goto(
      "https://www.carnival.com/cruise-to/caribbean-cruises?numGuests=2&pageNumber=1&pageSize=10&sort=priceLow&dur=6to9",
      { waitUntil: "domcontentloaded", timeout: 30000 }
    );

    console.log("Waiting for content...");
    await page.waitForTimeout(8000);

    const title = await page.title();
    console.log("Title:", title);

    const bodyText = await page.evaluate(() => document.body.innerText);
    const isBlocked =
      bodyText.includes("security verification") ||
      bodyText.includes("Cloudflare") ||
      bodyText.includes("Access Denied");

    if (isBlocked) {
      console.log("Blocked! Preview:", bodyText.substring(0, 300));
    } else {
      const lines = bodyText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 5);

      // Find lines with prices
      const priceLines = lines.filter(
        (l) => l.includes("$") || l.includes("Night") || l.includes("person")
      );
      console.log("Price lines found:", priceLines.length);
      priceLines.slice(0, 25).forEach((l) =>
        console.log("  ", l.substring(0, 150))
      );

      console.log("\n--- First 40 content lines ---");
      lines.slice(0, 40).forEach((l, i) =>
        console.log(`  [${i}]`, l.substring(0, 150))
      );
    }
  } catch (e) {
    console.error("Error:", e.message);
  }

  await browser.close();
  console.log("Done.");
})();
