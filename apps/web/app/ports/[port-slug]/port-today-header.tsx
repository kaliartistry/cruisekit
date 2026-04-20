"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface PortTodayHeaderProps {
  portName: string;
  timezone: string;
  timeZoneAlert?: string | null;
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
  timezone,
  timeZoneAlert,
}: PortTodayHeaderProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const portTime = now
    ? formatInTimeZone(now, extractIanaZone(timezone))
    : null;
  const deviceTime = now
    ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : null;
  const offsetLabel = now
    ? timezoneOffsetLabel(now, extractIanaZone(timezone))
    : null;

  return (
    <div className="sticky top-16 z-30 -mx-4 mb-8 border-y border-navy/10 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          Today at {portName}
        </div>
        <TimeBlock
          label="Port time"
          value={portTime ?? "—"}
          suffix={offsetLabel}
          color="text-teal"
        />
        <TimeBlock
          label="Your time"
          value={deviceTime ?? "—"}
          color="text-navy"
        />
        {timeZoneAlert && (
          <div className="flex items-start gap-1.5 text-[11px] text-amber-700 sm:ml-auto">
            <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0" />
            <span className="leading-tight">
              Time-zone alert — scroll down for details.
            </span>
          </div>
        )}
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

function extractIanaZone(tz: string): string {
  const match = tz.match(/([A-Z][a-z]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)?)/);
  return match ? match[1] : tz;
}

function formatInTimeZone(date: Date, timeZone: string): string {
  try {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    });
  } catch {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }
}

function timezoneOffsetLabel(date: Date, timeZone: string): string | null {
  try {
    const deviceHour = date.getHours() * 60 + date.getMinutes();
    const portDate = new Date(
      date.toLocaleString("en-US", { timeZone })
    );
    const portHour = portDate.getHours() * 60 + portDate.getMinutes();
    const diffMin = portHour - deviceHour;
    const diffHours = Math.round(diffMin / 60);
    if (diffHours === 0) return null;
    return diffHours > 0 ? `(+${diffHours}h)` : `(${diffHours}h)`;
  } catch {
    return null;
  }
}
