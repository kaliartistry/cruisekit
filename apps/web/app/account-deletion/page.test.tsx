import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AccountDeletionPage, { metadata } from "./page";

describe("account deletion page", () => {
  it("identifies MyDay by CruiseKit and supports people without app access", () => {
    const html = renderToStaticMarkup(<AccountDeletionPage />);

    expect(html).toContain("Delete your MyDay by CruiseKit account");
    expect(html).toContain("Cannot access the app?");
    expect(html).toContain("Email a deletion request");
    expect(html).toContain("within 30 days");
    expect(html).toContain('href="/privacy"');
    expect(html).toContain('href="/contact"');
  });

  it("has canonical public metadata", () => {
    expect(metadata.alternates?.canonical).toBe(
      "https://cruisekit.app/account-deletion/",
    );
  });
});
