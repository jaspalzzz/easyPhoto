"use client";

import * as React from "react";
import { CheckCircle2, XCircle, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PORTAL_PRESETS, PORTAL_KEYS } from "@/lib/portalPresets";
import { track } from "@/lib/analytics";

type Status = "pass" | "fail" | "warn";

interface Check {
  label: string;
  value: string;
  status: Status;
  hint?: string;
}

interface ValidationResult {
  filename: string;
  fileSizeKb: number;
  widthPx: number;
  heightPx: number;
  format: string;
  aspectRatio: number;
  checks: Check[];
  /** Portal matches — portals where this file passes all enforced limits. */
  matchingPortals: string[];
}

function fmt(n: number, d = 0) {
  return n.toFixed(d);
}

function runValidation(file: File, widthPx: number, heightPx: number): ValidationResult {
  const fileSizeKb = file.size / 1024;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "unknown";
  const mimeGuess = file.type.split("/")[1]?.toLowerCase() ?? ext;
  const format = mimeGuess === "jpeg" ? "jpg" : mimeGuess;
  const aspectRatio = widthPx / heightPx;

  const checks: Check[] = [];

  // Format check
  const isJpg = format === "jpg" || format === "jpeg";
  checks.push({
    label: "Format",
    value: format.toUpperCase(),
    status: isJpg ? "pass" : "warn",
    hint: !isJpg ? "Most portals require JPG/JPEG. Convert before uploading." : undefined,
  });

  // File size
  if (fileSizeKb < 5) {
    checks.push({ label: "File size", value: `${fmt(fileSizeKb, 1)} KB`, status: "warn", hint: "Very small — may be rejected as too compressed." });
  } else if (fileSizeKb > 1000) {
    checks.push({ label: "File size", value: `${fmt(fileSizeKb, 0)} KB`, status: "fail", hint: "Exceeds typical portal limits (100–500 KB). Compress before uploading." });
  } else if (fileSizeKb > 200) {
    checks.push({ label: "File size", value: `${fmt(fileSizeKb, 0)} KB`, status: "warn", hint: "Large file — many portals cap at 50–200 KB. Verify the portal limit." });
  } else {
    checks.push({ label: "File size", value: `${fmt(fileSizeKb, 0)} KB`, status: "pass" });
  }

  // Pixel dimensions
  const minEdge = Math.min(widthPx, heightPx);
  const maxEdge = Math.max(widthPx, heightPx);
  let dimStatus: Status = "pass";
  let dimHint: string | undefined;
  if (minEdge < 100) {
    dimStatus = "fail"; dimHint = "Too small — image will appear blurry or pixelated. Minimum 150 px on each edge.";
  } else if (maxEdge > 6000) {
    dimStatus = "warn"; dimHint = "Very large — compress or downscale before uploading.";
  }
  checks.push({ label: "Dimensions", value: `${widthPx} × ${heightPx} px`, status: dimStatus, hint: dimHint });

  // Aspect ratio — classify
  const arStr = `${fmt(aspectRatio, 2)} (${widthPx}:${heightPx})`;
  const passportAr = 35 / 45; // ≈ 0.778
  const squareAr = 1.0;
  const arDiff = (target: number) => Math.abs(aspectRatio - target) / target;
  let arStatus: Status = "warn";
  let arHint: string | undefined;
  if (arDiff(passportAr) < 0.02) {
    arStatus = "pass"; arHint = "35×45 mm passport / exam ratio.";
  } else if (arDiff(squareAr) < 0.02) {
    arStatus = "pass"; arHint = "Square (1:1) — suitable for LinkedIn, some visa portals.";
  } else if (arDiff(20 / 23) < 0.02) {
    arStatus = "pass"; arHint = "200×230 px exam pattern (standard IBPS/SSC ratio).";
  } else {
    arHint = "Non-standard ratio. Check exam notification for required pixel dimensions.";
  }
  checks.push({ label: "Aspect ratio", value: arStr, status: arStatus, hint: arHint });

  // Match against portal presets
  const matchingPortals: string[] = [];
  for (const key of PORTAL_KEYS) {
    const spec = PORTAL_PRESETS[key];
    const kbOk = fileSizeKb <= spec.photoLimitKb &&
      (spec.photoMinKb === undefined || fileSizeKb >= spec.photoMinKb);
    const wOk = spec.photoWidthPx === undefined || widthPx === spec.photoWidthPx;
    const hOk = spec.photoHeightPx === undefined || heightPx === spec.photoHeightPx;
    if (kbOk && wOk && hOk) {
      matchingPortals.push(spec.name);
    }
  }

  return {
    filename: file.name,
    fileSizeKb,
    widthPx,
    heightPx,
    format,
    aspectRatio,
    checks,
    matchingPortals,
  };
}

