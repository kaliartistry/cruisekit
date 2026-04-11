import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CruiseSearchPage from "./cruise-search";

export const metadata: Metadata = {
  title: "Cruise Deals — Compare Real Sailings from 9 Cruise Lines | CruiseKit",
  description:
    "Browse and filter real cruise deals from Royal Caribbean, Carnival, Norwegian, Celebrity, Princess, Holland America, MSC, Disney, and Virgin Voyages. Compare prices, ships, ports, and durations.",
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
