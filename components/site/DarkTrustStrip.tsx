import { Cpu, CloudOff, UserX, ServerOff, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Item { Icon: LucideIcon; title: string; sub: string; }

const ITEMS: Item[] = [
  {
    Icon: Cpu,
    title: "100% Browser Processing",
    sub: "Every edit runs on your own device. Your photo is never sent to a server.",
  },
  {
    Icon: CloudOff,
    title: "No Upload Required",
    sub: "Files stay local. Nothing leaves your phone or laptop — not even temporarily.",
  },
  {
    Icon: UserX,
    title: "No Account Needed",
    sub: "No sign-up, no email, no login. Open a tool and start in one tap.",
  },
  {
    Icon: ServerOff,
    title: "No Data Stored",
    sub: "We keep nothing. Close the tab and every trace of your photo is gone.",
  },
];

/* Deliberate dark band — privacy is the moat, so it gets the boldest section
   on the page. Navy + gold, matching the design language of the icon tiles. */
const NAVY = "hsl(222 60% 8%)";
const GOLD_TINT = { background: "hsl(45 88% 60% / 0.12)" } as const;
const BADGE = {
  background: "hsl(45 88% 60% / 0.10)",
  border: "1px solid hsl(45 88% 60% / 0.30)",
} as const;

export function DarkTrustStrip() {
  return (
    <section className="border-t border-hairline" style={{ background: NAVY }}>
      <div className="container reveal py-16 sm:py-20">

        {/* ── heading ── */}
        <div className="mb-10 max-w-2xl">
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1"
            style={BADGE}
          >
            <Lock className="h-3.5 w-3.5 text-cta" strokeWidth={2} />
            <span className="text-xs font-bold uppercase tracking-widest text-cta">
              Privacy is the product
            </span>
          </span>
          <h2 className="text-[2rem] font-bold tracking-tight text-white sm:text-[2.6rem]">
            Why your photos stay <span className="text-cta">private</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/60">
            Most photo tools upload your documents to their servers. easyPhoto runs
            entirely inside your browser — so your most sensitive photos and IDs
            never leave your device.
          </p>
        </div>

        {/* ── 4 privacy guarantees ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ Icon, title, sub }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.06]"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={GOLD_TINT}
              >
                <Icon className="h-6 w-6 text-cta" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[15px] font-bold leading-tight text-white">{title}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">{sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
