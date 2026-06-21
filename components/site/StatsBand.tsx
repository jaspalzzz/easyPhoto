import { Globe, FileCheck2, Wrench, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LAUNCH_ORDER } from "@/lib/countrySpecs";
import { PORTAL_KEYS } from "@/lib/portalPresets";
import { READY_TOOLS } from "@/lib/toolsCatalog";

/**
 * StatsBand — factual credibility strip (the honest alternative to fake star
 * ratings / "trusted by N users" claims, which we don't have a login to back).
 * Every number is derived from real catalog data at build time, so it can't
 * drift out of sync with what the site actually supports.
 */
interface Stat { Icon: LucideIcon; value: string; label: string; sub: string; }

const STATS: Stat[] = [
  { Icon: Globe,      value: `${LAUNCH_ORDER.length}+`, label: "Countries supported", sub: "Passport & visa specs"          },
  { Icon: FileCheck2, value: `${PORTAL_KEYS.length}+`,  label: "Exam & form specs",   sub: "SSC, UPSC, Railway & more"      },
  { Icon: Wrench,     value: `${READY_TOOLS.length}+`,  label: "Free tools",          sub: "Photo, PDF & signature"        },
  { Icon: Landmark,   value: "100%",                    label: "Government-sourced",  sub: "Every spec from official portals" },
];

const NAVY = { background: "hsl(222 60% 8%)" } as const;

/**
 * Renders without a <section> wrapper — intended to sit inside the hero
 * <section> as its bottom "foundation row", visually anchored to the hero.
 */
export function StatsBand() {
  return (
    <div className="pt-8 sm:pt-10">
      <p className="mb-5 text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground">
        Built on official government specifications — not opinions
      </p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-hairline">
        {STATS.map(({ Icon, value, label, sub }) => (
          <div key={label} className="flex items-center gap-3 sm:justify-center sm:px-4">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={NAVY}
            >
              <Icon className="h-4.5 w-4.5 text-cta" strokeWidth={1.75} />
            </span>
            <div>
              <dt className="text-[1.45rem] font-black leading-none tracking-tight text-ink">
                {value}
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
