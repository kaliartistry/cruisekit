import { Smartphone, Calendar, DollarSign, Users } from "lucide-react";

interface AppHandoffProps {
  /** The tone of the headline — tailored to where it appears. */
  variant?: "calculator-result" | "saved-trip" | "footer";
  className?: string;
}

const HEADLINES: Record<NonNullable<AppHandoffProps["variant"]>, { title: string; body: string }> = {
  "calculator-result": {
    title: "Take this on the ship.",
    body: "MyDay counts down to your all-aboard, syncs ship time, and keeps your spend against the number you just calculated.",
  },
  "saved-trip": {
    title: "Your cruise, in your pocket.",
    body: "Your saved trip is already waiting in the CruiseKit app when you install it.",
  },
  footer: {
    title: "Your cruise, in your pocket.",
    body: "CruiseKit on mobile: ship-time clocks, port-day planning, and spend tracking — works on spotty ship Wi-Fi.",
  },
};

const FEATURES = [
  { icon: Calendar, label: "Ship time + schedule" },
  { icon: DollarSign, label: "Spend tracker" },
  { icon: Users, label: "MyCrew coordination" },
];

/**
 * Web-to-mobile handoff card. Reusable across calculator result, my-trips
 * page, and footer. App is unreleased — CTAs read "Coming soon" for now;
 * swap the `href` props in with real store URLs on launch.
 */
export default function AppHandoff({
  variant = "calculator-result",
  className = "",
}: AppHandoffProps) {
  const { title, body } = HEADLINES[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-[#143057] p-6 sm:p-8 text-white ${className}`}
    >
      <div className="relative z-10 grid gap-6 sm:grid-cols-[1.2fr_1fr] sm:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal border border-white/10">
            <Smartphone className="h-3 w-3" />
            Coming soon to mobile
          </div>
          <h3 className="mb-2 text-xl sm:text-2xl font-extrabold leading-tight tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-white/75 leading-relaxed mb-5">{body}</p>

          <ul className="space-y-2 mb-5">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm text-white/90"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal/20">
                  <Icon className="h-3.5 w-3.5 text-teal" strokeWidth={2.2} />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <StoreBadge label="App Store" sub="iOS — coming soon" />
            <StoreBadge label="Google Play" sub="Android — coming soon" />
          </div>
        </div>

        {/* Phone mock — pure CSS, no asset required */}
        <div className="hidden sm:flex justify-end">
          <PhoneMock />
        </div>
      </div>
    </div>
  );
}

function StoreBadge({ label, sub }: { label: string; sub: string }) {
  return (
    <button
      disabled
      className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-left cursor-not-allowed opacity-80"
    >
      <div>
        <div className="text-[10px] uppercase tracking-wider text-white/60">
          Get on
        </div>
        <div className="text-sm font-semibold text-white">{label}</div>
        <div className="text-[10px] text-white/50 mt-0.5">{sub}</div>
      </div>
    </button>
  );
}

function PhoneMock() {
  return (
    <div className="relative h-[280px] w-[150px] rounded-[28px] bg-navy border-[3px] border-white/15 shadow-2xl overflow-hidden">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-20 bg-black rounded-b-xl" />
      {/* Screen content */}
      <div className="absolute inset-[3px] top-5 rounded-[24px] bg-gradient-to-b from-[#0F2B4E] to-navy p-3 text-left">
        <div className="text-[8px] font-semibold uppercase tracking-wider text-teal mb-0.5">
          MyDay
        </div>
        <div className="text-[10px] font-bold text-white mb-2">
          Day 3 of 7
        </div>
        <div className="rounded-lg bg-white/10 px-2 py-1.5 mb-1.5">
          <div className="text-[7px] uppercase tracking-wider text-white/50">
            Ship time
          </div>
          <div className="font-mono text-sm font-bold text-amber-400">
            2:41 PM
          </div>
        </div>
        <div className="rounded-lg bg-white/10 px-2 py-1.5 mb-1.5">
          <div className="text-[7px] uppercase tracking-wider text-white/50">
            Port time
          </div>
          <div className="font-mono text-sm font-bold text-teal">
            1:41 PM
          </div>
        </div>
        <div className="rounded-lg bg-white/10 px-2 py-1.5">
          <div className="text-[7px] uppercase tracking-wider text-white/50">
            Spend
          </div>
          <div className="text-[10px] font-bold text-white">
            $412 / $3,000
          </div>
          <div className="mt-1 h-1 w-full rounded-full bg-white/15 overflow-hidden">
            <div className="h-full w-[14%] bg-teal" />
          </div>
        </div>
      </div>
    </div>
  );
}
