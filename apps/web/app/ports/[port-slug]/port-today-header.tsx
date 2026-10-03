"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import {
  formatTimeInZone,
  resolvedDeviceTimeZone,
  zoneDifferenceLabel,
} from "@/lib/ports/port-time";

interface PortTodayHeaderProps {
  portName: string;
  ianaTimeZone: string;
}

/**
 * Sticky "Today at [port]" header — lives above the tabbed content
 * sections on the port detail page. Shows live port time, user's device
 * time, and a compact DST/TZ note. Pattern borrowed from the MyDay tab
 * on the mobile app, so the port detail surface feels consistent whether
 * you're planning on web or executing on the ship in the app.
 */
export default function PortTodayHeader({
  portName,
  ianaTimeZone,
}: PortTodayHeaderProps) {
  // Keep the server render and the browser's first render identical. The
  // browser clock is introduced only after hydration.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const initial = window.setTimeout(() => setNow(new Date()), 0);
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => {
      window.clearTimeout(initial);
      clearInterval(t);
    };
  }, []);

  const deviceTimeZone = now ? resolvedDeviceTimeZone() : null;
  const portTime = now ? formatTimeInZone(now, ianaTimeZone) : null;
  const deviceTime = now
    ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : null;
  const offsetLabel =
    now && deviceTimeZone
      ? zoneDifferenceLabel(now, ianaTimeZone, deviceTimeZone)
      : null;

  return (
    <div className="sticky top-16 z-30 -mx-4 mb-8 border-y border-navy/10 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          Today at {portName}
        </div>
        <TimeBlock
          label="Port local time"
          value={now ? (portTime ?? "Unavailable") : "—"}
          suffix={offsetLabel}
          color="text-teal"
        />
        <TimeBlock
          label="Your phone time"
          value={deviceTime ?? "—"}
          color="text-navy"
        />
        <div className="flex basis-full items-start gap-1.5 text-[11px] text-amber-700 lg:ml-auto lg:basis-auto">
          <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0" />
          <span className="max-w-xl leading-tight">
            These are port-local and phone times, not ship time. Follow the
            ship&apos;s official clock and all-aboard instructions.
          </span>
        </div>
      </div>
    </div>
  );
}

function TimeBlock({
  label,
  value,
  suffix,
  color,
}: {
  label: string;
  value: string;
  suffix?: string | null;
  color: string;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[11px] uppercase tracking-wider text-gray-400">
        {label}
      </span>
      <span className={`font-price text-sm font-bold ${color}`}>{value}</span>
      {suffix && (
        <span className="text-[11px] text-gray-400">{suffix}</span>
      )}
    </div>
  );
}
