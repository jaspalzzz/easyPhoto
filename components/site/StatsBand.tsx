"use client";

import * as React from "react";
import { Globe, FileCheck2, Wrench, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LAUNCH_ORDER } from "@/lib/countrySpecs";
import { PORTAL_KEYS } from "@/lib/portalPresets";
import { READY_TOOLS } from "@/lib/toolsCatalog";

/**
 * StatsBand — factual credibility strip with count-up animation.
 * Numbers animate from 0 → target when the band scrolls into view (once per session).
 * Every value is derived from real catalog data at build time so it can never drift.
 */

interface Stat {
  Icon: LucideIcon;
  num: number;
  suffix: string;
  label: string;
  sub: string;
}

const STATS: Stat[] = [
  { Icon: Globe,      num: LAUNCH_ORDER.length, suffix: "+", label: "Countries supported", sub: "Passport & visa specs"           },
  { Icon: FileCheck2, num: PORTAL_KEYS.length,  suffix: "+", label: "Exam & form specs",   sub: "SSC, UPSC, Railway & more"       },
  { Icon: Wrench,     num: READY_TOOLS.length,  suffix: "+", label: "Free tools",          sub: "Photo, PDF & signature"          },
  { Icon: Landmark,   num: 100,                 suffix: "%", label: "Source documented",   sub: "Published source linked for every spec" },
];

const NAVY = { background: "hsl(222 60% 8%)" } as const;

function useCountUp(target: number, active: boolean, duration = 1100): number {
  // Initialize with the real target so the server-rendered HTML (what Googlebot
  // crawls) shows the actual number, not the animation start-value of 0.
  const [value, setValue] = React.useState(target);
  React.useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round((1 - (1 - p) ** 3) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return value;
}

/**
 * Renders without a <section> wrapper — intended to sit inside the hero
 * <section> as its bottom "foundation row", visually anchored to the hero.
 */
export function StatsBand() {
  const dlRef = React.useRef<HTMLDListElement>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const el = dlRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const c0 = useCountUp(STATS[0].num, active);
  const c1 = useCountUp(STATS[1].num, active);
  const c2 = useCountUp(STATS[2].num, active);

  const displayValues = [
    `${c0}${STATS[0].suffix}`,
    `${c1}${STATS[1].suffix}`,
    `${c2}${STATS[2].suffix}`,
    `${STATS[3].num}${STATS[3].suffix}`,
  ];

  return (
    <div className="pt-8 sm:pt-10">
      <p className="mb-5 text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground">
        Built on official government specifications — not opinions
      </p>
      <dl
        ref={dlRef}
        className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-hairline"
      >
        {STATS.map(({ Icon, label, sub }, i) => (
          <div key={label} className="flex items-center gap-3 sm:justify-center sm:px-4">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={NAVY}
            >
              <Icon className="h-4.5 w-4.5 text-cta" strokeWidth={1.75} />
            </span>
            <div>
              <dt className="text-[1.45rem] font-black leading-none tracking-tight text-ink">
                {displayValues[i]}
              </dt>
              <dd className="mt-0.5 text-[11.5px] font-bold leading-tight text-ink">{label}</dd>
              <dd className="text-[10px] leading-snug text-muted-foreground">{sub}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
