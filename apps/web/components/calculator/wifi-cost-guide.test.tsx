import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LineWifiSummary, WifiCostGuide } from "./wifi-cost-guide";

describe("cruise Wi-Fi cost guidance", () => {
  it("renders the hub anchor, line tiers, voyage totals, and honest usage note", () => {
    const html = renderToStaticMarkup(<WifiCostGuide />);

    expect(html).toContain('id="wifi"');
    expect(html).toContain("Cruise WiFi cost calculator");
    expect(html).toContain("$20.40");
    expect(html).toContain("$22.00");
    expect(html).toContain("$11.20 per plan on a 7-night cruise");
    expect(html).toContain("port-heavy itinerary");
    expect(html).toContain("Royal Caribbean and Celebrity prices vary by sailing");
    expect(html).not.toContain("/cruise-wifi-calculator");
  });

  it("links a line summary back to the single hub and never renders a fake $0 dynamic price", () => {
    const html = renderToStaticMarkup(
      <LineWifiSummary
        cruiseLineId="celebrity"
        displayName="Celebrity Cruises"
      />,
    );

    expect(html).toContain('href="/calculator#wifi"');
    expect(html).toContain("Enter your current sailing quote");
    expect(html).not.toContain("$0.00");
  });
});
