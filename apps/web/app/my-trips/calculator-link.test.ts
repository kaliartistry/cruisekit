import { describe, expect, it } from "vitest";
import { buildCalculatorHref } from "./calculator-link";

const deal = {
  id: "icon sailing/2026",
  cruiseLineId: "royal-caribbean",
  shipName: "Icon of the Seas",
  duration: 7,
  departurePort: "Miami, Florida",
  ports: ["CocoCay"],
  fromPrice: 1299,
  departureDate: "2026-10-03",
  itineraryTitle: "7-night Caribbean cruise",
};

describe("buildCalculatorHref", () => {
  it("preserves the saved sailing context in encoded calculator params", () => {
    const url = new URL(
      buildCalculatorHref(deal),
      "https://cruisekit.app",
    );

    expect(url.pathname).toBe("/calculator");
    expect(url.searchParams.get("line")).toBe("royal-caribbean");
    expect(url.searchParams.get("duration")).toBe("7");
    expect(url.searchParams.get("adults")).toBe("2");
    expect(url.searchParams.get("fare")).toBe("1299");
    expect(url.searchParams.get("sailing")).toBe("icon sailing/2026");
    expect(url.searchParams.get("ship")).toBe("Icon of the Seas");
    expect(url.searchParams.get("departure")).toBe("2026-10-03");
    expect(url.searchParams.get("port")).toBe("Miami, Florida");
  });

  it("omits optional sailing params when an older saved deal lacks them", () => {
    const url = new URL(
      buildCalculatorHref({
        ...deal,
        id: undefined,
        shipName: "",
        departureDate: null,
        departurePort: "",
      }),
      "https://cruisekit.app",
    );

    expect(url.searchParams.has("sailing")).toBe(false);
    expect(url.searchParams.has("ship")).toBe(false);
    expect(url.searchParams.has("departure")).toBe(false);
    expect(url.searchParams.has("port")).toBe(false);
  });
});
