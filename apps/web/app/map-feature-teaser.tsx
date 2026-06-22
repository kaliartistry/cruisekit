import Link from "next/link";
import { ArrowRight, Compass, MapPinned, Route } from "lucide-react";

const MAP_FEATURES = [
  {
    title: "Cruise Route Map",
    body: "See each cruise day, sea day, and port stop as a simple visual itinerary.",
    href: "/features/cruise-route-map",
    icon: Route,
  },
  {
    title: "Port Guide Map Cards",
    body: "Preview walkability, tender status, currency, Wi-Fi, cell coverage, and top things to do.",
    href: "/features/cruise-port-guides",
    icon: MapPinned,
  },
  {
    title: "Explore Map",
    body: "Browse cruise ports visually, filter by region, and open destination guides.",
    href: "/features/explore-map",
    icon: Compass,
  },
] as const;

export default function MapFeatureTeaser() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Visual cruise planning without expensive or complicated tools.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              CruiseKit is a free cruise planning app that helps travelers
              visualize cruise routes, explore cruise ports, compare
              destinations, and plan better cruise days.
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              CruiseKit maps are built for planning and discovery: see where
              your cruise is going, preview ports, and understand each
              destination before you sail.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {MAP_FEATURES.map(({ title, body, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-[var(--shadow-md)]"
              >
                <Icon className="h-6 w-6 text-teal" strokeWidth={2.1} />
                <h3 className="mt-4 text-base font-extrabold text-navy">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-teal">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
