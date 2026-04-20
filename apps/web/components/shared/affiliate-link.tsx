"use client";

/**
 * Client-side affiliate link component.
 * Opens affiliate URLs in a new tab with tracking via analytics events.
 * Replaces the server-side /api/affiliate/redirect route for GitHub Pages compatibility.
 */

interface AffiliateLinkProps {
  /** The destination URL (must be an allowed affiliate domain) */
  href: string;
  /** Partner identifier for tracking */
  partner: string;
  /** Source context (e.g., "calculator", "port-page", "comparison") */
  source?: string;
  /** Link content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const ALLOWED_DOMAINS = [
  "awin1.com",
  "awin.com",
  "gotosea.com",
  "viator.com",
  "getyourguide.com",
  "cruisedirect.com",
  "booking.com",
  "amazon.com",
  "insuremytrip.com",
  "generalitravelinsurance.com",
  "medjetassist.com",
  "samboat.com",
  "undercovertourist.com",
  "onestopparking.com",
  "triptogo.com",
  "royalcaribbean.com",
  "carnival.com",
  "ncl.com",
  "msccruisesusa.com",
  "celebritycruises.com",
  "princess.com",
  "hollandamerica.com",
  "disneycruise.disney.go.com",
  "virginvoyages.com",
];

function isAllowedDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return ALLOWED_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith(`.${d}`)
    );
  } catch {
    return false;
  }
}

export default function AffiliateLink({
  href,
  partner,
  source = "unknown",
  children,
  className,
}: AffiliateLinkProps) {
  const handleClick = () => {
    // Log to console (replace with analytics in production)
    console.log("[CruiseKit Affiliate Click]", {
      partner,
      source,
      destination: href,
      timestamp: new Date().toISOString(),
    });

    // Fire Google Analytics event if available
    if (typeof window !== "undefined" && "gtag" in window) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
      gtag("event", "affiliate_click", {
        partner,
        source,
        destination: href,
      });
    }
  };

  if (!isAllowedDomain(href)) {
    // Render as plain text if URL is not from an allowed domain
    return <span className={className}>{children}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored nofollow"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
