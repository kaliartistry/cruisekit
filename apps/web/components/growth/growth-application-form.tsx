"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { httpsCallable } from "firebase/functions";
import { CheckCircle2, Loader2, LockKeyhole } from "lucide-react";
import { functions } from "@/lib/firebase/config";
import { getGrowthAttribution } from "@/lib/growth/attribution";
import { trackGrowthEvent } from "@/lib/growth/analytics";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export type GrowthApplicationType = "founding20" | "captain" | "advisor" | "creator";

type FormValue = string | boolean;
type FormState = Record<string, FormValue>;
type FieldError = Record<string, string>;

type FormField = {
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "date" | "url" | "number";
  placeholder?: string;
  options?: readonly string[];
  helper?: string;
};

const CRUISE_LINES = [
  "Azamara",
  "Carnival Cruise Line",
  "Celebrity Cruises",
  "Disney Cruise Line",
  "Holland America Line",
  "MSC Cruises",
  "Norwegian Cruise Line",
  "Princess Cruises",
  "Royal Caribbean International",
  "Viking",
  "Virgin Voyages",
  "Other",
] as const;

const FOUNDING_FIELDS: FormField[] = [
  { name: "firstName", label: "First name", required: true, placeholder: "Your first name" },
  { name: "email", label: "Email address", type: "email", required: true, placeholder: "you@example.com" },
  { name: "phone", label: "Phone number (optional)", type: "tel", placeholder: "(555) 555-5555" },
  { name: "cruiseLine", label: "Cruise line", required: true, options: CRUISE_LINES },
  { name: "ship", label: "Ship", required: true, placeholder: "e.g. Icon of the Seas" },
  { name: "departureDate", label: "Departure date", type: "date", required: true },
  { name: "travelers", label: "Number of travelers", type: "number", required: true, placeholder: "2" },
  {
    name: "cruiseExperience",
    label: "Cruise experience",
    required: true,
    options: ["First cruise", "Experienced cruiser"],
  },
  {
    name: "primaryConcern",
    label: "What matters most right now?",
    required: true,
    options: ["Budget", "Drink package", "Daily organization", "Ports", "Group coordination", "Packing", "Other"],
  },
  {
    name: "preferredPlatform",
    label: "Preferred platform",
    required: true,
    options: ["iPhone", "Android", "Web"],
  },
];

const CAPTAIN_FIELDS: FormField[] = [
  { name: "name", label: "Name", required: true, placeholder: "Your name" },
  { name: "email", label: "Email address", type: "email", required: true, placeholder: "you@example.com" },
  { name: "cruiseLine", label: "Cruise line", options: CRUISE_LINES },
  { name: "ship", label: "Ship", placeholder: "Your upcoming ship" },
  { name: "departureDate", label: "Departure date", type: "date" },
  { name: "groupSize", label: "Approximate group size", type: "number", placeholder: "12" },
  { name: "groupRole", label: "How do you organize the group?", options: ["Group chat", "Social community", "Travel party", "Other"] },
  { name: "preferredPlatform", label: "Preferred platform", options: ["iPhone", "Android", "Web"] },
];

const ADVISOR_FIELDS: FormField[] = [
  { name: "name", label: "Name", required: true, placeholder: "Your name" },
  { name: "email", label: "Work email", type: "email", required: true, placeholder: "you@agency.com" },
  { name: "agencyName", label: "Agency name (optional)", placeholder: "Your agency" },
  { name: "companyWebsite", label: "Website (optional)", type: "url", placeholder: "https://" },
  { name: "primaryMarket", label: "Primary client market", options: ["Families", "Couples", "Groups", "Luxury", "Premium", "Other"] },
  { name: "cruiseNiche", label: "Cruise niche (optional)", placeholder: "e.g. Caribbean group sailings" },
  { name: "preferredPlatform", label: "Preferred platform", options: ["iPhone", "Android", "Web"] },
];

