import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MyDayContent from "./myday-content";

export const metadata: Metadata = {
  title: "MyDay — Your Cruise Day, Handled",
  description:
    "CruiseKit MyDay helps cruisers compare device and port-local time, keep official ship-time verification close, manage daily plans, track spend, and use MyCrew check-ins.",
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
