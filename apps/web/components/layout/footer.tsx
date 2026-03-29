import Link from "next/link";
import { Ship } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Cruise Deals", href: "/cruises" },
      { label: "True Cost Calculator", href: "/calculator" },
      { label: "Port Day Planner", href: "/ports" },
      { label: "Group Hub", href: "/groups" },
      { label: "BackToShip GPS", href: "/track" },
      { label: "Loyalty Hub", href: "/loyalty" },
      { label: "Compare Cruise Lines", href: "/compare" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Cruise Guides", href: "/guides" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Twitter / X", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
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
            <a
              href="https://shipsafesdk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 transition-colors hover:text-teal"
            >
              Powered by ShipSafe SDK
            </a>
            <span className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Patent Pending
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
