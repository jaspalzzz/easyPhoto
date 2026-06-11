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
  const [box, setBox] = React.useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const seed = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.setData({
      x: initialCrop.sx,
      y: initialCrop.sy,
      width: initialCrop.sw,
      height: initialCrop.sh,
    });
    handleCrop();
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    const boxData = cropper.getCropBoxData();
    setBox({
      top: boxData.top,
      left: boxData.left,
      width: boxData.width,
      height: boxData.height,
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
        Drag to reposition · drag a corner to resize. Align your chin and head top to the overlay.
      </p>
      <div className="overflow-hidden rounded-md border border-hairline bg-paper relative">
        <Cropper
          ref={cropperRef}
          src={src}
          // Fixed 380px overflows small phones once the 64px header and the
          // controls are accounted for — cap to the viewport so the Apply
          // button stays reachable without scrolling mid-crop.
          style={{ height: "min(380px, 52vh)", width: "100%" }}
          aspectRatio={aspectRatio}
          viewMode={1}
          dragMode="move"
          autoCropArea={1}
          background={false}
          responsive
          checkOrientation={false}
          guides
          ready={seed}
          crop={handleCrop}
        />
        
        {box && (
          <svg
            style={{
              position: "absolute",
              pointerEvents: "none", // click-through
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
              zIndex: 10,
            }}
            viewBox="0 0 100 100"
          >
            {/* Biometric head shape guide */}
            <ellipse
              cx="50"
              cy="46"
              rx="23"
              ry="32"
              fill="none"
              stroke="#157F75"
              strokeWidth="1.2"
              strokeDasharray="2,2"
            />
            {/* Eye horizontal guideline */}
            <line
              x1="10"
              y1="40"
              x2="90"
              y2="40"
              stroke="#157F75"
              strokeWidth="0.8"
              strokeDasharray="2,2"
              opacity="0.7"
            />
            {/* Center alignment vertical guideline */}
            <line
              x1="50"
              y1="10"
              x2="50"
              y2="82"
              stroke="#157F75"
              strokeWidth="0.8"
              strokeDasharray="2,2"
              opacity="0.7"
            />
            <text
              x="50"
              y="9"
              textAnchor="middle"
              fill="#157F75"
              fontSize="4.5"
              fontWeight="bold"
            >
              ALIGN FACE TO OVAL
            </text>
          </svg>
        )}
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
