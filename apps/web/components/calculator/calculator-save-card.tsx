"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Save, Ship } from "lucide-react";
import type { CalculatorInputs, CostBreakdown } from "@cruise/shared/types";
import { Button } from "@/components/ui/button";
import SignInModal from "@/components/shared/sign-in-modal";
import { useAuth } from "@/lib/firebase/auth";
import {
  activeCruiseHandoffUrl,
  saveActiveCruiseForUser,
} from "@/lib/firebase/saved-cruises";
import {
  getOrCreateFirstTouch,
  readCampaignAttribution,
} from "@/lib/distribution/attribution";
import {
  trackSaveCruiseCompleted,
  trackSaveCruiseStarted,
} from "@/lib/analytics";

export type CalculatorSailingContext = {
  sailingId?: string;
  shipName?: string;
  departureDate?: string;
  returnDate?: string;
  departurePort?: string;
  region?: string;
};

type SaveableCalculatorSailingContext = CalculatorSailingContext & {
  shipName: string;
  departureDate: string;
};

export default function CalculatorSaveCard({
  inputs,
  breakdown,
  sailingContext,
}: {
  inputs: CalculatorInputs;
  breakdown: CostBreakdown;
  sailingContext?: CalculatorSailingContext;
}) {
  const { user } = useAuth();
  const [signInOpen, setSignInOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSave = hasRealSailing(sailingContext);
  const attribution = useMemo(
    () => readCampaignAttribution(sailingContext),
    [sailingContext],
  );

  const save = async (uid?: string) => {
    if (!hasRealSailing(sailingContext)) return;

    const targetUid = uid ?? user?.uid;
    trackSaveCruiseStarted({
      sourceType: attribution.sourceType,
      sourceId: attribution.sourceId,
      landingContext: attribution.landingContext,
      cruiseLineId: inputs.cruiseLineId,
    });
    if (!targetUid) {
      persistBrowserDraft(inputs, breakdown, sailingContext);
      setSignInOpen(true);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const dates = resolveDates(inputs.duration, sailingContext);
      const shipName = sailingContext.shipName.trim();
      await saveActiveCruiseForUser(targetUid, {
        sailing: {
          id:
            sailingContext.sailingId ||
            `calculator-${inputs.cruiseLineId}-${dates.departureDate}`,
          cruiseLineId: inputs.cruiseLineId,
          shipName,
          departureDate: dates.departureDate,
          returnDate: dates.returnDate,
          duration: inputs.duration,
          departurePort: sailingContext.departurePort || "Not selected yet",
          region: sailingContext.region || inputs.region,
          itinerary: [],
        },
        confirmedItinerary: [],
        cabinType: inputs.cabinType,
        calculatorSnapshot: {
          version: "1",
          travelers: { adults: inputs.adults, children: inputs.children },
          cabinType: inputs.cabinType,
          duration: inputs.duration,
          region: inputs.region,
          selectedAddOns: selectedAddOns(inputs),
          estimate: {
            advertisedFare: inputs.baseFare,
            estimatedTotal: breakdown.grandTotal,
            totalAdditional: breakdown.totalAdditional,
          },
        },
        attribution: {
          firstTouch: getOrCreateFirstTouch(attribution),
          convertingTouch: attribution,
        },
        importState: "saved",
      });
      window.localStorage.removeItem("cruisekit:calculator-draft:v1");
      setSaved(true);
      trackSaveCruiseCompleted({
        sourceType: attribution.sourceType,
        sourceId: attribution.sourceId,
        landingContext: attribution.landingContext,
        cruiseLineId: inputs.cruiseLineId,
      });
    } catch {
      setError("We could not save this cruise. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-teal/25 bg-teal/5 p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal text-white">
          {saved ? <Check className="h-5 w-5" /> : <Ship className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-navy">
            {saved ? "Your cruise is saved." : "Save this cruise, not just the number."}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            {saved
              ? "Continue in CruiseKit to finish the sailing details and use MyDay onboard."
              : "Keep this estimate across devices, then carry the cruise into MyDay, Spend, and MyCrew."}
          </p>
          {!saved && !canSave && (
            <p
              id="calculator-save-sailing-help"
              className="mt-3 text-sm font-medium text-slate-600"
            >
              Pick a sailing above to save it.
            </p>
          )}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {saved ? (
              <>
                <Button asChild>
                  <Link href="/cruise/handoff?v=1">Continue in CruiseKit</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href={activeCruiseHandoffUrl()}>Open handoff page</a>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => void save()}
                disabled={saving || !canSave}
                aria-describedby={
                  canSave ? undefined : "calculator-save-sailing-help"
                }
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save this cruise"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <SignInModal
        open={signInOpen}
        onOpenChange={setSignInOpen}
        onSuccess={(signedInUser) => void save(signedInUser.uid)}
      />
    </div>
  );
}

function persistBrowserDraft(
  inputs: CalculatorInputs,
  breakdown: CostBreakdown,
  sailingContext?: CalculatorSailingContext,
) {
  try {
    window.localStorage.setItem(
      "cruisekit:calculator-draft:v1",
      JSON.stringify({
        version: 1,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        inputs,
        breakdown,
        sailingContext,
      }),
    );
  } catch {
    // Sign-in can still continue when browser storage is unavailable.
  }
}

export function hasRealSailing(
  context?: CalculatorSailingContext,
): context is SaveableCalculatorSailingContext {
  return Boolean(context?.shipName?.trim() && context.departureDate?.trim());
}

export function resolveDates(
  duration: number,
  context: SaveableCalculatorSailingContext,
) {
  const departure = new Date(`${context.departureDate.trim()}T12:00:00Z`);
  const fallbackReturn = new Date(departure);
  fallbackReturn.setUTCDate(fallbackReturn.getUTCDate() + duration);
  return {
    departureDate: departure.toISOString().slice(0, 10),
    returnDate: context.returnDate || fallbackReturn.toISOString().slice(0, 10),
  };
}

function selectedAddOns(inputs: CalculatorInputs) {
  return [
    inputs.drinkPackage ? "drink_package" : null,
    inputs.wifiPackage ? "wifi" : null,
    inputs.specialtyDiningMeals > 0 ? "specialty_dining" : null,
    inputs.excursionBudgetPerPort > 0 ? "excursions" : null,
    inputs.addTravelInsurance ? "travel_insurance" : null,
    inputs.addParking ? "parking" : null,
  ].filter((value): value is string => Boolean(value));
}
