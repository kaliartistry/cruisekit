"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { httpsCallable } from "firebase/functions";
import { Calendar, Ship, Users } from "lucide-react";
import { functions } from "@/lib/firebase/config";
import { useAuth } from "@/lib/firebase/auth";
import SignInModal from "@/components/shared/sign-in-modal";
import { Button } from "@/components/ui/button";
import { StoreButtonRow } from "@/components/shared/store-buttons";
import { trackMyCrewInviteOpened } from "@/lib/analytics";

type InvitePreview = {
  name: string;
  organizerName?: string;
  cruiseLineId?: string;
  shipName?: string;
  departureDate?: string;
  isMember?: boolean;
};

export default function MyCrewJoinClient() {
  return <Suspense fallback={<Loading />}><JoinContent /></Suspense>;
}

function JoinContent() {
  const params = useSearchParams();
  const code = (params.get("code") ?? "").trim().toUpperCase().slice(0, 6);
  const { user, loading: authLoading } = useAuth();
  const [signInOpen, setSignInOpen] = useState(false);
  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackMyCrewInviteOpened({ sourceType: "traveler", landingContext: "sailing" });
  }, []);

  useEffect(() => {
    if (authLoading || !user || !/^[A-Z2-9]{6}$/.test(code)) return;
    const lookup = httpsCallable<{ inviteCode: string }, InvitePreview>(
      functions,
      "findGroupByInvite",
    );
    void lookup({ inviteCode: code })
      .then((result) => setPreview(result.data))
      .catch(() => setError("This invitation is invalid or no longer available."));
  }, [authLoading, code, user]);

  if (!/^[A-Z2-9]{6}$/.test(code)) {
    return <Message title="This invite link is incomplete" body="Ask the organizer to share the full CruiseKit MyCrew link again." />;
  }
  if (authLoading || (user && !preview && !error)) return <Loading />;
  if (!user) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <Users className="mx-auto h-11 w-11 text-teal" />
        <h1 className="mt-4 text-2xl font-extrabold text-navy">You have a private MyCrew invite</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">Sign in to verify the invitation. Cruise details are not exposed on public links.</p>
        <Button className="mt-6" onClick={() => setSignInOpen(true)}>Verify invitation</Button>
        <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />
      </div>
    );
  }
  if (error || !preview) return <Message title="Invitation unavailable" body={error ?? "We could not load this invitation."} />;

  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="p-7 sm:p-8">
        <Users className="h-10 w-10 text-teal" />
        <h1 className="mt-4 text-2xl font-extrabold text-navy">Join {preview.name}</h1>
        {preview.organizerName && <p className="mt-1 text-sm text-gray-600">Invited by {preview.organizerName}</p>}
        <div className="mt-6 space-y-3 rounded-xl bg-gray-50 p-5 text-sm text-navy">
          <p className="flex items-center gap-2"><Ship className="h-4 w-4 text-teal" />{preview.shipName || "Cruise details will appear in the app"}</p>
          {preview.departureDate && <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-teal" />{preview.departureDate}</p>}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-gray-600">Install or open CruiseKit, then this link will take you to the private join screen. You choose the name your crew sees before joining.</p>
      </div>
      <div className="bg-navy p-6 sm:p-8"><StoreButtonRow sourceSurface="saved_trip" variant="dark" /></div>
    </div>
  );
}

function Loading() {
  return <div className="mx-auto max-w-xl py-20 text-center text-gray-500">Checking your invitation...</div>;
}

function Message({ title, body }: { title: string; body: string }) {
  return <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm"><Users className="mx-auto h-10 w-10 text-gray-300" /><h1 className="mt-4 text-2xl font-extrabold text-navy">{title}</h1><p className="mt-2 text-sm text-gray-600">{body}</p></div>;
}
