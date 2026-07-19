"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { EyeOff, Eye, Loader2, Save, Share2, Ship, Sparkles } from "lucide-react";
import { httpsCallable } from "firebase/functions";
import type { CruiseLineId } from "@cruise/shared/types";
import {
  TRUE_COST_CATEGORIES,
  calculateTrueCruiseCost,
  type TrueCostCategory,
  type TrueCostInputs,
} from "@cruise/shared/utils";
import { CRUISE_LINES } from "@cruise/shared/constants";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import SignInModal from "@/components/shared/sign-in-modal";
import { useAuth } from "@/lib/firebase/auth";
import { functions } from "@/lib/firebase/config";
import { saveActiveCruiseForUser } from "@/lib/firebase/saved-cruises";
import { getGrowthAttribution } from "@/lib/growth/attribution";
import { trackGrowthEvent } from "@/lib/growth/analytics";
import type { CampaignAttribution } from "@/lib/distribution/attribution";

const CATEGORY_META: Record<TrueCostCategory, { label: string; helper?: string; primary?: boolean }> = {
  advertisedFare: { label: "Advertised cruise fare", helper: "The fare you were quoted for everyone traveling.", primary: true },
  taxesAndPortFees: { label: "Taxes and port fees" },
  gratuities: { label: "Gratuities" },
  travelToPort: { label: "Travel to the port" },
  preCruiseHotel: { label: "Pre-cruise hotel" },
  parkingOrTransfers: { label: "Parking or transfers" },
  travelInsurance: { label: "Travel insurance" },
  drinkPackages: { label: "Drink packages" },
  wifi: { label: "Wi-Fi" },
  specialtyDining: { label: "Specialty dining" },
  excursions: { label: "Excursions" },
  shopping: { label: "Shopping" },
  casinoOrEntertainment: { label: "Casino or entertainment" },
  otherCosts: { label: "Other costs" },
};

function blankValues() {
  return Object.fromEntries(TRUE_COST_CATEGORIES.map((category) => [category, ""])) as Record<TrueCostCategory, string>;
}

