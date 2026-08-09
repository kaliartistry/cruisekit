const canonicalLicenseUrls = new Map([
  [
    "Attribution only license",
    ["https://commons.wikimedia.org/wiki/Template:Attribution_only_license"],
  ],
  ["CC BY 2.0", ["https://creativecommons.org/licenses/by/2.0"]],
  ["CC BY 3.0", ["https://creativecommons.org/licenses/by/3.0"]],
  ["CC BY 4.0", ["https://creativecommons.org/licenses/by/4.0"]],
  ["CC BY-SA 2.0", ["https://creativecommons.org/licenses/by-sa/2.0"]],
  ["CC BY-SA 2.5", ["https://creativecommons.org/licenses/by-sa/2.5"]],
  ["CC BY-SA 3.0", ["https://creativecommons.org/licenses/by-sa/3.0"]],
  ["CC BY-SA 4.0", ["https://creativecommons.org/licenses/by-sa/4.0"]],
  ["CC0 1.0", ["https://creativecommons.org/publicdomain/zero/1.0"]],
  [
    "Public domain",
    [
      "https://commons.wikimedia.org/wiki/Template:PD-author-FlickrPDM",
      "https://commons.wikimedia.org/wiki/Template:PD-user-en",
    ],
  ],
  [
    "Public domain U.S. Coast Guard work",
    ["https://commons.wikimedia.org/wiki/Template:PD-USCG"],
  ],
  [
    "Public domain release by the photographer",
    [
      "https://commons.wikimedia.org/wiki/Template:PD-self",
      "https://commons.wikimedia.org/wiki/Template:PD-user-de",
    ],
  ],
]);

function normalizeLicenseUrl(value) {
  const url = new URL(String(value ?? "").trim());
  if (url.hostname === "creativecommons.org") url.protocol = "https:";
  url.hash = "";
  url.search = "";
  url.pathname = url.pathname.replace(/\/+$/, "");
  return url.toString().replace(/\/$/, "");
}

export const COMMERCIAL_SHIP_IMAGE_LICENSES = new Set(
  canonicalLicenseUrls.keys(),
);

export function isCommercialShipImageLicense(value) {
  return COMMERCIAL_SHIP_IMAGE_LICENSES.has(String(value ?? "").trim());
}

export function hasCanonicalShipImageLicenseUrl(license, licenseUrl) {
  const expectedUrls = canonicalLicenseUrls.get(String(license ?? "").trim());
  if (!expectedUrls || typeof licenseUrl !== "string" || !licenseUrl.trim()) {
    return false;
  }
  try {
    const normalized = normalizeLicenseUrl(licenseUrl);
    return expectedUrls.some(
      (expected) => normalizeLicenseUrl(expected) === normalized,
    );
  } catch {
    return false;
  }
}
