"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Uploader } from "@/components/tool/Uploader";
import { setWorkflowPayload } from "@/lib/workflowHandoff";
import { track } from "@/lib/analytics";

/**
 * Homepage "start here" card — upload-first, exam-led.
 *
 * The old hero led with a search box, so a visitor who arrived on "photo resize
 * 20kb" had to read, search, tap, then upload. Competitors are one tap. This
 * card puts the drop zone above the fold and routes the dropped file straight
 * into the KB resizer via the existing cross-tool handoff (setWorkflowPayload →
 * the destination's ImageToolShell consumes it on mount), so the file is only
 * chosen once.
 *
 * Exams are handled as one-tap chips rather than drop targets: an exam page now
 * renders its resizer directly under the spec (see the exam template reorder),
 * so "tap SSC → drop on a tool that's already on screen" is one honest step.
 * The KB resizer is the only guaranteed single-shell handoff target, so it is
 * the only destination the drop zone itself feeds.
 */

const EXAM_CHIPS: { label: string; href: string; exam: string }[] = [
  { label: "SSC", href: "/exam-requirements/ssc/#resizer", exam: "ssc" },
  { label: "UPSC", href: "/exam-requirements/upsc/#resizer", exam: "upsc" },
  { label: "Voter ID", href: "/exam-requirements/voter-id/#resizer", exam: "voter-id" },
  { label: "RRB / Railway", href: "/exam-requirements/rrb/#resizer", exam: "rrb" },
  { label: "IBPS / SBI", href: "/exam-requirements/ibps/#resizer", exam: "ibps" },
  { label: "PAN card", href: "/exam-requirements/pan/#resizer", exam: "pan" },
];

const OTHER_CHIPS: { label: string; href: string }[] = [
  { label: "Passport photo", href: "/passport-photo/" },
  { label: "Sign on a photo", href: "/tools/sign-image/" },
];

export function HomeStarter() {
  const router = useRouter();

  const start = React.useCallback(
    (file: File) => {
      // Hand the file to the KB resizer; its ImageToolShell auto-loads it.
      setWorkflowPayload(file, file.name, { kind: "image" });
      track({ name: "tool_start", tool: "resize-kb" });
      router.push("/tools/resize-kb/");
    },
    [router],
  );

  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-4 sm:px-6">
        <span className="eyebrow flex items-center gap-2">
          <span className="text-ink-faint">01</span> Drop your photo
        </span>
        <p className="mt-1 text-sm text-muted-foreground">
          We resize it to an exact KB size in your browser — nothing is uploaded.
        </p>
        <div className="mt-3">
          <Uploader
            onFile={start}
            allowCamera
            className="min-h-[220px] gap-4 py-10"
            hint="JPG, PNG or HEIC — a clear, front-facing photo works best"
          />
        </div>
      </div>

      <div className="border-t border-hairline px-5 py-4 sm:px-6">
        <span className="eyebrow flex items-center gap-2">
          <span className="text-ink-faint">02</span> Or pick your exam / document
        </span>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {EXAM_CHIPS.map((c) => (
            <Link
              key={c.exam}
              href={c.href}
              onClick={() => track({ name: "exam_select", exam: c.exam })}
              className="inline-flex items-center rounded-md border border-hairline-strong bg-paper px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand-soft/40"
            >
              {c.label}
            </Link>
          ))}
          {OTHER_CHIPS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="inline-flex items-center rounded-md border border-hairline-strong bg-paper px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand-soft/40"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
