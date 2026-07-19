export type HeroMessageVariant = "A" | "B";

export const HERO_MESSAGE_EXPERIMENT = {
  id: "founding20_hero_message_v1",
  status: "active",
  startDate: "2026-07-19",
  endDate: "2026-10-31",
  assignmentVersion: 1,
  eligibility: { pathname: "/founding-20" },
  primarySuccessEvent: "founding20_application_submitted",
  guardrailEvents: ["calculator_completed", "client_error"] as const,
  notes: "Directional learning only; do not claim significance from the first 20 users.",
  variants: {
    A: "Know what your cruise will really cost.",
    B: "Keep every cruise day organized.",
  },
} as const;

const EXPERIMENT_KEY = `cruisekit:experiment:${HERO_MESSAGE_EXPERIMENT.id}`;

export function isHeroMessageExperimentEligible(now = new Date()) {
  if (HERO_MESSAGE_EXPERIMENT.status !== "active") return false;
  const today = now.toISOString().slice(0, 10);
  return today >= HERO_MESSAGE_EXPERIMENT.startDate && today <= HERO_MESSAGE_EXPERIMENT.endDate;
}

function hash(text: string) {
  let result = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    result ^= text.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

/** Stable assignment is persisted locally and deterministic if storage is off. */
export function getHeroMessageVariant(anonymousId: string): HeroMessageVariant {
  if (typeof window !== "undefined") {
    try {
      const existing = window.localStorage.getItem(EXPERIMENT_KEY);
      if (existing === "A" || existing === "B") return existing;
      const variant: HeroMessageVariant = hash(anonymousId) % 2 === 0 ? "A" : "B";
      window.localStorage.setItem(EXPERIMENT_KEY, variant);
      return variant;
    } catch {
      // Continue with deterministic assignment below.
    }
  }
  return hash(anonymousId) % 2 === 0 ? "A" : "B";
}
