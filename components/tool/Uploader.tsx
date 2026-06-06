"use client";

import * as React from "react";
import { UploadCloud, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploaderProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

/**
 * File / drag-drop input. The selected file is read in-memory by the caller —
 * it is NEVER uploaded to any server.
 */
export function Uploader({ onFile, disabled }: UploaderProps) {
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
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors",
        dragging ? "border-primary bg-accent" : "border-input hover:bg-accent/50",
        disabled && "pointer-events-none opacity-60"
      )}
    >
      <UploadCloud className="h-10 w-10 text-muted-foreground" />
      <div>
        <p className="font-medium">Drop a photo here, or click to choose</p>
        <p className="text-sm text-muted-foreground">
          JPG, PNG or HEIC · a clear, front-facing photo works best
        </p>
      </div>
      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Processed in your browser — never uploaded
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
