import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import LoyaltyContent from "./loyalty-content";

export const metadata: Metadata = {
  title: "Cruise Loyalty Programs — Compare Tiers, Perks & Status Matching",
  description:
    "Compare loyalty programs across Royal Caribbean, Carnival, Norwegian, Celebrity, Princess, Disney, and more. Find your tier, see perks, and discover which lines offer status matching.",
  keywords: [
    "cruise loyalty programs",
    "crown and anchor society",
    "vifp club",
    "latitudes rewards",
    "cruise status match",
    "cruise line loyalty comparison",
    "cruise loyalty tiers",
    "best cruise loyalty program",
  ],
};

export default function LoyaltyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          pillar="optimize"
          title="Loyalty Hub"
          subtitle="Compare loyalty programs across 9 cruise lines. See your tier, explore perks, and find status match opportunities."
          breadcrumbs={[{ label: "Loyalty Hub" }]}
        />
        <LoyaltyContent />
      </main>
      <Footer />
    </>
  );
}
