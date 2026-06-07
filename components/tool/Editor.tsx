"use client";

import * as React from "react";
import { Cropper, type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CropRect } from "@/lib/headPositioning";

interface EditorProps {
  /** Image to crop — the bg-composited canvas (preferred) or the original. */
  src: string;
  /** print width / height — locks the crop box to the country's aspect ratio. */
  aspectRatio: number;
  /** Auto crop rect (source px) used to seed the crop box. */
  initialCrop: CropRect;
  onApply: (crop: CropRect) => void;
  onCancel: () => void;
}

/**
 * Optional manual fine-tune. The auto-crop from the engine is almost always
 * right; this lets the user nudge it. The crop box is aspect-locked to the
 * country's print ratio so the output proportions can never drift.
 */
export function Editor({
  src,
  aspectRatio,
  initialCrop,
  onApply,
  onCancel,
}: EditorProps) {
  const cropperRef = React.useRef<ReactCropperElement>(null);

  const seed = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.setData({
      x: initialCrop.sx,
      y: initialCrop.sy,
      width: initialCrop.sw,
      height: initialCrop.sh,
    });
  };

  const apply = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const d = cropper.getData(true); // rounded, natural-image coordinates
    onApply({ sx: d.x, sy: d.y, sw: d.width, sh: d.height });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-soft">
        Drag to reposition · drag a corner to resize. The box is locked to the
        required photo shape.
      </p>
      <div className="overflow-hidden rounded-md border border-hairline bg-paper">
        <Cropper
          ref={cropperRef}
          src={src}
          style={{ height: 380, width: "100%" }}
          aspectRatio={aspectRatio}
          viewMode={1}
          dragMode="move"
          autoCropArea={1}
          background={false}
          responsive
          checkOrientation={false}
          guides
          ready={seed}
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="cta" onClick={apply}>
          <Check className="h-4 w-4" strokeWidth={1.75} /> Apply crop
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4" strokeWidth={1.75} /> Cancel
        </Button>
      </div>
    </div>
  );
}
