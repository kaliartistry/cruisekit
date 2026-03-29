import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Group Hub",
  description:
    "Manage group bookings, split costs, share itineraries, and keep everyone on the same page.",
};

export default function GroupsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          pillar="coordinate"
          title="Group Hub"
          subtitle="Manage group bookings, split costs, share itineraries, and keep everyone on the same page."
          breadcrumbs={[{ label: "Group Hub" }]}
        />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
            <p className="text-lg font-medium text-gray-500">
              Coming soon — Wrangle your group with ease.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
