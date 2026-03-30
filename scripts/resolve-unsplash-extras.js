const { chromium } = require("playwright");

// Need unique images for ports that currently share the Nassau photo
const PHOTOS = {
  // Private islands / Bahamas variants
  "cococay": "Bj1cMUmFzsk",       // Perfect Day at CocoCay, Bahamas
  "bimini": "AyP5aHK1abY",         // Bimini, Bahamas beach
  "celebration key": "gKkpGmX-dTI", // Tropical Caribbean beach
  "half moon cay": "Bj1cMUmFzsk",  // Caribbean private island
  "great stirrup cay": "rbrSFhfH2Pw", // Bahamas beach
  // Individual islands
  "st. kitts": "iGapVlY7JuU",       // St Kitts Caribbean
  "puerto plata": "Y4fKN-RlMV4",    // Dominican Republic coast
  "montego bay": "XPMr_nDIMkU",     // Jamaica beach
  "port royal": "lj2x6RNV4vk",      // Jamaica harbor
  // San Juan might be broken
  "san juan check": "VPavA7BBxK0",   // Old San Juan colorful streets
};

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  });

  for (const [dest, slug] of Object.entries(PHOTOS)) {
    try {
      const page = await context.newPage();
      await page.goto(`https://unsplash.com/photos/${slug}`, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });
      await page.waitForTimeout(3000);

      const photoId = await page.evaluate(() => {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) return ogImage.content;
        return null;
      });

      if (photoId) {
        const match = photoId.match(/(photo-[a-f0-9-]+)/);
        if (match) {
          console.log(`${dest}: ${match[1]}`);
        }
      } else {
        console.log(`${dest}: NOT FOUND`);
      }
      await page.close();
    } catch (e) {
      console.log(`${dest}: ERROR ${e.message.substring(0, 60)}`);
    }
  }

  await browser.close();
}

main();
