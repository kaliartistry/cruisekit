/**
 * Format a number as USD currency without cents.
 * Example: 1234 → "$1,234"
 */
export function formatCurrency(amount: number): string {
  return "$" + Math.round(amount).toLocaleString("en-US");
}

/**
 * Format a number as a percentage without decimals.
 * Example: 76.4 → "76%"
 */
export function formatPercent(value: number): string {
  return Math.round(value) + "%";
}

/**
 * Format a number of nights into a cruise duration string.
 * Example: 7 → "7-Night"
 */
export function formatDuration(nights: number): string {
  return nights + "-Night";
}

/**
 * Convert a string to a URL-friendly slug.
 * Example: "Royal Caribbean" → "royal-caribbean"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}
