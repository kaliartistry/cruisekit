import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

/**
 * Teaser for the Drink Package Worth It guide on the home page.
 * Designer flagged this as the single most search-friendly, most
 * trust-building piece of content on the site — putting it on home
 * previews the editorial quality before a user commits to the calc.
 */
export default function HomeGuideTeaser() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 border-y border-gray-200">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-teal" />
          <span className="text-xs font-semibold uppercase tracking-wider text-teal">
            The kind of thing we&rsquo;ll tell you
          </span>
        </div>

        <h2 className="mb-3 max-w-3xl text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Is the drink package worth it? Probably not, actually.
        </h2>
        <p className="mb-6 max-w-2xl text-base leading-relaxed text-gray-600">
          Cruise lines market drink packages at a flat daily price that looks
          like a deal. Break-even math says most couples lose money on it.
          Here&rsquo;s the spreadsheet, line by line.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-6">
          {[
            { stat: "$85/day", label: "Avg. package price" },
            { stat: "7–9 drinks", label: "Break-even per day" },
            { stat: "$0", label: "What we charge to tell you" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="font-price text-lg font-bold text-navy">
                {s.stat}
              </div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <Link
          href="/guides/drink-package-guide"
          className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-navy/90"
        >
          Read the 2026 break-even math
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
