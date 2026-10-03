import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import InviteLandingClient from "./invite-landing-client";

export const metadata: Metadata = {
  title: "Join a MyCrew Group",
  description:
    "Open a CruiseKit MyCrew invitation and enter its code in MyDay on iPhone or Android.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function MyCrewJoinPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <InviteLandingClient />
      </main>
      <Footer />
    </>
  );
}
