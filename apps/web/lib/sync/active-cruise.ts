import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from "firebase/firestore";

import mobileSailingsData from "../../../../data/bundles/mobile/sailings.json";
import type { RealDeal } from "@/lib/data/real-deals";
import { db } from "@/lib/firebase/config";

export type ActiveCruiseStatus = "active" | "deleted";
export type ActiveCruiseSourcePlatform = "web" | "ios" | "android";

export interface SyncedItineraryDay {
  day: number;
  type: "departure" | "port" | "sea" | "arrival" | string;
  portSlug?: string;
  portName?: string;
  arrivalTime?: string;
  departureTime?: string;
  allAboardTime?: string;
  isTender?: boolean;
}

export interface SyncedSailing {
  id: string;
  cruiseLineId: string;
  shipName: string;
  shipId?: string;
  departureDate: string;
  returnDate: string;
  duration: number;
  departurePort: string;
  region: string;
  itinerary: SyncedItineraryDay[];
}

export interface ActiveCruiseDocument {
  schemaVersion: 1;
  status: ActiveCruiseStatus;
  sourcePlatform: ActiveCruiseSourcePlatform;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  sailing?: SyncedSailing;
  confirmedItinerary?: SyncedItineraryDay[];
  itineraryTitle?: string;
  imageUrl?: string | null;
  sourceUrl?: string | null;
}

export type ActiveCruiseSavePayload = Omit<
  ActiveCruiseDocument,
  "createdAt" | "updatedAt"
>;

const mobileSailings = mobileSailingsData as SyncedSailing[];
const mobileSailingById = new Map(
  mobileSailings.map((sailing) => [sailing.id, sailing]),
);

export function getSyncedSailingForDeal(dealId: string) {
  return mobileSailingById.get(dealId) ?? null;
}

export function buildActiveCruisePayload(
  deal: RealDeal,
): ActiveCruiseSavePayload | null {
  const sailing = getSyncedSailingForDeal(deal.id);
  if (!sailing) return null;

  return {
    schemaVersion: 1,
    status: "active",
    sourcePlatform: "web",
    sailing,
    confirmedItinerary: sailing.itinerary,
    itineraryTitle: deal.itineraryTitle,
    imageUrl: deal.imageUrl,
    sourceUrl: deal.affiliateLink ?? deal.directLink ?? deal.bookingUrl,
  };
}

export async function saveActiveCruiseForUser(
  uid: string,
  payload: ActiveCruiseSavePayload,
) {
  const activeCruiseRef = doc(db, "users", uid, "activeCruise", "current");
  const existing = await getDoc(activeCruiseRef);
  const createdAt = existing.exists()
    ? existing.data().createdAt ?? serverTimestamp()
    : serverTimestamp();

  await setDoc(activeCruiseRef, {
    ...payload,
    createdAt,
    updatedAt: serverTimestamp(),
  });
}

export async function tombstoneActiveCruiseForUser(uid: string) {
  const activeCruiseRef = doc(db, "users", uid, "activeCruise", "current");
  const existing = await getDoc(activeCruiseRef);
  const createdAt = existing.exists()
    ? existing.data().createdAt ?? serverTimestamp()
    : serverTimestamp();

  await setDoc(activeCruiseRef, {
    schemaVersion: 1,
    status: "deleted",
    sourcePlatform: "web",
    createdAt,
    updatedAt: serverTimestamp(),
  });
}

export function isActiveCruiseDocument(
  data: unknown,
): data is ActiveCruiseDocument {
  if (typeof data !== "object" || data === null) return false;
  const value = data as Partial<ActiveCruiseDocument>;
  return value.schemaVersion === 1 && value.status === "active" && !!value.sailing;
}
