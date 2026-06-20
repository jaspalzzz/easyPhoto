"use client";

import * as React from "react";
import { Plus, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { CropMarks } from "@/components/site/CropMarks";
import { CameraCapture } from "./CameraCapture";

interface UploaderProps {
  onFile: (file: File) => void;
  disabled?: boolean;
  /** Extra classes for the dropzone (e.g. a taller hero variant). */
  className?: string;
  /** Primary call-to-action line. Defaults to photo-oriented copy. */
  title?: string;
  /** Secondary hint line. Override for non-photo inputs (e.g. signatures). */
  hint?: string;
  /**
   * Offer an in-browser "take a photo" option alongside upload. Enable for
   * photo capture (passport/visa maker, photo tools); leave off for non-photo
   * inputs like signature scans or documents.
   */
  allowCamera?: boolean;
}

/**
 * File / drag-drop input, framed like a photo being aligned under crop marks.
 * The selected file is read in-memory by the caller — NEVER uploaded.
 *
 * When `allowCamera` is set, a "Take a photo" affordance appears: the camera is
 * just another *source* of the same File, so the consumer's `onFile` handles
 * upload and capture identically.
 */
export function Uploader({
  onFile,
  disabled,
  className,
  title = "Drop a photo, or click to browse",
  hint = "A clear, front-facing photo works best",
  allowCamera = false,
}: UploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [camera, setCamera] = React.useState(false);

  const pick = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    // Accept images, plus HEIC by extension — iPhone/Android HEIC files often
    // arrive with an empty or non-"image/*" MIME type, so the type check alone
    // silently drops valid uploads. The pipeline decodes/validates downstream.
    const ok =
      file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
    if (ok) onFile(file);
  };

  if (camera) {
    return (
      <CameraCapture
        className={className}
        onCapture={(file) => {
          setCamera(false);
          onFile(file);
        }}
        onCancel={() => setCamera(false)}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled)
            inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) pick(e.dataTransfer.files);
        }}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border bg-card p-10 text-center transition-colors",
          dragging
            ? "border-brand bg-brand-soft/40"
            : "border-hairline-strong hover:border-ink/30 hover:bg-accent/40",
          disabled && "pointer-events-none opacity-60",
          className
        )}
      >
        <CropMarks
          size={18}
          inset={10}
          className={cn(
            "transition-opacity",
            dragging ? "opacity-100" : "opacity-60 group-hover:opacity-100"
          )}
        />
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-hairline-strong bg-paper text-ink-soft">
          <Plus className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-[15px] font-medium text-foreground">{title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{hint}</p>
        </div>
        <p className="spec mt-1 normal-case tracking-[0.04em]">
          JPG · PNG · HEIC &nbsp;·&nbsp; processed on your device, never uploaded
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.heic,.heif"
          className="hidden"
          onChange={(e) => pick(e.target.files)}
        />
      </div>

      {allowCamera && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-hairline" />
          <span className="uppercase tracking-wide">or</span>
          <span className="h-px flex-1 bg-hairline" />
        </div>
      )}

      {allowCamera && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setCamera(true)}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-md border border-hairline-strong bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-ink/30 hover:bg-accent/40",
            disabled && "pointer-events-none opacity-60"
          )}
        >
          <Camera className="h-4 w-4" strokeWidth={1.75} />
          Take a photo with your camera
        </button>
      )}
    </div>
  );
}
