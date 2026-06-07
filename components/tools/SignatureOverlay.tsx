"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

export interface Placement {
  x: number; // percentage (0-100) relative to parent width
  y: number; // percentage (0-100) relative to parent height
  width: number; // percentage (5-100) relative to parent width
  height: number; // percentage (5-100) relative to parent height
}

interface SignatureOverlayProps {
  signatureUrl: string;
  placement: Placement;
  onPlacementChange: (placement: Placement) => void;
  onDelete: () => void;
  parentRef: React.RefObject<HTMLDivElement | null>;
}

export function SignatureOverlay({
  signatureUrl,
  placement,
  onPlacementChange,
  onDelete,
  parentRef,
}: SignatureOverlayProps) {
  const [dragState, setDragState] = React.useState<{
    type: "drag" | "resize";
    startX: number;
    startY: number;
    startPlacement: Placement;
  } | null>(null);

  // Aspect ratio of the signature image (width / height)
  const [aspectRatio, setAspectRatio] = React.useState<number | null>(null);

  // Load image to determine aspect ratio
  React.useEffect(() => {
    const img = new Image();
    img.src = signatureUrl;
    img.onload = () => {
      setAspectRatio(img.width / img.height);
      
      // Initialize relative height based on signature aspect ratio
      if (parentRef.current) {
        const parentRect = parentRef.current.getBoundingClientRect();
        const parentAspect = parentRect.width / parentRect.height;
        
        // Calculate new height percent to match aspect ratio:
        // width% / height% = imgW / imgH * parentH / parentW
        const desiredHeight = placement.width / (img.width / img.height) * parentAspect;
        onPlacementChange({
          ...placement,
          height: Math.min(100 - placement.y, desiredHeight),
        });
      }
    };
  }, [signatureUrl]);

  const handlePointerDown = (
    e: React.MouseEvent | React.TouchEvent,
    type: "drag" | "resize"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    setDragState({
      type,
      startX: clientX,
      startY: clientY,
      startPlacement: { ...placement },
    });
  };

  React.useEffect(() => {
    if (!dragState || !parentRef.current) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      
      let clientX: number;
      let clientY: number;

      if ("touches" in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const parentRect = parentRef.current!.getBoundingClientRect();
      const parentW = parentRect.width;
      const parentH = parentRect.height;

      const deltaX = clientX - dragState.startX;
      const deltaY = clientY - dragState.startY;

      const deltaXPercent = (deltaX / parentW) * 100;
      const deltaYPercent = (deltaY / parentH) * 100;

      if (dragState.type === "drag") {
        let newX = dragState.startPlacement.x + deltaXPercent;
        let newY = dragState.startPlacement.y + deltaYPercent;

        // Clamp inside parent container
        newX = Math.max(0, Math.min(100 - placement.width, newX));
        newY = Math.max(0, Math.min(100 - placement.height, newY));

        onPlacementChange({
          ...placement,
          x: newX,
          y: newY,
        });
      } else if (dragState.type === "resize") {
        // We resize based on deltaX, lock height ratio dynamically
        let newWidth = dragState.startPlacement.width + deltaXPercent;
        
        // Minimum width 5%, maximum width limited by starting coordinate x
        newWidth = Math.max(5, Math.min(100 - placement.x, newWidth));
        
        let newHeight = placement.height;
        if (aspectRatio) {
          const parentAspect = parentW / parentH;
          // height% = width% / (sigW / sigH) * parentH / parentW
          newHeight = newWidth / aspectRatio * parentAspect;
        }

        // Clamp height inside parent container
        if (placement.y + newHeight > 100) {
          newHeight = 100 - placement.y;
          // recalculate width to maintain aspect ratio
          if (aspectRatio) {
            const parentAspect = parentW / parentH;
            newWidth = newHeight * aspectRatio / parentAspect;
          }
        }

        onPlacementChange({
          ...placement,
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handlePointerUp = () => {
      setDragState(null);
    };

    // Listeners registered on document level for smooth tracking
    document.addEventListener("mousemove", handlePointerMove, { passive: false });
    document.addEventListener("mouseup", handlePointerUp);
    document.addEventListener("touchmove", handlePointerMove, { passive: false });
    document.addEventListener("touchend", handlePointerUp);

    return () => {
      document.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("mouseup", handlePointerUp);
      document.removeEventListener("touchmove", handlePointerMove);
      document.removeEventListener("touchend", handlePointerUp);
    };
  }, [dragState, placement, aspectRatio]);

  return (
    <div
      id="signature-overlay-box"
      style={{
        position: "absolute",
        left: `${placement.x}%`,
        top: `${placement.y}%`,
        width: `${placement.width}%`,
        height: `${placement.height}%`,
        border: "1.5px dashed var(--brand)",
        cursor: "move",
        userSelect: "none",
        touchAction: "none",
      }}
      onMouseDown={(e) => handlePointerDown(e, "drag")}
      onTouchStart={(e) => handlePointerDown(e, "drag")}
    >
      <img
        src={signatureUrl}
        alt="Placed Signature"
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
      />

      {/* Resize Handle: Bottom Right */}
      <div
        id="signature-overlay-resize-handle"
        className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 bg-brand border border-white cursor-se-resize rounded-full shadow-sm"
        onMouseDown={(e) => handlePointerDown(e, "resize")}
        onTouchStart={(e) => handlePointerDown(e, "resize")}
      />

      {/* Delete button: Top Right */}
      <button
        id="signature-overlay-delete-btn"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute -top-3 -right-3 h-5 w-5 bg-destructive hover:bg-red-700 text-white rounded-full flex items-center justify-center text-[10px] font-bold border border-white shadow shadow-black/25 transition-colors"
        title="Remove signature"
      >
        ✕
      </button>
    </div>
  );
}
