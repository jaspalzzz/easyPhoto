import { Check, X } from "lucide-react";
import type { CountrySpec } from "@/lib/countrySpecs";

/**
 * Visual head-size guide — the honest version of competitors' sample-photo
 * rows. Not AI faces (those read as fake): clean head-and-shoulders DIAGRAMS,
 * the way an official passport-office sheet shows it, sized correctly vs
 * incorrectly. Spec-aware: the "correct" card reflects THIS country's head %.
 */

/** A single framed silhouette. `frac` = head height as a fraction of the frame. */
function FrameDiagram({ frac, tone }: { frac: number; tone: "ok" | "bad" }) {
  const W = 120;
  const H = 150;
  const pad = 6;
  const innerTop = pad;
  const innerH = H - pad * 2;
  // Head: leave a top margin (smaller when the head is "too big").
  const topMargin = tone === "bad" && frac > 0.85 ? 2 : innerH * 0.07;
  const headH = frac * innerH;
  const headRy = headH / 2;
  const headRx = headH * 0.38;
  const cx = W / 2;
  const headCy = innerTop + topMargin + headRy;
  // Shoulders: a rounded trapezoid from just below the head to the frame bottom.
  const shTop = headCy + headRy * 0.78;
  const shW = headRx * 2.7;
  const frame = tone === "ok" ? "hsl(142 55% 38%)" : "hsl(0 70% 52%)";
  const fill = "hsl(32 10% 80%)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-hidden="true">
      <rect
        x={pad / 2}
        y={pad / 2}
        width={W - pad}
        height={H - pad}
        rx={6}
        fill="hsl(40 30% 98.5%)"
        stroke={frame}
        strokeWidth={2.5}
      />
      {/* shoulders */}
      <path
        d={`M ${cx - shW} ${H - pad}
            C ${cx - shW} ${shTop + 6}, ${cx - shW * 0.5} ${shTop}, ${cx} ${shTop}
            C ${cx + shW * 0.5} ${shTop}, ${cx + shW} ${shTop + 6}, ${cx + shW} ${H - pad} Z`}
        fill={fill}
      />
      {/* head */}
      <ellipse cx={cx} cy={headCy} rx={headRx} ry={headRy} fill={fill} />
    </svg>
  );
}

function Card({
  frac,
  tone,
  label,
}: {
  frac: number;
  tone: "ok" | "bad";
  label: string;
}) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <FrameDiagram frac={frac} tone={tone} />
        <span
          className={`absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full ${
            tone === "ok" ? "bg-[hsl(142_55%_38%)]" : "bg-[hsl(0_70%_52%)]"
          }`}
        >
          {tone === "ok" ? (
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          ) : (
            <X className="h-3 w-3 text-white" strokeWidth={3} />
          )}
        </span>
      </div>
      <p className="text-center text-xs leading-tight text-ink-soft">{label}</p>
    </div>
  );
}

export function HeadSizeGuide({ spec }: { spec: CountrySpec }) {
  const pct = spec.headPercentOfFrame;
  const band = pct ? `${pct.min}–${pct.max}%` : "the required band";
  // Draw the "correct" head at the middle of the spec's band (fallback 0.74).
  const correctFrac = pct ? (pct.min + pct.max) / 200 : 0.74;

  return (
    <section className="rounded-xl border border-hairline bg-card p-5">
      <h2 className="text-sm font-semibold tracking-tight text-ink">
        Get the head size right
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        For {spec.label}, your face should fill{" "}
        <strong className="text-ink">{band}</strong> of the photo — the maker
        does this automatically, but here&apos;s what it should look like.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:max-w-md">
        <Card frac={correctFrac} tone="ok" label="Correct head size" />
        <Card frac={0.45} tone="bad" label="Too small / far away" />
        <Card frac={0.96} tone="bad" label="Too close / cropped" />
      </div>
    </section>
  );
}
