"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Wallet,
  CalendarDays,
  Bell,
  ArrowRight,
  TrendingUp,
  Smartphone,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const FEATURES = [
  {
    icon: Clock,
    title: "Triple Clock Display",
    description:
      "Ship time, port time, and home time side by side. Never get confused by timezone changes again.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Bell,
    title: "All-Aboard Countdown",
    description:
      "Live countdown to your ship's departure on port days. Auto-calculated from your itinerary.",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    icon: CalendarDays,
    title: "Daily Schedule",
    description:
      "Add dinner reservations, show times, spa appointments, and excursions. Get push notification reminders.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  {
    icon: Wallet,
    title: "Numpad Spend Tracker",
    description:
      "Two-tap expense logging with a calculator-style numpad. Tracks budget vs actual from your Plan estimates.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: TrendingUp,
    title: "Smart Tip Prompts",
    description:
      "After logging a dinner or bar charge, get instant 15%/18%/20% tip buttons. No mental math needed.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Users,
    title: "Crew Coordination",
    description:
      "See where your travel companions are on a real map during port days. Quick status broadcasts and group chat.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

const TABS = [
  {
    name: "Today",
    icon: CalendarDays,
    features: [
      "Ship time / port time / home time clocks",
      "All-aboard countdown with push alerts",
      "Personal event schedule with reminders",
      '"What\'s Open Now" venue strip',
      "Crew status at a glance",
    ],
  },
  {
    name: "Spend",
    icon: Wallet,
    features: [
      "Numpad-first charge entry (2 taps)",
      "Smart tip prompt after dining/bar charges",
      "Budget vs actual from Plan calculator",
      "Category breakdown with progress bars",
      "Learned frequent items for quick repeat",
    ],
  },
  {
    name: "Crew",
    icon: Users,
    features: [
      "GPS map with crew dots on port days",
      "Quick status broadcasts (At pool, At dinner...)",
      "Group chat with push notifications",
      "Tap-to-center on any crew member",
      "Straight-line distance from ship",
    ],
  },
];

export default function MyDayContent() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-navy to-navy/95 px-4 pb-20 pt-24 text-center text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div custom={0} variants={fadeUp}>
            <span className="inline-block rounded-full bg-amber-500/20 px-4 py-1 text-sm font-semibold text-amber-400">
              New Pillar
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl"
          >
            Your cruise day,{" "}
            <span className="text-amber-400">handled.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            className="mx-auto mt-5 max-w-2xl text-lg text-white/90"
          >
            MyDay is your daily command center during the cruise. Schedule,
            spend tracking, and crew coordination — everything you need from
            embarkation to disembarkation.
          </motion.p>

          {/* 3-tab preview */}
          <motion.div
            custom={3}
            variants={fadeUp}
            className="mx-auto mt-10 flex max-w-md justify-center gap-4"
          >
            {TABS.map((tab) => (
              <div
                key={tab.name}
                className="flex flex-col items-center gap-2 rounded-xl bg-white/10 px-6 py-4 backdrop-blur-sm"
              >
                <tab.icon className="h-6 w-6 text-amber-400" />
                <span className="text-sm font-semibold">{tab.name}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.h2
            custom={0}
            variants={fadeUp}
            className="text-3xl font-black text-navy"
          >
            Built for daily cruise life
          </motion.h2>
          <motion.p
            custom={1}
            variants={fadeUp}
            className="mx-auto mt-3 max-w-xl text-muted"
          >
            The features cruisers actually use every day — validated by
            Reddit, CruiseCritic, and app store reviews across thousands of
            passengers.
          </motion.p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.bg}`}
              >
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Tab Breakdown ── */}
      <section className="bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center text-3xl font-black text-navy"
          >
            Three tabs. One pillar.
          </motion.h2>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {TABS.map((tab, i) => (
              <motion.div
                key={tab.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-2xl border border-gray-100 bg-white p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <tab.icon className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-navy">{tab.name}</h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {tab.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-sm text-muted"
                    >
                      <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-20 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            custom={0}
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5"
          >
            <Smartphone className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600">
              Available in the CruiseKit app
            </span>
          </motion.div>
          <motion.h2
            custom={1}
            variants={fadeUp}
            className="mt-6 text-3xl font-black text-navy"
          >
            Your next cruise, simplified.
          </motion.h2>
          <motion.p
            custom={2}
            variants={fadeUp}
            className="mx-auto mt-3 max-w-lg text-muted"
          >
            MyDay joins Plan, Explore, Coordinate, and Optimize to give you
            the complete cruise planning toolkit — before, during, and after
            your voyage.
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
}