const CREATOR_FIELDS: FormField[] = [
  { name: "name", label: "Name", required: true, placeholder: "Your name" },
  { name: "email", label: "Email address", type: "email", required: true, placeholder: "you@example.com" },
  { name: "primaryPlatform", label: "Primary platform", required: true, options: ["Instagram", "TikTok", "YouTube", "Blog", "Facebook", "Other"] },
  { name: "profileUrl", label: "Profile URL", type: "url", placeholder: "https://" },
  { name: "audienceSizeRange", label: "Audience size range", options: ["Under 1,000", "1,000–9,999", "10,000–49,999", "50,000–249,999", "250,000+", "Prefer not to say"] },
  { name: "cruiseNiche", label: "Cruise niche", placeholder: "e.g. family cruising" },
  { name: "upcomingSailing", label: "Upcoming sailing", placeholder: "Cruise line, ship, or date (optional)" },
  { name: "preferredCollaborationType", label: "Preferred collaboration type", options: ["Cost breakdown content", "Cruise planning content", "Product feedback", "Other"] },
];

const CONFIG: Record<GrowthApplicationType, { fields: FormField[]; button: string; title: string; success: string }> = {
  founding20: {
    fields: FOUNDING_FIELDS,
    button: "Send my application",
    title: "Tell us about your sailing",
    success: "Thanks—we received your application. We’ll review upcoming sailings before reaching out; applying does not guarantee selection.",
  },
  captain: {
    fields: CAPTAIN_FIELDS,
    button: "Apply to be a sailing captain",
    title: "Tell us about your sailing group",
    success: "Thanks—we received your captain interest form. We’ll review it and follow up if this pilot is a fit.",
  },
  advisor: {
    fields: ADVISOR_FIELDS,
    button: "Apply for advisor access",
    title: "Tell us about your practice",
    success: "Thanks—we received your advisor application. We’ll follow up after reviewing pilot fit and timing.",
  },
  creator: {
    fields: CREATOR_FIELDS,
    button: "Send creator application",
    title: "Tell us about your audience",
    success: "Thanks—we received your creator application. We’ll follow up if there’s a useful fit for the pilot.",
  },
};

function isEmail(value: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/i.test(value);
}

