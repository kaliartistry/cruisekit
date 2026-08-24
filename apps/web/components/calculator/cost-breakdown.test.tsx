import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { buildTotalCruiseShareText, DeltaHero } from "./cost-breakdown";

describe("Total Cruise Cost result sharing", () => {
  it("renders a clearly named share control", () => {
    const html = renderToStaticMarkup(
      <DeltaHero
        lineName="Royal Caribbean"
        cruiseLineId="royal-caribbean"
        advertised={2400}
        real={3150}
        percentOver={31}
      />,
    );

    expect(html).toContain("Share result");
    expect(html).not.toContain("Share this gap");
  });

  it("shares a useful result summary without itinerary or party details", () => {
    const text = buildTotalCruiseShareText({ advertised: 2400, real: 3150 });

    expect(text).toContain("Fare: $2,400");
    expect(text).toContain("Estimated real total: $3,150");
    expect(text).toContain("https://cruisekit.app/calculator/");
    expect(text).not.toMatch(/ship|departure|itinerary|children|passenger/i);
  });
});
