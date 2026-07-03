"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Loader2, Plus, Smartphone } from "lucide-react";

import SignInModal from "@/components/shared/sign-in-modal";
import { Button } from "@/components/ui/button";
import type { RealDeal } from "@/lib/data/real-deals";
import { useAuth } from "@/lib/firebase/auth";
import {
  buildActiveCruisePayload,
  saveActiveCruiseForUser,
} from "@/lib/sync/active-cruise";
import { cn } from "@/lib/utils/cn";

interface ActiveCruiseButtonProps {
  deal: RealDeal;
  className?: string;
}

export default function ActiveCruiseButton({
  deal,
  className,
}: ActiveCruiseButtonProps) {
  const { user, loading: authLoading } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [pendingCloudSave, setPendingCloudSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo(() => buildActiveCruisePayload(deal), [deal]);

  const saveActiveCruise = useCallback(
    async (uid: string) => {
      if (!payload) return;

      setSaving(true);
      setError(null);
      try {
        await saveActiveCruiseForUser(uid, payload);
        setSaved(true);
      } catch (err) {
        console.error("Error saving active cruise:", err);
        setError("Could not add this cruise. Try again.");
      } finally {
        setSaving(false);
        setPendingCloudSave(false);
      }
    },
    [payload],
  );

  useEffect(() => {
    if (!pendingCloudSave || !user || authLoading) return;
    void saveActiveCruise(user.uid);
  }, [authLoading, pendingCloudSave, saveActiveCruise, user]);

  const handleClick = async () => {
    if (!payload) {
      setError("This sailing is not available in the mobile app yet.");
      return;
    }

    if (!user) {
      setPendingCloudSave(true);
      setShowSignIn(true);
      return;
    }

    await saveActiveCruise(user.uid);
  };

  const buttonLabel = saved ? "Added to My Trips" : "Add to My Trips";
  const Icon = saving ? Loader2 : saved ? Check : Plus;

  return (
    <div className={cn("space-y-2", className)}>
      <Button
        type="button"
        size="sm"
        variant={saved ? "default" : "outline"}
        className="w-full"
        disabled={saving || !payload}
        onClick={handleClick}
      >
        <Icon className={cn("mr-1.5 h-3.5 w-3.5", saving && "animate-spin")} />
        {saving ? "Adding..." : buttonLabel}
      </Button>

      {saved ? (
        <p className="flex items-start gap-1.5 text-[10px] leading-snug text-teal">
          <Smartphone className="mt-0.5 h-3 w-3 shrink-0" />
          <span>
            Open CruiseKit on your phone and sign in with this same Google
            account.
          </span>
        </p>
      ) : null}

      {error ? (
        <p className="text-[10px] leading-snug text-red-600">{error}</p>
      ) : null}

      <SignInModal
        open={showSignIn}
        onOpenChange={setShowSignIn}
        onSuccess={() => setPendingCloudSave(true)}
      />
    </div>
  );
}
