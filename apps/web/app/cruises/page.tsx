import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CruiseSearchPage from "./cruise-search";

export const metadata: Metadata = {
  title: "Curated Cruise Sailings — Compare Planning-Ready Options",
  description:
    "Browse curated cruise sailings with itinerary details, source dates, and planning fares that should be confirmed with the cruise line before booking.",
};

export default function CruisesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <CruiseSearchPage />
      </main>
      <Footer />
    </>
  );
}