function money(value: number | null) {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function numeric(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function departureWindow(date: string) {
  if (!date) return undefined;
  return date.slice(0, 7);
}

export default function TrueCostCalculator() {
  const { user } = useAuth();
  const [values, setValues] = useState<Record<TrueCostCategory, string>>(blankValues);
  const [travelers, setTravelers] = useState("");
  const [cruiseDays, setCruiseDays] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [formError, setFormError] = useState("");
  const [hideDollars, setHideDollars] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [cruiseLineId, setCruiseLineId] = useState<CruiseLineId | "">("");
  const [shipName, setShipName] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departurePort, setDeparturePort] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);
  const started = useRef(false);

  const result = useMemo(() => {
    const inputs = Object.fromEntries(TRUE_COST_CATEGORIES.map((category) => [category, numeric(values[category])])) as Record<TrueCostCategory, number>;
    return calculateTrueCruiseCost({ ...inputs, travelers: numeric(travelers), cruiseDays: numeric(cruiseDays) } as TrueCostInputs);
  }, [cruiseDays, travelers, values]);

  const updateCost = (category: TrueCostCategory, value: string) => {
    if (!started.current) {
      started.current = true;
      trackGrowthEvent("calculator_started");
    }
    setValues((current) => ({ ...current, [category]: value }));
  };

  const calculate = () => {
    const fare = numeric(values.advertisedFare);
    const guestCount = numeric(travelers);
    const days = numeric(cruiseDays);
    if (!fare || !guestCount || !days) {
      setFormError("Enter the advertised fare, number of travelers, and cruise days to see your estimate.");
      setShowResults(false);
      return;
    }
    setFormError("");
    setShowResults(true);
    trackGrowthEvent("calculator_completed");
  };

  const save = async (uid?: string) => {
    if (!cruiseLineId || !shipName.trim() || !departureDate) {
      setSaveError("Choose the cruise line, ship, and upcoming departure date before saving this sailing.");
      return;
    }
    const parsedDeparture = new Date(`${departureDate}T12:00:00Z`);
    if (
      Number.isNaN(parsedDeparture.getTime()) ||
      departureDate <= new Date().toISOString().slice(0, 10)
    ) {
      setSaveError("Choose an upcoming departure date.");
      return;
    }
    const targetUid = uid ?? user?.uid;
    trackGrowthEvent("sailing_save_started", { cruiseLine: cruiseLineId, departureWindow: departureWindow(departureDate) });
    if (!targetUid) {
      setSignInOpen(true);
      return;
    }
    setSavingDetails(true);
    setSaveError("");
    try {
      const end = new Date(parsedDeparture);
      end.setUTCDate(end.getUTCDate() + numeric(cruiseDays));
      await saveActiveCruiseForUser(targetUid, {
        sailing: {
          id: `manual-${cruiseLineId}-${departureDate}-${shipName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50)}`,
          cruiseLineId,
          shipName: shipName.trim(),
          departureDate,
          returnDate: end.toISOString().slice(0, 10),
          duration: numeric(cruiseDays),
          departurePort: departurePort.trim() || "Not set",
          region: "caribbean",
          itinerary: [],
          isRealUpcoming: true,
        },
        confirmedItinerary: [],
        cabinType: "balcony",
        calculatorSnapshot: {
          version: "1",
          travelers: { adults: numeric(travelers), children: 0 },
          cabinType: "balcony",
          duration: numeric(cruiseDays),
          region: "caribbean",
          selectedAddOns: TRUE_COST_CATEGORIES.filter((category) => !["advertisedFare", "taxesAndPortFees", "gratuities"].includes(category) && result.lineItems[category] > 0),
          estimate: { advertisedFare: result.advertisedFare, estimatedTotal: result.estimatedTotal, totalAdditional: result.additionalCosts },
        },
        attribution: {
          firstTouch: mapLegacyTouch(getGrowthAttribution().firstTouch),
          convertingTouch: mapLegacyTouch(getGrowthAttribution().lastTouch),
        },
        importState: "saved",
      });
      setSaved(true);
      setSaveOpen(false);
      trackGrowthEvent("sailing_saved", { cruiseLine: cruiseLineId, departureWindow: departureWindow(departureDate) });
      void httpsCallable(functions, "recordGrowthEvent")({
        eventName: "calculator_completed",
        attribution: getGrowthAttribution(),
        context: { cruiseLine: cruiseLineId, departureWindow: departureWindow(departureDate) },
      });
    } catch {
      setSaveError("We couldn’t save this sailing. Please try again.");
    } finally {
      setSavingDetails(false);
    }
  };

  const share = async () => {
    try {
      const blob = await buildShareCard(result, hideDollars);
      const file = new File([blob], "cruisekit-true-cruise-cost.png", { type: "image/png" });
      const shareData = { title: "My CruiseKit estimate", text: "I mapped out my true cruise cost with CruiseKit.", files: [file] };
      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData);
      } else {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "cruisekit-true-cruise-cost.png";
        anchor.click();
        URL.revokeObjectURL(url);
      }
      trackGrowthEvent("calculator_result_shared");
    } catch {
      // Cancelling a native share or blocking a download is not an app error.
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)] sm:p-8">
        <div className="border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">True cruise cost calculator</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-gray-600">Start with the quote you have. Add only the costs you know. We won’t fill in a fare, fee, or add-on for you.</p>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CurrencyField id="advertisedFare" label="Advertised cruise fare" value={values.advertisedFare} onChange={(value) => updateCost("advertisedFare", value)} required />
          <PlainField id="travelers" label="Travelers" value={travelers} onChange={setTravelers} required />
          <PlainField id="cruiseDays" label="Cruise days" value={cruiseDays} onChange={setCruiseDays} required />
        </div>
        <div className="mt-7 border-t border-gray-100 pt-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><h2 className="text-xl font-bold text-navy">Add the rest of the trip</h2><p className="mt-1 text-sm text-gray-600">Leave a field empty if you don’t know it yet. You can set it to $0 if it won’t apply.</p></div><p className="text-xs text-gray-500">All amounts are for the whole trip.</p></div>
          <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            {TRUE_COST_CATEGORIES.filter((category) => category !== "advertisedFare").map((category) => <CurrencyField key={category} id={category} label={CATEGORY_META[category].label} value={values[category]} onChange={(value) => updateCost(category, value)} />)}
          </div>
        </div>
        {formError && <p role="alert" className="mt-5 text-sm font-medium text-error">{formError}</p>}
        <Button onClick={calculate} size="lg" className="mt-7 w-full sm:w-auto"><Sparkles className="h-4 w-4" />See my estimate</Button>
      </section>

      <aside className="lg:sticky lg:top-24">
        {showResults ? <ResultsPanel result={result} hideDollars={hideDollars} setHideDollars={setHideDollars} share={share} saveOpen={saveOpen} setSaveOpen={setSaveOpen} saved={saved} saveError={saveError} savingDetails={savingDetails} cruiseLineId={cruiseLineId} setCruiseLineId={setCruiseLineId} shipName={shipName} setShipName={setShipName} departureDate={departureDate} setDepartureDate={setDepartureDate} departurePort={departurePort} setDeparturePort={setDeparturePort} save={() => void save()} /> : <EmptyResult />}
      </aside>
      <SignInModal open={signInOpen} onOpenChange={setSignInOpen} onSuccess={(signedInUser) => void save(signedInUser.uid)} />
    </div>
  );
}

