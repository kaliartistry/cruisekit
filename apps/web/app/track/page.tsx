import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BackToShipContent from "./back-to-ship-content";

export const metadata: Metadata = {
  title: "BackToShip — Never Miss Your Cruise Ship | CruiseKit",
  description:
    "Offline GPS tracking that tells you exactly when to head back to the ship. Personalized walking times, escalating departure alerts, and excursion awareness. No WiFi or data needed.",
};

export default function TrackPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <BackToShipContent />
      </main>
      <Footer />
    </>
  );
}
