import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MyCrewJoinPage, { metadata } from "./page";
import { normalizePublicInviteCode } from "./invite-landing-client";

describe("MyCrew invitation landing", () => {
  it("renders an honest app handoff without account data", () => {
    const html = renderToStaticMarkup(<MyCrewJoinPage />);

    expect(html).toContain("Join the crew in MyDay by CruiseKit");
    expect(html).toContain("does not claim that the app opened");
    expect(html).toContain("does not read or display any CruiseKit account");
    expect(html).toContain("App Store");
    expect(html).toContain("Google Play");
  });

  it("normalizes only valid six-character public codes", () => {
    expect(normalizePublicInviteCode(" ab-c123 ")).toBe("ABC123");
    expect(normalizePublicInviteCode("too-long")).toBeNull();
    expect(normalizePublicInviteCode("<script>")).toBeNull();
  });

  it("is excluded from search indexing", () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });
});
