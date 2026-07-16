"use client";

import * as React from "react";
import { Search, X, Landmark, Lock, Gift } from "lucide-react";

/**
 * Shared exam-search state. The search box lives in the hero (ExamSearchControls)
 * but filters the picker rendered inside ExamPackageTool further down the page —
 * so both read/write one piece of state through this context (mirrors the blog's
 * single-owner search → grid pattern, just split across two on-page regions).
 */
interface ExamSearchCtx {
  query: string;
  setQuery: (q: string) => void;
}
const Ctx = React.createContext<ExamSearchCtx>({ query: "", setQuery: () => {} });

export const useExamSearch = () => React.useContext(Ctx);

export function ExamSearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = React.useState("");
  return <Ctx.Provider value={{ query, setQuery }}>{children}</Ctx.Provider>;
}

const POPULAR = ["SSC", "UPSC", "IBPS", "Railway", "NEET", "PAN"];

const TRUST = [
  { Icon: Landmark, text: "52+ exam specs, each with a published source" },
  { Icon: Lock,     text: "100% private — nothing is uploaded" },
  { Icon: Gift,     text: "Free, with no sign-up required" },
];

const scrollToPicker = () =>
  document.getElementById("exam-picker")?.scrollIntoView({ behavior: "smooth", block: "start" });

/**
 * Hero-left controls: search + popular tags + trust points. Matches the blog
 * hero's search/chip stack. Filters the exam picker below via the shared context.
 */
export function ExamSearchControls() {
  const { query, setQuery } = useExamSearch();

  return (
    <div className="mt-6">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && scrollToPicker()}
          placeholder="Search your exam (e.g. SSC, UPSC, IBPS, NEET)…"
          aria-label="Search exams"
          className="h-11 w-full rounded-xl border border-hairline bg-card pl-10 pr-9 text-[14px] text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-brand/40 focus:ring-1 focus:ring-brand/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Popular tags */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-muted-foreground">Popular:</span>
        {POPULAR.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setQuery(t); scrollToPicker(); }}
            className="rounded-full border border-hairline bg-card px-2.5 py-1 text-[11.5px] font-medium text-ink transition-colors hover:bg-accent"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Trust points */}
      <ul className="mt-5 space-y-2.5">
        {TRUST.map(({ Icon, text }) => (
          <li key={text} className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
              <Icon className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
            </span>
            <span className="text-[12.5px] leading-snug text-ink">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
