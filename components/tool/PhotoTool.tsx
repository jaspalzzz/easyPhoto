"use client";

import * as React from "react";
import {
  RotateCcw,
  AlertCircle,
  SlidersHorizontal,
  Crop,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CropMarks } from "@/components/site/CropMarks";
import { ScanProgress, type ScanStep } from "@/components/site/ScanProgress";
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

const MAKER_STEPS: ScanStep[] = [
  { key: "loading", label: "Read" },
  { key: "detecting", label: "Detect face" },
  { key: "segmenting", label: "Remove bg" },
  { key: "rendering", label: "Crop & size" },
];

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
    brightness,
    contrast,
    setBrightness,
    setContrast,
  } = useToolStore();

  const [editing, setEditing] = React.useState(false);
  const [manual, setManual] = React.useState(false);

  // Brightness/contrast sliders: the store setter triggers a full preset
  // rebuild (Pica resize + re-encode), far too heavy to run per drag tick.
  // Render from local state for an instant thumb, push to the store only
  // after the user pauses.
  const [liveBrightness, setLiveBrightness] = React.useState(brightness);
  const [liveContrast, setLiveContrast] = React.useState(contrast);
  const adjustTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => setLiveBrightness(brightness), [brightness]);
  React.useEffect(() => setLiveContrast(contrast), [contrast]);
  React.useEffect(
    () => () => {
      if (adjustTimer.current) clearTimeout(adjustTimer.current);
    },
    []
  );
  const pushAdjust = (kind: "b" | "c", value: number) => {
    if (kind === "b") setLiveBrightness(value);
    else setLiveContrast(value);
    if (adjustTimer.current) clearTimeout(adjustTimer.current);
    adjustTimer.current = setTimeout(() => {
      if (kind === "b") setBrightness(value);
      else setContrast(value);
    }, 180);
  };

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
          <ScanProgress
            label={STATUS_LABEL[status] ?? "Processing…"}
            hint="First run downloads the AI models — this can take a moment."
            thumbnailUrl={sourceUrl}
            steps={MAKER_STEPS}
            activeKey={status}
          />
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
                  We kept your original background on this device. The crop and
                  sizing are correct and ready to use. For an automatic plain
                  background, try a photo taken against a clear wall, or open
                  this page on a laptop or desktop.
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

                    {/* Image Adjustment sliders */}
                    <div className="bg-paper border border-hairline rounded-md p-3.5 space-y-3">
                      <span className="text-[11px] font-semibold eyebrow uppercase tracking-wider text-brand block">
                        Image Adjustments
                      </span>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="block text-xs">
                          <span className="text-muted-foreground block mb-1 font-semibold uppercase text-[10px]">
                            Brightness: {liveBrightness}%
                          </span>
                          <input
                            type="range"
                            min={80}
                            max={120}
                            value={liveBrightness}
                            onChange={(e) => pushAdjust("b", Number(e.target.value))}
                            className="w-full accent-brand cursor-pointer"
                          />
                        </label>
                        <label className="block text-xs">
                          <span className="text-muted-foreground block mb-1 font-semibold uppercase text-[10px]">
                            Contrast: {liveContrast}%
                          </span>
                          <input
                            type="range"
                            min={80}
                            max={120}
                            value={liveContrast}
                            onChange={(e) => pushAdjust("c", Number(e.target.value))}
                            className="w-full accent-brand cursor-pointer"
                          />
                        </label>
                      </div>
                      <p className="text-[10px] leading-snug text-muted-foreground">
                        Use sparingly to correct lighting only. Passport and visa
                        authorities can reject photos that look digitally altered
                        — don&apos;t change your natural appearance.
                      </p>
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
                            <Crop className="h-4 w-4" /> Auto
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
