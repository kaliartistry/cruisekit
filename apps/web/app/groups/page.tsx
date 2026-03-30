import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";
import GroupsContent from "./groups-content";

export const metadata: Metadata = {
  title: "Group Hub — Plan & Split Costs for Group Cruises",
  description:
    "Estimate per-person costs for your group cruise, follow a step-by-step planning timeline, and coordinate your group booking across all major cruise lines.",
  keywords: [
    "group cruise planning",
    "group cruise cost calculator",
    "split cruise costs",
    "group cruise booking",
    "cruise group rates",
    "group cruise checklist",
  ],
};

export default function GroupsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          pillar="coordinate"
          title="Group Hub"
          subtitle="Estimate per-person costs, plan your timeline, and coordinate your group cruise — all in one place."
          breadcrumbs={[{ label: "Group Hub" }]}
        />
        <GroupsContent />
      </main>
      <Footer />
    </>
  );
}