function CurrencyField({ id, label, value, onChange, required }: { id: string; label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <div className="grid gap-1.5"><Label htmlFor={id}>{label}{required ? " *" : ""}</Label><div className="relative"><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-400">$</span><input id={id} inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} placeholder="0" className="h-10 w-full rounded-lg border border-gray-200 bg-white py-2 pl-7 pr-3 text-sm text-navy transition-colors hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1" /></div></div>;
}

function PlainField({ id, label, value, onChange, required }: { id: string; label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <Input inputId={id} label={`${label}${required ? " *" : ""}`} inputMode="numeric" value={value} onChange={(event) => onChange(event.target.value)} placeholder="0" />;
}

function EmptyResult() {
  return <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-7 text-center"><Ship className="mx-auto h-8 w-8 text-teal" /><h2 className="mt-4 text-xl font-bold text-navy">Your estimate will appear here</h2><p className="mt-2 text-sm leading-relaxed text-gray-600">Enter the fare, travelers, and cruise days, then add any costs you know.</p></div>;
}

type ResultPanelProps = {
  result: ReturnType<typeof calculateTrueCruiseCost>;
  hideDollars: boolean;
  setHideDollars: (value: boolean) => void;
  share: () => void;
  saveOpen: boolean;
  setSaveOpen: (value: boolean) => void;
  saved: boolean;
  saveError: string;
  savingDetails: boolean;
  cruiseLineId: CruiseLineId | "";
  setCruiseLineId: (value: CruiseLineId | "") => void;
  shipName: string;
  setShipName: (value: string) => void;
  departureDate: string;
  setDepartureDate: (value: string) => void;
  departurePort: string;
  setDeparturePort: (value: string) => void;
  save: () => void;
};

function ResultsPanel(props: ResultPanelProps) {
  const display = (value: number | null) => props.hideDollars && value !== null ? "$•••" : money(value);
  return <div className="space-y-5"><section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[var(--shadow-md)]"><div className="border-b border-gray-100 p-6"><p className="text-sm font-semibold text-gray-500">Your true cruise cost</p><p className="mt-1 font-price text-4xl font-bold text-navy">{display(props.result.estimatedTotal)}</p><p className="mt-2 text-sm text-gray-600">Built from the amounts you entered.</p></div><dl className="divide-y divide-gray-100 px-6"><Metric label="Advertised fare" value={display(props.result.advertisedFare)} /><Metric label="Additional costs" value={display(props.result.additionalCosts)} emphasize /><Metric label="Total per traveler" value={display(props.result.totalPerTraveler)} /><Metric label="Total per cruise day" value={display(props.result.totalPerCruiseDay)} /><Metric label="Difference from advertised fare" value={props.result.percentageDifference === null ? "—" : `${Math.round(props.result.percentageDifference)}%`} /></dl><div className="p-6"><Button onClick={() => props.setSaveOpen(!props.saveOpen)} className="w-full">{props.saved ? "Saved to your sailing" : "Save this to my sailing"}</Button><Link href="/app" className="mt-3 flex h-10 items-center justify-center rounded-lg border-2 border-navy/20 text-sm font-semibold text-navy transition-colors hover:bg-navy/5">Continue in CruiseKit</Link><Link href="/founding-20" className="mt-3 flex h-10 items-center justify-center text-sm font-semibold text-teal hover:text-teal-dark">Apply for Founding 20</Link></div></section>{props.saveOpen && !props.saved && <SaveSailingForm {...props} />}<section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)]"><p className="text-sm font-bold text-navy">Share card preview</p><ShareCardPreview result={props.result} hidden={props.hideDollars} /><button type="button" onClick={() => props.setHideDollars(!props.hideDollars)} className="mt-4 flex w-full items-center justify-between text-sm font-semibold text-navy"><span className="flex items-center gap-2">{props.hideDollars ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} Hide dollar amounts</span><span className={`relative h-6 w-11 rounded-full transition-colors ${props.hideDollars ? "bg-teal" : "bg-gray-300"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${props.hideDollars ? "translate-x-5" : "translate-x-0.5"}`} /></span></button><Button variant="outline" onClick={props.share} className="mt-4 w-full"><Share2 className="h-4 w-4" />Share my estimate</Button></section></div>;
}

function Metric({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) { return <div className="flex items-center justify-between gap-4 py-3 text-sm"><dt className={emphasize ? "font-semibold text-coral" : "text-gray-600"}>{label}</dt><dd className={`font-price font-bold ${emphasize ? "text-coral" : "text-navy"}`}>{value}</dd></div>; }

function SaveSailingForm(props: ResultPanelProps) {
  return <section className="rounded-2xl border border-teal/30 bg-teal/5 p-5"><h2 className="text-lg font-bold text-navy">Save a real upcoming sailing</h2><p className="mt-1 text-sm leading-relaxed text-gray-600">We need these details to keep a saved estimate from being mistaken for a hypothetical trip.</p><div className="mt-4 grid gap-3"><div className="grid gap-1.5"><Label htmlFor="save-cruise-line">Cruise line *</Label><select id="save-cruise-line" value={props.cruiseLineId} onChange={(event) => props.setCruiseLineId(event.target.value as CruiseLineId | "")} className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"><option value="">Select cruise line</option>{CRUISE_LINES.map((line) => <option key={line.id} value={line.id}>{line.name}</option>)}</select></div><Input inputId="save-ship" label="Ship *" value={props.shipName} onChange={(event) => props.setShipName(event.target.value)} placeholder="e.g. Carnival Celebration" /><Input inputId="save-departure" label="Departure date *" type="date" value={props.departureDate} onChange={(event) => props.setDepartureDate(event.target.value)} /><Input inputId="save-port" label="Departure port (optional)" value={props.departurePort} onChange={(event) => props.setDeparturePort(event.target.value)} placeholder="e.g. Miami" /></div>{props.saveError && <p role="alert" className="mt-3 text-sm font-medium text-error">{props.saveError}</p>}<Button onClick={props.save} className="mt-5 w-full" disabled={props.savingDetails}>{props.savingDetails ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <><Save className="h-4 w-4" />Save real sailing</>}</Button></section>;
}

function ShareCardPreview({ result, hidden }: { result: ReturnType<typeof calculateTrueCruiseCost>; hidden: boolean }) { const total = hidden ? "$•••" : money(result.estimatedTotal); return <div className="mt-4 aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-b from-sky-100 via-white to-ocean p-5 text-navy"><p className="font-bold tracking-tight">CRUISEKIT</p><div className="mt-12"><p className="text-2xl font-extrabold leading-tight">My true cruise cost</p><p className="mt-5 text-sm text-navy/70">Estimated total</p><p className="font-price mt-1 text-4xl font-bold">{total}</p></div><div className="mt-16 border-t border-navy/15 pt-4 text-sm font-semibold">Made with CruiseKit</div></div>; }

function mapLegacyTouch(touch: ReturnType<typeof getGrowthAttribution>["firstTouch"]): CampaignAttribution {
  return {
    sourceType: touch.referralCode ? "traveler" : touch.utmSource ? "organic" : "calculator",
    sourceId: touch.referralCode ?? touch.utmCampaign,
    landingContext: "generic",
    utmSource: touch.utmSource,
    utmMedium: touch.utmMedium,
    utmCampaign: touch.utmCampaign,
    utmContent: touch.utmContent,
  };
}

async function buildShareCard(result: ReturnType<typeof calculateTrueCruiseCost>, hidden: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");
  context.fillStyle = "#E0F7FA";
  context.fillRect(0, 0, 1080, 1350);
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, 1080, 850);
  context.fillStyle = "#0C2340";
  context.font = "700 62px Arial";
  context.fillText("CRUISEKIT", 84, 120);
  context.font = "800 104px Arial";
  wrapCanvasText(context, "My true cruise cost", 84, 285, 840, 116);
  context.font = "400 42px Arial";
  context.fillStyle = "#475569";
  context.fillText("Estimated total", 84, 570);
  context.fillStyle = "#0C2340";
  context.font = "800 142px Arial";
  context.fillText(hidden ? "$•••" : money(result.estimatedTotal), 84, 720);
  context.fillStyle = "#0077B6";
  context.fillRect(0, 980, 1080, 370);
  context.fillStyle = "#FFFFFF";
  context.font = "700 46px Arial";
  context.fillText("Made with CruiseKit", 84, 1250);
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not make image")), "image/png"));
}

function wrapCanvasText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) { const words = text.split(" "); let line = ""; let lineY = y; for (const word of words) { const test = `${line}${line ? " " : ""}${word}`; if (context.measureText(test).width > maxWidth && line) { context.fillText(line, x, lineY); line = word; lineY += lineHeight; } else line = test; } if (line) context.fillText(line, x, lineY); }
