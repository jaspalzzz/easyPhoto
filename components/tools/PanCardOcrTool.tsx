"use client";

import * as React from "react";
import { FileUp, ShieldCheck, Loader2, BadgeCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recognizeFileDualPass } from "@/lib/ocr";
import { parsePanFields, type PanFields } from "@/lib/panParse";
import { cleanOcrText } from "@/lib/ocrTextClean";
import { OcrResultField } from "@/components/tools/OcrResultField";
import { track } from "@/lib/analytics";

const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.webp,.bmp,.tiff,.tif,.heic,.heif";

export function PanCardOcrTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [rawText, setRawText] = React.useState<string | null>(null);
  const [fields, setFields] = React.useState<PanFields | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "pan-card-ocr" });
  }, []);

  React.useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const pick = (f: File) => {
    if (!f.type.startsWith("image/") && !/\.(jpe?g|png|webp|bmp|tiff?|heic|heif)$/i.test(f.name)) {
      setError("Please select an image of your PAN card (JPG, PNG, WebP, HEIC).");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
    setRawText(null);
    setFields(null);
    setProgress(0);
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) pick(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) pick(f);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setProgress(0);
    try {
      // Dual pass: Pass 1 reads all text for name/father/DOB labels; Pass 2
      // uses an alphanumeric whitelist so the PAN AAAAA9999A pattern isn't
      // broken by stray punctuation. Deskew corrects tilted card photos.
      const { primary, numeric } = await recognizeFileDualPass(file, {
        lang: "eng",
        onProgress: setProgress,
        preprocess: { deskew: true },
        secondPassWhitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ",
      });
      setRawText(cleanOcrText(primary.text));
      setFields(parsePanFields(primary.text, numeric.text));
      track({ name: "tool_success", tool: "pan-card-ocr" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "OCR failed. Please try again.");
      track({ name: "tool_failure", tool: "pan-card-ocr", reason: "ocr-error" });
    } finally {
      setBusy(false);
    }
  };

  const update = (key: keyof PanFields, value: string) =>
    setFields((prev) => (prev ? { ...prev, [key]: value } : prev));

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
        <strong>Privacy first:</strong> Your PAN card image never leaves your device. OCR runs entirely in your browser.
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload PAN card image"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
          dragging ? "border-brand bg-brand-soft/20" : "border-hairline hover:border-brand/50"
        }`}
      >
        <input ref={inputRef} type="file" accept={IMAGE_ACCEPT} className="hidden" onChange={onInput} />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="PAN card preview" className="max-h-[200px] w-auto object-contain" />
        ) : (
          <>
            <FileUp className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium text-ink">Drop your PAN card photo here</p>
              <p className="mt-1 text-sm text-muted-foreground">JPG, PNG, WebP, HEIC — a clear, straight photo or scan</p>
            </div>
          </>
        )}
      </div>

      {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      {busy && (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${Math.max(4, progress)}%` }} />
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {progress < 5 ? "Loading OCR engine…" : progress < 95 ? "Reading PAN card details…" : "Finishing…"}
          </p>
        </div>
      )}

      <Button onClick={run} disabled={!file || busy} className="w-full">
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Extract PAN Details
      </Button>

      {fields && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-ink">Extracted Fields</p>
          <p className="text-xs text-muted-foreground">Tap any field to correct it before copying.</p>

          <div className="divide-y divide-hairline overflow-hidden rounded-xl border border-hairline">
            <OcrResultField
              label="PAN Number"
              value={fields.panNumber}
              onChange={(v) => update("panNumber", v.toUpperCase())}
              mono
              badge={
                fields.panValid ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <BadgeCheck className="h-3 w-3" /> Valid format{fields.panEntity ? ` · ${fields.panEntity}` : ""}
                  </span>
                ) : fields.panNumber ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                    <AlertTriangle className="h-3 w-3" /> Verify format
                  </span>
                ) : undefined
              }
            />
            <OcrResultField label="Name" value={fields.name} onChange={(v) => update("name", v)} />
            <OcrResultField label="Father's Name" value={fields.fathersName} onChange={(v) => update("fathersName", v)} />
            <OcrResultField label="Date of Birth" value={fields.dob} onChange={(v) => update("dob", v)} mono />
          </div>

          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-ink">Show raw text</summary>
            <textarea
              className="mt-2 min-h-[120px] w-full resize-y rounded-lg border border-hairline bg-accent/30 p-3 font-mono text-xs text-ink focus:outline-none"
              value={rawText ?? ""}
              readOnly
            />
          </details>
        </div>
      )}

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
        On-device OCR — PAN card data never sent to any server.
      </p>
    </div>
  );
}
