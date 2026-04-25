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
    title: "Ship + Port Clocks",
    description:
      "Ship time and port time stay visible together, so timezone changes do not turn into day-three confusion.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Bell,
    title: "All-Aboard Reference",
    description:
      "Port-day timing is pulled from your itinerary and kept close to the rest of your day, without turning MyDay into a navigation tool.",
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
    title: "Spend Tracker",
    description:
      "Log drinks, dining, excursions, and extras into one running total against the budget you set before boarding.",
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
    title: "MyCrew Check-ins",
    description:
      "Share simple group status like on ship, at dinner, or heading back, so the day feels coordinated without needing a full chat app.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

const TABS = [
  {
    name: "Today",
    icon: CalendarDays,
    features: [
      "Ship time and port time at a glance",
      "All-aboard context from your itinerary",
      "Personal event schedule with reminders",
      '"What\'s Open Now" venue strip',
      "Crew status at a glance",
    ],
  },
  {
    name: "Spend",
    icon: Wallet,
    features: [
      "Fast charge entry for onboard purchases",
      "Smart tip prompt after dining or bar charges",
      "Budget vs actual from Plan calculator",
      "Category breakdown with progress bars",
      "Learned frequent items for quick repeat",
    ],
  },
  {
    name: "MyCrew",
    icon: Users,
    features: [
      "Quick status check-ins for your group",
      "Dinner, pool, and meetup plan updates",
      "Crew list with current shared status",
      "Sea-day coordination without location noise",
      "Location-sharing language only when it is appropriate",
    ],
  },
];

export default function MyDayContent() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-navy to-[#0a1d38] px-4 pb-20 pt-24 text-center text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h1
            custom={0}
            variants={fadeUp}
            className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-5xl"
            style={{ color: '#ffffff' }}
          >
            Your phone says 2pm.{" "}
            <span className="text-amber-400">The ship says 1pm.</span>
          </motion.h1>

          <motion.p
            custom={1}
            variants={fadeUp}
            className="mx-auto mt-5 max-w-2xl text-lg text-white/90"
          >
            Ship time drift. Surprise charges on your folio. Dinner plans
            scattered across texts. MyDay pulls the day into one calm view
            &mdash; clocks, schedule, spend, and MyCrew check-ins, even on
            unreliable cruise WiFi.
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
            The features cruisers actually use every day: knowing the right
            time, seeing what is next, keeping spend honest, and staying loose
            with the people they came with.
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
