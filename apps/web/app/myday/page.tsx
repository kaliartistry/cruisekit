import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MyDayContent from "./myday-content";

export const metadata: Metadata = {
  title: "MyDay — Your Cruise Day, Handled",
  description:
    "Coming mobile cruise-day planner with ship time clocks, onboard spend tracking, smart tip prompts, and MyCrew status check-ins.",
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
