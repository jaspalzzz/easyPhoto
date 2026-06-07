"use client";

import * as React from "react";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageToolShell, PreviewFrame, type ToolSource } from "./ImageToolShell";
import { imageToCanvas, pngUnderKb } from "@/lib/imaging";
import { whiteToTransparent, trimToContent } from "@/lib/signature";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";

interface Out {
  url: string;
  blob: Blob;
  bytes: number;
  width: number;
  height: number;
  underCap: boolean;
}

function Body({ source, kb }: { source: ToolSource; kb: number }) {
  const [threshold, setThreshold] = React.useState(200);
  const [busy, setBusy] = React.useState(false);
  const [out, setOut] = React.useState<Out | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      const base = imageToCanvas(source.image, source.size.width, source.size.height);
      const transparent = whiteToTransparent(base, { threshold, softness: 40 });
      const trimmed = trimToContent(transparent, { mode: "alpha", padding: 12 }).canvas;
      const res = await pngUnderKb(trimmed, kb);
      if (cancelled) return;
      setOut({
        url: res.canvas.toDataURL("image/png"),
        blob: res.blob,
        bytes: res.bytes,
        width: res.canvas.width,
        height: res.canvas.height,
        underCap: res.underCap,
      });
      setBusy(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [source, threshold, kb]);

  return (
    <div className="space-y-4">
      <PreviewFrame checker>
        {busy || !out ? (
          <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Processing…
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={out.url} alt="Transparent signature" className="max-h-[240px] w-auto" />
        )}
      </PreviewFrame>

      <label className="block text-sm">
        <span className="mb-1 flex items-center justify-between">
          <span className="eyebrow">Paper removal strength</span>
          <span className="font-mono text-[13px] text-ink-soft">{threshold}</span>
        </span>
        <input
          type="range"
          min={120}
          max={245}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full"
        />
      </label>

      {out && (
        <div className="space-y-2 rounded-md border border-hairline bg-card p-3 text-sm">
          <p className="font-mono text-[13px]">
            Result: <strong className="font-semibold">{formatKb(out.bytes)}</strong> · {out.width}×
            {out.height}px · transparent PNG
          </p>
          {!out.underCap && (
            <p className="border-l-2 border-amber-500 pl-3 text-amber-700">
              Couldn&apos;t get under {kb} KB without losing too much detail.
              This is the smallest clean version. Try a tighter scan.
            </p>
          )}
          <Button
            variant="cta"
            size="sm"
            onClick={() => downloadBlob(out.blob, `signature-${kb}kb.png`)}
          >
            <Download className="h-4 w-4" strokeWidth={1.75} /> Download PNG
          </Button>
        </div>
      )}
    </div>
  );
}

export function SignatureKbTool({ kb = 20 }: { kb?: number }) {
  return (
    <ImageToolShell>{(source) => <Body source={source} kb={kb} />}</ImageToolShell>
  );
}
