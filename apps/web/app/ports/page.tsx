import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Port Day Planner",
  description:
    "Discover port activities, plan excursions, and build day-by-day itineraries for every stop.",
};

export default function PortsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          pillar="explore"
          title="Port Day Planner"
          subtitle="Discover activities, plan excursions, and build day-by-day itineraries for every port of call."
          breadcrumbs={[{ label: "Port Day Planner" }]}
        />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
            <p className="text-lg font-medium text-gray-500">
              Coming soon — Plan your perfect port day.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
