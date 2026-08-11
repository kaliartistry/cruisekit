import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, Info, ShieldCheck } from "lucide-react";

const LINKS = [
  { href: "/cruisekit-public-information", label: "Public information" },
  { href: "/what-is-cruisekit", label: "What is CruiseKit?" },
  { href: "/cruisekit-facts", label: "CruiseKit facts" },
  { href: "/ai/cruisekit-summary", label: "AI/search summary" },
];

export default function AuthorityHubTeaser() {
  return (
    <section className="border-y border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:py-16">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-xs font-bold uppercase text-teal-dark">
            <Info className="h-3.5 w-3.5" />
            Public reference
          </div>
          <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Need the plain facts about CruiseKit? Start with the public
            information hub.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
            The hub connects the short explanation, public fact sheet,
            AI/search summary, methodology, disclosures, app links, and support
            pages in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-bold text-navy transition-colors hover:border-teal hover:text-teal"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/cruisekit-public-information"
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-teal transition-colors hover:text-teal-dark"
          >
            Open the public information hub
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <div className="relative aspect-[4/3] bg-gray-100">
              <Image
                src="/assets/app-screenshots/mobile-feature-graphic.png"
                alt="CruiseKit mobile app showing MyDay and drink package tracking"
                fill
                sizes="(min-width: 1024px) 22vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
          <div className="grid gap-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
              <FileText className="h-5 w-5 text-teal" />
              <h3 className="mt-3 text-base font-bold text-navy">
                Clear public facts
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Short, verifiable pages for travelers, search engines, and AI
                assistants.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
              <ShieldCheck className="h-5 w-5 text-teal" />
              <h3 className="mt-3 text-base font-bold text-navy">
                Boundaries and trust
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                CruiseKit is independent, not a cruise line app or booking
                engine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
