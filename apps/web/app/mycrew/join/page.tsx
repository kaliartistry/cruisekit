import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MyCrewJoinClient from "./mycrew-join-client";

export const metadata: Metadata = {
  title: "Join MyCrew",
  description: "Open a private CruiseKit MyCrew invitation.",
  robots: { index: false, follow: false },
};

export default function MyCrewJoinPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-gray-50/60 px-4 py-14 sm:px-6">
        <MyCrewJoinClient />
      </main>
      <Footer />
    </>
  );
}
