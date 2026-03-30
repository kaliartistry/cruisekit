const { chromium } = require("playwright");

const SEARCHES = [
  { dest: "st kitts", query: "basseterre saint kitts" },
  { dest: "great stirrup cay", query: "bahamas private island beach" },
  { dest: "half moon cay", query: "half moon cay bahamas" },
  { dest: "port royal", query: "port royal jamaica" },
  { dest: "puerto plata", query: "puerto plata dominican republic" },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  });

  for (const { dest, query } of SEARCHES) {
    try {
      const page = await context.newPage();
      await page.goto(`https://unsplash.com/s/photos/${encodeURIComponent(query)}`, {
        waitUntil: "domcontentloaded", timeout: 15000,
      });
      await page.waitForTimeout(4000);
      const results = await page.evaluate(() => {
        const imgs = document.querySelectorAll('img[srcset*="images.unsplash.com"]');
        const found = [];
        for (const img of Array.from(imgs).slice(0, 3)) {
          const match = (img.srcset || img.src || "").match(/(photo-[a-f0-9-]+)/);
          if (match && !found.includes(match[1])) found.push(match[1]);
        }
        return found;
      });
      console.log(`${dest}: ${results[0] || "none"}`);
      await page.close();
    } catch (e) {
      console.log(`${dest}: ERROR`);
    }
  }
  await browser.close();
}
main();
