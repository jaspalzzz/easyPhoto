"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { setWorkflowPayload } from "@/lib/workflowHandoff";

export interface NextStepDef {
  slug: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
}

interface Props {
  /**
   * Lazily produces the blob to hand off when the user clicks a step.
   * Called only on click — not eagerly — so tools don't encode twice.
   */
  getBlob: () => Promise<Blob>;
  /** Suggested filename displayed in the receiving tool's file-info bar. */
  filename: string;
  steps: NextStepDef[];
}

export function WorkflowNextSteps({ getBlob, filename, steps }: Props) {
  const router = useRouter();
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleStep = async (slug: string) => {
    if (loading) return;
    setLoading(slug);
    try {
      const blob = await getBlob();
      setWorkflowPayload(blob, filename);
      router.push(`/tools/${slug}/`);
    } catch {
      setLoading(null);
    }
  };

  return (
    <div className="mt-5 border-t border-hairline pt-5">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
        Continue editing
      </p>
      <div className={`grid gap-2 ${steps.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {steps.map((step) => {
          const busy = loading === step.slug;
          return (
            <button
              key={step.slug}
              onClick={() => handleStep(step.slug)}
              disabled={!!loading}
              className="group flex items-start gap-3 rounded-lg border border-hairline bg-accent/40 px-3.5 py-3 text-left transition-colors hover:border-brand/25 hover:bg-accent disabled:cursor-wait disabled:opacity-60"
            >
              <span className="mt-0.5 shrink-0 text-brand">
                {busy
                  ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                  : step.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-snug text-ink">
                  {step.label}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-ink-soft">
                  {step.hint}
                </p>
              </div>
              <ArrowRight
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
