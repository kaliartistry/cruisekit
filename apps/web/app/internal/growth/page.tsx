import type { Metadata } from "next";
import GrowthDashboard from "./growth-dashboard";

export const metadata: Metadata = {
  title: "Growth Console",
  robots: { index: false, follow: false },
};

export default function GrowthConsolePage() {
  return <GrowthDashboard />;
}
