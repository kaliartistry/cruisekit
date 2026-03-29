import { cn } from "@/lib/utils/cn";

const LOGO_EXISTS: Record<string, boolean> = {
  "royal-caribbean": true,
  "carnival": true,
  "norwegian": true,
  "msc": true,
  "celebrity": true,
  "princess": true,
  "holland-america": true,
  "disney": true,
  "virgin-voyages": true,
};

interface CruiseLineLogoProps {
  /** Cruise line identifier (e.g. "royal-caribbean") */
  cruiseLineId: string;
  /** Display size (default "md") */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

const SIZE_MAP = {
  sm: { width: 80, height: 24 },
  md: { width: 120, height: 36 },
  lg: { width: 160, height: 48 },
};

export default function CruiseLineLogo({
  cruiseLineId,
  size = "md",
  className,
}: CruiseLineLogoProps) {
  const dims = SIZE_MAP[size];
  const hasLogo = LOGO_EXISTS[cruiseLineId];

  if (!hasLogo) {
    // Fallback for unknown cruise lines
    return (
      <span className={cn("text-xs font-semibold text-gray-500", className)}>
        {cruiseLineId}
      </span>
    );
  }

  return (
    <img
      src={`/images/cruise-lines/${cruiseLineId}.svg`}
      alt={`${cruiseLineId} logo`}
      width={dims.width}
      height={dims.height}
      className={cn("object-contain", className)}
    />
  );
}
