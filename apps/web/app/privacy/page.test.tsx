import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyPage from "./page";

describe("privacy policy", () => {
  it("covers account, MyDay, MyCrew, diagnostics, payments, and deletion", () => {
    const html = renderToStaticMarkup(<PrivacyPage />);

    expect(html).toContain("anonymous Firebase Authentication");
    expect(html).toContain("Google or Apple sign-in");
    expect(html).toContain("Firebase Analytics and Firebase Crashlytics");
    expect(html).toContain("does not request or collect");
    expect(html).toContain("legacy MyCrew location records");
    expect(html).toContain("does not process cruise bookings, card payments");
    expect(html).toContain("Google Analytics off");
    expect(html).toContain("Change website analytics choice");
    expect(html).toContain('href="/account-deletion"');
  });
});
