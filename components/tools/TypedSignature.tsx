"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Dancing_Script, Great_Vibes, Sacramento } from "next/font/google";
import { Button } from "@/components/ui/button";
import { trimToContent } from "@/lib/signature";

/*
 * "Type your name" signatures. This module is imported only when the Type tab
 * is opened (see SignaturePad), so the handwriting fonts never load with the
 * page. next/font self-hosts them under /_next, which the CSP's font-src 'self'
 * already allows.
 */
const dancing = Dancing_Script({ subsets: ["latin"], weight: "600", display: "swap", preload: false });
const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap", preload: false });
const sacramento = Sacramento({ subsets: ["latin"], weight: "400", display: "swap", preload: false });

export const SIGNATURE_STYLES = [
  { id: "flowing", label: "Flowing", fontFamily: dancing.style.fontFamily },
  { id: "classic", label: "Classic", fontFamily: vibes.style.fontFamily },
  { id: "light", label: "Light", fontFamily: sacramento.style.fontFamily },
] as const;

const MAX_NAME_LENGTH = 40;
/** Large enough that the signature stays sharp when stretched over a photo. */
const RENDER_FONT_PX = 160;

/** Draw `name` in `fontFamily` and trim to the ink, as a transparent PNG data URL. */
export async function renderTypedSignature(name: string, fontFamily: string, color: string): Promise<string | null> {
  const text = name.trim();
  if (!text) return null;
  const font = `${RENDER_FONT_PX}px ${fontFamily}`;
  // Canvas text silently falls back to a default font if this one isn't loaded yet.
  await document.fonts.load(font, text);
  const measure = document.createElement("canvas").getContext("2d");
  if (!measure) throw new Error("Could not acquire 2D canvas context.");
  measure.font = font;
  const width = Math.ceil(measure.measureText(text).width + RENDER_FONT_PX);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = Math.ceil(RENDER_FONT_PX * 2);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not acquire 2D canvas context.");
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.fillText(text, RENDER_FONT_PX / 2, canvas.height / 2);
  const { canvas: trimmed, bbox } = trimToContent(canvas, { mode: "alpha", padding: 24 });
  return bbox ? trimmed.toDataURL("image/png") : null;
}

interface TypedSignatureProps {
  color: string;
  onSignatureReady: (dataUrl: string) => void;
  onCancel?: () => void;
}

export function TypedSignature({ color, onSignatureReady, onCancel }: TypedSignatureProps) {
  const [name, setName] = React.useState("");
  const [styleId, setStyleId] = React.useState<(typeof SIGNATURE_STYLES)[number]["id"]>("flowing");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const style = SIGNATURE_STYLES.find((s) => s.id === styleId) ?? SIGNATURE_STYLES[0];

  const apply = async () => {
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await renderTypedSignature(name, style.fontFamily, color);
      if (dataUrl) onSignatureReady(dataUrl);
    } catch (err) {
      console.error("[signature] could not draw the typed signature", err);
      setError("Couldn't draw this signature. Try again, or draw it instead.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <label className="block text-sm">
        <span className="eyebrow mb-1 block">Your name</span>
        <input
          id="sig-pad-type-name"
          type="text"
          value={name}
          maxLength={MAX_NAME_LENGTH}
          autoComplete="name"
          onChange={(e) => setName(e.target.value)}
          placeholder="Type your name"
          className="h-10 w-full rounded-md border border-hairline-strong bg-background px-3 text-[15px]"
        />
      </label>

      <fieldset>
        <legend className="eyebrow mb-1 block">Style</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {SIGNATURE_STYLES.map((s) => (
            <button
              key={s.id}
              id={`sig-pad-type-style-${s.id}`}
              type="button"
              aria-pressed={s.id === styleId}
              aria-label={`${s.label} handwriting`}
              onClick={() => setStyleId(s.id)}
              className={`h-16 truncate rounded-md border px-3 text-3xl transition-colors ${
                s.id === styleId ? "border-brand bg-brand-soft/30" : "border-hairline hover:bg-accent/40"
              }`}
              style={{ fontFamily: s.fontFamily, color }}
            >
              {name.trim() || "Your name"}
            </button>
          ))}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="border-l-2 border-destructive bg-destructive/5 py-2 pl-3 pr-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button id="sig-pad-type-cancel-btn" variant="outline" size="sm" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
        )}
        <Button
          id="sig-pad-type-apply-btn"
          variant="cta"
          size="sm"
          onClick={apply}
          disabled={!name.trim() || busy}
          className="w-full sm:w-auto"
        >
          <Check className="h-4 w-4" /> Use Typed Signature
        </Button>
      </div>
    </div>
  );
}
