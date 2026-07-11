"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Anchor, Calendar, Ship, Smartphone } from "lucide-react";
import { useAuth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/config";
import SignInModal from "@/components/shared/sign-in-modal";
import { Button } from "@/components/ui/button";
import CruiseLineLogo from "@/components/shared/cruise-line-logo";
import { StoreButtonRow } from "@/components/shared/store-buttons";
import {
  trackSavedCruiseHandoffOpened,
  type DistributionSourceType,
  type LandingContext,
} from "@/lib/analytics";

type SavedCruiseSummary = {
  cruiseLineId: string;
  shipName: string;
  departureDate: string;
  duration: number;
  departurePort: string;
  sourceType?: DistributionSourceType;
  sourceId?: string;
  landingContext?: LandingContext;
};

export default function CruiseHandoffClient() {
  const { user, loading: authLoading } = useAuth();
  const [signInOpen, setSignInOpen] = useState(false);
  const [summary, setSummary] = useState<SavedCruiseSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    let cancelled = false;
    void (async () => {
      const ref = doc(db, "users", user.uid, "savedCruises", "active");
      const snapshot = await getDoc(ref);
      if (cancelled) return;
      if (!snapshot.exists()) {
        setLoading(false);
        return;
      }
      const data = snapshot.data();
      const sailing = data.sailing as Record<string, unknown>;
      const touch = (data.attribution as Record<string, unknown> | undefined)
        ?.convertingTouch as Record<string, unknown> | undefined;
      const nextSummary: SavedCruiseSummary = {
        cruiseLineId: String(sailing.cruiseLineId ?? ""),
        shipName: String(sailing.shipName ?? "Cruise not selected yet"),
        departureDate: String(sailing.departureDate ?? ""),
        duration: Number(sailing.duration ?? 0),
        departurePort: String(sailing.departurePort ?? "Not selected yet"),
        sourceType: touch?.sourceType as DistributionSourceType | undefined,
        sourceId: touch?.sourceId as string | undefined,
        landingContext: touch?.landingContext as LandingContext | undefined,
      };
      setSummary(nextSummary);
      setLoading(false);
      trackSavedCruiseHandoffOpened({
        sourceType: nextSummary.sourceType,
        sourceId: nextSummary.sourceId,
        landingContext: nextSummary.landingContext,
        cruiseLineId: nextSummary.cruiseLineId,
      });
      await updateDoc(ref, { importState: "opened" }).catch(() => undefined);
    })().catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  if (authLoading || (user && loading)) {
    return <div className="mx-auto max-w-2xl py-20 text-center text-gray-500">Loading your saved cruise...</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <Anchor className="mx-auto h-10 w-10 text-teal" />
        <h1 className="mt-4 text-2xl font-extrabold text-navy">Open your saved cruise</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Sign in with the same account you used on the calculator. Your cruise details stay private.
        </p>
        <Button className="mt-6" onClick={() => setSignInOpen(true)}>Sign in to continue</Button>
        <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <Ship className="mx-auto h-10 w-10 text-gray-300" />
        <h1 className="mt-4 text-2xl font-extrabold text-navy">No saved calculator cruise yet</h1>
        <p className="mt-2 text-sm text-gray-600">Run the true-cost calculator and choose “Save this cruise” first.</p>
        <Button asChild className="mt-6"><Link href="/calculator">Open calculator</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <CruiseLineLogo cruiseLineId={summary.cruiseLineId} size="lg" />
          <div>
            <h1 className="text-2xl font-extrabold text-navy">Your cruise is ready for CruiseKit</h1>
            <p className="mt-1 text-sm text-gray-600">Open the app with this account to import the saved cruise into MyDay.</p>
          </div>
        </div>
        <dl className="mt-6 grid gap-4 rounded-xl bg-gray-50 p-5 sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase text-gray-400">Ship</dt><dd className="mt-1 font-semibold text-navy">{summary.shipName}</dd></div>
          <div><dt className="text-xs font-semibold uppercase text-gray-400">Sailing</dt><dd className="mt-1 flex items-center gap-2 font-semibold text-navy"><Calendar className="h-4 w-4 text-teal" />{formatDate(summary.departureDate)} · {summary.duration} nights</dd></div>
          <div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase text-gray-400">Departure port</dt><dd className="mt-1 font-semibold text-navy">{summary.departurePort}</dd></div>
        </dl>
      </div>
      <div className="bg-navy p-6 text-white sm:p-8">
        <div className="mb-4 flex items-center gap-2"><Smartphone className="h-5 w-5 text-teal" /><h2 className="font-bold">Continue in the free app</h2></div>
        <StoreButtonRow sourceSurface="saved_trip" variant="dark" />
        <p className="mt-4 text-xs leading-relaxed text-white/60">If CruiseKit is already installed, opening this same link from Messages, Mail, or your browser will take you directly to the saved-cruise handoff.</p>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime())
    ? "Date not selected"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
