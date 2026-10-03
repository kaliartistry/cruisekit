import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CruiseHandoffClient from "./cruise-handoff-client";

export const metadata: Metadata = {
  title: "Continue Your Saved Cruise",
  description:
    "Open the cruise you saved from the CruiseKit calculator and continue in the mobile app.",
  robots: { index: false, follow: false },
};

export default function CruiseHandoffPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-gray-50/60 px-4 py-14 sm:px-6">
        <CruiseHandoffClient />
      </main>
      <Footer />
    </>
  );
}
