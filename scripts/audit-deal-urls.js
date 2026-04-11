const fs = require('fs');
const dir = 'apps/web/lib/data/scraped';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(dir + '/' + f, 'utf8'));
  const sailings = data.sailings || data;
  if (!Array.isArray(sailings)) { console.log(f, '- not array'); continue; }
  const total = sailings.length;
  const withUrl = sailings.filter(s => s.bookingUrl || s.itineraryUrl || s.detailUrl || s.url).length;
  const sample = sailings.find(s => s.bookingUrl || s.itineraryUrl || s.detailUrl || s.url);
  const sampleUrl = sample ? (sample.bookingUrl || sample.itineraryUrl || sample.detailUrl || sample.url) : 'NONE';
  console.log(f.padEnd(30), (withUrl + '/' + total).padEnd(12), sampleUrl ? sampleUrl.substring(0, 100) : 'NONE');
}
