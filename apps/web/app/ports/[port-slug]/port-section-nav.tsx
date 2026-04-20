"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: "overview", label: "Overview" },
  { id: "excursions", label: "Excursions" },
  { id: "eat", label: "Eat" },
  { id: "get-around", label: "Get around" },
  { id: "emergency", label: "Emergency" },
];

/**
 * Sticky in-page nav for port detail sections. Replaces the 500-line
 * single-scroll experience with a tabbed mental model — each tab
 * smooth-scrolls to a section and highlights via IntersectionObserver.
 * SEO-friendly (all content still on one page) but feels like tabs.
 */
export default function PortSectionNav() {
  const [active, setActive] = useState<string>("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top
          );
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-[112px] z-20 -mx-4 mb-8 border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => handleClick(s.id)}
            className={cn(
              "relative min-h-[44px] whitespace-nowrap px-3 py-3 text-sm font-semibold transition-colors",
              active === s.id
                ? "text-navy"
                : "text-gray-500 hover:text-navy"
            )}
          >
            {s.label}
            {active === s.id && (
              <span className="absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-teal" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
