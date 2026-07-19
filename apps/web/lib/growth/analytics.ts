"use client";

import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase/config";
import { trackEvent } from "@/lib/analytics";
import {
  currentDeviceCategory,
  currentPlatform,
  getGrowthAttribution,
} from "./attribution";

export type GrowthEventName =
  | "landing_page_viewed"
  | "founding20_application_started"
  | "founding20_application_submitted"
  | "calculator_started"
  | "calculator_completed"
  | "calculator_result_shared"
  | "sailing_save_started"
  | "sailing_saved"
  | "store_link_clicked"
  | "activation_completed"
  | "mycrew_invite_created"
  | "mycrew_invite_sent"
  | "mycrew_invite_accepted"
  | "captain_application_submitted"
  | "advisor_application_submitted"
  | "creator_application_submitted"
  | "feedback_submitted"
  | "review_prompt_displayed"
  | "experiment_variant_viewed";

type GrowthEventContext = {
  experimentId?: string;
  experimentVariant?: string;
  cruiseLine?: string;
  departureWindow?: string;
  platform?: string;
  deviceCategory?: string;
  store?: "apple" | "google";
};

const recordGrowthEvent = httpsCallable<
  { eventName: GrowthEventName; attribution: ReturnType<typeof getGrowthAttribution>; context: GrowthEventContext },
  { ok: boolean }
>(functions, "recordGrowthEvent");

/**
 * Vendor-neutral event adapter. GA4 remains the existing traffic sink while a
 * privacy-limited server ledger powers operational funnel counts.
 */
export function trackGrowthEvent(
  eventName: GrowthEventName,
  context: GrowthEventContext = {},
  options: { durable?: boolean } = {},
) {
  const attribution = getGrowthAttribution();
  const compactContext = {
    anonymous_id: attribution.anonymousId,
    campaign: attribution.lastTouch.utmCampaign,
    referral_code: attribution.lastTouch.referralCode,
    landing_page: attribution.lastTouch.landingPage,
    device_category: currentDeviceCategory(),
    platform: context.platform ?? currentPlatform(),
    experiment_id: context.experimentId,
    experiment_variant: context.experimentVariant,
    cruise_line: context.cruiseLine,
    departure_window: context.departureWindow,
    store: context.store,
  };
  trackEvent(eventName, compactContext);
  if (options.durable === false) return;
  void recordGrowthEvent({
    eventName,
    attribution,
    context: {
      ...context,
      platform: context.platform ?? currentPlatform(),
      deviceCategory: currentDeviceCategory(),
    },
  }).catch(() => {
    // Growth instrumentation must never interrupt a public action.
  });
}

export async function linkGrowthIdentity(userId: string) {
  const attribution = getGrowthAttribution();
  const linkIdentity = httpsCallable<
    { userId: string; attribution: ReturnType<typeof getGrowthAttribution> },
    { ok: boolean }
  >(functions, "linkGrowthIdentity");
  try {
    await linkIdentity({ userId, attribution });
  } catch {
    // Sign-in remains successful even if the growth adapter is unavailable.
  }
}
