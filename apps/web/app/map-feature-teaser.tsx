import Link from "next/link";
import { ArrowRight, CalendarDays, MapPinned, Route } from "lucide-react";

const MAP_FEATURES = [
  {
    title: "Itinerary Route Context",
    body: "See the cruise days, sea days, and port sequence tied to the sailing you saved.",
    href: "/features/cruise-route-map",
    icon: Route,
  },
  {
    title: "Itinerary Port Maps",
    body: "Open maps for the ports on your cruise, with terminal and point-of-interest context.",
    href: "/features/cruise-port-guides",
    icon: MapPinned,
  },
  {
    title: "Plan Port Day",
    body: "Start plans from port details and points of interest, then keep them close in MyDay.",
    href: "/app",
    icon: CalendarDays,
  },
] as const;

export default function MapFeatureTeaser() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              Port maps that stay tied to your actual itinerary.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              CruiseKit keeps port planning focused on the stops you are
              visiting. Save a cruise, open the relevant port guides, and use
              the map as context for getting back to the ship on time.
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Public port research still lives on the website, but the mobile
              app avoids overwhelming travelers with ports that are not part of
              their sailing.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {MAP_FEATURES.map(({ title, body, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-lg border border-gray-200 bg-white p-5 shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-[var(--shadow-md)]"
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
