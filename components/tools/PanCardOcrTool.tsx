"use client";

import * as React from "react";
import { FileUp, Copy, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recognizeImage } from "@/lib/ocr";
import { track } from "@/lib/analytics";

interface PanFields {
  panNumber: string;
  name: string;
  fathersName: string;
  dob: string;
}

function parsePanFields(raw: string): PanFields {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

  // PAN number: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F)
  const panMatch = raw.match(/\b([A-Z]{5}[0-9]{4}[A-Z])\b/);
  const panNumber = panMatch ? panMatch[1] : "";

  // DOB: DD/MM/YYYY
  const dobMatch = raw.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
  const dob = dobMatch ? dobMatch[1] : "";

  // Name and father's name: appear after their label lines
  const nameIdx = lines.findIndex((l) => /^name$/i.test(l));
  const name = nameIdx >= 0 && lines[nameIdx + 1] ? lines[nameIdx + 1] : "";

  const fatherIdx = lines.findIndex((l) => /father('s)?\s+(name|'s)/i.test(l));
  const fathersName = fatherIdx >= 0 && lines[fatherIdx + 1] ? lines[fatherIdx + 1] : "";

  // Fallback: if label approach didn't work, guess from structure
  // PAN cards typically have: Name on line before DOB, Father's name between them
  if (!name && !fathersName) {
    const skipPatterns = /income tax|government|india|pan|permanent|account|date|birth|dob/i;
    const textLines = lines.filter(
      (l) => l.length > 2 && l.length < 50 && !/\d/.test(l) && !skipPatterns.test(l)
    );
    return {
      panNumber,
      name: textLines[0] ?? "",
      fathersName: textLines[1] ?? "",
      dob,
    };
  }

  return { panNumber, name, fathersName, dob };
}

const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.webp,.bmp,.tiff,.tif";

export function PanCardOcrTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [rawText, setRawText] = React.useState<string | null>(null);
  const [fields, setFields] = React.useState<PanFields | null>(null);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "pan-card-ocr" });
  }, []);

  React.useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const pick = (f: File) => {
    if (!f.type.startsWith("image/") && !/\.(jpe?g|png|webp|bmp|tiff?)$/i.test(f.name)) {
      setError("Please select an image of your PAN card (JPG, PNG, WebP).");
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
      const res = await recognizeImage(file, "eng", (pct) => setProgress(pct));
      setRawText(res.text);
      setFields(parsePanFields(res.text));
    } catch (err) {
      setError(err instanceof Error ? err.message : "OCR failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const copyField = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const FIELD_LABELS: { key: keyof PanFields; label: string }[] = [
    { key: "panNumber", label: "PAN Number" },
    { key: "name", label: "Name" },
    { key: "fathersName", label: "Father's Name" },
    { key: "dob", label: "Date of Birth" },
  ];

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
              <p className="mt-1 text-sm text-muted-foreground">JPG, PNG, WebP — photo of the card or a scanned copy</p>
            </div>
          </>
        )}
      </div>

      {error && <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      {busy && (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading PAN card details…
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
          <div className="divide-y divide-hairline overflow-hidden rounded-xl border border-hairline">
            {FIELD_LABELS.map(({ key, label }) => {
              const value = fields[key];
              return (
                <div key={key} className="flex items-start gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className={`mt-0.5 font-medium font-mono ${value ? "text-ink" : "text-muted-foreground italic"}`}>
                      {value || "Not detected"}
                    </p>
                  </div>
                  {value && (
                    <button
                      onClick={() => copyField(key, value)}
                      className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-ink"
                      aria-label={`Copy ${label}`}
                    >
                      {copiedField === key ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
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
