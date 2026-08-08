import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import MyCrewJoinPage, { metadata } from "./page";
import {
  InviteCodeDisplay,
  normalizePublicInviteCode,
  writePublicInviteCodeToClipboard,
} from "./invite-landing-client";

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

  it("copies a valid code only when the clipboard API is available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    await expect(
      writePublicInviteCodeToClipboard("ABC123", { writeText }),
    ).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("ABC123");

    await expect(
      writePublicInviteCodeToClipboard("ABC123", undefined),
    ).resolves.toBe(false);
    await expect(
      writePublicInviteCodeToClipboard("ABC123", {
        writeText: vi.fn().mockRejectedValue(new Error("not allowed")),
      }),
    ).resolves.toBe(false);
  });

  it("renders Copy and Copied states beside the invitation code", () => {
    const copyHtml = renderToStaticMarkup(
      <InviteCodeDisplay code="ABC123" copied={false} onCopy={() => {}} />,
    );
    const copiedHtml = renderToStaticMarkup(
      <InviteCodeDisplay code="ABC123" copied onCopy={() => {}} />,
    );

    expect(copyHtml).toContain("ABC123");
    expect(copyHtml).toContain("Copy invite code ABC123");
    expect(copyHtml).toContain(">Copy</button>");
    expect(copiedHtml).toContain(">Copied</button>");
  });

  it("is excluded from search indexing", () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });
});
