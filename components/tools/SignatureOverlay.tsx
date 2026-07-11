"use client";

import * as React from "react";
import { Trash2, X } from "lucide-react";

export interface Placement {
  x: number; // percentage (0-100) relative to parent width
  y: number; // percentage (0-100) relative to parent height
  width: number; // percentage (5-100) relative to parent width
  height: number; // percentage (5-100) relative to parent height
  /**
   * Clockwise rotation in degrees around the placement's centre. Optional so
   * existing consumers (and SignPdf, which does not apply rotation on export)
   * keep working unchanged; treated as 0 when absent.
   */
  rotation?: number;
}

interface SignatureOverlayProps {
  signatureUrl: string;
  placement: Placement;
  onPlacementChange: (placement: Placement) => void;
  onDelete: () => void;
  parentRef: React.RefObject<HTMLDivElement | null>;
  /** Show the rotate handle + enable rotation keys. Off by default. */
  allowRotation?: boolean;
}

export function SignatureOverlay({
  signatureUrl,
  placement,
  onPlacementChange,
  onDelete,
  parentRef,
  allowRotation = false,
}: SignatureOverlayProps) {
  const [dragState, setDragState] = React.useState<{
    type: "drag" | "resize" | "rotate";
    startX: number;
    startY: number;
    startPlacement: Placement;
  } | null>(null);

  // Aspect ratio of the signature image (width / height)
  const [aspectRatio, setAspectRatio] = React.useState<number | null>(null);

  // Ref to ensure the height-initialization side-effect runs only once per
  // signatureUrl change (guards against stale-closure loops that would occur
  // if placement / onPlacementChange were added to the dependency array).
  const hasInitializedRef = React.useRef(false);

  // Stable refs so the image-load callback always reads the latest placement
  // and callback without them appearing in the effect dependency array.
  const placementRef = React.useRef(placement);
  const onPlacementChangeRef = React.useRef(onPlacementChange);
  React.useLayoutEffect(() => {
    placementRef.current = placement;
    onPlacementChangeRef.current = onPlacementChange;
  });

  // Load image to determine aspect ratio
  React.useEffect(() => {
    // Reset the guard whenever the signature URL changes so a fresh image
    // always gets its height initialised.
    hasInitializedRef.current = false;

    const img = new Image();
    img.src = signatureUrl;
    img.onload = () => {
      setAspectRatio(img.width / img.height);

      // Initialise relative height based on signature aspect ratio — only
      // once per URL so we never enter an infinite update cycle.
      if (!hasInitializedRef.current && parentRef.current) {
        hasInitializedRef.current = true;
        const parentRect = parentRef.current.getBoundingClientRect();
        const parentAspect = parentRect.width / parentRect.height;

        // Capture current placement values at the moment the image loads via
        // the ref to avoid adding `placement` to the dependency array.
        const currentPlacement = placementRef.current;

        // Calculate new height percent to match aspect ratio:
        // width% / height% = imgW / imgH * parentH / parentW
        const desiredHeight =
          currentPlacement.width / (img.width / img.height) * parentAspect;
        onPlacementChangeRef.current({
          ...currentPlacement,
          height: Math.min(100 - currentPlacement.y, desiredHeight),
        });
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatureUrl]);

  const handlePointerDown = (
    e: React.MouseEvent | React.TouchEvent,
    type: "drag" | "resize" | "rotate"
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
      } else if (dragState.type === "rotate") {
        // Rotation is absolute (angle from the box centre to the pointer), so
        // there is no accumulation drift. The box rotates around its centre, so
        // the centre is stable while rotating.
        const centerX =
          parentRect.left + ((placement.x + placement.width / 2) / 100) * parentW;
        const centerY =
          parentRect.top + ((placement.y + placement.height / 2) / 100) * parentH;
        // Handle sits directly above centre (12 o'clock) at 0°, so add 90°.
        const angle =
          Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90;
        // Normalise to (-180, 180] for a clean readout.
        const normalized = ((Math.round(angle) + 180) % 360 + 360) % 360 - 180;
        onPlacementChange({ ...placement, rotation: normalized });
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
      style={{
        position: "absolute",
        left: `${placement.x}%`,
        top: `${placement.y}%`,
        width: `${placement.width}%`,
        height: `${placement.height}%`,
        transform: `rotate(${placement.rotation ?? 0}deg)`,
        transformOrigin: "center center",
        border: "1.5px dashed var(--brand)",
        cursor: "move",
        userSelect: "none",
        touchAction: "none",
      }}
      onMouseDown={(e) => handlePointerDown(e, "drag")}
      onTouchStart={(e) => handlePointerDown(e, "drag")}
      tabIndex={0}
      role="group"
      aria-label={
        allowRotation
          ? "Signature overlay — arrow keys reposition, [ and ] rotate"
          : "Signature overlay — use arrow keys to reposition"
      }
      onKeyDown={(e) => {
        if (allowRotation && (e.key === "[" || e.key === "]")) {
          e.preventDefault();
          const delta = e.key === "]" ? 1 : -1;
          const next = ((placement.rotation ?? 0) + delta + 180 + 360) % 360 - 180;
          onPlacementChange({ ...placement, rotation: next });
          return;
        }
        const STEP = 1; // 1% per key press
        let newX = placement.x;
        let newY = placement.y;
        if (e.key === "ArrowLeft") { e.preventDefault(); newX = Math.max(0, placement.x - STEP); }
        else if (e.key === "ArrowRight") { e.preventDefault(); newX = Math.min(100 - placement.width, placement.x + STEP); }
        else if (e.key === "ArrowUp") { e.preventDefault(); newY = Math.max(0, placement.y - STEP); }
        else if (e.key === "ArrowDown") { e.preventDefault(); newY = Math.min(100 - placement.height, placement.y + STEP); }
        else return;
        onPlacementChange({ ...placement, x: newX, y: newY });
      }}
    >
      <img
        src={signatureUrl}
        alt="Placed Signature"
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
      />

      {/* Resize Handle: Bottom Right */}
      <div
        className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 bg-brand border border-white cursor-se-resize rounded-full shadow-sm"
        onMouseDown={(e) => handlePointerDown(e, "resize")}
        onTouchStart={(e) => handlePointerDown(e, "resize")}
      />

      {/* Rotate Handle: Top Centre (drag to spin; [ / ] fine-tune 1°) */}
      {allowRotation && (
        <>
          {/* Connector line from the box edge up to the handle */}
          <div className="pointer-events-none absolute left-1/2 -top-6 h-6 w-px -translate-x-1/2 bg-brand/60" />
          <div
            className="absolute left-1/2 -top-[30px] h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-white bg-brand shadow-sm"
            style={{ cursor: dragState?.type === "rotate" ? "grabbing" : "grab" }}
            onMouseDown={(e) => handlePointerDown(e, "rotate")}
            onTouchStart={(e) => handlePointerDown(e, "rotate")}
            title="Drag to rotate ( [ and ] to fine-tune )"
            aria-label="Rotate signature"
          />
          {/* Live angle readout while rotating or when tilted */}
          {(dragState?.type === "rotate" || (placement.rotation ?? 0) !== 0) && (
            <span className="pointer-events-none absolute left-1/2 -top-[52px] -translate-x-1/2 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-white shadow-sm">
              {Math.round(placement.rotation ?? 0)}°
            </span>
          )}
        </>
      )}

      {/* Delete button: Top Right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute -top-3 -right-3 h-5 w-5 bg-destructive hover:bg-red-700 text-white rounded-full flex items-center justify-center border border-white shadow shadow-black/25 transition-colors"
        title="Remove signature"
        aria-label="Remove signature"
      >
        <X className="h-3 w-3" strokeWidth={2.5} />
      </button>
    </div>
  );
}
