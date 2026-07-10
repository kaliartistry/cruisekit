import portTimeZoneContract from "../../../../data/reference/port-timezones.json";
import { isValidIanaTimeZone } from "./port-time";

export type PortReviewStatus =
  | "needs-review"
  | "reviewed"
  | "stale"
  | "blocked";

export interface PortFieldProvenance {
  fieldPath: string;
  sourceUrl: string;
  sourceType: "official" | "standard" | "licensed" | "editorial";
  accessedAt: string;
  note?: string;
}

export interface PortFieldFreshness {
  fieldPath: string;
  lastVerifiedAt: string | null;
  reviewAfter: string | null;
  reviewTrigger: string;
}

export interface PortGovernanceMetadata {
  schemaVersion: 1;
  reviewStatus: PortReviewStatus;
  lastEditorialReviewAt: string | null;
  fieldProvenance: PortFieldProvenance[];
  fieldFreshness: PortFieldFreshness[];
}

interface GovernedPortRecord {
  slug: string;
  canonicalId: string;
  ianaTimeZone: string;
  coordinates: { lat: number; lng: number };
  governance: PortGovernanceMetadata;
}

type PortTimeZoneSlug = keyof typeof portTimeZoneContract.timeZones;
type ExternalPortTimeZoneSlug = keyof typeof portTimeZoneContract.externalTimeZones;
type PortAliasSlug = keyof typeof portTimeZoneContract.aliases;

export interface PortTimeZoneContractShape {
  timeZones: Record<string, string>;
  externalTimeZones: Record<string, string>;
  aliases: Record<string, string>;
}

export function canonicalPortId(slug: string): `cruisekit:port:${string}` {
  return `cruisekit:port:${slug}`;
}

export function ianaTimeZoneForPort(slug: string): string {
  const canonicalSlug =
    portTimeZoneContract.aliases[slug as PortAliasSlug] ?? slug;
  const timeZone =
    portTimeZoneContract.timeZones[canonicalSlug as PortTimeZoneSlug] ??
    portTimeZoneContract.externalTimeZones[
      canonicalSlug as ExternalPortTimeZoneSlug
    ];
  if (!timeZone) {
    throw new Error(`Port \"${slug}\" has no IANA time-zone assignment`);
  }
  return timeZone;
}

export function validatePortTimeZoneContract(
  contract: PortTimeZoneContractShape,
): void {
  const currentSlugs = new Set(Object.keys(contract.timeZones));
  const externalSlugs = new Set(Object.keys(contract.externalTimeZones));
  const aliasSlugs = new Set(Object.keys(contract.aliases));

  for (const slug of externalSlugs) {
    if (currentSlugs.has(slug)) {
      throw new Error(`External port collides with a current port: ${slug}`);
    }
  }

  for (const alias of aliasSlugs) {
    if (currentSlugs.has(alias) || externalSlugs.has(alias)) {
      throw new Error(`Port alias collides with a concrete record: ${alias}`);
    }
    const target = contract.aliases[alias];
    if (!currentSlugs.has(target) && !externalSlugs.has(target)) {
      throw new Error(`Port alias ${alias} targets unknown port ${target}`);
    }
    if (aliasSlugs.has(target)) {
      throw new Error(`Port alias chains are not allowed: ${alias} -> ${target}`);
    }
  }

  for (const [slug, timeZone] of Object.entries({
    ...contract.timeZones,
    ...contract.externalTimeZones,
  })) {
    if (!isValidIanaTimeZone(timeZone)) {
      throw new Error(`Port ${slug} has an invalid IANA time zone`);
    }
  }
}

export function baselinePortGovernance(): PortGovernanceMetadata {
  return {
    schemaVersion: 1,
    reviewStatus: "needs-review",
    lastEditorialReviewAt: null,
    fieldProvenance: [
      {
        fieldPath: "ianaTimeZone",
        sourceUrl: portTimeZoneContract.provenance.sourceUrl,
        sourceType: "standard",
        accessedAt: portTimeZoneContract.provenance.accessedAt,
        note: portTimeZoneContract.provenance.note,
      },
    ],
    fieldFreshness: [
      {
        fieldPath: "ianaTimeZone",
        lastVerifiedAt: portTimeZoneContract.catalogRevision,
        reviewAfter: null,
        reviewTrigger: portTimeZoneContract.freshness.reviewTrigger,
      },
    ],
  };
}

/**
 * Publish gate for the port catalog. It validates structural integrity and
 * time-zone safety; it deliberately does not mark unsourced editorial fields
 * as reviewed.
 */
export function validatePortCatalog(ports: GovernedPortRecord[]): void {
  validatePortTimeZoneContract(portTimeZoneContract);
  const slugs = new Set<string>();
  const ids = new Set<string>();

  for (const port of ports) {
    if (slugs.has(port.slug)) throw new Error(`Duplicate port slug: ${port.slug}`);
    if (ids.has(port.canonicalId)) {
      throw new Error(`Duplicate canonical port ID: ${port.canonicalId}`);
    }
    slugs.add(port.slug);
    ids.add(port.canonicalId);

    if (port.canonicalId !== canonicalPortId(port.slug)) {
      throw new Error(`Port ${port.slug} has a non-canonical ID`);
    }
    if (port.ianaTimeZone !== ianaTimeZoneForPort(port.slug)) {
      throw new Error(`Port ${port.slug} does not match the time-zone contract`);
    }
    if (!isValidIanaTimeZone(port.ianaTimeZone)) {
      throw new Error(`Port ${port.slug} has an invalid IANA time zone`);
    }
    if (
      !Number.isFinite(port.coordinates.lat) ||
      !Number.isFinite(port.coordinates.lng) ||
      Math.abs(port.coordinates.lat) > 90 ||
      Math.abs(port.coordinates.lng) > 180
    ) {
      throw new Error(`Port ${port.slug} has invalid coordinates`);
    }
    if (
      port.governance.reviewStatus === "reviewed" &&
      (port.governance.lastEditorialReviewAt === null ||
        port.governance.fieldProvenance.length === 0)
    ) {
      throw new Error(`Reviewed port ${port.slug} is missing review evidence`);
    }
  }

  const contractSlugs = Object.keys(portTimeZoneContract.timeZones);
  const missingRecords = contractSlugs.filter((slug) => !slugs.has(slug));
  if (missingRecords.length > 0) {
    throw new Error(
      `Time-zone contract contains unknown ports: ${missingRecords.join(", ")}`,
    );
  }
}

export const PORT_TIME_ZONE_CONTRACT = portTimeZoneContract;