const STATUS_ICON = {
  pass: <CheckCircle2 className="h-4 w-4 text-green-600" strokeWidth={2} />,
  fail: <XCircle className="h-4 w-4 text-red-500" strokeWidth={2} />,
  warn: <AlertCircle className="h-4 w-4 text-amber-500" strokeWidth={2} />,
};

const STATUS_TEXT = {
  pass: "text-green-700 dark:text-green-400",
  fail: "text-red-600 dark:text-red-400",
  warn: "text-amber-700 dark:text-amber-400",
};

export function PhotoValidatorTool() {
  const [result, setResult] = React.useState<ValidationResult | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const prevPreviewRef = React.useRef<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    track({ name: "tool_view", tool: "photo-validator" });
  }, []);

  React.useEffect(() => {
    const prev = prevPreviewRef.current;
    prevPreviewRef.current = previewUrl;
    if (prev && prev !== previewUrl) URL.revokeObjectURL(prev);
  }, [previewUrl]);
  React.useEffect(() => {
    return () => { if (prevPreviewRef.current) URL.revokeObjectURL(prevPreviewRef.current); };
  }, []);

  const processFile = React.useCallback((file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const r = runValidation(file, img.naturalWidth, img.naturalHeight);
      setResult(r);
      setPreviewUrl(objectUrl);
      track({ name: "tool_success", tool: "photo-validator" });
    };
    img.onerror = () => URL.revokeObjectURL(objectUrl);
    img.src = objectUrl;
  }, []);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) processFile(file);
  }, [processFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const reset = () => {
    setResult(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (!result) {
    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
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
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        <p className="text-base font-medium text-foreground">Drop your photo here</p>
        <p className="text-sm text-muted-foreground">
          JPG, PNG, WebP accepted · nothing is uploaded to any server
        </p>
        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
          Choose file
        </Button>
      </div>
    );
  }

  const overallStatus: Status = result.checks.some(c => c.status === "fail")
    ? "fail"
    : result.checks.some(c => c.status === "warn")
    ? "warn"
    : "pass";

  const overallLabel = {
    pass: "Looks good",
    warn: "Check before uploading",
    fail: "Issues found",
  }[overallStatus];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Validated photo"
            className="h-24 w-20 flex-shrink-0 rounded-md border border-hairline object-cover shadow-sm"
          />
        )}
        <div>
          <p className="text-sm font-medium text-foreground">{result.filename}</p>
          <div className="mt-1 flex items-center gap-2">
            {STATUS_ICON[overallStatus]}
            <span className={`text-sm font-semibold ${STATUS_TEXT[overallStatus]}`}>{overallLabel}</span>
          </div>
        </div>
      </div>

      {/* Checks table */}
      <div className="overflow-hidden rounded-xl border border-hairline">
        {result.checks.map((check, i) => (
          <div
            key={check.label}
            className={`flex items-start gap-3 px-4 py-3 ${i !== 0 ? "border-t border-hairline" : ""}`}
          >
            <span className="mt-0.5 flex-shrink-0">{STATUS_ICON[check.status]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <span className="text-sm font-medium text-foreground">{check.label}</span>
                <span className={`text-sm font-mono ${STATUS_TEXT[check.status]}`}>{check.value}</span>
              </div>
              {check.hint && (
                <p className="mt-0.5 text-xs text-muted-foreground">{check.hint}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Portal match summary */}
      {result.matchingPortals.length > 0 ? (
        <div className="rounded-xl border border-green-200 bg-green-50/60 px-4 py-3 dark:border-green-800 dark:bg-green-950/30">
          <p className="mb-1.5 text-sm font-semibold text-green-800 dark:text-green-300">
            Passes limits for {result.matchingPortals.length} portal{result.matchingPortals.length > 1 ? "s" : ""}
          </p>
          <p className="text-xs text-green-700 dark:text-green-400 line-clamp-3">
            {result.matchingPortals.slice(0, 8).join(" · ")}
            {result.matchingPortals.length > 8 && ` · +${result.matchingPortals.length - 8} more`}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            No exact preset match
          </p>
          <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
            The file doesn&apos;t match the stored pixel dimensions or KB limits for any preset.
            Use the <a href="/tools/resize-kb/" className="underline underline-offset-2">resize-to-KB</a> or{" "}
            <a href="/tools/resize-dimensions/" className="underline underline-offset-2">resize-dimensions</a> tool to adjust,
            then validate again.
          </p>
        </div>
      )}

      <Button variant="outline" size="sm" onClick={reset}>
        <RefreshCcw className="h-4 w-4" strokeWidth={1.75} />
        Validate another file
      </Button>
    </div>
  );
}
