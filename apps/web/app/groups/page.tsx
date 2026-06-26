import type { Metadata } from "next";
import Link from "next/link";
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
        <section className="border-b border-gray-200 bg-seafoam/35">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase text-teal-dark">
                MyCrew check-ins
              </p>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-700">
                Need day-of group status during the cruise? Read how CruiseKit
                handles lightweight MyCrew coordination without replacing
                official onboard information.
              </p>
            </div>
            <Link
              href="/cruise-group-check-in-app"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-teal/40 bg-white px-4 py-2 text-sm font-bold text-teal-dark transition-colors hover:border-teal hover:text-teal"
            >
              Cruise group check-ins
            </Link>
          </div>
        </section>
        <GroupsContent />
      </main>
      <Footer />
    </>
  );
}
