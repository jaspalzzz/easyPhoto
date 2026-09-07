"use client";

import * as React from "react";
import type { Point, Quad } from "@/lib/perspective";
import { isConvexQuad } from "@/lib/perspective";

/**
 * Four draggable corner handles laid over a photograph.
 *
 * Deliberately built from real <button> elements positioned over an <img>
 * rather than drawn into a canvas: handles are then focusable, labelled for
 * screen readers, and nudgeable with the arrow keys for free. Canvas hit
 * testing would have given us none of that.
 *
 * Coordinates are in *image* pixels throughout (matching `loadImageFromFile`'s
 * reported size) and converted to percentages only for layout, so the overlay
 * stays correct at any rendered width.
 */

const CORNER_LABELS = [
  "Top-left corner",
  "Top-right corner",
  "Bottom-right corner",
  "Bottom-left corner",
] as const;

/** Arrow-key step, as a fraction of the image's longest edge. */
const NUDGE_RATIO = 0.01;
/** Shift+arrow for fine positioning. */
const FINE_NUDGE_RATIO = 0.002;

export interface CornerAdjusterProps {
  src: string;
  /** Natural dimensions of `src`, in pixels. */
  width: number;
  height: number;
  value: Quad;
  onChange: (quad: Quad) => void;
  disabled?: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function CornerAdjuster({
  src,
  width,
  height,
  value,
  onChange,
  disabled = false,
}: CornerAdjusterProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState<number | null>(null);

  const valid = isConvexQuad(value);

  // Holding an arrow key fires faster than React re-renders, so several moves
  // can run in a single tick. Reading `value` directly would make each of them
  // start from the same stale quad and silently overwrite the others — the
  // corner would creep one step instead of gliding. Chaining through a ref lets
  // successive moves build on each other; the render assignment below keeps it
  // in step with whatever the parent actually committed.
  const latestRef = React.useRef<Quad>(value);
  latestRef.current = value;

  const moveCorner = React.useCallback(
    (index: number, next: Point) => {
      const updated = latestRef.current.map((p, i) =>
        i === index
          ? {
              x: clamp(next.x, 0, width),
              y: clamp(next.y, 0, height),
            }
          : p
      ) as unknown as Quad;
      latestRef.current = updated;
      onChange(updated);
    },
    [onChange, width, height]
  );

  const pointerToImage = React.useCallback(
    (clientX: number, clientY: number): Point => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
      return {
        x: ((clientX - rect.left) / rect.width) * width,
        y: ((clientY - rect.top) / rect.height) * height,
      };
    },
    [width, height]
  );

  const handleKeyDown = (index: number) => (event: React.KeyboardEvent) => {
    const deltas: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault();
    const step =
      Math.max(width, height) *
      (event.shiftKey ? FINE_NUDGE_RATIO : NUDGE_RATIO);
    // Read the live quad, not the render-time one, so a held arrow key
    // accumulates instead of repeatedly re-applying one step from the same
    // starting point.
    const corner = latestRef.current[index];
    moveCorner(index, {
      x: corner.x + delta[0] * step,
      y: corner.y + delta[1] * step,
    });
  };

  const polygon = value.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="relative select-none overflow-hidden rounded-lg border border-hairline-strong bg-paper"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Photographed document. Drag the four corner handles onto the page edges."
          className="block w-full"
          draggable={false}
        />

        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {/* Everything outside the quad is dimmed, so the crop reads at a glance. */}
          <defs>
            <mask id="corner-adjuster-mask">
              <rect x="0" y="0" width={width} height={height} fill="white" />
              <polygon points={polygon} fill="black" />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="rgba(0,0,0,0.45)"
            mask="url(#corner-adjuster-mask)"
          />
          <polygon
            points={polygon}
            fill="none"
            stroke={valid ? "#F4C63F" : "#DC2626"}
            strokeWidth={Math.max(2, Math.min(width, height) * 0.004)}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {value.map((corner, index) => (
          <button
            key={CORNER_LABELS[index]}
            type="button"
            disabled={disabled}
            aria-label={`${CORNER_LABELS[index]}. Use the arrow keys to move it, hold Shift for finer steps.`}
            onKeyDown={handleKeyDown(index)}
            onPointerDown={(event) => {
              if (disabled) return;
              // preventDefault stops the image being dragged and text being
              // selected mid-drag — but it also suppresses the browser's own
              // focus-on-click, which would leave the arrow-key nudge dead
              // right after grabbing a handle. So focus it explicitly.
              event.preventDefault();
              event.currentTarget.focus();
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging(index);
            }}
            onPointerMove={(event) => {
              if (dragging !== index) return;
              moveCorner(index, pointerToImage(event.clientX, event.clientY));
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId);
              setDragging(null);
            }}
            onPointerCancel={() => setDragging(null)}
            style={{
              left: `${(corner.x / width) * 100}%`,
              top: `${(corner.y / height) * 100}%`,
            }}
            className="absolute -ml-4 -mt-4 h-8 w-8 cursor-grab touch-none rounded-full border-2 border-white bg-brand shadow-md ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
          />
        ))}
      </div>

      {!valid && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          The corners cross over each other. Drag them back so the outline forms
          a four-sided shape.
        </p>
      )}
    </div>
  );
}
