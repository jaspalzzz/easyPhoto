"use client";

import * as React from "react";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell } from "./ImageToolShell";
import { downloadBlob, shareFile } from "@/lib/download";
import { track, deviceClass } from "@/lib/analytics";

type PaperSize = "a4" | "4x6";
type Count = 4 | 6 | 8;

const PAPER: Record<PaperSize, { label: string; widthPx: number; heightPx: number }> = {
  a4:  { label: "A4 (210×297 mm)", widthPx: 2480, heightPx: 3508 }, // 300 DPI
  "4x6": { label: '4×6 inch',       widthPx: 1200, heightPx: 1800 }, // 300 DPI
};

const COUNTS: Count[] = [4, 6, 8];

// Gap between photos in pixels (at 300 DPI, 2 mm = ~24 px)
const GAP = 24;
// Margin around the sheet in pixels (~5 mm = 59 px)
const MARGIN = 59;

function gridLayout(
  count: Count,
  paperW: number,
  paperH: number
): { cols: number; rows: number; cellW: number; cellH: number } {
  const candidates: Array<{ cols: number; rows: number }> = [
    { cols: 2, rows: 2 },
    { cols: 2, rows: 3 },
    { cols: 2, rows: 4 },
    { cols: 3, rows: 2 },
    { cols: 4, rows: 2 },
  ];
  for (const c of candidates) {
    if (c.cols * c.rows === count) {
      const cellW = Math.floor((paperW - 2 * MARGIN - (c.cols - 1) * GAP) / c.cols);
      const cellH = Math.floor((paperH - 2 * MARGIN - (c.rows - 1) * GAP) / c.rows);
      return { ...c, cellW, cellH };
    }
  }
  // fallback 2×2
  const cols = 2, rows = Math.ceil(count / 2);
  const cellW = Math.floor((paperW - 2 * MARGIN - (cols - 1) * GAP) / cols);
  const cellH = Math.floor((paperH - 2 * MARGIN - (rows - 1) * GAP) / rows);
  return { cols, rows, cellW, cellH };
}

function Body({ source, reset }: { source: import("./ImageToolShell").ToolSource; reset: () => void }) {
  const [paper, setPaper] = React.useState<PaperSize>("a4");
  const [count, setCount] = React.useState<Count>(6);
  const [busy, setBusy] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);
  const prevPreviewRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "print-sheet" });
  }, []);

  // Clean up previous preview URL when it changes
  React.useEffect(() => {
    const prev = prevPreviewRef.current;
    prevPreviewRef.current = previewUrl;
    if (prev && prev !== previewUrl) URL.revokeObjectURL(prev);
  }, [previewUrl]);

  // Revoke on unmount
  React.useEffect(() => {
    return () => {
      if (prevPreviewRef.current) URL.revokeObjectURL(prevPreviewRef.current);
    };
  }, []);

  const generate = React.useCallback(async () => {
    setBusy(true);
    try {
      const p = PAPER[paper];
      const { cols, rows, cellW, cellH } = gridLayout(count, p.widthPx, p.heightPx);

      const canvas = document.createElement("canvas");
      canvas.width = p.widthPx;
      canvas.height = p.heightPx;
      const ctx = canvas.getContext("2d")!;

      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, p.widthPx, p.heightPx);

      // Draw each photo cell
      for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = MARGIN + col * (cellW + GAP);
        const y = MARGIN + row * (cellH + GAP);

        // Cover-fit the source image into the cell
        const srcW = source.size.width;
        const srcH = source.size.height;
        const scaleX = cellW / srcW;
        const scaleY = cellH / srcH;
        const scale = Math.max(scaleX, scaleY);
        const drawW = srcW * scale;
        const drawH = srcH * scale;
        const ox = (cellW - drawW) / 2;
        const oy = (cellH - drawH) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, cellW, cellH);
        ctx.clip();
        ctx.drawImage(source.image, x + ox, y + oy, drawW, drawH);
        ctx.restore();

        // Thin cut-guide line around each cell
        ctx.strokeStyle = "#cccccc";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellW, cellH);
      }

      const blob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/jpeg", 0.94)
      );
      setResultBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      track({ name: "tool_success", tool: "print-sheet", device: deviceClass() });
    } catch (e) {
      console.error(e);
      track({ name: "tool_failure", tool: "print-sheet", device: deviceClass(), reason: "render-error" });
    } finally {
      setBusy(false);
    }
  }, [source, paper, count]);

  const handleDownload = () => {
    if (!resultBlob) return;
    downloadBlob(resultBlob, `photo-sheet-${count}up-${paper}.jpg`);
    track({ name: "download", tool: "print-sheet", format: "jpg" });
  };

  const handleShare = async () => {
    if (!resultBlob) return;
    await shareFile(resultBlob, `photo-sheet-${count}up.jpg`, "Photo print sheet");
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <fieldset>
          <legend className="eyebrow mb-2 block text-xs">Paper size</legend>
          <div className="flex gap-2">
            {(["a4", "4x6"] as PaperSize[]).map((ps) => (
              <button
                key={ps}
                onClick={() => setPaper(ps)}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                  paper === ps
                    ? "border-brand bg-brand text-white"
                    : "border-hairline-strong bg-background text-foreground hover:bg-accent/40"
                }`}
              >
                {PAPER[ps].label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="eyebrow mb-2 block text-xs">Number of photos</legend>
          <div className="flex gap-2">
            {COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                  count === n
                    ? "border-brand bg-brand text-white"
                    : "border-hairline-strong bg-background text-foreground hover:bg-accent/40"
                }`}
              >
                {n} photos
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <Button variant="cta" onClick={generate} disabled={busy}>
        {busy ? "Generating…" : "Generate print sheet"}
      </Button>

      {previewUrl && (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Print sheet preview"
            className="w-full max-w-sm rounded-lg border border-hairline object-contain shadow-sm"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="cta" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" strokeWidth={1.75} />
              Download JPG
            </Button>
            {"share" in navigator && (
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" strokeWidth={1.75} />
                Share / WhatsApp
              </Button>
            )}
            <button
              onClick={reset}
              className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Use different photo
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            300 DPI · print-ready · grey guide lines mark the cut edges
          </p>
        </div>
      )}
    </div>
  );
}

export function PrintSheetTool() {
  return (
    <ImageToolShell uploaderTitle="passport photo" uploaderHint="Upload any photo — we'll tile it">
      {(source, reset) => <Body source={source} reset={reset} />}
    </ImageToolShell>
  );
}
