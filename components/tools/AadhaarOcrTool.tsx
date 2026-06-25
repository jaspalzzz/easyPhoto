"use client";

import * as React from "react";
import { FileUp, Copy, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recognizeImage } from "@/lib/ocr";
import { track } from "@/lib/analytics";

interface AadhaarFields {
  aadhaarNumber: string;
  name: string;
  dob: string;
  gender: string;
  address: string;
}

function parseAadhaarFields(raw: string): AadhaarFields {
  const text = raw.replace(/\n+/g, "\n");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Aadhaar number: 12 digits in groups of 4 (printed as XXXX XXXX XXXX)
  const numMatch = text.match(/\b(\d{4})\s+(\d{4})\s+(\d{4})\b/);
  const aadhaarNumber = numMatch ? `${numMatch[1]} ${numMatch[2]} ${numMatch[3]}` : "";

  // DOB: DD/MM/YYYY or DD-MM-YYYY or Year of Birth: YYYY
  const dobMatch = text.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/) ||
                   text.match(/Year\s+of\s+Birth[:\s]+(\d{4})/i);
  const dob = dobMatch ? dobMatch[1] : "";

  // Gender: Male, Female, MALE, FEMALE, M, F
  const genderMatch = text.match(/\b(Male|Female|MALE|FEMALE)\b/i);
  const gender = genderMatch ? (genderMatch[1].toLowerCase() === "male" ? "Male" : "Female") : "";

  // Name: the first line that looks like an English proper name.
  // Aadhaar cards print the name in Hindi first, then English on the next line.
  // English-only OCR garbles Hindi into ASCII junk (e.g. "-r = Po") that
  // contains chars like = | ~ which never appear in real names. Requiring
  // the line to start with a letter and contain only name-safe chars (letters,
  // spaces, hyphens, apostrophes, dots) skips all garbled Hindi lines and picks
  // the clean English name instead.
  const skipPatterns = /aadhaar|government|india|unique|authority|dob|date|birth|year|male|female|address|help|enrolment/i;
  const nameLine = lines.find(
    (l) =>
      l.length > 2 &&
      l.length < 60 &&
      !/\d/.test(l) &&
      !skipPatterns.test(l) &&
      /^[A-Za-z][A-Za-z\s.'-]*$/.test(l)
  );
  const name = nameLine ?? "";

  // Address: lines after "Address" or S/O, W/O, D/O
  const addrIdx = lines.findIndex((l) => /\b(address|s\/o|w\/o|d\/o|house|flat|village|dist|pin)/i.test(l));
  const address = addrIdx >= 0
    ? lines.slice(addrIdx, addrIdx + 4).join(", ")
    : "";

  return { aadhaarNumber, name, dob, gender, address };
}

const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.webp,.bmp,.tiff,.tif";

export function AadhaarOcrTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [rawText, setRawText] = React.useState<string | null>(null);
  const [fields, setFields] = React.useState<AadhaarFields | null>(null);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "aadhaar-ocr" });
  }, []);

  React.useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const pick = (f: File) => {
    if (!f.type.startsWith("image/") && !/\.(jpe?g|png|webp|bmp|tiff?)$/i.test(f.name)) {
      setError("Please select an image of your Aadhaar card (JPG, PNG, WebP).");
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
      setFields(parseAadhaarFields(res.text));
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

  const FIELD_LABELS: { key: keyof AadhaarFields; label: string }[] = [
    { key: "aadhaarNumber", label: "Aadhaar Number" },
    { key: "name", label: "Name" },
    { key: "dob", label: "Date of Birth" },
    { key: "gender", label: "Gender" },
    { key: "address", label: "Address" },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
        <strong>Privacy first:</strong> Your Aadhaar image never leaves your device. OCR runs entirely in your browser with no server upload.
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload Aadhaar card image"
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
          <img src={preview} alt="Aadhaar preview" className="max-h-[200px] w-auto object-contain" />
        ) : (
          <>
            <FileUp className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium text-ink">Drop your Aadhaar card photo here</p>
              <p className="mt-1 text-sm text-muted-foreground">JPG, PNG, WebP — front side preferred</p>
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
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading Aadhaar details…
          </p>
        </div>
      )}

      <Button onClick={run} disabled={!file || busy} className="w-full">
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Extract Aadhaar Details
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
                    <p className={`mt-0.5 font-medium ${value ? "text-ink" : "text-muted-foreground italic"}`}>
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
        On-device OCR — Aadhaar data never sent to any server.
      </p>
    </div>
  );
}
