"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  UserPlus,
} from "lucide-react";
import { CRUISE_LINES } from "@cruise/shared/constants";
import {
  MONTH_LABELS,
  getDefaultMonth,
  getSeasonalMultiplier,
} from "@/lib/data/seasonal-pricing";

const DURATION_RANGES = [
  { label: "3-4", nights: 4 },
  { label: "5-6", nights: 5 },
  { label: "7", nights: 7 },
  { label: "8-9", nights: 9 },
  { label: "10-13", nights: 10 },
  { label: "14+", nights: 14 },
] as const;

export default function HeroSection() {
  const router = useRouter();
  const [selectedLine, setSelectedLine] = useState("");
  const [month, setMonth] = useState(getDefaultMonth());
  const [duration, setDuration] = useState("7");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showChildren, setShowChildren] = useState(false);

  const hasSelectedLine = selectedLine !== "";
  const seasonalInfo = getSeasonalMultiplier(month);

  const getMappedNights = () => {
    const found = DURATION_RANGES.find((d) => d.label === duration);
    return found ? found.nights : 7;
  };

  const handleSubmit = () => {
    const params = new URLSearchParams();
    if (selectedLine) params.set("line", selectedLine);
    params.set("month", String(month));
    params.set("duration", String(getMappedNights()));
    params.set("adults", String(adults));
    if (children > 0) params.set("children", String(children));
    router.push(`/calculator?${params.toString()}`);
  };

  const selectedLineName = CRUISE_LINES.find(
    (l) => l.id === selectedLine,
  )?.name;

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1920&q=80"
        alt="Cruise ship at sea"
        fill
        className="object-cover"
        priority
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy/80" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-24 text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight"
        >
          What will your cruise{" "}
          <span className="text-teal">REALLY</span> cost?
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-white/80 mb-8 max-w-2xl mx-auto"
        >
          Calculate the true total — including drinks, WiFi, gratuities, and
          hidden fees
        </motion.p>

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-5 sm:p-6 lg:p-8 max-w-3xl mx-auto"
        >
          {/* Phase 1: Cruise line selector (always visible) */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
              <Ship className="inline h-3.5 w-3.5 mr-1" />
              Cruise Line
            </label>

            {/* Show checkmark + selected name when a line is chosen */}
            {hasSelectedLine && (
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal text-white">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-sm font-medium text-navy">
                  {selectedLineName}
                </span>
              </div>
            )}

            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal appearance-none cursor-pointer"
            >
              <option value="">Select a cruise line</option>
              {CRUISE_LINES.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </select>
          </div>

          {/* Phase 1 CTA (only when no line selected) */}
          {!hasSelectedLine && (
            <button
              onClick={handleSubmit}
              className="w-full bg-[#FF6B4A] hover:bg-[#E85A3A] text-white font-bold py-4 px-6 rounded-xl text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              See What It Really Costs
              <span aria-hidden="true">&rarr;</span>
            </button>
          )}

          {/* Phase 2: Revealed after cruise line selected */}
          <AnimatePresence>
            {hasSelectedLine && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="overflow-hidden"
              >
                {/* Month selector */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
                    <Calendar className="inline h-3.5 w-3.5 mr-1" />
                    When are you sailing?
                  </label>
                  {/* 2-row grid: 6 per row */}
                  <div className="grid grid-cols-6 gap-1.5">
                    {MONTH_LABELS.map((label, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMonth(idx)}
                        className={`min-h-[44px] py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                          month === idx
                            ? "bg-teal text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {label.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  {/* Seasonal pricing badge */}
                  <div className="mt-2 text-left">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        seasonalInfo.multiplier > 1.15
                          ? "bg-[#FF6B4A]/10 text-[#FF6B4A]"
                          : seasonalInfo.multiplier < 0.95
                            ? "bg-teal/10 text-teal"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {seasonalInfo.multiplier > 1.15 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : seasonalInfo.multiplier < 0.95 ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <Minus className="h-3 w-3" />
                      )}
                      {seasonalInfo.label}
                      {seasonalInfo.multiplier !== 1.0 && (
                        <span>
                          {" — "}prices typically{" "}
                          {seasonalInfo.multiplier > 1
                            ? `${Math.round((seasonalInfo.multiplier - 1) * 100)}% higher`
                            : `${Math.round((1 - seasonalInfo.multiplier) * 100)}% lower`}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Duration selector */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
                    <Clock className="inline h-3.5 w-3.5 mr-1" />
                    Duration (nights)
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {DURATION_RANGES.map((d) => (
                      <button
                        key={d.label}
                        onClick={() => setDuration(d.label)}
                        className={`min-h-[44px] py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                          duration === d.label
                            ? "bg-teal text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Travelers section */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
                    <Users className="inline h-3.5 w-3.5 mr-1" />
                    Travelers
                  </label>

                  {/* Adults stepper */}
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2.5">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 rounded-full bg-white shadow text-navy font-bold text-lg flex items-center justify-center hover:bg-gray-50 transition"
                    >
                      &minus;
                    </button>
                    <span className="flex-1 text-center text-sm font-semibold text-navy">
                      {adults} {adults === 1 ? "Adult" : "Adults"}
                    </span>
                    <button
                      onClick={() => setAdults(Math.min(8, adults + 1))}
                      className="w-8 h-8 rounded-full bg-white shadow text-navy font-bold text-lg flex items-center justify-center hover:bg-gray-50 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Add children link */}
                  {!showChildren && (
                    <button
                      onClick={() => setShowChildren(true)}
                      className="mt-2 inline-flex items-center gap-1 text-sm text-teal font-medium hover:underline"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      + Add children
                    </button>
                  )}

                  {/* Children stepper (revealed with animation) */}
                  <AnimatePresence>
                    {showChildren && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2.5 mt-2">
                          <button
                            onClick={() =>
                              setChildren(Math.max(0, children - 1))
                            }
                            className="w-8 h-8 rounded-full bg-white shadow text-navy font-bold text-lg flex items-center justify-center hover:bg-gray-50 transition"
                          >
                            &minus;
                          </button>
                          <span className="flex-1 text-center text-sm font-semibold text-navy">
                            {children}{" "}
                            {children === 1 ? "Child" : "Children"}
                          </span>
                          <button
                            onClick={() =>
                              setChildren(Math.min(6, children + 1))
                            }
                            className="w-8 h-8 rounded-full bg-white shadow text-navy font-bold text-lg flex items-center justify-center hover:bg-gray-50 transition"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1 text-left ml-1">
                          Under 18
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Phase 2 CTA */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#FF6B4A] hover:bg-[#E85A3A] text-white font-bold py-4 px-6 rounded-xl text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  See What It Really Costs
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Trust pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 sm:gap-6 mt-6 flex-wrap"
        >
          {["9 cruise lines", "100% free", "No booking required"].map(
            (text) => (
              <span
                key={text}
                className="text-xs sm:text-sm text-white/70 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                {text}
              </span>
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
}
