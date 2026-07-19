import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PartnerRecruitmentContent from "@/components/growth/partner-recruitment-content";

export const metadata: Metadata = { title: "Travel Advisor Pilot", description: "Help clients keep cruise planning organized after booking with CruiseKit." };
export default function AdvisorsPage() { return <><Navbar /><main className="flex-1"><PartnerRecruitmentContent type="advisor" /></main><Footer /></>; }
