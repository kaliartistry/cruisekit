import Image from "next/image";
import { CheckCircle2, Smartphone } from "lucide-react";
import { StoreButtonRow } from "@/components/shared/store-buttons";

const MOBILE_FEATURES = [
  "MyDay home for the saved cruise",
  "Exact Spend totals with cents preserved",
  "Drink package value without pressure",
  "Itinerary-only port maps and MyCrew invites",
] as const;

export default function MobileLaunchSection() {
  return (
    <section id="download" className="scroll-mt-28 border-y border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8 lg:py-16">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-teal/20 bg-teal/10 px-3 py-1 text-xs font-semibold uppercase text-teal-dark">
            <Smartphone className="h-3.5 w-3.5" />
            Free on iPhone and Android
          </div>

          <h2 className="max-w-2xl text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            Built around the cruise you already saved.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
            The website stays useful for research. The mobile app is the
            onboard companion: MyDay first, Spend second, and practical port
            maps for the itinerary in front of you.
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

        <div className="grid gap-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              "/assets/app-screenshots/myday-home.png",
              "/assets/app-screenshots/drink-package.png",
              "/assets/app-screenshots/port-map.png",
            ].map((src, index) => (
              <div
                key={src}
                className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm"
              >
                <div className="relative aspect-[1290/2796]">
                  <Image
                    src={src}
                    alt={`CruiseKit app screenshot ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 180px, 30vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
          <StoreButtonRow sourceSurface="mobile_section" className="sm:grid-cols-2" />
        </div>
      </div>
    </section>
  );
}
