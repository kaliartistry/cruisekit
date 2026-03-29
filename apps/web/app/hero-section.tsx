"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Ship, Users, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CRUISE_LINES } from "@cruise/shared/constants";
import { MONTH_LABELS, getDefaultMonth, getSeasonalMultiplier } from "@/lib/data/seasonal-pricing";

const DURATIONS = [3, 5, 7, 10, 14];

export default function HeroSection() {
  const router = useRouter();
  const [selectedLine, setSelectedLine] = useState("");
  const [month, setMonth] = useState(getDefaultMonth());
  const [duration, setDuration] = useState(7);
  const [adults, setAdults] = useState(2);

  const seasonalInfo = getSeasonalMultiplier(month);

  // Determine which year each month falls in for display
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const getYearForMonth = (m: number) =>
    m >= currentMonth ? currentYear : currentYear + 1;

  const handleSubmit = () => {
    const params = new URLSearchParams();
    if (selectedLine) params.set("line", selectedLine);
    params.set("month", String(month));
    params.set("duration", String(duration));
    params.set("adults", String(adults));
    router.push(`/calculator?${params.toString()}`);
  };

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
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight"
        >
          What will your cruise{" "}
          <span className="text-teal">REALLY</span> cost?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-white/80 mb-8 max-w-2xl mx-auto"
        >
          Calculate the true total — including drinks, WiFi, gratuities, and
          hidden fees
        </motion.p>

        {/* Search form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-5 sm:p-6 lg:p-8 max-w-3xl mx-auto"
        >
          {/* Cruise line select */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
              <Ship className="inline h-3.5 w-3.5 mr-1" />
              Cruise Line
            </label>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal appearance-none cursor-pointer"
            >
              <option value="">Any cruise line</option>
              {CRUISE_LINES.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </select>
          </div>

          {/* Month selector */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
              <Calendar className="inline h-3.5 w-3.5 mr-1" />
              When
            </label>
            <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
              {MONTH_LABELS.map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => setMonth(idx)}
                  className={`flex-shrink-0 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                    month === idx
                      ? "bg-teal text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title={`${label} ${getYearForMonth(idx)}`}
                >
                  {label.slice(0, 3)}
                </button>
              ))}
            </div>
            {/* Seasonal badge */}
            <div className="mt-1.5 text-left">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  seasonalInfo.multiplier > 1.15
                    ? "bg-coral/10 text-coral"
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

          {/* Duration + Adults row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
                <Calendar className="inline h-3.5 w-3.5 mr-1" />
                Duration
              </label>
              <div className="flex gap-1.5">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      duration === d
                        ? "bg-teal text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-1 text-left">
                nights
              </p>
            </div>

            {/* Adults stepper */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
                <Users className="inline h-3.5 w-3.5 mr-1" />
                Travelers
              </label>
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
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleSubmit}
            className="w-full bg-teal hover:bg-teal-dark text-white font-bold py-4 px-6 rounded-xl text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Search className="h-5 w-5" />
            Calculate True Cost
          </button>
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
