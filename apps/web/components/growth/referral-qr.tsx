"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, Loader2 } from "lucide-react";
import { toDataURL } from "qrcode";

export default function ReferralQr() {
  const [code, setCode] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const referralCode = (new URLSearchParams(window.location.search).get("code") ?? "").trim().toUpperCase();
    // Match the server-issued opaque referral code format. The QR page only
    // renders a code; the redirect route still verifies that it is active.
    if (!/^[A-Z2-9]{8,32}$/.test(referralCode)) {
      Promise.resolve().then(() => setFailed(true));
      return;
    }
    Promise.resolve().then(() => setCode(referralCode));
  }, []);

  useEffect(() => {
    if (!code) return;
    const destination = `${window.location.origin}/r/?code=${encodeURIComponent(code)}`;
    void toDataURL(destination, { width: 768, margin: 2, color: { dark: "#0C2340", light: "#FFFFFF" } }).then(setDataUrl).catch(() => setFailed(true));
  }, [code]);

  if (failed) return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6"><section className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center"><h1 className="text-2xl font-bold text-navy">Referral QR code unavailable</h1><p className="mt-3 text-sm text-gray-600">Use an active referral code from the Growth Console.</p><Link href="/founding-20" className="mt-6 inline-flex text-sm font-semibold text-teal hover:text-teal-dark">Back to CruiseKit</Link></section></main>;
  if (!dataUrl) return <main className="flex min-h-screen items-center justify-center bg-gray-50"><Loader2 className="h-7 w-7 animate-spin text-teal" /></main>;
  return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6"><section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-[var(--shadow-md)]"><p className="text-sm font-semibold text-teal">CruiseKit referral</p><h1 className="mt-1 text-2xl font-bold text-navy">Scan to open your link</h1><p className="mt-2 text-sm text-gray-600">Code: <span className="font-mono font-bold">{code}</span></p><Image src={dataUrl} alt={`QR code for CruiseKit referral ${code}`} width={768} height={768} unoptimized className="mx-auto mt-6 w-full max-w-xs" /><a href={dataUrl} download={`cruisekit-referral-${code}.png`} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ocean px-5 py-3 text-sm font-bold text-white hover:bg-ocean/90"><Download className="h-4 w-4" />Download QR code</a></section></main>;
}
