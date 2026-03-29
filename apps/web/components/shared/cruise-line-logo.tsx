import { cn } from "@/lib/utils/cn";

/** Brand color and abbreviation for each cruise line */
const CRUISE_LINE_BRANDS: Record<string, { color: string; abbr: string }> = {
  "royal-caribbean": { color: "#0066CC", abbr: "RC" },
  carnival: { color: "#003DA5", abbr: "CC" },
  norwegian: { color: "#00BCD4", abbr: "NC" },
  msc: { color: "#003B73", abbr: "MSC" },
  celebrity: { color: "#1C1C1C", abbr: "CE" },
  princess: { color: "#003366", abbr: "PC" },
  "holland-america": { color: "#003B6F", abbr: "HA" },
  disney: { color: "#0066B2", abbr: "DC" },
  "virgin-voyages": { color: "#E4002B", abbr: "VV" },
};

const SIZE_MAP = {
  sm: 32,
  md: 48,
  lg: 64,
} as const;

const FONT_SIZE_MAP = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
} as const;

interface CruiseLineLogoProps {
  /** Cruise line identifier (e.g. "royal-caribbean") */
  cruiseLineId: string;
  /** Circle size (default "md") */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

export default function CruiseLineLogo({
  cruiseLineId,
  size = "md",
  className,
}: CruiseLineLogoProps) {
  const brand = CRUISE_LINE_BRANDS[cruiseLineId];
  const px = SIZE_MAP[size];

  // Fallback for unknown cruise lines: use first two uppercase letters and a neutral color
  const abbr = brand?.abbr ?? cruiseLineId.slice(0, 2).toUpperCase();
  const color = brand?.color ?? "#6B7280";

  return (
    <span
      role="img"
      aria-label={`${cruiseLineId} logo`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none",
        FONT_SIZE_MAP[size],
        className,
      )}
      style={{
        width: px,
        height: px,
        backgroundColor: color,
      }}
    >
      {abbr}
    </span>
  );
}
