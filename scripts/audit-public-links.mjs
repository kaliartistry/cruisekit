#!/usr/bin/env node
/**
 * Audits public data links without mutating source data.
 *
 * By default this performs deterministic local checks only. Set
 * LIVE_LINK_AUDIT=1 to also issue HTTP requests; live failures are reported as
 * warnings because some travel sites block automated HEAD/GET probes.
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(repoRoot, "data/reports");
const liveAudit = process.env.LIVE_LINK_AUDIT === "1";
const allowedCruiseDomains = [
  "carnival.com",
  "azamara.com",
  "ncl.com",
  "royalcaribbean.com",
  "celebritycruises.com",
  "princess.com",
  "hollandamerica.com",
  "msccruisesusa.com",
  "disneycruise.disney.go.com",
  "virginvoyages.com",
];
const allowedAffiliateDomains = [
  "awin1.com",
  "viator.com",
  "booking.com",
  "medjetassist.com",
  "samboat.com",
];

async function loadJson(relPath) {
  return JSON.parse(await readFile(resolve(repoRoot, relPath), "utf8"));
}

function add(list, severity, id, message, url = null) {
  list.push({ severity, id, message, url });
}

function isAllowedDomain(url, allowedDomains) {
  const hostname = new URL(url).hostname.replace(/^www\./, "");
  return allowedDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function validateUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

async function liveCheck(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "CruiseKitLinkAudit/1.0 (+https://cruisekit.app)",
      },
    });
    return { ok: response.status >= 200 && response.status < 400, status: response.status, finalUrl: response.url };
  } catch (error) {
    return { ok: false, status: null, error: error?.message ?? String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

async function loadViatorProductLinks() {
  const dir = resolve(repoRoot, "apps/web/public/data/viator");
  const files = (await readdir(dir)).filter((file) => file.endsWith(".json"));
  const links = [];
  for (const file of files) {
    const data = JSON.parse(await readFile(resolve(dir, file), "utf8"));
    for (const product of data.products ?? []) {
      if (product.productUrl) {
        links.push({
          id: `viator:${file.replace(/\.json$/, "")}:${product.productCode ?? "unknown"}`,
          url: product.productUrl,
        });
      }
    }
  }
  return links;
}

function markdownList(findings) {
  if (findings.length === 0) return "- None\n";
  return findings
    .map((finding) => {
      const url = finding.url ? ` (${finding.url})` : "";
      return `- ${finding.severity}: ${finding.id} - ${finding.message}${url}`;
    })
    .join("\n") + "\n";
}

async function main() {
  const [sailings, viatorLinks] = await Promise.all([
    loadJson("data/bundles/canonical/sailings.json"),
    loadViatorProductLinks(),
  ]);

  const blockers = [];
  const warnings = [];
  const liveTargets = [];

  for (const sailing of sailings) {
    for (const field of ["directLink", "affiliateLink"]) {
      const url = sailing[field];
      if (!url) continue;
      const id = `${sailing.id}:${field}`;
      if (!validateUrl(url)) {
        add(blockers, "blocker", id, "Malformed URL.", url);
        continue;
      }
      const allowlist = field === "affiliateLink" ? allowedAffiliateDomains : allowedCruiseDomains;
      if (!isAllowedDomain(url, allowlist)) {
        add(warnings, "warning", id, "URL domain is not in the expected allowlist.", url);
      }
      liveTargets.push({ id, url });
    }
  }

  for (const link of viatorLinks) {
    if (!validateUrl(link.url)) {
      add(blockers, "blocker", link.id, "Malformed Viator product URL.", link.url);
      continue;
    }
    if (!isAllowedDomain(link.url, allowedAffiliateDomains)) {
      add(warnings, "warning", link.id, "Viator product URL is outside expected affiliate domains.", link.url);
    }
    liveTargets.push(link);
  }

  if (liveAudit) {
    for (const target of liveTargets) {
      const result = await liveCheck(target.url);
      if (!result.ok) {
        const detail = result.status ? `HTTP ${result.status}` : result.error;
        add(warnings, "warning", target.id, `Live link check failed: ${detail}.`, target.url);
      }
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    liveAudit,
    counts: {
      canonicalSailingLinks: sailings.reduce((count, sailing) => count + Number(Boolean(sailing.directLink)) + Number(Boolean(sailing.affiliateLink)), 0),
      viatorProductLinks: viatorLinks.length,
      checkedLinks: liveTargets.length,
    },
    blockers,
    warnings,
  };

  const markdown = `# CruiseKit Public Link Audit

Generated: ${summary.generatedAt}

Live audit: ${liveAudit ? "enabled" : "disabled"}

## Counts

| Metric | Count |
| --- | ---: |
| Canonical sailing links | ${summary.counts.canonicalSailingLinks} |
| Viator product links | ${summary.counts.viatorProductLinks} |
| Checked links | ${summary.counts.checkedLinks} |

## Blockers

${markdownList(blockers)}
## Warnings

${markdownList(warnings)}
`;

  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(resolve(reportDir, "latest-link-audit.json"), `${JSON.stringify(summary, null, 2)}\n`),
    writeFile(resolve(reportDir, "latest-link-audit.md"), markdown),
  ]);

  console.log(`Link audit: ${blockers.length} blocker(s), ${warnings.length} warning(s).`);
  console.log("Report written to data/reports/latest-link-audit.md");
  if (blockers.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
