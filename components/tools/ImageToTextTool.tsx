"use client";

import * as React from "react";
import { FileUp, Copy, Download, ShieldCheck, Loader2, CheckCircle2, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recognizeFile, type OcrLang } from "@/lib/ocr";
import { cleanOcrText, detectIdCard } from "@/lib/ocrTextClean";
import { track, deviceClass } from "@/lib/analytics";
import { downloadBlob } from "@/lib/download";

const TOOL = "image-to-text";

const LANGS: { value: OcrLang; label: string }[] = [
  { value: "eng", label: "English" },
  { value: "hin", label: "Hindi" },
  { value: "eng+hin", label: "English + Hindi" },
];

const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.webp,.bmp,.tiff,.tif,.heic,.heif";

export function ImageToTextTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [lang, setLang] = React.useState<OcrLang>("eng");
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ text: string; confidence: number } | null>(null);
  const [rawOcrText, setRawOcrText] = React.useState<string | null>(null);
  const [cardHint, setCardHint] = React.useState<"aadhaar" | "pan" | null>(null);
  const [copied, setCopied] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: TOOL });
  }, []);

  // Revoke preview URL on cleanup
  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const pick = (f: File) => {
    if (!f.type.startsWith("image/") && !/\.(jpe?g|png|webp|bmp|tiff?|heic|heif)$/i.test(f.name)) {
      setError("Please select an image file (JPG, PNG, WebP, BMP, TIFF).");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
    setResult(null);
    setRawOcrText(null);
    setCardHint(null);
    setProgress(0);
  };

  const clearSelection = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError(null);
    setResult(null);
    setRawOcrText(null);
    setCardHint(null);
    setProgress(0);
    setCopied(false);
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) pick(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) pick(f);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(0);
    track({ name: "tool_start", tool: TOOL, device: deviceClass() });
    try {
      // Preprocess (grayscale + upscale + contrast) lifts phone photos toward
      // the ~300 DPI the engine expects — the main accuracy lever.
      const res = await recognizeFile(file, { lang, onProgress: setProgress });
      const cleaned = cleanOcrText(res.text);
      setRawOcrText(res.text);
      setResult({ ...res, text: cleaned });
      setCardHint(detectIdCard(res.text));
      track({ name: "tool_success", tool: TOOL, device: deviceClass() });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "OCR failed. Please try a clearer image.");
      track({ name: "tool_failure", tool: TOOL, device: deviceClass(), reason: "ocr-error" });
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob([result.text], { type: "text/plain;charset=utf-8" });
    downloadBlob(
      blob,
      (file?.name.replace(/\.[^.]+$/, "") ?? "ocr-result") + ".txt",
      TOOL
    );
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors ${
          dragging
            ? "border-brand bg-brand/5"
            : "border-hairline-strong bg-background hover:border-brand/40 hover:bg-accent/20"
        }`}
        onClick={() => !preview && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        role={preview ? undefined : "button"}
        tabIndex={preview ? undefined : 0}
        onKeyDown={(e) => !preview && e.key === "Enter" && inputRef.current?.click()}
        aria-label={preview ? undefined : "Upload image for OCR"}
      >
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          className="hidden"
          onChange={onInput}
        />
        {preview ? (
          <div className="flex w-full flex-col items-center gap-3 px-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="max-h-32 max-w-full rounded object-contain shadow"
            />
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                <RefreshCw className="h-4 w-4" strokeWidth={1.75} /> Replace image
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
              >
                <X className="h-4 w-4" strokeWidth={1.75} /> Remove
              </Button>
            </div>
          </div>
        ) : (
          <>
            <FileUp className="h-8 w-8 text-ink-soft" strokeWidth={1.5} />
            <div className="text-center">
              <p className="text-sm font-semibold text-ink">Drop an image here</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                JPG · PNG · WebP · BMP · TIFF
              </p>
            </div>
          </>
        )}
      </div>

      {/* Language selector */}
      <div className="rounded-md border border-hairline p-3 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Language</p>
        <div className="flex flex-wrap gap-2">
          {LANGS.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => setLang(l.value)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                lang === l.value
                  ? "border-brand bg-brand text-white"
                  : "border-hairline bg-background hover:border-brand/50 hover:bg-accent/30"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      {/* Progress bar */}
      {busy && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
              {progress < 5 ? "Loading OCR engine…" : progress < 95 ? "Reading text…" : "Finishing…"}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-accent/40">
            <div
              className="h-full rounded-full bg-brand transition-all duration-200"
              style={{ width: `${Math.max(3, progress)}%` }}
            />
          </div>
        </div>
      )}

      <Button
        className="w-full"
        onClick={run}
        disabled={!file || busy}
        aria-busy={busy}
      >
        {busy ? (
          <><Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} /> Reading…</>
        ) : (
          "Extract Text"
        )}
      </Button>

      {/* Result */}
      {result && (
        <div className="space-y-2">
          {/* ID card detected — suggest dedicated tool */}
          {cardHint && (
            <div className="rounded-md border border-brand/30 bg-brand/5 px-3 py-2.5 text-xs text-ink">
              <span className="font-semibold">
                {cardHint === "aadhaar" ? "Aadhaar card detected." : "PAN card detected."}
              </span>{" "}
              For structured fields (number, name, DOB, address), use the{" "}
              <a
                href={cardHint === "aadhaar" ? "/tools/aadhaar-ocr" : "/tools/pan-card-ocr"}
                className="font-semibold text-brand underline underline-offset-2 hover:opacity-80"
              >
                {cardHint === "aadhaar" ? "Aadhaar OCR" : "PAN Card OCR"}
              </a>{" "}
              tool — it extracts each field separately with validation.
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
              Extracted text
              <span className="ml-2 normal-case font-normal text-muted-foreground">
                ({result.confidence}% confidence)
              </span>
            </p>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" onClick={copy} className="h-7 px-2 text-xs gap-1">
                {copied ? (
                  <><CheckCircle2 className="h-3.5 w-3.5 text-green-600" strokeWidth={2} /> Copied</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" strokeWidth={1.75} /> Copy</>
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={download} className="h-7 px-2 text-xs gap-1">
                <Download className="h-3.5 w-3.5" strokeWidth={1.75} /> .txt
              </Button>
            </div>
          </div>
          <textarea
            readOnly
            value={result.text}
            rows={Math.min(16, Math.max(4, result.text.split("\n").length + 1))}
            className="w-full resize-y rounded-md border border-hairline bg-background px-3 py-2.5 text-sm font-mono text-ink focus:outline-none focus:ring-1 focus:ring-brand"
            aria-label="Extracted text"
          />
          {result.text.length === 0 && (
            <p className="text-xs text-amber-700">
              No text found. Try a clearer image with good contrast and horizontal text.
            </p>
          )}

          {/* Raw OCR output — collapsed by default */}
          {rawOcrText && rawOcrText !== result.text && (
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-ink select-none">
                Show raw OCR output
              </summary>
              <textarea
                readOnly
                value={rawOcrText}
                rows={Math.min(14, Math.max(4, rawOcrText.split("\n").length + 1))}
                className="mt-2 w-full resize-y rounded-md border border-hairline bg-accent/30 px-3 py-2 font-mono text-xs text-ink focus:outline-none"
                aria-label="Raw OCR output"
              />
            </details>
          )}
        </div>
      )}

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        Your image is processed on-device — never uploaded.
      </p>
    </div>
  );
}
