import { existsSync } from "node:fs";
import { join } from "node:path";
import type { PortData } from "@/lib/data/ports";

export interface PortHeroMedia {
  url: string;
  alt: string;
  isMapFallback: boolean;
}

export function resolvePortHeroMedia(port: PortData): PortHeroMedia {
  if (isHostedAssetAvailable(port.imageUrl)) {
    return {
      url: port.imageUrl,
      alt: `${port.name}, ${port.country}`,
      isMapFallback: false,
    };
  }

  return {
    url: `/assets/maps/static/port-${port.slug}.webp`,
    alt: `Static street map of the ${port.name}, ${port.country} port area`,
    isMapFallback: true,
  };
}

function isHostedAssetAvailable(url: string) {
  if (/^https?:\/\//.test(url)) return true;
  if (!url.startsWith("/") || url.includes("..")) return false;
  return existsSync(join(process.cwd(), "public", url.slice(1)));
}
