import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DesktopStoreQrCodes from "./desktop-store-qr-codes";

describe("desktop app handoff QR codes", () => {
  it("renders attributed Apple and Play destinations", () => {
    const html = renderToStaticMarkup(
      <DesktopStoreQrCodes sourceSurface="calculator_result" />,
    );

    expect(html).toContain("128557928");
    expect(html).toContain("cost_result");
    expect(html).toContain("referrer=");
    expect(html.match(/aria-label="Scan or open/g)).toHaveLength(2);
  });
});
