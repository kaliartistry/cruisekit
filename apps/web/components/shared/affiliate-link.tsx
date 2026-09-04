"use client";

import { useEffect, useRef } from "react";
import {
  hasAnalyticsConsent,
  trackAffiliateOfferViewed,
  trackOutboundAffiliateClick,
} from "@/lib/analytics";

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
  const linkRef = useRef<HTMLAnchorElement>(null);
  const handleClick = () => {
    trackOutboundAffiliateClick(partner, source);
  };

  useEffect(() => {
    const link = linkRef.current;
    if (!link || typeof IntersectionObserver === "undefined") return;
    let tracked = false;
    let visible = false;
    const trackIfAllowed = () => {
      if (tracked || !visible || !hasAnalyticsConsent()) return;
      tracked = true;
      trackAffiliateOfferViewed(partner, source);
      observer.disconnect();
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      trackIfAllowed();
    });
    observer.observe(link);
    window.addEventListener(
      "cruisekit:analytics-consent-changed",
      trackIfAllowed,
    );
    return () => {
      observer.disconnect();
      window.removeEventListener(
        "cruisekit:analytics-consent-changed",
        trackIfAllowed,
      );
    };
  }, [partner, source]);

  if (!isAllowedDomain(href)) {
    // Render as plain text if URL is not from an allowed domain
    return <span className={className}>{children}</span>;
  }

  return (
    <a
      ref={linkRef}
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
