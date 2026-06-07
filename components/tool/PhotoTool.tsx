"use client";

import * as React from "react";
import {
  Loader2,
  RotateCcw,
  AlertCircle,
  SlidersHorizontal,
  Wand2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CropMarks } from "@/components/site/CropMarks";
import { Uploader } from "./Uploader";
import { Editor } from "./Editor";
import { CompliancePanel } from "./CompliancePanel";
import { ExportPanel } from "./ExportPanel";
import { useToolStore } from "@/store/useToolStore";
import {
  effectivePrintMm,
  isProductionReady,
  type CountrySpec,
} from "@/lib/countrySpecs";

const STATUS_LABEL: Record<string, string> = {
  loading: "Reading your photo…",
  detecting: "Detecting face landmarks…",
  segmenting: "Removing background…",
  rendering: "Cropping and scaling…",
};

/**
 * The embeddable tool, pre-set to one country. Used on each /[country] page.
 */
export function PhotoTool({ spec }: { spec: CountrySpec }) {
  const {
    status,
    error,
    print,
    digital,
    composite,
    compositeUrl,
    sourceUrl,
    segmented,
    segmentationFailed,
    setSpec,
    processFile,
    applyManualCrop,
    recomputeAuto,
    reset,
  } = useToolStore();

  const [editing, setEditing] = React.useState(false);
  const [manual, setManual] = React.useState(false);

  React.useEffect(() => {
    setSpec(spec);
    // If the user picked a photo in the hero, process it now (one-click start).
    const { pendingFile, setPendingFile, processFile: run } =
      useToolStore.getState();
    if (pendingFile) {
      setPendingFile(null);
      void run(pendingFile);
    }
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec.id]);

  const busy =
    status === "loading" ||
    status === "detecting" ||
    status === "segmenting" ||
    status === "rendering";
  const ready = status === "ready" && print && digital;
  const blocked = !isProductionReady(spec);
  const photoMm = effectivePrintMm(spec);

  const handleApply = async (crop: Parameters<typeof applyManualCrop>[0]) => {
    await applyManualCrop(crop);
    setManual(true);
    setEditing(false);
  };

  const handleResetAuto = async () => {
    await recomputeAuto();
    setManual(false);
  };

  return (
    <div className="panel">
      <div className="space-y-6 p-5 sm:p-6">
        {blocked && (
          <div className="border-l-2 border-amber-500 bg-amber-50/60 py-2.5 pl-3 pr-2 text-sm leading-relaxed text-amber-900">
            <strong>Specs pending verification.</strong> {spec.label}&apos;s
            requirements aren&apos;t yet confirmed against the official portal.
            You can preview the crop, but don&apos;t rely on this output for a
            real submission yet.
          </div>
        )}

        {!blocked && spec.advisory && (
          <div className="border-l-2 border-brand bg-brand-soft/50 py-2.5 pl-3 pr-2 text-sm leading-relaxed text-foreground">
            <strong>Before you submit:</strong> {spec.advisory}
          </div>
        )}

        {status === "idle" && <Uploader onFile={processFile} disabled={busy} />}

        {busy && (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-muted-foreground">
            <Loader2 className="h-7 w-7 animate-spin text-ink-soft" />
            <p className="text-sm font-medium text-foreground">
              {STATUS_LABEL[status]}
            </p>
            <p className="spec normal-case tracking-[0.04em]">
              First run downloads the AI models. This can take a moment.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 border-l-2 border-destructive bg-destructive/5 py-2.5 pl-3 pr-2 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Try another photo
            </Button>
          </div>
        )}

        {ready && (
          <div className="space-y-4">
            {segmentationFailed && (
              <div className="flex items-start gap-2 border-l-2 border-amber-400 bg-amber-50/60 py-2 pl-3 pr-2 text-xs text-amber-900">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  Automatic background removal didn&apos;t run, so the original
                  background is still shown. The crop and sizing are still
                  correct, so retry or use a photo with a clearer background.
                </span>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    {editing ? "Adjust crop" : "Result preview"}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={reset}>
                    <RotateCcw className="h-4 w-4" /> New photo
                  </Button>
                </div>

                {editing ? (
                  <Editor
                    src={compositeUrl ?? sourceUrl ?? print!.previewUrl}
                    aspectRatio={photoMm.width / photoMm.height}
                    initialCrop={print!.result.crop}
                    onApply={handleApply}
                    onCancel={() => setEditing(false)}
                  />
                ) : (
                  <>
                    <div className="relative flex justify-center rounded-md border border-hairline bg-paper p-6">
                      <CropMarks size={16} inset={8} />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={print!.previewUrl}
                        alt={`${spec.label} passport photo preview`}
                        className="max-h-[360px] w-auto ring-1 ring-hairline-strong"
                        style={{
                          aspectRatio: `${photoMm.width} / ${photoMm.height}`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="spec normal-case tracking-[0.06em]">
                        {photoMm.width}×{photoMm.height}mm ·{" "}
                        {segmented
                          ? "background replaced"
                          : "original background"}
                        {manual ? " · adjusted" : ""}
                      </p>
                      <div className="flex gap-1">
                        {manual && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetAuto}
                          >
                            <Wand2 className="h-4 w-4" /> Auto
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(true)}
                        >
                          <SlidersHorizontal className="h-4 w-4" /> Fine-tune
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-6">
                <CompliancePanel spec={spec} result={print!.result} />
                <ExportPanel spec={spec} print={print!} digital={digital!} />
              </div>
            </div>
          </div>
        )}

        {(sourceUrl || composite) && null}
      </div>
    </div>
  );
}
