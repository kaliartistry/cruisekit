import Image from "next/image";
import { Check, ExternalLink, HeartHandshake, ReceiptText, UsersRound } from "lucide-react";
import GrowthApplicationForm, { type GrowthApplicationType } from "./growth-application-form";

type PartnerPageConfig = {
  type: Extract<GrowthApplicationType, "captain" | "advisor" | "creator">;
  title: string;
  description: string;
  image: { src: string; alt: string };
  outcomes: string[];
  note: string;
  icon: typeof UsersRound;
};

const configs: Record<Extract<GrowthApplicationType, "captain" | "advisor" | "creator">, PartnerPageConfig> = {
  captain: {
    type: "captain",
    title: "Help your sailing group stay organized.",
    description: "CruiseKit is inviting a small number of sailing captains to shape the tools that help real groups coordinate before and during their cruise.",
    image: { src: "/assets/app-screenshots/mycrew-invite.png", alt: "CruiseKit MyCrew invitation screen" },
    outcomes: ["A tracked CruiseKit group link", "Sailing setup support", "Early access", "A personalized sailing card", "MyCrew coordination", "A post-sailing summary and direct feedback channel"],
    note: "This is a product-feedback pilot. It does not promise payment or revenue share.",
    icon: UsersRound,
  },
  advisor: {
    type: "advisor",
    title: "Stay connected to your client after booking.",
    description: "CruiseKit helps travel advisors give clients a practical planning layer for the costs, days, and follow-up that happen after the booking is made.",
    image: { src: "/assets/app-screenshots/spend-exact.png", alt: "CruiseKit cruise spending screen" },
    outcomes: ["Co-branded client links", "True-cost estimates", "Day-by-day organization", "Advisor contact visibility", "Post-trip follow-up", "A direct feedback channel during the pilot"],
    note: "CruiseKit is designed to support travel advisors, not replace them.",
    icon: HeartHandshake,
  },
  creator: {
    type: "creator",
    title: "Make cruise content more useful than an app ad.",
    description: "We’re looking for creators who can turn real cruise-planning questions into useful, honest content—starting with what a low advertised fare can actually cost after the rest of the trip is included.",
    image: { src: "/assets/app-screenshots/drink-package.png", alt: "CruiseKit drink package tracker screen" },
    outcomes: ["A useful true-cost content angle", "A tracked link for your audience", "Early product access", "A real sailing planning workflow", "Optional feedback conversations", "No required claims or scripted endorsement"],
    note: "Example angle: “What a $699 cruise actually costs after fees, gratuities, drinks, Wi-Fi, travel, and excursions.” Use only real, clearly sourced numbers in published content.",
    icon: ReceiptText,
  },
};

export default function PartnerRecruitmentContent({ type }: { type: Extract<GrowthApplicationType, "captain" | "advisor" | "creator"> }) {
  const config = configs[type];
  const Icon = config.icon;
  return (
    <>
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <Icon className="h-9 w-9 text-teal" aria-hidden="true" />
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl">{config.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-700">{config.description}</p>
            <a href="#application" className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-ocean px-6 text-base font-bold text-white shadow-sm transition-colors hover:bg-ocean/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2">Apply for the pilot</a>
          </div>
          <div className="relative mx-auto w-full max-w-[380px]">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-seafoam" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2rem] border-[7px] border-navy bg-white shadow-[var(--shadow-xl)]"><Image src={config.image.src} alt={config.image.alt} width={560} height={1120} className="h-auto w-full" /></div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50/70">
        <div className="mx-auto grid max-w-7xl gap-9 px-4 py-14 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <div className="rounded-2xl bg-navy p-7 text-white sm:p-9">
            <p className="text-sm font-semibold text-teal">What this pilot can include</p>
            <ul className="mt-5 space-y-4">
              {config.outcomes.map((outcome) => <li key={outcome} className="flex gap-3 text-sm leading-relaxed text-white/90"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/20 text-teal"><Check className="h-3.5 w-3.5" /></span>{outcome}</li>)}
            </ul>
            <p className="mt-8 border-t border-white/15 pt-5 text-sm leading-relaxed text-white/70">{config.note}</p>
          </div>
          <div id="application" className="scroll-mt-24"><GrowthApplicationForm type={type} /></div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-11 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 rounded-2xl border border-gray-200 bg-gray-50/70 p-6 sm:flex-row sm:items-center">
            <div><p className="font-bold text-navy">Start with the traveler’s actual question.</p><p className="mt-1 text-sm text-gray-600">A clear cost plan and an organized day are more useful than another generic cruise checklist.</p></div>
            <a href="/tools/true-cruise-cost" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-teal hover:text-teal-dark">Open the true-cost calculator <ExternalLink className="h-4 w-4" /></a>
          </div>
        </div>
      </section>
    </>
  );
}
