import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { baselinePortGovernance } from "@/lib/ports/port-governance";
import PortGuideStatus from "./port-guide-status";

describe("PortGuideStatus", () => {
  it("visibly discloses an unfinished editorial review", () => {
    const html = renderToStaticMarkup(
      <PortGuideStatus governance={baselinePortGovernance()} />,
    );

    expect(html).toContain("Needs source review");
    expect(html).toContain("Editorial last reviewed:");
    expect(html).toContain("Not yet source-reviewed");
    expect(html).toContain("Editorial details have not completed source review");
    expect(html).toContain("safety, prices, and emergency information");
    expect(html).toContain("official sources");
  });

  it("distinguishes stale and blocked review states", () => {
    const stale = baselinePortGovernance();
    stale.reviewStatus = "stale";
    const blocked = baselinePortGovernance();
    blocked.reviewStatus = "blocked";

    expect(
      renderToStaticMarkup(<PortGuideStatus governance={stale} />),
    ).toContain("Review expired");
    expect(
      renderToStaticMarkup(<PortGuideStatus governance={blocked} />),
    ).toContain("Review blocked");
  });

  it("renders review dates from governance metadata", () => {
    const governance = baselinePortGovernance();
    governance.reviewStatus = "reviewed";
    governance.lastEditorialReviewAt = "2026-07-08";
    const html = renderToStaticMarkup(
      <PortGuideStatus governance={governance} />,
    );

    expect(html).toContain("Source-reviewed");
    expect(html).toContain("Jul 8, 2026");
    expect(html).toContain("Time zone checked:");
    expect(html).toContain("Jul 9, 2026");
  });
});
