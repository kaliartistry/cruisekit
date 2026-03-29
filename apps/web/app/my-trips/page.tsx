"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/firebase/auth";
import SignInModal from "@/components/shared/sign-in-modal";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Ship,
  MapPin,
  Calendar,
  Trash2,
  Calculator,
  Anchor,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { SavedDealData } from "@/components/shared/heart-button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SavedDeal extends SavedDealData {
  id: string;
  savedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Saved deal card                                                    */
/* ------------------------------------------------------------------ */

function SavedDealCard({
  deal,
  onRemove,
}: {
  deal: SavedDeal;
  onRemove: (id: string) => void;
}) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(deal.id);
  };

  const calcHref = `/calculator?line=${deal.cruiseLineId}&duration=${deal.duration}&adults=2&fare=${deal.fromPrice}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-lg)] sm:flex-row">
      {/* Left accent bar */}
      <div className="hidden sm:block w-1.5 shrink-0 bg-gradient-to-b from-teal to-ocean" />

      {/* Content */}
      <div className="flex flex-1 flex-col sm:flex-row">
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-navy group-hover:text-teal transition-colors">
                {deal.itineraryTitle}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {deal.cruiseLine || deal.cruiseLineId} &middot; {deal.shipName}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                from
              </p>
              <p className="font-price text-lg font-bold text-coral">
                ${deal.fromPrice.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-400">per person</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Ship className="h-3.5 w-3.5 text-gray-400" />
              {deal.duration} nights
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-gray-400" />
              {deal.departurePort}
            </span>
            {deal.departureDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                {new Date(deal.departureDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          {deal.ports.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {deal.ports.slice(0, 5).map((port) => (
                <Badge key={port} variant="outline" className="text-[10px]">
                  {port}
                </Badge>
              ))}
              {deal.ports.length > 5 && (
                <span className="text-[10px] text-gray-400 self-center">
                  +{deal.ports.length - 5} more
                </span>
              )}
            </div>
          )}

          <p className="mt-2 text-[10px] text-gray-300">
            Saved{" "}
            {new Date(deal.savedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 border-t border-gray-100 px-4 py-3 sm:flex-col sm:justify-center sm:border-t-0 sm:border-l sm:p-4 sm:w-[140px]">
          <Button asChild size="sm" className="flex-1 sm:w-full">
            <Link href={calcHref}>
              <Calculator className="h-3.5 w-3.5 mr-1" />
              True Cost
            </Link>
          </Button>
          <button
            onClick={handleRemove}
            disabled={removing}
            className={cn(
              "flex flex-1 sm:w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200",
              "px-3 py-2 text-xs font-medium text-gray-500",
              "transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {removing ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Heart className="h-8 w-8 text-gray-300" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-navy">
        No saved cruises yet
      </h2>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">
        When you find a cruise you love, tap the heart icon to save it here for
        easy comparison later.
      </p>
      <Button asChild className="mt-6">
        <Link href="/cruises">
          <Anchor className="h-4 w-4 mr-1.5" />
          Browse Deals
        </Link>
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sign-in prompt                                                     */
/* ------------------------------------------------------------------ */

function SignInPrompt() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal/10">
        <Ship className="h-8 w-8 text-teal" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-navy">
        Sign in to see your trips
      </h2>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">
        Save your favorite cruise deals and access them from any device.
      </p>
      <Button onClick={() => setShowModal(true)} className="mt-6">
        Sign In
      </Button>
      <SignInModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function MyTripsPage() {
  const { user, loading: authLoading } = useAuth();
  const [deals, setDeals] = useState<SavedDeal[]>([]);
  const [loading, setLoading] = useState(true);

  /* Fetch saved deals */
  useEffect(() => {
    if (!user) {
      setDeals([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchDeals = async () => {
      setLoading(true);
      try {
        const colRef = collection(db, "users", user.uid, "savedDeals");
        const snapshot = await getDocs(colRef);
        if (!cancelled) {
          const fetched: SavedDeal[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as SavedDealData & { savedAt: string }),
          }));
          // Sort by savedAt descending (most recent first)
          fetched.sort(
            (a, b) =>
              new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
          );
          setDeals(fetched);
        }
      } catch (err) {
        console.error("Error fetching saved deals:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDeals();
    return () => {
      cancelled = true;
    };
  }, [user]);

  /* Remove a deal */
  const handleRemove = async (dealId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "savedDeals", dealId));
      setDeals((prev) => prev.filter((d) => d.id !== dealId));
    } catch (err) {
      console.error("Error removing deal:", err);
    }
  };

  /* Loading skeleton */
  if (authLoading || (user && loading)) {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <div className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold tracking-tight text-navy">
                My Trips
              </h1>
            </div>
          </div>
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-5 w-5 text-coral" />
              <h1 className="text-2xl font-bold tracking-tight text-navy">
                My Trips
              </h1>
            </div>
            {user && deals.length > 0 && (
              <p className="text-sm text-gray-500">
                {deals.length} saved cruise{deals.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {!user ? (
            <SignInPrompt />
          ) : deals.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {deals.map((deal) => (
                <SavedDealCard
                  key={deal.id}
                  deal={deal}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
