import Link from "next/link";
import { Ship } from "lucide-react";
import AppHandoff from "@/components/shared/app-handoff";

const FOOTER_COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Download the App", href: "/app" },
      { label: "MyDay", href: "/myday" },
      { label: "Spend Tracker", href: "/app#spend" },
      { label: "Drink Package Tracker", href: "/cruise-drink-package-calculator" },
      { label: "Itinerary Port Guides", href: "/ports" },
      { label: "Cruise Route Map", href: "/features/cruise-route-map" },
      { label: "True Cost Calculator", href: "/calculator" },
      { label: "Browse Sailings", href: "/cruises" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Cruise Guides", href: "/guides" },
      { label: "Cruise Port Guides", href: "/features/cruise-port-guides" },
      {
        label: "Itinerary Planner",
        href: "/features/cruise-itinerary-planner",
      },
      { label: "Cruise Costs", href: "/cruise-costs" },
      { label: "Ship Time vs Port Time", href: "/ship-time-vs-port-time" },
      {
        label: "Drink Package Calculator",
        href: "/cruise-drink-package-calculator",
      },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Help Center", href: "/help" },
      { label: "Methodology", href: "/methodology" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Public Information", href: "/cruisekit-public-information" },
      { label: "What is CruiseKit?", href: "/what-is-cruisekit" },
      { label: "CruiseKit Facts", href: "/cruisekit-facts" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "How we make money", href: "/how-we-make-money" },
      { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Delete Your Account", href: "/account-deletion" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Email CruiseKit", href: "mailto:info@cruisekit.app" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Data corrections", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* App handoff block — persistent footer promo */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <AppHandoff variant="footer" />
      </div>

      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Brand row */}
        <div className="mb-10 flex items-center gap-2.5">
          <Ship className="h-6 w-6 text-teal" strokeWidth={2} />
          <span className="text-lg font-bold tracking-tight font-sans">
            CruiseKit
          </span>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} CruiseKit. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              Built for cruisers, by cruisers
            </span>
            <span className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Independent Toolkit
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
