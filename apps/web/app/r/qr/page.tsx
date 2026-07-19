import type { Metadata } from "next";
import ReferralQr from "@/components/growth/referral-qr";

export const metadata: Metadata = { title: "Referral QR code", robots: { index: false, follow: false } };
export default function ReferralQrPage() { return <ReferralQr />; }
