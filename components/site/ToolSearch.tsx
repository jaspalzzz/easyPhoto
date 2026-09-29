"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { track, type SearchSurface } from "@/lib/analytics";
import { buildSearchIndex, searchTools, type SearchItem } from "@/lib/toolSearch";

const RESULT_LIMIT = 8;

/** Shown when a query matches nothing, so the box never fails silently. */
const NO_RESULT_SUGGESTIONS: { label: string; href: string }[] = [
  { label: "Resize photo to KB", href: "/tools/resize-kb/" },
  { label: "Passport photo", href: "/passport-photo/" },
  { label: "Exam photo sizes", href: "/exam-requirements/" },
  { label: "All tools", href: "/tools/" },
];

export function ToolSearch() {
  const pathname = usePathname();
  const surface: SearchSurface = pathname === "/" ? "homepage" : "tools";
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchItem[]>([]);
  const [totalMatches, setTotalMatches] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const noResultReportedRef = React.useRef(false);

  function reportNoResult() {
    if (query.trim() && results.length === 0 && !noResultReportedRef.current) {
      noResultReportedRef.current = true;
      track({ name: "search_use", surface, result: "no_result" });
    }
  }

  function closeSearch() {
    reportNoResult();
    setIsOpen(false);
  }

  // Pre-populate from URL ?q= param — powers the WebSite SearchAction schema.
  // window.location is only available on the client, so this runs post-mount only.
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) { setQuery(q); setIsOpen(true); }
  }, []);

  // Index search items once
  const searchIndex = React.useMemo(buildSearchIndex, []);

  // Filter search results
  React.useEffect(() => {
    const { results: matched, total } = searchTools(searchIndex, query, RESULT_LIMIT);
    setTotalMatches(total);
    setResults(matched);
  }, [query, searchIndex]);

  // Keyboard navigation handler
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      closeSearch();
      setQuery("");
    } else if (e.key === "ArrowDown" && isOpen && results.length > 0) {
      e.preventDefault();
      const listbox = document.getElementById("tool-search-listbox");
      const first = listbox?.querySelector<HTMLAnchorElement>("a");
      first?.focus();
    } else if (e.key === "Enter" && query.trim() && results.length === 0) {
      e.preventDefault();
      reportNoResult();
    }
  }

  // Click outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        closeSearch();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query, results, surface]);

  const showResults = isOpen && results.length > 0;
  const showNoResults = isOpen && results.length === 0 && query.trim().length > 0;

  return (
    <div ref={wrapperRef} className="relative z-50 w-full max-w-md mx-auto">
      {/* Dims the rest of the page (catalog grid below) while results are
          open, so the dropdown reads as the focused surface — discovery
          feels faster when the eye isn't competing with the full catalog.
          Click-to-dismiss; the search box itself sits above this (z-50). */}
      {showResults && (
        <div
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-[1px] transition-opacity"
        />
      )}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-soft" strokeWidth={2} />
        <input
          type="text"
          role="combobox"
          aria-expanded={isOpen && results.length > 0}
          aria-haspopup="listbox"
          aria-controls="tool-search-listbox"
          aria-label="Search tools"
          value={query}
          onChange={(e) => {
            noResultReportedRef.current = false;
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tools — try '20kb', 'signature', 'SSC'"
          className="h-12 min-h-12 w-full rounded-xl border border-hairline bg-card pl-11 pr-16 text-[15px] font-medium text-ink shadow-[0_1px_2px_rgb(0_0_0/0.04),0_2px_10px_rgb(0_0_0/0.05)] outline-none transition-shadow placeholder:font-normal placeholder:text-muted-foreground focus:border-brand focus:shadow-[0_0_0_3px_hsl(174_72%_29%/0.14)]"
        />
        {/* ⌘K badge — desktop only, opens the global command palette */}
        <button
          type="button"
          aria-label="Open command palette"
          onClick={() => document.dispatchEvent(new CustomEvent("cmd-palette-open"))}
          className="pointer-events-auto absolute right-3 top-1/2 hidden min-h-6 min-w-6 -translate-y-1/2 items-center justify-center gap-0.5 rounded-md border border-hairline bg-paper px-1.5 py-0.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-ink-soft hover:text-ink sm:flex"
        >
          <span className="text-xs">⌘</span>K
        </button>
      </div>

      {showResults && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-hairline bg-card p-1.5 shadow-pop">
          <ul role="listbox" id="tool-search-listbox" className="space-y-0.5">
            {results.map((item) => (
              <li key={item.path} role="option" aria-selected={false}>
                <Link
                  href={item.path}
                  onClick={() => {
                    track({ name: "search_use", surface, result: "selected" });
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent/50"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold leading-tight text-ink">{item.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{item.category}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
          {totalMatches > RESULT_LIMIT && (
            <p className="mt-1 border-t border-hairline px-3 py-2 text-center text-xs text-muted-foreground">
              Showing {RESULT_LIMIT} of {totalMatches} — add another word to narrow it down
            </p>
          )}
        </div>
      )}

      {showNoResults && (
        <div
          role="status"
          className="absolute left-0 right-0 z-50 mt-2 rounded-xl border border-hairline bg-card px-4 py-3 text-sm shadow-pop"
        >
          <p className="text-ink">
            No tools match &ldquo;{query.trim()}&rdquo;. Try one of these:
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {NO_RESULT_SUGGESTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => {
                  setQuery("");
                  setIsOpen(false);
                }}
                className="rounded-md border border-hairline bg-paper px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:border-ink-soft"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
