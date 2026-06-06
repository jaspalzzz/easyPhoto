import { Check } from "lucide-react";

/** Soft, photo-like head-and-shoulders silhouette. */
function Portrait({
  className,
  cx = 50,
  headFill = "url(#skin)",
  bodyFill = "url(#cloth)",
}: {
  className?: string;
  cx?: number;
  headFill?: string;
  bodyFill?: string;
}) {
  return (
    <svg viewBox="0 0 100 120" className={className} preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cbd5e1" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#475569" />
          <stop offset="1" stopColor="#334155" />
        </linearGradient>
      </defs>
      <ellipse cx={cx} cy="44" rx="20" ry="23" fill={headFill} />
      <path
        d={`M${cx - 38} 120 C${cx - 38} 84 ${cx + 38} 84 ${cx + 38} 120 Z`}
        fill={bodyFill}
      />
    </svg>
  );
}

/**
 * Before → after product visual: a busy snapshot transforms into a compliant
 * passport photo with size guides + a green check. Light, animated, on-brand.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-sm select-none" aria-hidden>
      {/* BEFORE — tilted snapshot behind */}
      <div className="hero-float-slow absolute -left-2 top-10 w-36 -rotate-6 rounded-xl border bg-white p-1.5 shadow-lg sm:w-40">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-amber-200 via-rose-200 to-sky-200">
          <div className="aspect-[3/4]">
            {/* off-centre, "uncropped" subject */}
            <Portrait className="h-full w-full translate-x-3 translate-y-2" cx={60} />
          </div>
          <span className="absolute left-1.5 top-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white">
            Before
          </span>
        </div>
      </div>

      {/* AFTER — compliant photo in front */}
      <div className="hero-float relative ml-auto w-60 rounded-2xl border bg-white p-2 shadow-xl ring-1 ring-black/5 sm:w-64">
        <div className="relative overflow-hidden rounded-xl bg-white">
          <div className="aspect-square">
            <Portrait className="h-full w-full" cx={50} />
          </div>

          {/* head-height guides */}
          <span className="pointer-events-none absolute inset-x-3 top-[14%] border-t border-dashed border-brand/70" />
          <span className="pointer-events-none absolute inset-x-3 bottom-[16%] border-t border-dashed border-brand/70" />
          <span className="pointer-events-none absolute bottom-[16%] right-3 top-[14%] flex items-center">
            <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-brand-foreground">
              head ✓
            </span>
          </span>

          {/* shine sweep */}
          <span className="hero-shine pointer-events-none absolute inset-0" />

          {/* compliant badge */}
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-green-600 px-2 py-0.5 text-[11px] font-semibold text-white shadow">
            <Check className="h-3 w-3" strokeWidth={3} /> Compliant
          </span>
        </div>
        <div className="flex items-center justify-between px-1 pt-2 text-[11px] text-muted-foreground">
          <span>White background</span>
          <span className="font-medium text-foreground">51 × 51 mm</span>
        </div>
      </div>
    </div>
  );
}
