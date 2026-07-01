"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { COUNTRY_SPECS } from "@/lib/countrySpecs";
import { MAKER_PAGES } from "@/lib/makerPages";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

interface SearchItem {
  title: string;
  category: string;
  path: string;
  keywords: string[];
}

const RESULT_LIMIT = 8;

export function ToolSearch() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchItem[]>([]);
  const [totalMatches, setTotalMatches] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Pre-populate from URL ?q= param — powers the WebSite SearchAction schema.
  // window.location is only available on the client, so this runs post-mount only.
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) { setQuery(q); setIsOpen(true); }
  }, []);

  // Index search items once
  const searchIndex = React.useMemo(() => {
    const items: SearchItem[] = [];

    // 1. Country Maker Pages
    MAKER_PAGES.forEach((maker) => {
      const spec = COUNTRY_SPECS[maker.countryId];
      if (!spec) return;
      const docType = maker.kind === "visa" ? "Visa" : "Passport";
      items.push({
        title: `${spec.label} ${docType} Photo Maker`,
        category: "Passport & Visa Specs",
        path: `/${maker.slug}/`,
        keywords: [spec.label.toLowerCase(), maker.kind, "photo", "spec", maker.countryId],
      });
    });

    // 2. Standalone Catalog Tools
    TOOLS_CATALOG.forEach((group) => {
      group.tools.forEach((tool) => {
        if (!tool.ready) return;
        items.push({
          title: tool.title,
          category: group.group,
          path: `/tools/${tool.slug}/`,
          keywords: [tool.title.toLowerCase(), tool.blurb.toLowerCase(), group.group.toLowerCase(), tool.slug],
        });
      });
    });

    // 3. Portal Resizers
    Object.entries(PORTAL_PRESETS).forEach(([key, spec]) => {
      items.push({
        title: `${spec.name} Form Resizer`,
        category: "Government Portals",
        path: `/tools/form-resizer/${key}/`,
        keywords: [spec.name.toLowerCase(), key, "form", "portal", "resizer"],
      });
    });

    // 4. Exact Size Presets
    [10, 20, 30, 50, 100, 200].forEach((kb) => {
      items.push({
        title: `Resize Image to ${kb} KB`,
        category: "Image Compressors",
        path: `/photo-resize-to-${kb}kb/`,
        keywords: ["photo", "image", "resize", "compress", `${kb}kb`, `${kb} kb`, "size", "limit"],
      });
    });

    [10, 20, 50, 100].forEach((kb) => {
      items.push({
        title: `Resize Signature to ${kb} KB`,
        category: "Signature Tools",
        path: `/signature-resize-to-${kb}kb/`,
        keywords: ["signature", "sign", "resize", "compress", `${kb}kb`, `${kb} kb`, "size", "limit", "transparent"],
      });
    });

    return items;
  }, []);

  // Filter search results
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotalMatches(0);
      return;
    }
    const q = query.toLowerCase();
    const filtered = searchIndex.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.some((kw) => kw.includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
    setTotalMatches(filtered.length);
    setResults(filtered.slice(0, RESULT_LIMIT));
  }, [query, searchIndex]);

  // Keyboard navigation handler
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    } else if (e.key === "ArrowDown" && isOpen && results.length > 0) {
      e.preventDefault();
      const listbox = document.getElementById("tool-search-listbox");
      const first = listbox?.querySelector<HTMLAnchorElement>("a");
      first?.focus();
    }
  }

  // Click outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showResults = isOpen && results.length > 0;

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
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tools — try '20kb', 'signature', 'SSC'"
          className="h-12 w-full rounded-xl border border-hairline bg-card pl-11 pr-16 text-[15px] font-medium text-ink shadow-[0_1px_2px_rgb(0_0_0/0.04),0_2px_10px_rgb(0_0_0/0.05)] outline-none transition-shadow placeholder:font-normal placeholder:text-muted-foreground focus:border-brand focus:shadow-[0_0_0_3px_hsl(174_72%_29%/0.14)]"
        />
        {/* ⌘K badge — desktop only, opens the global command palette */}
        <button
          type="button"
          aria-label="Open command palette"
          onClick={() => document.dispatchEvent(new CustomEvent("cmd-palette-open"))}
          className="pointer-events-auto absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-hairline bg-paper px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-ink-soft hover:text-ink sm:flex"
        >
          <span className="text-[10px]">⌘</span>K
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
                    setQuery("");
                    setIsOpen(false);
                  }}
                  className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent/50"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold leading-tight text-ink">{item.title}</span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">{item.category}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
          {totalMatches > RESULT_LIMIT && (
            <p className="mt-1 border-t border-hairline px-3 py-2 text-center text-[11px] text-muted-foreground">
              Showing {RESULT_LIMIT} of {totalMatches} — add another word to narrow it down
            </p>
          )}
        </div>
      )}
    </div>
  );
}
