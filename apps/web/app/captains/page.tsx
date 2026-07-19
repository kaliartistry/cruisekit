import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PartnerRecruitmentContent from "@/components/growth/partner-recruitment-content";

export const metadata: Metadata = { title: "Sailing Captain Pilot", description: "Help your real sailing group stay organized with CruiseKit." };
export default function CaptainsPage() { return <><Navbar /><main className="flex-1"><PartnerRecruitmentContent type="captain" /></main><Footer /></>; }
