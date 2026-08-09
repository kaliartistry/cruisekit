"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Check, CheckCircle2, Copy, Smartphone, Users } from "lucide-react";
import { StoreButtonRow } from "@/components/shared/store-buttons";
import { trackMyCrewInviteOpened } from "@/lib/analytics";

export default function InviteLandingClient() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackMyCrewInviteOpened({
      sourceType: "traveler",
      landingContext: "sailing",
    });
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const search = useSyncExternalStore(
    subscribeToStaticUrl,
    () => window.location.search,
    () => null,
  );
  const checkedUrl = search !== null;
  const code = checkedUrl
    ? normalizePublicInviteCode(new URLSearchParams(search).get("code"))
    : null;

  const copyInviteCode = async () => {
    if (code && (await writePublicInviteCodeToClipboard(code))) {
      setCopied(true);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal/10 text-teal-dark">
          <Users className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-teal-dark">
          MyCrew invitation
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          Join the crew in MyDay by CruiseKit
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          This page keeps the invitation code visible while you install or open
          CruiseKit. It does not claim that the app opened or that you joined a
          group; joining happens only after you confirm it under More in the app.
        </p>

        <div
          className="mt-7 rounded-2xl border border-teal/20 bg-teal/5 p-5 text-center"
          aria-live="polite"
        >
          {!checkedUrl ? (
            <p className="text-sm font-medium text-slate-600">
              Checking the invitation code…
            </p>
          ) : code ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Invite code
              </p>
              <InviteCodeDisplay
                code={code}
                copied={copied}
                onCopy={() => void copyInviteCode()}
              />
            </>
          ) : (
            <p className="text-sm font-medium text-slate-700">
              This link does not contain a valid six-character invite code. Ask
              the organizer to share the invitation again.
            </p>
          )}
        </div>

        <ol className="mt-8 space-y-4 text-sm leading-6 text-slate-700">
          <Step number="1">Install or open CruiseKit on iPhone or Android.</Step>
          <Step number="2">
            In the app, open More, choose MyCrew, and sign in if prompted.
          </Step>
          <Step number="3">
            Choose Join a crew, enter the code shown above, and review the group
            before joining.
          </Step>
        </ol>

        <div className="mt-8">
          <StoreButtonRow sourceSurface="other" variant="light" />
        </div>

        <div className="mt-7 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-teal-dark" aria-hidden="true" />
          <p>
            Keep this page open if you need to copy the code after installing.
            The page does not read or display any CruiseKit account or group
            member data.
          </p>
        </div>
      </div>
    </section>
  );
}

function subscribeToStaticUrl() {
  return () => {};
}

export function normalizePublicInviteCode(value: string | null) {
  if (!value) return null;
  const normalized = value.trim().toUpperCase().replace(/[\s-]+/g, "");
  return /^[A-Z0-9]{6}$/.test(normalized) ? normalized : null;
}

type ClipboardWriter = Pick<Clipboard, "writeText">;

export async function writePublicInviteCodeToClipboard(
  code: string,
  clipboard: ClipboardWriter | undefined =
    typeof navigator === "undefined" ? undefined : navigator.clipboard,
) {
  if (!clipboard?.writeText) return false;

  try {
    await clipboard.writeText(code);
    return true;
  } catch {
    return false;
  }
}

export function InviteCodeDisplay({
  code,
  copied,
  onCopy,
}: {
  code: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="mt-3 flex items-center justify-center gap-3">
      <p className="font-mono text-3xl font-extrabold tracking-[0.2em] text-navy">
        {code}
      </p>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-teal/30 bg-white px-3 py-2 text-sm font-bold text-teal-dark shadow-sm transition-colors hover:bg-teal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
        aria-label={`Copy invite code ${code}`}
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function Step({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
        {number}
      </span>
      <span className="pt-0.5">{children}</span>
      <CheckCircle2 className="sr-only" aria-hidden="true" />
    </li>
  );
}
