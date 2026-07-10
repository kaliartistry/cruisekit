import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PortTodayHeader from "./port-today-header";

describe("PortTodayHeader", () => {
  it("has a deterministic server and initial-client representation", () => {
    const props = {
      portName: "Cozumel",
      ianaTimeZone: "America/Cancun",
    };
    const firstRender = renderToStaticMarkup(<PortTodayHeader {...props} />);
    const secondRender = renderToStaticMarkup(<PortTodayHeader {...props} />);

    expect(firstRender).toBe(secondRender);
    expect(firstRender).toContain("Port local time");
    expect(firstRender).toContain("Your phone time");
    expect(firstRender).toContain("not ship time");
    expect(firstRender).toContain("—");
  });
});
