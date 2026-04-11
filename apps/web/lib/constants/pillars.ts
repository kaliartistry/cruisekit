import {
  Calculator,
  Users,
  Map,
  Navigation,
  Star,
  type LucideIcon,
} from "lucide-react";

export type PillarKey = "plan" | "coordinate" | "explore" | "myday" | "optimize";

export interface Pillar {
  key: PillarKey;
  label: string;
  icon: LucideIcon;
  color: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  tagline: string;
  description: string;
  href: string;
}

export const PILLARS: Record<PillarKey, Pillar> = {
  plan: {
    key: "plan",
    label: "Plan",
    icon: Calculator,
    color: "#00B4D8",
    colorClass: "text-teal",
    bgClass: "bg-teal/10",
    borderClass: "border-teal/30",
    tagline: "What will it really cost?",
    description:
      "Calculate true cruise costs, compare lines side-by-side, and budget with confidence. No hidden fees, no surprises.",
    href: "/calculator",
  },
  coordinate: {
    key: "coordinate",
    label: "Coordinate",
    icon: Users,
    color: "#FF6B6B",
    colorClass: "text-coral",
    bgClass: "bg-coral/10",
    borderClass: "border-coral/30",
    tagline: "Wrangle your group",
    description:
      "Manage group bookings, split costs, share itineraries, and keep everyone on the same page — literally.",
    href: "/groups",
  },
  explore: {
    key: "explore",
    label: "Explore",
    icon: Map,
    color: "#22C55E",
    colorClass: "text-success",
    bgClass: "bg-success/10",
    borderClass: "border-success/30",
    tagline: "Plan your port days",
    description:
      "Discover port activities, plan excursions, and build day-by-day itineraries for every stop on your voyage.",
    href: "/ports",
  },
  myday: {
    key: "myday",
    label: "MyDay",
    icon: Navigation,
    color: "#F59E0B",
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
    borderClass: "border-warning/30",
    tagline: "Your cruise day, handled",
    description:
      "Daily schedule, onboard spend tracker, and real-time MyCrew coordination — everything you need during your cruise.",
    href: "/myday",
  },
  optimize: {
    key: "optimize",
    label: "Optimize",
    icon: Star,
    color: "#8B5CF6",
    colorClass: "text-[#8B5CF6]",
    bgClass: "bg-[#8B5CF6]/10",
    borderClass: "border-[#8B5CF6]/30",
    tagline: "Loyalty & savings",
    description:
      "Track loyalty points, find the best deals, and maximize every dollar across all major cruise lines.",
    href: "/loyalty",
  },
};

export const PILLAR_LIST: Pillar[] = [
  PILLARS.plan,
  PILLARS.explore,
  PILLARS.coordinate,
  PILLARS.myday,
  PILLARS.optimize,
];
