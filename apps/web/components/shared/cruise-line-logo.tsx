import { cn } from "@/lib/utils/cn";

/**
 * Cruise line logo tile.
 *
 * Renders the real cruise line logo on a square tile. Uses nominative
 * fair use — the logo identifies the line in a comparison/booking
 * context, no co-branding claim, no trade dress copied in surrounding
 * chrome.
 *
 * Backgrounds are chosen per-logo: lines whose official mark is
 * white or light (MSC, Holland America) sit on navy; all others on
 * white. Unknown lines fall back to a navy monogram tile so the grid
 * never has a blank slot.
 *
 * Keep in sync with the Flutter widget at
 * `CruiseKit-Mobile/lib/widgets/shared/cruise_line_logo.dart`.
 */

interface CruiseLineLogoProps {
  cruiseLineId: string;
  /** Tile size. `sm`=28, `md`=40, `lg`=44, `xl`=80 px per spec tiers. */
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

type LogoTheme = "onLight" | "onDark";

interface LineConfig {
  monogram: string;
  /** Which tile background the logo was designed to live on. */
  theme: LogoTheme;
}

/** Canonical config — shared source of truth with the Flutter app. */
const LINES: Record<string, LineConfig> = {
  "royal-caribbean": { monogram: "RCI", theme: "onLight" },
  carnival: { monogram: "CCL", theme: "onLight" },
  norwegian: { monogram: "NCL", theme: "onLight" },
  celebrity: { monogram: "CEL", theme: "onLight" },
  princess: { monogram: "PCL", theme: "onLight" },
  disney: { monogram: "DCL", theme: "onLight" },
  "virgin-voyages": { monogram: "VV", theme: "onLight" },
  // Official marks are white — must sit on dark.
  "holland-america": { monogram: "HAL", theme: "onDark" },
  msc: { monogram: "MSC", theme: "onDark" },
};

/**
 * Size classes. Tile is square (h = w). Inner padding leaves a
 * consistent bounding box so short wordmarks and square icons render
 * at similar visual weight. Logo uses `object-contain` to preserve
 * aspect within the box.
 */
const SIZE: Record<
  NonNullable<CruiseLineLogoProps["size"]>,
  { tile: string; pad: string; mono: string }
> = {
  sm: { tile: "h-7 w-7 rounded-md", pad: "p-1", mono: "text-[10px] font-semibold" },
  md: { tile: "h-10 w-10 rounded-lg", pad: "p-1.5", mono: "text-[13px] font-bold" },
  lg: { tile: "h-11 w-11 rounded-[10px]", pad: "p-1.5", mono: "text-[15px] font-bold" },
  xl: { tile: "h-20 w-20 rounded-2xl", pad: "p-3", mono: "text-[28px] font-bold" },
};

export default function CruiseLineLogo({
  cruiseLineId,
  size = "md",
  className,
}: CruiseLineLogoProps) {
  const config = LINES[cruiseLineId];
  const sz = SIZE[size];

  // Unknown line → auto-derived monogram on teal tile (flags for ops).
  if (!config) {
    return (
      <Tile
        size={sz.tile}
        className={cn("bg-[#E0F7FA] text-[#0C2340]", className)}
        aria-label={cruiseLineId}
      >
        <span className={cn("leading-none tracking-tight", sz.mono)}>
          {deriveMonogram(cruiseLineId)}
        </span>
      </Tile>
    );
  }

  const bgClass = config.theme === "onDark" ? "bg-[#0C2340]" : "bg-white border border-slate-200";

  return (
    <Tile
      size={sz.tile}
      className={cn(bgClass, sz.pad, className)}
      aria-label={`${config.monogram} logo`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG is bundled, no optimization needed */}
      <img
        src={`/images/cruise-lines/${cruiseLineId}.svg`}
        alt=""
        className="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </Tile>
  );
}

function Tile({
  size,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  size: string;
  className?: string;
  children: React.ReactNode;
  "aria-label": string;
}) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden",
        size,
        className
      )}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

/** Derive a 2-char monogram for unknown ids ("new-line" → "NL"). */
function deriveMonogram(id: string): string {
  if (!id) return "??";
  const parts = id.split("-").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return id.slice(0, 2).toUpperCase();
}
