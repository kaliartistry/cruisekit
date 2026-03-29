import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Cruise Guides",
  description:
    "Expert cruise guides covering everything from first-time tips to advanced loyalty strategies.",
};

export default function GuidesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title="Cruise Guides"
          subtitle="Expert guides covering everything from first-time tips to advanced loyalty strategies."
          breadcrumbs={[{ label: "Guides" }]}
        />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
            <p className="text-lg font-medium text-gray-500">
              Coming soon — Comprehensive cruise guides.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
