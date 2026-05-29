import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MyDayContent from "./myday-content";

export const metadata: Metadata = {
  title: "MyDay — Your Cruise Day, Handled",
  description:
    "CruiseKit MyDay for iPhone helps cruisers manage ship time, port time, daily schedules, onboard spend, and MyCrew check-ins.",
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
