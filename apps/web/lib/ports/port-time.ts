const TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "2-digit",
};

export function isValidIanaTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format();
    return timeZone.includes("/") || timeZone === "UTC";
  } catch {
    return false;
  }
}

/**
 * Format a time in a named IANA zone. Invalid data returns null instead of
 * silently displaying the device clock as if it were port-local time.
 */
export function formatTimeInZone(
  date: Date,
  timeZone: string,
  locale?: string,
): string | null {
  if (!isValidIanaTimeZone(timeZone)) return null;

  try {
    return new Intl.DateTimeFormat(locale, {
      ...TIME_FORMAT_OPTIONS,
      timeZone,
    }).format(date);
  } catch {
    return null;
  }
}

export function resolvedDeviceTimeZone(): string | null {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timeZone && isValidIanaTimeZone(timeZone) ? timeZone : null;
}

/** Return a zone's UTC offset at an instant, including DST and date rollovers. */
export function utcOffsetMinutes(date: Date, timeZone: string): number | null {
  if (!isValidIanaTimeZone(timeZone)) return null;

  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const values = Object.fromEntries(
      parts
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, Number(part.value)]),
    );
    const wallClockAsUtc = Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour,
      values.minute,
      values.second,
    );
    return Math.round((wallClockAsUtc - date.getTime()) / 60_000);
  } catch {
    return null;
  }
}

export function zoneDifferenceLabel(
  date: Date,
  portTimeZone: string,
  deviceTimeZone: string,
): string | null {
  const portOffset = utcOffsetMinutes(date, portTimeZone);
  const deviceOffset = utcOffsetMinutes(date, deviceTimeZone);
  if (portOffset === null || deviceOffset === null) return null;

  const difference = portOffset - deviceOffset;
  if (difference === 0) return null;

  const sign = difference > 0 ? "+" : "−";
  const absoluteMinutes = Math.abs(difference);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  const duration = [hours ? `${hours}h` : "", minutes ? `${minutes}m` : ""]
    .filter(Boolean)
    .join(" ");
  return `(${sign}${duration})`;
}
