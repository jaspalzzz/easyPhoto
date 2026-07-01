"use client";

import * as React from "react";
import { Download, FileUp, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { compressToCap } from "@/lib/compress";
import { compressPdfToTarget } from "@/lib/pdfCompress";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { track } from "@/lib/analytics";

/** Load a File into an HTMLCanvasElement for image compression. */
async function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas 2D unavailable")); return; }
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not decode image.")); };
    img.src = url;
  });
}

type DocType = "image" | "pdf" | null;

const TARGETS = [20, 50, 100, 200, 500];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

function detectType(file: File): DocType {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) return "pdf";
  if (IMAGE_TYPES.includes(file.type) || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name))
    return "image";
  return null;
}

interface Result {
  blob: Blob;
  bytes: number;
  underCap: boolean;
  ext: string;
}

export function CompressDocumentTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [docType, setDocType] = React.useState<DocType>(null);
  const [targetKb, setTargetKb] = React.useState(100);
  const [busy, setBusy] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Result | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "compress-document" });
  }, []);

  const pick = (f: File) => {
    const t = detectType(f);
    if (!t) {
      setError("Please select a JPG, PNG, or PDF file.");
      return;
    }
    setFile(f);
    setDocType(t);
    setError(null);
    setResult(null);
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

  const compress = async () => {
    if (!file || !docType) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      if (docType === "pdf") {
        const res = await compressPdfToTarget(file, targetKb);
        setResult({
          blob: res.blob,
          bytes: res.bytes,
          underCap: res.underTarget,
          ext: "pdf",
        });
      } else {
        const canvas = await fileToCanvas(file);
        const res = await compressToCap(canvas, targetKb, { minScale: 0.1 });
        setResult({
          blob: res.blob,
          bytes: res.bytes,
          underCap: res.underCap,
          ext: "jpg",
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Compression failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const save = () => {
    if (!result || !file) return;
    const base = file.name.replace(/\.[^.]+$/, "");
    downloadBlob(result.blob, `${base}-${targetKb}kb.${result.ext}`);
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
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Upload document"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf"
          className="hidden"
          onChange={onInput}
        />
        {file ? (
          <div className="text-center">
            <p className="text-sm font-semibold text-ink">{file.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {docType === "pdf" ? "PDF document" : "Image"} · {formatKb(file.size)}
            </p>
            <p className="mt-1 text-xs text-brand">Tap to change file</p>
          </div>
        ) : (
          <>
            <FileUp className="h-8 w-8 text-ink-soft" strokeWidth={1.5} />
            <div className="text-center">
              <p className="text-sm font-semibold text-ink">
                Drop your document here
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                JPG · PNG · PDF — auto-detected
              </p>
            </div>
          </>
        )}
      </div>

      {/* Target KB */}
      <div className="rounded-md border border-hairline p-3 space-y-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
          Target size
        </p>
        <div className="flex flex-wrap gap-2">
          {TARGETS.map((kb) => (
            <button
              key={kb}
              type="button"
              onClick={() => setTargetKb(kb)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                targetKb === kb
                  ? "border-brand bg-brand text-white"
                  : "border-hairline bg-background hover:border-brand/50 hover:bg-accent/30"
              }`}
            >
              {kb} KB
            </button>
          ))}
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={1}
              max={9999}
              value={targetKb}
              onChange={(e) => setTargetKb(Math.max(1, Number(e.target.value) || 1))}
              className="w-20 rounded-md border border-hairline bg-background px-2 py-1.5 text-xs font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
              aria-label="Custom KB target"
            />
            <span className="text-xs text-muted-foreground">KB custom</span>
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <Button
        className="w-full"
        onClick={compress}
        disabled={!file || busy}
        aria-busy={busy}
      >
        {busy ? (
          <><Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} /> Compressing…</>
        ) : (
          "Compress"
        )}
      </Button>

      {result && (
        <div className="rounded-md border border-hairline bg-accent/10 p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">
                {formatKb(result.bytes)}
                {result.underCap ? (
                  <span className="ml-2 text-xs font-normal text-green-700">
                    ✓ under {targetKb} KB
                  </span>
                ) : (
                  <span className="ml-2 text-xs font-normal text-amber-700">
                    Couldn&apos;t reach {targetKb} KB
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Was {formatKb(file!.size)} → now {formatKb(result.bytes)}
              </p>
            </div>
            <Button size="sm" onClick={save}>
              <Download className="h-4 w-4" strokeWidth={1.75} /> Download
            </Button>
          </div>
        </div>
      )}

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        Your file never leaves your device.
      </p>
    </div>
  );
}
