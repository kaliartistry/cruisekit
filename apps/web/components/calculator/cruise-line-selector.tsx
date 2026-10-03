"use client";

import { motion } from "framer-motion";
import CruiseLineLogo from "@/components/shared/cruise-line-logo";
import { cn } from "@/lib/utils/cn";

const CRUISE_LINES = [
  {
    id: "royal-caribbean" as const,
    name: "Royal Caribbean",
    tagline: "Main dining, buffet, kids club, pools & entertainment included",
  },
  {
    id: "carnival" as const,
    name: "Carnival",
    tagline: "Guy's Burgers, comedy shows, Camp Ocean kids club included",
  },
  {
    id: "norwegian" as const,
    name: "Norwegian",
    tagline: "Free at Sea: open bar, 3 dining meals, WiFi minutes included",
  },
  {
    id: "msc" as const,
    name: "MSC Cruises",
    tagline: "Main dining, buffet, LEGO kids clubs, pools included",
  },
  {
    id: "celebrity" as const,
    name: "Celebrity",
    tagline: "Elegant dining, Oceanview Cafe, entertainment included",
  },
  {
    id: "princess" as const,
    name: "Princess",
    tagline: "Movies Under the Stars, main dining, pools included",
  },
  {
    id: "holland-america" as const,
    name: "Holland America",
    tagline: "Lido Market, Dive-In burgers, Club HAL kids club included",
  },
  {
    id: "disney" as const,
    name: "Disney",
    tagline: "Character dining, Castaway Cay, all kids clubs included",
  },
  {
    id: "virgin-voyages" as const,
    name: "Virgin Voyages",
    tagline: "All 20+ restaurants, basic WiFi, tips on food included",
  },
];

interface CruiseLineSelectorProps {
  selected: string[];
  onSelect: (ids: string[]) => void;
}

export default function CruiseLineSelector({
  selected,
  onSelect,
}: CruiseLineSelectorProps) {
  const handleClick = (id: string) => {
    const idx = selected.indexOf(id);
    if (idx >= 0) {
      // Already selected -> remove
      onSelect(selected.filter((s) => s !== id));
    } else if (selected.length < 2) {
      // Not selected + room -> add
      onSelect([...selected, id]);
    } else {
      // Not selected + 2 already -> replace oldest (first)
      onSelect([selected[1], id]);
    }
  };

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">
        Select up to 2 cruise lines to compare
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CRUISE_LINES.map((line) => {
          const selectionIndex = selected.indexOf(line.id);
          const isSelected = selectionIndex >= 0;
          return (
            <motion.button
              key={line.id}
              type="button"
              onClick={() => handleClick(line.id)}
              whileHover={{ translateY: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={cn(
                "relative flex items-start gap-3 rounded-xl border-2 bg-white p-4 text-left transition-all duration-200",
                isSelected
                  ? "border-teal shadow-[0_0_16px_rgba(0,180,216,0.15)]"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              {/* Numbered badge */}
              {isSelected && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal text-xs font-bold text-white shadow-sm">
                  {selectionIndex + 1}
                </span>
              )}
              <CruiseLineLogo cruiseLineId={line.id} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy">{line.name}</p>
                <p className="mt-0.5 text-xs leading-snug text-gray-500">
                  {line.tagline}
                </p>
              </div>
              {isSelected && (
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal text-white">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
