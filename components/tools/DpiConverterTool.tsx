"use client";

import * as React from "react";
import Link from "next/link";
import { Download, RefreshCcw, Gauge, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  readBlobDensityDpi,
  setBlobDensityDpi,
  type JpegDensity,
} from "@/lib/jpegDensity";
import { downloadBlob } from "@/lib/download";
import { formatKb } from "@/lib/utils";
import { track } from "@/lib/analytics";

const PRESETS = [
  { dpi: 200, label: "200 DPI", hint: "NSDL PAN scan requirement" },
  { dpi: 300, label: "300 DPI", hint: "Print / photo-studio standard" },
  { dpi: 600, label: "600 DPI", hint: "High-resolution document scan" },
];

interface Loaded {
  file: File;
  isJpeg: boolean;
  current: JpegDensity | null;
  widthPx: number;
  heightPx: number;
  previewUrl: string;
}

function describeCurrent(d: JpegDensity | null): string {
  if (!d) return "Not specified";
  if (d.units === 0) return "Not specified (aspect-ratio only)";
  if (d.x === d.y) return `${d.x} DPI`;
  return `${d.x} × ${d.y} DPI`;
}

export function DpiConverterTool() {
  const [loaded, setLoaded] = React.useState<Loaded | null>(null);
  const [targetDpi, setTargetDpi] = React.useState(200);
  const [dragging, setDragging] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const prevUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "dpi-converter" });
  }, []);

  React.useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  const processFile = React.useCallback((file: File) => {
    const previewUrl = URL.createObjectURL(file);
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    prevUrlRef.current = previewUrl;

    const isJpeg = /\.jpe?g$/i.test(file.name) || file.type === "image/jpeg";
    const img = new Image();
    img.onload = async () => {
      const current = isJpeg ? await readBlobDensityDpi(file) : null;
      setLoaded({
        file,
        isJpeg,
        current,
        widthPx: img.naturalWidth,
        heightPx: img.naturalHeight,
        previewUrl,
      });
      setDone(false);
      track({ name: "tool_success", tool: "dpi-converter" });
    };
    img.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      prevUrlRef.current = null;
    };
    img.src = previewUrl;
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) processFile(file);
    },
    [processFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const apply = async () => {
    if (!loaded || !loaded.isJpeg) return;
    const out = await setBlobDensityDpi(loaded.file, targetDpi);
    const base = loaded.file.name.replace(/\.[^.]+$/, "");
    downloadBlob(out, `${base}-${targetDpi}dpi.jpg`);
    setDone(true);
    track({ name: "download", tool: "dpi-converter", format: "jpg" });
  };

  const reset = () => {
    setLoaded(null);
    setDone(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (!loaded) {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          dragging
            ? "border-brand bg-brand-soft/20"
            : "border-hairline-strong bg-accent/20 hover:border-brand/50 hover:bg-accent/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg"
          className="hidden"
          onChange={handleInputChange}
        />
        <Gauge className="h-7 w-7 text-brand" strokeWidth={1.5} />
        <p className="text-base font-medium text-foreground">Drop your JPG here</p>
        <p className="text-sm text-muted-foreground">
          Sets the DPI tag without re-compressing — pixels stay identical · nothing
          is uploaded
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Choose file
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={loaded.previewUrl}
          alt="Selected image"
          className="h-24 w-20 flex-shrink-0 rounded-md border border-hairline object-cover shadow-sm"
        />
        <div className="space-y-1 text-sm">
          <p className="font-medium text-foreground">{loaded.file.name}</p>
          <p className="text-muted-foreground">
            {loaded.widthPx} × {loaded.heightPx} px · {formatKb(loaded.file.size)}
          </p>
          <p className="text-muted-foreground">
            Current DPI:{" "}
            <span className="font-mono text-foreground">
              {describeCurrent(loaded.current)}
            </span>
          </p>
        </div>
      </div>

      {!loaded.isJpeg ? (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm dark:border-amber-800 dark:bg-amber-950/30">
          <AlertCircle
            className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500"
            strokeWidth={2}
          />
          <p className="text-amber-800 dark:text-amber-300">
            DPI metadata editing applies to JPG files. Convert this image to JPG
            first with the{" "}
            <Link
              href="/tools/format-converter/"
              className="underline underline-offset-2"
            >
              format converter
            </Link>
            , then come back.
          </p>
        </div>
      ) : (
        <>
          <fieldset>
            <legend className="eyebrow mb-2 block text-xs">Set DPI to</legend>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.dpi}
                  onClick={() => setTargetDpi(p.dpi)}
                  title={p.hint}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    targetDpi === p.dpi
                      ? "border-brand bg-brand text-white"
                      : "border-hairline-strong bg-background text-foreground hover:bg-accent/40"
                  }`}
                >
                  {p.label}
                </button>
              ))}
              <label className="flex items-center gap-2 rounded-md border border-hairline-strong bg-background px-3 py-2 text-sm">
                <span className="text-muted-foreground">Custom</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={65535}
                  value={targetDpi}
                  onChange={(e) =>
                    setTargetDpi(
                      Math.min(65535, Math.max(1, Number(e.target.value) || 0))
                    )
                  }
                  className="h-7 w-20 rounded border border-hairline bg-background px-2 font-mono text-[13px]"
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {PRESETS.find((p) => p.dpi === targetDpi)?.hint ??
                "Custom dots-per-inch value"}
            </p>
          </fieldset>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="cta" size="sm" onClick={apply}>
              <Download className="h-4 w-4" strokeWidth={1.75} /> Set to {targetDpi}{" "}
              DPI &amp; download
            </Button>
            <Button variant="outline" size="sm" onClick={reset}>
              <RefreshCcw className="h-4 w-4" strokeWidth={1.75} /> Different file
            </Button>
          </div>

          {done && (
            <p className="rounded-lg border border-green-200 bg-green-50/60 px-4 py-2 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300">
              Downloaded a copy tagged {targetDpi} DPI. The pixels are byte-for-byte
              unchanged — only the metadata was rewritten.
            </p>
          )}
        </>
      )}
    </div>
  );
}
