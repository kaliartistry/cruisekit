"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Ship, Check, Calculator, Map, Navigation, ArrowRight } from "lucide-react";
import { CRUISE_LINES } from "@cruise/shared/constants";
import CruiseLineLogo from "@/components/shared/cruise-line-logo";

const HERO_PROOF = [
  {
    icon: Calculator,
    label: "Calculator",
    value: "See the real cost. No sticker-price tricks.",
    href: "/calculator",
  },
  {
    icon: Map,
    label: "Ports",
    value: "Ship time, port time, and all-aboard math for every port.",
    href: "/ports",
  },
  {
    icon: Navigation,
    label: "MyDay",
    value: "Your cruise day, handled on your phone.",
    href: "/myday",
  },
] as const;

export default function HeroSection() {
  const router = useRouter();
  const [selectedLine, setSelectedLine] = useState("");
  const hasSelectedLine = selectedLine !== "";

  const handleSubmit = () => {
    const params = new URLSearchParams();
    if (selectedLine) params.set("line", selectedLine);
    router.push(`/calculator?${params.toString()}`);
  };

  const selectedLineName = CRUISE_LINES.find(
    (l) => l.id === selectedLine,
  )?.name;

  return (
    <section className="relative min-h-[600px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1920&q=80"
        alt="Cruise ship at sea"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/75 via-navy/55 to-navy/85" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-tight leading-[1.05]"
        >
          Your phone says 2pm.{" "}
          <span className="text-amber-400">The ship says 1pm.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base sm:text-lg text-white/85 mb-6 max-w-2xl mx-auto"
        >
          Cruises look cheap on the sticker and expensive on the folio.
          CruiseKit tells you the real cost, the real schedule, and the real
          logistics — before you board.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 sm:gap-5 mb-8 flex-wrap"
        >
          {["9 cruise lines", "994 sailings", "affiliate-only"].map((text) => (
            <span
              key={text}
              className="text-xs sm:text-sm text-white/75 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal" />
              {text}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-8"
        >
          {HERO_PROOF.map(({ icon: Icon, label, value, href }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-start gap-3 text-left rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3 transition-all hover:bg-white/15 hover:border-white/25"
            >
              <Icon className="h-5 w-5 text-teal mt-0.5 flex-shrink-0" strokeWidth={2.2} />
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-xs font-semibold text-white uppercase tracking-wider">
                  {label}
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </div>
                <p className="mt-0.5 text-[13px] text-white/75 leading-snug">
                  {value}
                </p>
              </div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-5 sm:p-6 max-w-2xl mx-auto"
        >
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-left">
            <Ship className="inline h-3.5 w-3.5 mr-1" />
            Pick your cruise line
          </label>

          {hasSelectedLine && (
            <div className="flex items-center gap-2 mb-2">
              <CruiseLineLogo cruiseLineId={selectedLine} size="sm" />
              <span className="text-sm font-medium text-navy">
                {selectedLineName}
              </span>
              <Check className="h-4 w-4 text-teal ml-auto" />
            </div>
          )}

          <select
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal appearance-none cursor-pointer mb-4"
          >
            <option value="">Select a cruise line</option>
            {CRUISE_LINES.map((line) => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#FF6B4A] hover:bg-[#E85A3A] text-white font-bold py-4 px-6 rounded-xl text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            See the true cost of my cruise
            <span aria-hidden="true">&rarr;</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
