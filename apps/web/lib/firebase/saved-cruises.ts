import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase/config";
import type { CampaignAttribution } from "@/lib/distribution/attribution";

type ItineraryDay = {
  day: number;
  type: "departure" | "arrival" | "port" | "sea" | string;
  portSlug?: string;
  portName?: string;
  arrivalTime?: string;
  departureTime?: string;
  allAboardTime?: string;
  isTender?: boolean;
};

type Sailing = {
  id: string;
  cruiseLineId: string;
  shipName: string;
  shipId?: string;
  departureDate: string;
  returnDate: string;
  duration: number;
  departurePort: string;
  region: string;
  itinerary: ItineraryDay[];
};

export type ActiveSavedCruiseInput = {
  sailing: Sailing;
  confirmedItinerary?: ItineraryDay[];
  cabinNumber?: string;
  cabinType?: string;
  confirmedAt?: string;
  calculatorSnapshot?: {
    version: "1";
    travelers: { adults: number; children: number };
    cabinType: string;
    duration: number;
    region: string;
    selectedAddOns: string[];
    estimate: {
      advertisedFare: number;
      estimatedTotal: number;
      totalAdditional: number;
    };
  };
  attribution?: {
    firstTouch: CampaignAttribution;
    convertingTouch: CampaignAttribution;
  };
  importState?: "saved" | "opened" | "imported";
};

const ACTIVE_SAVED_CRUISE_VERSION = "1";

export async function saveActiveCruiseForUser(
  uid: string,
  cruise: ActiveSavedCruiseInput,
) {
  const activeCruiseRef = doc(db, "users", uid, "savedCruises", "active");
  await setDoc(activeCruiseRef, {
    source: "web",
    version: ACTIVE_SAVED_CRUISE_VERSION,
    sailing: cruise.sailing,
    confirmedItinerary: cruise.confirmedItinerary ?? cruise.sailing.itinerary,
    ...(cruise.cabinNumber ? { cabinNumber: cruise.cabinNumber } : {}),
    ...(cruise.cabinType ? { cabinType: cruise.cabinType } : {}),
    ...(cruise.confirmedAt ? { confirmedAt: cruise.confirmedAt } : {}),
    ...(cruise.calculatorSnapshot
      ? { calculatorSnapshot: cruise.calculatorSnapshot }
      : {}),
    ...(cruise.attribution ? { attribution: cruise.attribution } : {}),
    importState: cruise.importState ?? "saved",
    updatedAt: serverTimestamp(),
  });
}

export function activeCruiseHandoffUrl() {
  return "https://cruisekit.app/cruise/handoff?v=1";
}

export async function clearActiveCruiseForUser(uid: string) {
  await deleteDoc(doc(db, "users", uid, "savedCruises", "active"));
}
