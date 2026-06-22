"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Interactive before/after comparison slider (drag the handle to reveal).
 * Left of the handle = "before" (the selfie); right = "after" (compliant photo).
 *
 * The revealed (top) layer is clipped to a width %, and its image is sized to
 * the full container width via container-query units (100cqw) so it never
 * squishes as the clip changes. Pointer Events unify mouse + touch; arrow keys
 * move the handle for keyboard users.
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Your selfie",
  afterLabel = "Compliant",
  caption,
  className = "",
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);
  const [pct, setPct] = React.useState(50);

  const updateFromClientX = React.useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPct((x / rect.width) * 100);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    ref.current?.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };
  const endDrag = () => { dragging.current = false; };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") { setPct((p) => Math.max(0, p - 4)); e.preventDefault(); }
    if (e.key === "ArrowRight") { setPct((p) => Math.min(100, p + 4)); e.preventDefault(); }
  };

  return (
    <figure className={cn("mx-auto w-full max-w-[260px]", className)}>
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare your selfie with the compliant photo"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        className="lift-card relative aspect-[4/5] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border border-hairline [container-type:inline-size] [touch-action:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {/* AFTER (full, underneath) — compliant photo */}
        <div className="absolute inset-0">
          <img
            src={afterSrc}
            alt="Compliant passport photo after processing"
            className="h-full w-full object-cover object-top"
            draggable={false}
          />
        </div>

        {/* BEFORE (clipped from left) — original selfie */}
        <div
          className="absolute inset-0 z-[2] overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          <img
            src={beforeSrc}
            alt="Original selfie before processing"
            className="h-full w-[100cqw] max-w-none object-cover object-top"
            draggable={false}
          />
        </div>

        {/* Badges — anchored to the frame (never clipped by the wipe) */}
        <span className="pointer-events-none absolute left-3 top-3 z-[6] whitespace-nowrap rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          ✕ {beforeLabel}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 z-[6] whitespace-nowrap rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          ✓ {afterLabel}
        </span>

        {/* Handle */}
        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-cta shadow-[0_0_10px_hsl(45_88%_60%/0.6)]"
          style={{ left: `${pct}%` }}
        >
          <span
            className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-cta text-[hsl(var(--cta-foreground))] shadow-md"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={3} />
            <ChevronRight className="-ml-1 h-3.5 w-3.5" strokeWidth={3} />
          </span>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
