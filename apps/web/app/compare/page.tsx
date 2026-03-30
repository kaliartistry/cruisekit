import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import CompareContent from "./compare-content";

export const metadata: Metadata = {
  title: "Compare Cruise Lines — Side-by-Side Cost Comparison",
  description:
    "Compare gratuities, drink packages, WiFi, dining, and hidden costs across Royal Caribbean, Carnival, Norwegian, Celebrity, Princess, Disney, and more. Find the best value cruise line for your next trip.",
  keywords: [
    "compare cruise lines",
    "cruise line comparison",
    "cruise cost comparison",
    "royal caribbean vs carnival",
    "norwegian vs royal caribbean",
    "cheapest cruise line",
    "cruise line gratuity comparison",
    "cruise drink package comparison",
  ],
};

export default function ComparePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          pillar="plan"
          title="Compare Cruise Lines"
          subtitle="Side-by-side cost comparison across 9 major cruise lines. Real prices, not marketing — find where your money goes."
          breadcrumbs={[{ label: "Compare Cruise Lines" }]}
        />
        <CompareContent />
      </main>
      <Footer />
    </>
  );
}
