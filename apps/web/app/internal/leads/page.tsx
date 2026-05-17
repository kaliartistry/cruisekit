import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LeadDashboard from "./lead-dashboard";

export const metadata: Metadata = {
  title: "Lead Dashboard",
  robots: { index: false, follow: false },
};

export default function LeadDashboardPage() {
  if (
    process.env.NEXT_PUBLIC_ENABLE_INTERNAL_TOOLS !== "true" &&
    process.env.NEXT_PUBLIC_ENABLE_LEAD_DASHBOARD !== "true"
  ) {
    notFound();
  }

  return <LeadDashboard />;
}
