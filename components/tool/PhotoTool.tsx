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
import { Card, CardContent } from "@/components/ui/card";
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
    <Card>
      <CardContent className="space-y-6 p-6">
        {blocked && (
          <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong>Specs pending verification.</strong> {spec.label}&apos;s
              requirements are not yet confirmed against the official portal. You
              can preview the crop, but do not rely on this output for a real
              submission yet.
            </span>
          </div>
        )}

        {!blocked && spec.advisory && (
          <div className="flex items-start gap-2 rounded-md border border-sky-300 bg-sky-50 p-3 text-sm text-sky-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong>Before you submit:</strong> {spec.advisory}
            </span>
          </div>
        )}

        {status === "idle" && <Uploader onFile={processFile} disabled={busy} />}

        {busy && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">{STATUS_LABEL[status]}</p>
            <p className="text-xs">
              First run downloads the AI models — this can take a moment.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
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
              <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  Automatic background removal didn&apos;t run, so the original
                  background is still shown. The crop and sizing are still
                  correct — retry or use a photo with a clearer background.
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
                    <div className="flex justify-center rounded-md border bg-muted/30 p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={print!.previewUrl}
                        alt={`${spec.label} passport photo preview`}
                        className="max-h-[360px] w-auto rounded shadow-sm ring-1 ring-border"
                        style={{
                          aspectRatio: `${photoMm.width} / ${photoMm.height}`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {photoMm.width}×{photoMm.height}mm ·{" "}
                        {segmented
                          ? "background replaced"
                          : "original background"}
                        {manual ? " · manually adjusted" : ""}
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
      </CardContent>
    </Card>
  );
}
