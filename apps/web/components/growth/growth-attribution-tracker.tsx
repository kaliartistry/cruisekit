"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth";
import { getGrowthAttribution } from "@/lib/growth/attribution";
import { HERO_MESSAGE_EXPERIMENT, getHeroMessageVariant, isHeroMessageExperimentEligible } from "@/lib/growth/experiments";
import { linkGrowthIdentity, trackGrowthEvent } from "@/lib/growth/analytics";

export default function GrowthAttributionTracker() {
  const pathname = usePathname();
  const { user } = useAuth();
  const linkedUserId = useRef<string | null>(null);

  useEffect(() => {
    // Do not place the full query string in browser storage. It can contain
    // an accidentally supplied personal value, while the attribution helper
    // captures only the supported, bounded campaign fields separately.
    const pageKey = pathname;
    const storageKey = `cruisekit:growth:page:${pageKey}`;
    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // A duplicate non-PII page event is safer than a broken page.
    }
    const attribution = getGrowthAttribution();
    const experimentVariant = pathname === "/founding-20" && isHeroMessageExperimentEligible()
      ? getHeroMessageVariant(attribution.anonymousId)
      : undefined;
    trackGrowthEvent("landing_page_viewed", {
      experimentId: experimentVariant ? HERO_MESSAGE_EXPERIMENT.id : undefined,
      experimentVariant,
    });
  }, [pathname]);

  useEffect(() => {
    if (!user || linkedUserId.current === user.uid) return;
    linkedUserId.current = user.uid;
    void linkGrowthIdentity(user.uid);
  }, [user]);

  return null;
}
