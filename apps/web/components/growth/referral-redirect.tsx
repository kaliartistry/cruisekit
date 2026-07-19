"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase/config";

export default function ReferralRedirect() {
  const [state, setState] = useState<"loading" | "invalid">("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = (params.get("code") ?? params.get("ref") ?? "").trim();
    if (!code) {
      Promise.resolve().then(() => setState("invalid"));
      return;
    }
    const resolveReferral = httpsCallable<{ code: string }, { active: boolean; code?: string; targetPath?: string }>(functions, "resolveReferral");
    void resolveReferral({ code }).then((result) => {
      if (!result.data.active || !result.data.code) { setState("invalid"); return; }
      const target = result.data.targetPath?.startsWith("/") ? result.data.targetPath : "/founding-20";
      const url = new URL(target, window.location.origin);
      url.searchParams.set("ref", result.data.code);
      window.location.replace(url.toString());
    }).catch(() => setState("invalid"));
  }, []);

  if (state === "loading") return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6"><div className="text-center"><Loader2 className="mx-auto h-7 w-7 animate-spin text-teal" /><p className="mt-4 text-sm text-gray-600">Opening your CruiseKit link…</p></div></main>;
  return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6"><section className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-[var(--shadow-md)]"><h1 className="text-2xl font-bold text-navy">This CruiseKit link isn’t active</h1><p className="mt-3 text-sm leading-relaxed text-gray-600">The referral link may have expired or been revoked. You can still explore CruiseKit directly.</p><Link href="/founding-20" className="mt-6 inline-flex rounded-lg bg-ocean px-5 py-3 text-sm font-bold text-white hover:bg-ocean/90">Explore Founding 20</Link></section></main>;
}
