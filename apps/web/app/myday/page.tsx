import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MyDayContent from "./myday-content";

export const metadata: Metadata = {
  title: "MyDay — Your Cruise Day, Handled | CruiseKit",
  description:
    "Daily schedule with ship time clocks, onboard spend tracker with smart tip prompts, and real-time MyCrew coordination. Everything you need during your cruise.",
};

export default function MyDayPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <MyDayContent />
      </main>
      <Footer />
    </>
  );
}
