import { CheckCircle2, Smartphone } from "lucide-react";
import { StoreButtonRow } from "@/components/shared/store-buttons";

const MOBILE_FEATURES = [
  "True cost calculator",
  "Ship-time and port-time planning",
  "MyDay itinerary and spend tools",
  "Optional MyCrew check-ins",
] as const;

export default function MobileLaunchSection() {
  return (
    <section id="download" className="scroll-mt-28 border-y border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:px-8 lg:py-16">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-dark">
            <Smartphone className="h-3.5 w-3.5" />
            Free on iPhone and Android
          </div>

          <h2 className="max-w-2xl text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            CruiseKit is now available for iPhone and Android.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
            The website stays useful today, and the mobile app gives cruisers
            the onboard tools they need for planning, port days, MyDay, and
            trip costs.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {MOBILE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-teal" strokeWidth={2.2} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <StoreButtonRow sourceSurface="mobile_section" className="sm:grid-cols-1" />
      </div>
    </section>
  );
}
