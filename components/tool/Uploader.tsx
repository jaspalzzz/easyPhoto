"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CropMarks } from "@/components/site/CropMarks";

interface UploaderProps {
  onFile: (file: File) => void;
  disabled?: boolean;
  /** Extra classes for the dropzone (e.g. a taller hero variant). */
  className?: string;
}

/**
 * File / drag-drop input, framed like a photo being aligned under crop marks.
 * The selected file is read in-memory by the caller — NEVER uploaded.
 */
export function Uploader({ onFile, disabled, className }: UploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const pick = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) onFile(file);
  };

  return (
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
        <p className="text-[15px] font-medium text-foreground">
          Drop a photo, or click to browse
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          A clear, front-facing photo works best
        </p>
      </div>
      <p className="spec mt-1 normal-case tracking-[0.04em]">
        JPG · PNG · HEIC &nbsp;·&nbsp; processed on your device, never uploaded
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files)}
      />
    </div>
  );
}
