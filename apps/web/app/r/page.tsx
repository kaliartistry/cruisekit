import type { Metadata } from "next";
import ReferralRedirect from "@/components/growth/referral-redirect";

export const metadata: Metadata = {
  title: "CruiseKit invitation",
  robots: { index: false, follow: false },
};

export default function ReferralPage() { return <ReferralRedirect />; }
