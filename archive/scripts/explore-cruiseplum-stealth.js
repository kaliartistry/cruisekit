const { chromium } = require("playwright-extra");
const stealth = require("puppeteer-extra-plugin-stealth")();

// Add stealth plugin to avoid Cloudflare detection
chromium.use(stealth);

(async () => {
  console.log("Launching stealth browser...");
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
    ],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1920, height: 1080 },
    locale: "en-US",
  });

  const page = await context.newPage();

  try {
    console.log("Loading CruisePlum hot deals...");
    await page.goto("https://www.cruiseplum.com/hot", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Wait longer for Cloudflare challenge to resolve
    console.log("Waiting for Cloudflare challenge...");
    await page.waitForTimeout(15000);

    const currentUrl = page.url();
    const title = await page.title();
    console.log("Current URL:", currentUrl);
    console.log("Title:", title);

    // Check if we got past Cloudflare
    const bodyText = await page.evaluate(() => document.body.innerText);
    const isBlocked = bodyText.includes("security verification") || bodyText.includes("Cloudflare");

    if (isBlocked) {
      console.log("\nStill blocked by Cloudflare.");
      console.log("Body preview:", bodyText.substring(0, 300));
    } else {
      console.log("\nGot through! Page content:");
      const lines = bodyText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 5);

      lines.slice(0, 40).forEach((l, i) =>
        console.log(`  [${i}]`, l.substring(0, 150))
      );

      // Look for price data
      const priceLines = lines.filter((l) => l.includes("$"));
      console.log("\n--- Lines with prices (" + priceLines.length + ") ---");
      priceLines.slice(0, 20).forEach((l) =>
        console.log("  ", l.substring(0, 150))
      );
    }
  } catch (e) {
    console.error("Error:", e.message);
  }

  await browser.close();
  console.log("\nDone.");
})();
