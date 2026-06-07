"use client";

import { CheckCircle2, AlertTriangle, Info, Camera } from "lucide-react";
import type { CountrySpec } from "@/lib/countrySpecs";
import type { CropResult } from "@/lib/headPositioning";
import { cn } from "@/lib/utils";

/** Warnings serious enough that a fresh photo beats a hand-fix. */
function retakeReason(result: CropResult): string | null {
  if (result.achieved.upscale > 1.15)
    return "This photo is lower-resolution than ideal, so the result may look soft when printed. A higher-resolution photo will look sharper.";
  if (result.warnings.some((w) => /past the photo edges/i.test(w)))
    return "The head is too close to the photo edges to leave the required margin. Retake from a bit further back so there's space above the head and around the shoulders.";
  return null;
}

interface CompliancePanelProps {
  spec: CountrySpec;
  result: CropResult;
}

/**
 * Surfaces the engine's compliance warnings as a pass/warn checklist, plus the
 * achieved head-size readout. Warnings come straight from computeCrop() —
 * this panel never invents its own pass/fail logic.
 */
export function CompliancePanel({ spec, result }: CompliancePanelProps) {
  const { achieved, warnings } = result;
  const band = spec.headPercentOfFrame;
  const headInBand =
    !band ||
    (achieved.headPercentOfFrame >= band.min &&
      achieved.headPercentOfFrame <= band.max);
  const retake = retakeReason(result);

  return (
    <div className="space-y-3.5">
      <h3 className="eyebrow">Compliance check</h3>

      {retake && (
        <div className="border-l-2 border-amber-500 bg-amber-50/60 py-2 pl-3 pr-2 text-xs leading-relaxed text-amber-900">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Camera className="h-3.5 w-3.5" /> Retake recommended
          </span>
          <p className="mt-0.5">{retake}</p>
        </div>
      )}

      <ul className="space-y-2 text-sm">
        <CheckItem ok={headInBand}>
          Head height{" "}
          <span className="font-mono text-[13px]">
            {achieved.headPercentOfFrame}%
          </span>{" "}
          of frame
          {band && (
            <span className="text-muted-foreground">
              {" "}
              (target {band.min}–{band.max}%)
            </span>
          )}
        </CheckItem>

        <CheckItem ok={achieved.upscale <= 1.15}>
          Source resolution{" "}
          <span className="text-muted-foreground">
            ({achieved.upscale <= 1 ? "downscaled" : `${achieved.upscale}× scale`})
          </span>
        </CheckItem>

        <li className="flex items-start gap-2.5">
          <span
            className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded-[3px] border border-hairline-strong"
            style={{ backgroundColor: spec.background.hex }}
            aria-hidden
          />
          <span>
            Background{" "}
            <span className="font-mono text-[13px] uppercase">
              {spec.background.hex}
            </span>
            <span className="text-muted-foreground">
              {": "}
              {spec.background.description}
            </span>
          </span>
        </li>
      </ul>

      {warnings.length > 0 ? (
        <div className="space-y-1.5 border-l-2 border-amber-400 bg-amber-50/60 py-2 pl-3 pr-2">
          {warnings.map((w, i) => (
            <p key={i} className="flex items-start gap-2 text-xs text-amber-900">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{w}</span>
            </p>
          ))}
        </div>
      ) : (
        <p className="flex items-center gap-2 border-l-2 border-success bg-success-soft py-2 pl-3 pr-2 text-xs text-success">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          Head size, framing and resolution look good.
        </p>
      )}

      <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-faint">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Automated checks can&apos;t catch everything (expression, glasses glare,
        shadows). Review against the official requirements before submitting.
      </p>
    </div>
  );
}

function CheckItem({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      {ok ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
      ) : (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      )}
      <span className={cn(!ok && "text-amber-900")}>{children}</span>
    </li>
  );
}
