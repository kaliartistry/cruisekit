"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/firebase/auth";
import SignInModal from "@/components/shared/sign-in-modal";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SavedDealData {
  cruiseLineId: string;
  shipName: string;
  duration: number;
  departurePort: string;
  ports: string[];
  fromPrice: number;
  departureDate: string | null;
  itineraryTitle: string;
  cruiseLine?: string;
  imageUrl?: string | null;
  bookingUrl?: string | null;
}

interface HeartButtonProps {
  dealId: string;
  dealData: SavedDealData;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeartButton({
  dealId,
  dealData,
  className,
}: HeartButtonProps) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);

  /* Check if deal is already saved */
  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }

    let cancelled = false;
    setChecking(true);

    const checkSaved = async () => {
      try {
        const ref = doc(db, "users", user.uid, "savedDeals", dealId);
        const snap = await getDoc(ref);
        if (!cancelled) setSaved(snap.exists());
      } catch (err) {
        console.error("Error checking saved state:", err);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    checkSaved();
    return () => {
      cancelled = true;
    };
  }, [user, dealId]);

  /* Save deal to Firestore */
  const saveDeal = useCallback(async () => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid, "savedDeals", dealId);
      await setDoc(ref, {
        ...dealData,
        savedAt: new Date().toISOString(),
      });
      setSaved(true);
    } catch (err) {
      console.error("Error saving deal:", err);
    }
  }, [user, dealId, dealData]);

  /* Remove saved deal */
  const unsaveDeal = useCallback(async () => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid, "savedDeals", dealId);
      await deleteDoc(ref);
      setSaved(false);
    } catch (err) {
      console.error("Error unsaving deal:", err);
    }
  }, [user, dealId]);

  /* Toggle save state */
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setPendingSave(true);
      setShowSignIn(true);
      return;
    }

    if (saved) {
      await unsaveDeal();
    } else {
      await saveDeal();
    }
  };

  /* After sign-in, auto-save if pending */
  const handleSignInSuccess = () => {
    if (pendingSave) {
      setPendingSave(false);
      // Small delay to let auth state propagate
      setTimeout(() => {
        saveDeal();
      }, 500);
    }
  };

  return (
    <>
      <motion.button
        onClick={handleClick}
        disabled={checking}
        className={cn(
          "absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center",
          "rounded-full bg-white/90 backdrop-blur-sm shadow-md",
          "transition-colors hover:bg-white",
          "disabled:opacity-50",
          className
        )}
        whileTap={{ scale: 0.85 }}
        aria-label={saved ? "Remove from saved" : "Save this cruise"}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={saved ? "filled" : "outline"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                saved
                  ? "fill-red-500 text-red-500"
                  : "fill-transparent text-gray-600"
              )}
            />
          </motion.div>
        </AnimatePresence>
      </motion.button>

      <SignInModal
        open={showSignIn}
        onOpenChange={setShowSignIn}
        onSuccess={handleSignInSuccess}
      />
    </>
  );
}
