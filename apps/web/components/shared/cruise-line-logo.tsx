import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ */
/*  Brand data for each cruise line                                    */
/* ------------------------------------------------------------------ */

interface BrandInfo {
  /** Brand hex color */
  color: string;
  /** Short abbreviation shown at `sm` size */
  abbr: string;
  /** Full display name shown at `md` / `lg` sizes */
  displayName: string;
  /** Extra Tailwind classes applied to the text (font style, tracking, etc.) */
  textClass: string;
}

const CRUISE_LINE_BRANDS: Record<string, BrandInfo> = {
  "royal-caribbean": {
    color: "#0066CC",
    abbr: "RCI",
    displayName: "Royal Caribbean",
    textClass: "font-bold tracking-tight",
  },
  carnival: {
    color: "#003DA5",
    abbr: "CCL",
    displayName: "CARNIVAL",
    textClass: "font-extrabold uppercase tracking-wide",
  },
  norwegian: {
    color: "#00BCD4",
    abbr: "NCL",
    displayName: "NORWEGIAN",
    textClass: "font-bold uppercase tracking-widest",
  },
  msc: {
    color: "#003B73",
    abbr: "MSC",
    displayName: "MSC",
    textClass: "font-extrabold uppercase tracking-[0.15em]",
  },
  celebrity: {
    color: "#1C1C1C",
    abbr: "CEL",
    displayName: "Celebrity",
    textClass: "italic font-semibold tracking-wide",
  },
  princess: {
    color: "#003366",
    abbr: "PCL",
    displayName: "PRINCESS",
    textClass: "font-semibold uppercase tracking-[0.2em]",
  },
  "holland-america": {
    color: "#003B6F",
    abbr: "HAL",
    displayName: "Holland America",
    textClass: "font-semibold tracking-tight",
  },
  disney: {
    color: "#0066B2",
    abbr: "DCL",
    displayName: "Disney",
    textClass: "font-bold tracking-normal",
  },
  "virgin-voyages": {
    color: "#E4002B",
    abbr: "VV",
    displayName: "Virgin Voyages",
    textClass: "font-extrabold tracking-tight",
  },
};

/* ------------------------------------------------------------------ */
/*  Size configuration                                                 */
/* ------------------------------------------------------------------ */

const CONTAINER_CLASSES = {
  sm: "h-8 px-2.5 text-[11px] rounded-full",
  md: "h-10 px-3 text-xs rounded-lg",
  lg: "h-12 px-4 text-sm rounded-lg",
} as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface CruiseLineLogoProps {
  /** Cruise line identifier (e.g. "royal-caribbean") */
  cruiseLineId: string;
  /** Display size (default "md") */
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

  /* Fallback for unknown cruise lines */
  const color = brand?.color ?? "#6B7280";
  const abbr = brand?.abbr ?? cruiseLineId.slice(0, 3).toUpperCase();
  const displayName =
    brand?.displayName ??
    cruiseLineId
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const textClass = brand?.textClass ?? "font-semibold";

  /* Pick label based on size */
  const label = size === "sm" ? abbr : displayName;

  /* 8 % opacity tint of brand color for background */
  const bgTint = `${color}14`;

  return (
    <span
      role="img"
      aria-label={`${displayName} logo`}
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap select-none",
        CONTAINER_CLASSES[size],
        textClass,
        className,
      )}
      style={{
        color,
        backgroundColor: bgTint,
        borderLeft: `3px solid ${color}`,
      }}
    >
      {label}
    </span>
  );
}
