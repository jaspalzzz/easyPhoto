"use client";

import * as React from "react";
import type { SignatureInkColor } from "@/lib/signature";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

const INK_COLOUR_PRESETS: Array<{
  value: SignatureInkColor;
  label: string;
  swatch?: string;
}> = [
  { value: "original", label: "Original" },
  { value: "black", label: "Black", swatch: "#000000" },
  { value: "dark-blue", label: "Dark blue", swatch: "#0b2a6f" },
  { value: "blue", label: "Blue", swatch: "#0033cb" },
  { value: "red", label: "Red", swatch: "#b42318" },
  { value: "custom", label: "Custom" },
];

export interface SignatureInkControlModel {
  inkColor: SignatureInkColor;
  setInkColor: React.Dispatch<React.SetStateAction<SignatureInkColor>>;
  customInkColor: string;
  setCustomInkColor: React.Dispatch<React.SetStateAction<string>>;
  inkContrast: number;
  setInkContrast: React.Dispatch<React.SetStateAction<number>>;
  strokeWidth: number;
  setStrokeWidth: React.Dispatch<React.SetStateAction<number>>;
  processedInkContrast: number;
  processedStrokeWidth: number;
}

/** Shared state and debouncing for every signature-cleaning workflow. */
export function useSignatureInkControls(debounceMs = 150): SignatureInkControlModel {
  const [inkColor, setInkColor] = React.useState<SignatureInkColor>("original");
  const [customInkColor, setCustomInkColor] = React.useState("#0033cb");
  const [inkContrast, setInkContrast] = React.useState(1.0);
  const [strokeWidth, setStrokeWidth] = React.useState(0);
  const processedInkContrast = useDebouncedValue(inkContrast, debounceMs);
  const processedStrokeWidth = useDebouncedValue(strokeWidth, debounceMs);

  return {
    inkColor,
    setInkColor,
    customInkColor,
    setCustomInkColor,
    inkContrast,
    setInkContrast,
    strokeWidth,
    setStrokeWidth,
    processedInkContrast,
    processedStrokeWidth,
  };
}

export function SignatureInkControls({
  controls,
  idPrefix = "sig-ink",
}: {
  controls: SignatureInkControlModel;
  idPrefix?: string;
}) {
  const {
    inkColor,
    setInkColor,
    customInkColor,
    setCustomInkColor,
    inkContrast,
    setInkContrast,
    strokeWidth,
    setStrokeWidth,
  } = controls;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h4 className="eyebrow text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ink Adjustments
        </h4>
      </div>

      <div className="space-y-2">
        <span className="block text-xs font-medium text-muted-foreground">Ink colour</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {INK_COLOUR_PRESETS.map((preset) => (
            <button
              id={`${idPrefix}-color-${preset.value}`}
              key={preset.value}
              type="button"
              aria-pressed={inkColor === preset.value}
              onClick={() => setInkColor(preset.value)}
              className={`flex min-h-10 items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                inkColor === preset.value
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-hairline bg-background hover:bg-accent/40"
              }`}
            >
              {preset.swatch ? (
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-full border border-ink/20"
                  style={{ backgroundColor: preset.swatch }}
                />
              ) : null}
              {preset.label}
            </button>
          ))}
        </div>
        {inkColor === "custom" ? (
          <label className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-hairline bg-background px-3 py-2 text-xs">
            <span className="font-medium text-foreground">Choose custom colour</span>
            <span className="flex items-center gap-2 font-mono text-muted-foreground">
              {customInkColor.toUpperCase()}
              <input
                id={`${idPrefix}-custom-colour`}
                type="color"
                value={customInkColor}
                onChange={(event) => setCustomInkColor(event.target.value)}
                className="h-8 w-11 cursor-pointer rounded border border-hairline bg-transparent p-0.5"
              />
            </span>
          </label>
        ) : null}
        <p className="text-xs leading-relaxed text-muted-foreground">
          Choose the ink colour requested by the current form; requirements vary by portal.
        </p>
      </div>

      <label className="block text-sm">
        <span className="mb-1 flex items-center justify-between">
          <span className="eyebrow">Stroke darkness</span>
          <span className="font-mono text-xs font-semibold text-brand">
            {inkContrast.toFixed(1)}x
          </span>
        </span>
        <input
          id={`${idPrefix}-contrast`}
          type="range"
          min={1.0}
          max={3.0}
          step={0.1}
          value={inkContrast}
          onChange={(event) => setInkContrast(Number(event.target.value))}
          className="w-full cursor-pointer accent-brand"
        />
        <span className="mt-0.5 block text-xs text-muted-foreground">
          Strengthen faint strokes without changing their width.
        </span>
      </label>

      <label className="block text-sm">
        <span className="mb-1 flex items-center justify-between">
          <span className="eyebrow">Stroke width</span>
          <span className="font-mono text-xs font-semibold text-brand">
            {strokeWidth === 0 ? "Original" : `+${strokeWidth}px`}
          </span>
        </span>
        <input
          id={`${idPrefix}-stroke-width`}
          type="range"
          min={0}
          max={6}
          step={1}
          value={strokeWidth}
          onChange={(event) => setStrokeWidth(Number(event.target.value))}
          className="w-full cursor-pointer accent-brand"
        />
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
          Expand thin extracted strokes. Start with +1px or +2px to preserve the signature shape.
        </span>
      </label>
    </div>
  );
}