function isFutureDate(value: string) {
  if (!value) return false;
  const date = new Date(`${value}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(date.getTime()) && date > today;
}

function validate(type: GrowthApplicationType, state: FormState) {
  const errors: FieldError = {};
  const config = CONFIG[type];
  for (const field of config.fields) {
    const value = String(state[field.name] ?? "").trim();
    if (field.required && !value) errors[field.name] = `${field.label} is required.`;
    if (field.type === "email" && value && !isEmail(value)) errors[field.name] = "Enter a valid email address.";
    if (field.type === "url" && value) {
      try {
        const parsed = new URL(value);
        if (!/^https?:$/.test(parsed.protocol)) throw new Error("Invalid protocol");
      } catch {
        errors[field.name] = "Enter a complete http(s) URL.";
      }
    }
    if (field.type === "number" && value && (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 99_999)) {
      errors[field.name] = "Enter a whole number greater than zero.";
    }
  }
  if (type === "founding20" && !isFutureDate(String(state.departureDate ?? ""))) {
    errors.departureDate = "Choose an upcoming departure date.";
  }
  if (!state.contactConsent) errors.contactConsent = "Please confirm that CruiseKit may contact you about this application.";
  return errors;
}

function typeEvent(type: GrowthApplicationType): "founding20_application_submitted" | "captain_application_submitted" | "advisor_application_submitted" | "creator_application_submitted" {
  return `${type}_application_submitted` as "founding20_application_submitted" | "captain_application_submitted" | "advisor_application_submitted" | "creator_application_submitted";
}

export default function GrowthApplicationForm({ type }: { type: GrowthApplicationType }) {
  const config = CONFIG[type];
  const [state, setState] = useState<FormState>({ contactConsent: false, website: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [message, setMessage] = useState("");
  const started = useRef(false);
  const fields = useMemo(() => config.fields, [config.fields]);

  const update = (name: string, value: FormValue) => {
    if (!started.current) {
      started.current = true;
      if (type === "founding20") trackGrowthEvent("founding20_application_started");
    }
    setState((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "", contactConsent: name === "contactConsent" ? "" : current.contactConsent }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(type, state);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("idle");
      setMessage("Check the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");
    setMessage("");
    try {
      const submitApplication = httpsCallable<
        { applicationType: GrowthApplicationType; form: FormState; attribution: ReturnType<typeof getGrowthAttribution>; honeypot?: string },
        { ok: boolean; applicationId: string }
      >(functions, "submitGrowthApplication");
      await submitApplication({
        applicationType: type,
        form: state,
        attribution: getGrowthAttribution(),
        honeypot: String(state.website ?? ""),
      });
      // The successful submission callable writes the authoritative ledger
      // event. Send the browser analytics event without writing a duplicate.
      trackGrowthEvent(typeEvent(type), {}, { durable: false });
      setStatus("submitted");
      setMessage(config.success);
    } catch {
      setStatus("error");
      setMessage("We couldn’t submit this right now. Please check your connection and try again.");
    }
  };

  if (status === "submitted") {
    return (
      <section className="rounded-2xl border border-success/30 bg-success-light/50 p-6 sm:p-8" aria-live="polite">
        <CheckCircle2 className="h-9 w-9 text-success" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-bold text-navy">Application received</h2>
        <p className="mt-2 max-w-xl leading-relaxed text-gray-700">{message}</p>
        <Link href="/calculator" className="mt-5 inline-flex text-sm font-semibold text-teal hover:text-teal-dark">
          Try the true-cost calculator →
        </Link>
      </section>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[var(--shadow-md)] sm:p-8">
      <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-navy">{config.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">We ask only for the details needed to review this pilot application.</p>
        </div>
        <LockKeyhole className="mt-1 h-5 w-5 shrink-0 text-teal" aria-hidden="true" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const value = String(state[field.name] ?? "");
          const isSelect = Boolean(field.options);
          const fullWidth = ["primaryConcern", "profileUrl", "upcomingSailing", "preferredCollaborationType", "cruiseNiche"].includes(field.name);
          return (
            <div key={field.name} className={fullWidth ? "sm:col-span-2" : undefined}>
              {isSelect ? (
                <div className="grid gap-1.5">
                  <Label htmlFor={field.name}>{field.label}{field.required ? " *" : ""}</Label>
                  <select
                    id={field.name}
                    value={value}
                    required={field.required}
                    aria-invalid={Boolean(errors[field.name]) || undefined}
                    aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                    onChange={(event) => update(field.name, event.target.value)}
                    className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1 ${errors[field.name] ? "border-error ring-1 ring-error/30" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <option value="">Select one</option>
                    {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  {errors[field.name] && <p id={`${field.name}-error`} role="alert" className="text-xs font-medium text-error">{errors[field.name]}</p>}
                </div>
              ) : (
                <Input
                  inputId={field.name}
                  label={`${field.label}${field.required ? " *" : ""}`}
                  type={field.type ?? "text"}
                  value={value}
                  required={field.required}
                  min={field.type === "number" ? 1 : undefined}
                  placeholder={field.placeholder}
                  error={errors[field.name]}
                  onChange={(event) => update(field.name, event.target.value)}
                />
              )}
              {field.helper && <p className="mt-1 text-xs text-gray-500">{field.helper}</p>}
            </div>
          );
        })}
      </div>

      {/* Honeypot: hidden from people but visible to unsophisticated bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={String(state.website ?? "")} onChange={(event) => update("website", event.target.value)} />
      </div>

      <div className="mt-6 border-t border-gray-100 pt-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-gray-700">
          <input
            type="checkbox"
            checked={Boolean(state.contactConsent)}
            onChange={(event) => update("contactConsent", event.target.checked)}
            aria-invalid={Boolean(errors.contactConsent) || undefined}
            aria-describedby={errors.contactConsent ? "contactConsent-error" : undefined}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal"
          />
          <span>I agree that CruiseKit may contact me about this application and the pilot program. *</span>
        </label>
        {errors.contactConsent && <p id="contactConsent-error" role="alert" className="mt-2 text-xs font-medium text-error">{errors.contactConsent}</p>}
        <p className="mt-3 text-xs leading-relaxed text-gray-500">We use this information to review your application and coordinate the pilot. Do not include booking numbers, payment details, or private notes. <Link href="/privacy" className="font-medium text-teal hover:text-teal-dark">Privacy policy</Link> · To request deletion, contact <a className="font-medium text-teal hover:text-teal-dark" href="mailto:info@cruisekit.app?subject=Growth%20application%20data%20request">info@cruisekit.app</a>.</p>
      </div>

      {message && <p role="alert" className={`mt-4 text-sm font-medium ${status === "error" ? "text-error" : "text-gray-600"}`}>{message}</p>}
      <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : config.button}
      </Button>
    </form>
  );
}
