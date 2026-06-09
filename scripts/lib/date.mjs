const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function dateOnly(value) {
  if (typeof value !== "string" || !DATE_ONLY_PATTERN.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10) === value ? date : null;
}

export function formatDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

export function currentUtcDateOnly(env = process.env) {
  const override = env.CRUISEKIT_TODAY;
  if (override) {
    const date = dateOnly(override);
    if (!date) {
      throw new Error("CRUISEKIT_TODAY must be a valid YYYY-MM-DD date.");
    }
    return date;
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}

export function daysBetween(start, end) {
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}
